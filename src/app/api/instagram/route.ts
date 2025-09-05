import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/instagram
export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  try {
    if (token) {
      const fields = ["id", "caption", "media_type", "media_url", "permalink", "thumbnail_url"].join(",");
      const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ items: [], error: "Instagram fetch failed", details: text });
      }
      const data = await res.json();
      const items = Array.isArray(data?.data) ? data.data.slice(0, 8) : [];
      return NextResponse.json({ items });
    }

    // Fallback: public web profile JSON (may be rate-limited by Instagram)
    const username = "rovingvietnam.travel";
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json,text/plain,*/*",
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ items: [], error: "Instagram fallback fetch failed", details: text });
    }
    const data = await res.json();
    type InstagramEdge = {
      node?: {
        id?: string;
        is_video?: boolean;
        display_url?: string;
        shortcode?: string;
        thumbnail_src?: string;
        edge_media_to_caption?: { edges?: Array<{ node?: { text?: string } }> };
      };
    };
    const edges: InstagramEdge[] = data?.data?.user?.edge_owner_to_timeline_media?.edges || [];
    const items = edges.slice(0, 8).map((e: InstagramEdge) => {
      const node = e?.node || {};
      const caption = node?.edge_media_to_caption?.edges?.[0]?.node?.text;
      const isVideo = Boolean(node?.is_video);
      return {
        id: node?.id,
        caption,
        media_type: isVideo ? "VIDEO" : "IMAGE",
        media_url: node?.display_url,
        permalink: node?.shortcode ? `https://www.instagram.com/p/${node.shortcode}/` : `https://www.instagram.com/${username}/`,
        thumbnail_url: node?.thumbnail_src,
      };
    });
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ items: [], error: "Unexpected error", details: String(err) });
  }
}


