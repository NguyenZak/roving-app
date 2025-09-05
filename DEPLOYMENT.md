# Heroku Deployment Guide

## Prerequisites

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Create a Heroku account: https://signup.heroku.com/
3. Login to Heroku: `heroku login`

## Deployment Steps

### 1. Create Heroku App
```bash
heroku create your-app-name
```

### 2. Add PostgreSQL Database
```bash
heroku addons:create heroku-postgresql:mini
```

### 3. Set Environment Variables
```bash
# Database URL (automatically set by Heroku Postgres addon)
heroku config:set DATABASE_URL=$(heroku config:get DATABASE_URL)

# NextAuth Configuration
heroku config:set NEXTAUTH_SECRET="your-secret-key-here"
heroku config:set NEXTAUTH_URL="https://your-app-name.herokuapp.com"

# Email Configuration
heroku config:set EMAIL_USER="rovingvietnamtravel@gmail.com"
heroku config:set EMAIL_PASS="your-app-password"
heroku config:set ADMIN_EMAIL="rovingvietnamtravel@gmail.com"

# Mapbox Token
heroku config:set NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"

# i18n
heroku config:set NEXT_PUBLIC_DEFAULT_LOCALE="vi"

# Instagram Token (optional)
heroku config:set INSTAGRAM_ACCESS_TOKEN="your-instagram-token"

# Node Environment
heroku config:set NODE_ENV="production"
```

### 4. Deploy to Heroku
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### 5. Run Database Migrations
```bash
heroku run npx prisma migrate deploy
```

### 6. Seed Database (Optional)
```bash
heroku run npm run seed:regions
heroku run npm run seed:testimonials
```

## Important Notes

1. **Database**: The app uses PostgreSQL. Heroku will automatically provide a DATABASE_URL.
2. **Environment Variables**: Make sure to set all required environment variables before deployment.
3. **Build Process**: The app will automatically build and generate Prisma client during deployment.
4. **Migrations**: Database migrations will run automatically via the release command in Procfile.

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check that all dependencies are in package.json
2. **Database Connection**: Verify DATABASE_URL is set correctly
3. **Environment Variables**: Ensure all required env vars are set
4. **Memory Issues**: Consider upgrading to a higher tier if you encounter memory issues

### Useful Commands:
```bash
# View logs
heroku logs --tail

# Open app in browser
heroku open

# Access database
heroku run npx prisma studio

# Check config
heroku config
```

## Post-Deployment

1. Test all functionality
2. Set up monitoring
3. Configure custom domain (if needed)
4. Set up automated backups
