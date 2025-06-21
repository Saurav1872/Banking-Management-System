# Environment Configuration Setup

This document explains how to configure environment variables for the Banking Management System frontend.

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp env.example .env.local
   ```

2. **Edit the configuration:**
   Open `.env.local` and modify the values as needed.

## Environment Variables

### Required Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API server URL | `http://localhost:8080/api` |
| `NEXT_PUBLIC_JWT_STORAGE_KEY` | Key for storing JWT tokens | `bank_jwt` |

### Optional Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_APP_NAME` | Application name | `Banking Management System` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` |
| `NODE_ENV` | Environment mode | `development` |

### API Endpoints (Optional)

These can be customized if your backend uses different endpoint paths:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_AUTH_ENDPOINT` | Authentication endpoints | `/auth` |
| `NEXT_PUBLIC_ACCOUNTS_ENDPOINT` | Account management endpoints | `/accounts` |
| `NEXT_PUBLIC_TRANSACTIONS_ENDPOINT` | Transaction endpoints | `/transactions` |
| `NEXT_PUBLIC_USERS_ENDPOINT` | User management endpoints | `/users` |
| `NEXT_PUBLIC_NOTIFICATIONS_ENDPOINT` | Notification endpoints | `/notifications` |
| `NEXT_PUBLIC_EMPLOYEE_ENDPOINT` | Employee-specific endpoints | `/employee` |

## Environment Examples

### Development
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NODE_ENV=development
```

### Production
```env
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com/api
NODE_ENV=production
```

### Staging
```env
NEXT_PUBLIC_API_BASE_URL=https://staging-api.yourcompany.com/api
NODE_ENV=production
```

## Configuration Usage

The environment variables are automatically loaded and used throughout the application:

- **API Service**: Uses `NEXT_PUBLIC_API_BASE_URL` for all API calls
- **Authentication**: Uses `NEXT_PUBLIC_JWT_STORAGE_KEY` for token storage
- **UI Components**: Can access app name and version for display

## Security Notes

- Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Sensitive data (like API keys) should be handled server-side
- JWT tokens are stored in localStorage (consider httpOnly cookies for production)

## Troubleshooting

1. **API calls failing**: Check `NEXT_PUBLIC_API_BASE_URL` is correct
2. **Authentication issues**: Verify `NEXT_PUBLIC_JWT_STORAGE_KEY` is set
3. **Build errors**: Ensure all required variables are defined

## Next Steps

After setting up your environment variables:

1. Restart the development server: `npm run dev`
2. Test the application functionality
3. Verify API connectivity with your backend 