# Category CMS Documentation

## Overview
The Category CMS (Content Management System) provides a complete interface for managing province categories in the Roving Vietnam Travel application. This system allows administrators to create, read, update, and delete categories with a user-friendly interface.

## Features

### 🎯 Core Functionality
- **Create Categories**: Add new province categories with name and display order
- **Read Categories**: View all categories in a paginated table
- **Update Categories**: Edit existing category information
- **Delete Categories**: Remove categories with confirmation dialog
- **Quick Actions**: Modal-based quick create/edit for faster workflow

### 🎨 User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with consistent styling
- **Data Table**: Sortable, searchable table with pagination
- **Modal Forms**: Quick create/edit without page navigation
- **Confirmation Dialogs**: Safe deletion with user confirmation

## Database Schema

### ProvinceCategory Model
```prisma
model ProvinceCategory {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  order     Int      @default(0)
  createdAt DateTime @default(now())
}
```

### Fields
- **id**: Unique identifier (auto-generated)
- **name**: Display name for the category (required, unique)
- **slug**: URL-friendly version of the name (auto-generated)
- **order**: Display order for sorting (default: 0)
- **createdAt**: Timestamp when category was created

## API Endpoints

### GET /api/admin/categories
Retrieve all categories with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "items": [
    {
      "id": "category_id",
      "name": "Category Name",
      "slug": "category-name",
      "order": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

### POST /api/admin/categories
Create a new category.

**Form Data:**
- `name` (required): Category name
- `order` (optional): Display order (default: 0)

**Response:**
```json
{
  "ok": true,
  "id": "new_category_id"
}
```

### GET /api/admin/categories/[id]
Retrieve a specific category by ID.

**Response:**
```json
{
  "id": "category_id",
  "name": "Category Name",
  "slug": "category-name",
  "order": 0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/admin/categories/[id] (PATCH)
Update an existing category.

**Form Data:**
- `_method`: "PATCH"
- `name` (optional): New category name
- `order` (optional): New display order

**Response:**
```json
{
  "ok": true,
  "id": "category_id"
}
```

### POST /api/admin/categories/[id] (DELETE)
Delete a category.

**Form Data:**
- `_method`: "DELETE"

**Response:**
```json
{
  "ok": true
}
```

## File Structure

```
src/
├── app/
│   └── admin/
│       └── categories/
│           ├── page.tsx                    # Main categories list page
│           ├── new/
│           │   └── page.tsx               # Create new category page
│           └── [id]/
│               └── edit/
│                   └── page.tsx           # Edit category page
├── components/
│   └── admin/
│       └── CategoryFormModal.tsx          # Reusable category form modal
└── api/
    └── admin/
        └── categories/
            ├── route.ts                   # GET, POST endpoints
            └── [id]/
                └── route.ts               # GET, PATCH, DELETE endpoints
```

## Components

### AdminCategoriesPage
Main page component that displays the categories table and handles CRUD operations.

**Features:**
- Paginated data table
- Quick create/edit modals
- Delete confirmation
- Full page create/edit links

### CategoryFormModal
Reusable modal component for creating and editing categories.

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to handle modal close
- `onSuccess`: Function to handle successful operations
- `category`: Category object for edit mode (null for create)
- `mode`: "create" | "edit"

### NewCategoryPage
Full-page form for creating new categories.

### EditCategoryPage
Full-page form for editing existing categories.

## Usage Examples

### Creating a Category
1. Navigate to `/admin/categories`
2. Click "Quick Create" for modal or "Full Create" for full page
3. Enter category name and optional display order
4. Click "Create Category"

### Editing a Category
1. Navigate to `/admin/categories`
2. Click "Quick Edit" for modal or "Full Edit" for full page
3. Modify the category information
4. Click "Update Category"

### Deleting a Category
1. Navigate to `/admin/categories`
2. Click "Delete" button for the category
3. Confirm deletion in the dialog

## Security

### Authentication
All API endpoints require authentication via NextAuth session.

### Authorization
Only users with admin privileges can access category management.

### Validation
- Category names are required and must be unique
- Display order must be a non-negative integer
- Slugs are auto-generated and sanitized

## Testing

### Manual Testing
1. Start the development server: `npm run dev`
2. Navigate to `/admin/categories`
3. Test all CRUD operations
4. Verify responsive design on different screen sizes

### API Testing
Run the test script:
```bash
node test-category-cms.js
```

## Future Enhancements

### Potential Improvements
- **Bulk Operations**: Select multiple categories for bulk delete/update
- **Category Images**: Add image upload for category icons
- **Category Descriptions**: Add rich text descriptions
- **Category Hierarchy**: Support for parent-child relationships
- **Export/Import**: CSV export/import functionality
- **Audit Log**: Track category changes and modifications

### Integration Opportunities
- **Tour Categories**: Link categories to tours for better organization
- **Destination Filtering**: Use categories to filter destinations
- **SEO Optimization**: Category-specific meta tags and descriptions

## Troubleshooting

### Common Issues

**1. Category not saving**
- Check if category name is unique
- Verify all required fields are filled
- Check browser console for errors

**2. Modal not opening**
- Ensure CategoryFormModal component is imported
- Check if modal state is properly managed
- Verify modal props are correctly passed

**3. API errors**
- Check authentication status
- Verify API endpoint URLs
- Check server logs for detailed error messages

### Debug Mode
Enable debug logging by adding console.log statements in the components and API routes.

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.
