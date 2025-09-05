# Tour Gallery Feature

## Overview
The Tour Gallery feature allows tours to display multiple images in an interactive gallery format on the tour details page. This enhances the user experience by providing visual content beyond the main tour image.

## Features
- **Interactive Gallery**: Uses `react-image-gallery` library for smooth navigation
- **Thumbnail Navigation**: Users can click thumbnails to jump to specific images
- **Fullscreen Mode**: Users can view images in fullscreen for better viewing
- **Responsive Design**: Gallery adapts to different screen sizes
- **Image Captions**: Each image can have a caption for context
- **Lazy Loading**: Images load as needed for better performance

## Implementation

### Database Schema
The gallery uses the existing `TourGallery` model:
```prisma
model TourGallery {
  id        String   @id @default(cuid())
  tourId    String
  imageUrl  String
  alt       String?
  caption   String?
  order     Int      @default(0)
  createdAt DateTime @default(now())
  
  tour      Tour     @relation(fields: [tourId], references: [id], onDelete: Cascade)
}
```

### Components
- **TourGallery.tsx**: Main gallery component with lightbox functionality
- **Tour Details Page**: Updated to include gallery section

### Styling
- Custom CSS added to `globals.css` for better integration with the design
- Responsive design with proper spacing and hover effects
- Consistent with the overall site theme

## Usage

### For Developers
1. Gallery images are automatically loaded when viewing a tour details page
2. The gallery only displays if there are images in the `galleries` relation
3. Images are ordered by the `order` field in ascending order

### For Content Managers
1. Add gallery images through the admin panel (TourGallery management)
2. Set proper alt text for accessibility
3. Add captions to provide context for images
4. Use the order field to control image sequence

## Technical Details

### Dependencies
- `react-image-gallery`: Main gallery component library
- `@types/react-image-gallery`: TypeScript definitions

### Performance
- Images are lazy-loaded for better performance
- Thumbnails are generated automatically
- Fullscreen mode uses browser native fullscreen API

### Accessibility
- Proper alt text support
- Keyboard navigation support
- Screen reader friendly

## Sample Data
The `scripts/add-gallery-images.js` script adds sample gallery images to existing tours for testing purposes.

## Future Enhancements
- Video support in gallery
- Image zoom functionality
- Social sharing for individual images
- Admin interface for gallery management
- Image optimization and compression
