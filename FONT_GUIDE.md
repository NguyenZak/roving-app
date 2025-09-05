# Inter Font Implementation Guide

## Overview
This project now uses **Inter** as the primary font family, replacing the previous Geist Sans font. Inter is a highly legible font designed specifically for computer screens and user interfaces.

## Implementation Details

### 1. Font Import
The Inter font is imported in two ways:
- **Google Fonts CDN**: `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');`
- **Next.js Font Optimization**: Using `next/font/google` for better performance

### 2. Font Configuration
- **Variable**: `--font-inter`
- **Default Font**: Set as the primary sans-serif font in Tailwind CSS
- **Display**: `swap` for better loading performance

### 3. Available Font Weights
Inter supports the following weights:
- `100` - Thin
- `200` - Extra Light
- `300` - Light
- `400` - Normal (Regular)
- `500` - Medium
- `600` - Semi Bold
- `700` - Bold
- `800` - Extra Bold
- `900` - Black

## Usage Examples

### Basic Usage
```tsx
// Using Tailwind classes
<h1 className="font-inter-bold text-4xl">Bold Heading</h1>
<p className="font-inter-normal text-base">Normal body text</p>
<span className="font-inter-medium text-sm">Medium weight text</span>
```

### Available CSS Classes
```css
/* Font Family Classes */
.font-inter
.font-inter-thin
.font-inter-extralight
.font-inter-light
.font-inter-normal
.font-inter-medium
.font-inter-semibold
.font-inter-bold
.font-inter-extrabold
.font-inter-black
.font-inter-italic
```

### Typography Hierarchy
```tsx
// Headings
<h1 className="font-inter-bold text-4xl">Main Heading</h1>
<h2 className="font-inter-semibold text-3xl">Section Heading</h2>
<h3 className="font-inter-medium text-2xl">Subsection Heading</h3>
<h4 className="font-inter-medium text-xl">Minor Heading</h4>

// Body Text
<p className="font-inter-normal text-base">Regular body text</p>
<p className="font-inter-light text-sm">Light weight for subtle text</p>

// UI Elements
<button className="font-inter-medium text-sm">Button Text</button>
<label className="font-inter-semibold text-sm">Form Label</label>
```

## Migration from Geist Sans

### Before (Geist Sans)
```tsx
<span className="font-semibold text-lg">Roving Vietnam Travel</span>
```

### After (Inter)
```tsx
<span className="font-inter-semibold text-lg">Roving Vietnam Travel</span>
```

## Best Practices

### 1. Font Weight Usage
- **100-300**: Use sparingly for very subtle text or decorative elements
- **400**: Default body text, most readable
- **500**: UI elements, buttons, form labels
- **600**: Subheadings, important UI text
- **700**: Main headings, strong emphasis
- **800-900**: Large display text, hero sections

### 2. Readability
- Use **font-inter-normal** (400) for body text
- Use **font-inter-medium** (500) for UI elements
- Use **font-inter-semibold** (600) for headings
- Use **font-inter-bold** (700) for main titles

### 3. Performance
- The font is optimized with `display: swap`
- Next.js font optimization is enabled
- Font files are preloaded for better performance

## Demo Page
Visit `/font-demo` to see all Inter font weights and styles in action.

## Files Modified
1. `src/app/layout.tsx` - Font import and configuration
2. `src/app/globals.css` - CSS variables and imports
3. `src/app/fonts.css` - Font utility classes
4. `src/components/site/Navbar.tsx` - Updated to use Inter font
5. `src/components/site/FontDemo.tsx` - Demo component
6. `src/app/font-demo/page.tsx` - Demo page

## Browser Support
Inter font is supported in all modern browsers and gracefully falls back to system fonts in older browsers.
