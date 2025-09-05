"use client";

import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Footer() {
  const locale = useLocale();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-400">Roving Vietnam Travel</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {locale === "vi" 
                ? "Chuyên cung cấp các gói du lịch chất lượng cao tại Việt Nam với trải nghiệm đáng nhớ và dịch vụ chuyên nghiệp."
                : "Specializing in high-quality travel packages in Vietnam with memorable experiences and professional service."
              }
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">
              {locale === "vi" ? "Liên kết nhanh" : "Quick Links"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tours" className="text-gray-300 hover:text-white transition-colors">
                  {locale === "vi" ? "Tours" : "Tours"}
                </Link>
              </li>
              <li>
                <Link href="/regions/packages" className="text-gray-300 hover:text-white transition-colors">
                  {locale === "vi" ? "Gói du lịch" : "Travel Packages"}
                </Link>
              </li>
              <li>
                <Link href="/tips" className="text-gray-300 hover:text-white transition-colors">
                  {locale === "vi" ? "Mẹo du lịch" : "Travel Tips"}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  {locale === "vi" ? "Blog" : "Blog"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  {locale === "vi" ? "Về chúng tôi" : "About Us"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">
              {locale === "vi" ? "Điểm đến" : "Destinations"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/regions/north" className="text-gray-300 hover:text-white transition-colors">
                  {locale === "vi" ? "Miền Bắc" : "Northern Vietnam"}
                </Link>
              </li>
              <li>
                <Link href="/regions/central" className="text-gray-300 hover:text-white transition-colors">
                  {locale === "vi" ? "Miền Trung" : "Central Vietnam"}
                </Link>
              </li>
              <li>
                <Link href="/regions/south" className="text-gray-300 hover:text-white transition-colors">
                  {locale === "vi" ? "Miền Nam" : "Southern Vietnam"}
                </Link>
              </li>
              <li>
                <Link href="/transportation" className="text-gray-300 hover:text-white transition-colors">
                  {locale === "vi" ? "Phương tiện" : "Transportation"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">
              {locale === "vi" ? "Liên hệ" : "Contact"}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>info@rovingtravel.vn</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>Hà Nội, Việt Nam</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Globe className="h-4 w-4 text-blue-400" />
                <span>www.rovingtravel.vn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Roving Vietnam Travel. {locale === "vi" ? "Tất cả quyền được bảo lưu." : "All rights reserved."}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              {locale === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              {locale === "vi" ? "Điều khoản sử dụng" : "Terms of Service"}
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              {locale === "vi" ? "Sitemap" : "Sitemap"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


