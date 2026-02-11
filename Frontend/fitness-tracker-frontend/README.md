# Fitness Tracker Frontend

A modern React + TypeScript fitness tracking application with OAuth2 authentication and real-time activity management.

## Project Overview

The frontend provides a user-friendly interface for:
- User authentication via Keycloak OAuth2
- Activity tracking (Running, Cycling, Walking)
- AI-powered activity recommendations
- Activity history and analytics

## Tech Stack

- **React 19.2** - UI library
- **TypeScript 5.5** - Type safety
- **Vite 7.2** - Build tool & dev server
- **Redux Toolkit** - State management
- **Material-UI 7.3** - Component library
- **Axios** - HTTP client
- **React OAuth2 Code PKCE** - Authentication

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ActivityForm.tsx
│   ├── ActivityList.tsx
│   └── ActivityDetails.tsx
├── services/           # API communication
│   └── apiFetch.ts
├── store/             # Redux store configuration
│   ├── store.ts
│   └── authSlice.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── authConfig.ts      # OAuth2 configuration
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (http://localhost:8080/api)
- Keycloak running (http://localhost:8181)

## Installation

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env
```

## Environment Configuration

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8080/api
```

## Development

```bash
# Start dev server
npm run dev

# The app will be available at http://localhost:5173
```

## Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Linting

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## Features

### Authentication
- OAuth2 Code with PKCE flow
- Token refresh handling
- Secure token storage
- Automatic logout on token expiration

### Activity Management
- Add activities (Running, Cycling, Walking)
- View activity history
- Track calories and duration
- View detailed AI recommendations

### AI Recommendations
- Activity analysis
- Improvement suggestions
- Safety guidelines
- Activity-specific insights

### State Management
- Redux for global auth state
- LocalStorage for token persistence
- Automatic token injection in API calls

## API Integration

The app communicates with the backend API at `http://localhost:8080/api`:

### Endpoints Used:
- `POST /activities` - Create new activity
- `GET /activities` - Get user's activities
- `GET /recommendations/activity/{id}` - Get AI recommendations

### Authentication:
- Bearer token in Authorization header
- User ID in X-User-ID header
- Automatic header injection via Axios interceptor

## Component Documentation

### ActivityForm
Renders a form for adding new activities:
- Activity type selector (Running/Cycling/Walking)
- Duration input
- Calories burned input
- Error handling with visual feedback
- Loading state during submission

### ActivityList
Displays user's activity history:
- Grid layout with activity cards
- Click to view details
- Loading and error states
- Empty state message

### ActivityDetails
Shows detailed activity information:
- Basic activity metrics
- AI-generated recommendations
- Improvements and suggestions
- Safety guidelines
- Formatted recommendations display

## Type Safety

Full TypeScript support with defined types for:
- Activity and ActivityRequest
- Recommendation response
- Auth token and user data
- API client configuration
- Component props

## Error Handling

- Try-catch blocks in API calls
- User-friendly error messages
- Alert components for errors
- Console logging for debugging
- Loading states during async operations

## Performance Optimizations

- Lazy component loading
- Memoized components where needed
- Efficient state updates
- Optimized re-renders
- Production build optimization via Vite

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Common Issues

### "Failed to connect to API"
- Ensure backend is running on port 8080
- Check VITE_API_URL in .env
- Verify CORS is enabled on backend

### "Login not working"
- Ensure Keycloak is running on port 8181
- Verify realm and client configured in Keycloak
- Check auth configuration in authConfig.ts
- Clear browser cache and local storage

### "Activities not loading"
- Check if user is properly authenticated
- Verify token is present in localStorage
- Check browser console for specific errors
- Ensure activity service is running

### TypeScript errors
- Run `npm install` to ensure all types are installed
- Check tsconfig.json configuration
- Verify all imports use correct paths

## Development Workflows

### Adding a New Feature
1. Create type definitions in `src/types/index.ts`
2. Create component in `src/components/`
3. Add API calls in `src/services/apiFetch.ts` if needed
4. Update Redux store if needed
5. Test with dev server

### Modifying Components
- All components use TypeScript for type safety
- Props are fully typed with interfaces
- Use Material-UI components for consistency
- Follow existing code patterns

### Adding New Types
1. Define in `src/types/index.ts`
2. Export from the same file
3. Import in components that need them
4. Use strict typing for props

## Testing

```bash
# No test configuration currently
# Recommended: Add Jest and React Testing Library

npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

## Deployment

### Build Steps:
```bash
npm run build
```

### Deploy dist/ folder to:
- Vercel
- Netlify
- AWS S3
- Any static hosting service

### Environment Variables for Production:
Update `.env.production`:
```env
VITE_API_URL=https://your-production-api.com/api
```

## Contributing

1. Create a feature branch
2. Make changes with TypeScript support
3. Test locally with `npm run dev`
4. Build and verify with `npm run build`
5. Submit pull request

## Best Practices

- Always add proper TypeScript types
- Use Material-UI components for UI
- Handle loading and error states
- Provide user feedback for all actions
- Keep components focused and reusable
- Follow existing code patterns

## Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 5174
```

### Module resolution errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors after changes
```bash
# Ensure tsconfig is correct and restart dev server
npm run dev
```

## Adding new pages/routes

1. Create component in `src/components/`
2. Add route in `App.tsx` Routes component
3. Create navigate links as needed
4. Ensure proper TypeScript typing

## Next Steps

1. Ensure backend services are running
2. Run `npm install` to install dependencies
3. Create `.env` file from `.env.example`
4. Run `npm run dev` to start development server
5. Navigate to http://localhost:5173
6. Login with Keycloak credentials
7. Start tracking activities!

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Material-UI Docs](https://mui.com)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Vite Documentation](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs for API errors
3. Check browser console for client-side errors
4. Verify environment configuration
