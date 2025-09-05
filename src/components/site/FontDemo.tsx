"use client";

export default function FontDemo() {
  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-inter-bold text-center mb-8">
        Inter Font Demo
      </h1>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-inter-semibold mb-4">Font Weights</h2>
          <div className="space-y-2">
            <p className="font-inter-thin text-lg">Inter Thin (100) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-inter-extralight text-lg">Inter Extra Light (200) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-inter-light text-lg">Inter Light (300) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-inter-normal text-lg">Inter Normal (400) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-inter-medium text-lg">Inter Medium (500) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-inter-semibold text-lg">Inter Semi Bold (600) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-inter-bold text-lg">Inter Bold (700) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-inter-extrabold text-lg">Inter Extra Bold (800) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-inter-black text-lg">Inter Black (900) - The quick brown fox jumps over the lazy dog</p>
          </div>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-2xl font-inter-semibold mb-4">Italic Styles</h2>
          <div className="space-y-2">
            <p className="font-inter-normal font-inter-italic text-lg">Inter Normal Italic - The quick brown fox jumps over the lazy dog</p>
            <p className="font-inter-medium font-inter-italic text-lg">Inter Medium Italic - The quick brown fox jumps over the lazy dog</p>
            <p className="font-inter-bold font-inter-italic text-lg">Inter Bold Italic - The quick brown fox jumps over the lazy dog</p>
          </div>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-2xl font-inter-semibold mb-4">Typography Examples</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-inter-bold mb-2">Heading 1 - Inter Bold</h1>
              <p className="font-inter-normal text-gray-600">This is a subtitle using Inter Normal weight</p>
            </div>
            
            <div>
              <h2 className="text-3xl font-inter-semibold mb-2">Heading 2 - Inter Semi Bold</h2>
              <p className="font-inter-normal text-gray-600">Supporting text with Inter Normal weight</p>
            </div>
            
            <div>
              <h3 className="text-2xl font-inter-medium mb-2">Heading 3 - Inter Medium</h3>
              <p className="font-inter-normal text-gray-600">Body text using Inter Normal weight for optimal readability</p>
            </div>
            
            <div>
              <h4 className="text-xl font-inter-medium mb-2">Heading 4 - Inter Medium</h4>
              <p className="font-inter-light text-gray-600">Light weight text for subtle emphasis</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-inter-semibold mb-4">Travel Content Example</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-2xl font-inter-bold text-blue-900 mb-3">
              Discover Vietnam – Live Fully in Every Journey
            </h3>
            <p className="font-inter-normal text-blue-800 mb-4">
              At Roving Vietnam Travel, we believe that every journey is more than just moving from one place to another – 
              it is about discovering stories, embracing cultures, and creating memories that last a lifetime.
            </p>
            <p className="font-inter-light text-blue-700">
              From vibrant city streets to hidden mountain trails, from serene beaches to timeless heritage sites, 
              our team is dedicated to revealing the soul of this beautiful country.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
