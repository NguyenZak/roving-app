# CMS Gallery Integration

## Overview
The Tour Gallery feature is now fully integrated with the CMS system, allowing content managers to manage gallery images through the admin API endpoints.

## API Endpoints

### Tour Management with Gallery

#### GET `/api/admin/tours/[id]`
**Description**: Get tour details including gallery images
**Response**: 
```json
{
  "ok": true,
  "tour": {
    "id": "tour_id",
    "title": "Tour Title",
    "galleries": [
      {
        "id": "gallery_id",
        "imageUrl": "https://example.com/image.jpg",
        "alt": "Image description",
        "caption": "Image caption",
        "order": 1
      }
    ]
  }
}
```

#### POST/PATCH `/api/admin/tours/[id]`
**Description**: Update tour including gallery data
**Body**: FormData with `gallery` field containing JSON array:
```json
[
  {
    "imageUrl": "https://example.com/image1.jpg",
    "alt": "Image 1 description",
    "caption": "Image 1 caption",
    "order": 1
  },
  {
    "imageUrl": "https://example.com/image2.jpg",
    "alt": "Image 2 description", 
    "caption": "Image 2 caption",
    "order": 2
  }
]
```

### Individual Gallery Image Management

#### GET `/api/admin/tours/[id]/gallery`
**Description**: Get all gallery images for a tour
**Response**:
```json
{
  "ok": true,
  "gallery": [
    {
      "id": "gallery_id",
      "imageUrl": "https://example.com/image.jpg",
      "alt": "Image description",
      "caption": "Image caption",
      "order": 1
    }
  ]
}
```

#### POST `/api/admin/tours/[id]/gallery`
**Description**: Add a new gallery image to a tour
**Body**: JSON or FormData
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "alt": "Image description",
  "caption": "Image caption",
  "order": 1
}
```

#### GET `/api/admin/tours/[id]/gallery/[galleryId]`
**Description**: Get a specific gallery image
**Response**:
```json
{
  "ok": true,
  "galleryImage": {
    "id": "gallery_id",
    "imageUrl": "https://example.com/image.jpg",
    "alt": "Image description",
    "caption": "Image caption",
    "order": 1
  }
}
```

#### PATCH `/api/admin/tours/[id]/gallery/[galleryId]`
**Description**: Update a specific gallery image
**Body**: JSON or FormData with fields to update
```json
{
  "imageUrl": "https://example.com/new-image.jpg",
  "alt": "New description",
  "caption": "New caption",
  "order": 2
}
```

#### DELETE `/api/admin/tours/[id]/gallery/[galleryId]`
**Description**: Delete a specific gallery image
**Response**:
```json
{
  "ok": true,
  "message": "Gallery image deleted successfully"
}
```

#### POST `/api/admin/tours/[id]/gallery/reorder`
**Description**: Reorder gallery images
**Body**: JSON with array of gallery IDs in desired order
```json
{
  "galleryIds": ["gallery_id_1", "gallery_id_2", "gallery_id_3"]
}
```

## Database Schema

### TourGallery Model
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
  
  @@index([tourId])
}
```

### Tour Model (Updated)
```prisma
model Tour {
  // ... existing fields ...
  galleries      TourGallery[]
  // ... other fields ...
}
```

## Frontend Integration

### Tour Details Page
The tour details page automatically displays the gallery when gallery images are available:

```tsx
{tour.galleries && tour.galleries.length > 0 && (
  <TourGallery 
    images={tour.galleries} 
    title={`${tour.title} Gallery`}
  />
)}
```

### TourGallery Component
The `TourGallery` component provides:
- Interactive image navigation
- Thumbnail support
- Fullscreen mode
- Image captions
- Responsive design
- Lazy loading

## Usage Examples

### Adding Gallery Images via API
```javascript
// Add multiple gallery images to a tour
const galleryData = [
  {
    imageUrl: "https://example.com/image1.jpg",
    alt: "Tour destination view",
    caption: "Beautiful landscape",
    order: 1
  },
  {
    imageUrl: "https://example.com/image2.jpg", 
    alt: "Local culture",
    caption: "Traditional architecture",
    order: 2
  }
];

const formData = new FormData();
formData.append('gallery', JSON.stringify(galleryData));

fetch(`/api/admin/tours/${tourId}`, {
  method: 'POST',
  body: formData
});
```

### Adding Single Gallery Image
```javascript
// Add a single gallery image
const imageData = {
  imageUrl: "https://example.com/new-image.jpg",
  alt: "New image description",
  caption: "New image caption"
};

fetch(`/api/admin/tours/${tourId}/gallery`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(imageData)
});
```

### Reordering Gallery Images
```javascript
// Reorder gallery images
const reorderData = {
  galleryIds: ["gallery_id_3", "gallery_id_1", "gallery_id_2"]
};

fetch(`/api/admin/tours/${tourId}/gallery/reorder`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(reorderData)
});
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "ok": false,
  "error": "Error message",
  "details": "Detailed error information (development only)"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid data)
- `404`: Not Found (tour or gallery image not found)
- `500`: Internal Server Error

## Performance Considerations

- Gallery images are lazy-loaded for better performance
- Thumbnails are generated automatically by the gallery component
- Database queries are optimized with proper indexing
- Images are ordered efficiently using the `order` field

## Security

- All gallery operations are scoped to the specific tour
- Gallery images are validated to belong to the correct tour
- Proper error handling prevents information leakage
- TypeScript type safety throughout the API

## Testing

The integration has been tested with:
- ✅ Real gallery data from the database
- ✅ API endpoint functionality
- ✅ Frontend gallery display
- ✅ Image ordering and management
- ✅ Error handling scenarios

## Future Enhancements

- Image upload and storage integration
- Image optimization and compression
- Video support in gallery
- Admin UI for gallery management
- Bulk image operations
- Image metadata extraction
