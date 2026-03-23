# MaritimeFlow Frontend - Complete Setup & Deployment Guide

## Project Status
**Frontend Completion:** 95% ✅

### Completed Features
✅ Complete Authentication System (Login, Register, Password Reset)
✅ Dashboard with Real-time Analytics & Recharts Visualizations
✅ Shipments Management (CRUD + Search + CSV Export)
✅ Containers Management (CRUD + Status History Timeline)
✅ Documents Management (Upload + Download)
✅ Role-Based Access Control (Admin/Operator/Viewer)
✅ Global Toast Notifications (Success/Error/Warning/Info)
✅ Reusable UI Components Library (10+ components)
✅ Centralized API Client with JWT Authentication
✅ Responsive Design (Mobile/Tablet/Desktop)
✅ Professional Styling with Tailwind CSS

### In Progress / Pending
⏳ Test Coverage (Jest + React Testing Library)
⏳ E2E Tests (Cypress)
⏳ Performance Metrics & Monitoring
⏳ Offline Support (Service Workers)

---

## Environment Setup

### System Requirements
- **Node.js:** v14.0.0 or higher
- **npm:** v6.0.0 or higher
- **OS:** Windows, macOS, or Linux

### Installation Steps

1. **Clone or navigate to frontend directory:**
   ```bash
   cd MaritimeFlow/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Create .env.local in frontend root
   touch .env.local
   ```

4. **Configure environment variables:**
   ```env
   # .env.local
   VITE_API_BASE_URL=http://localhost:5000
   VITE_APP_NAME=MaritimeFlow
   VITE_JWT_EXPIRY=7d
   ```

5. **Verify installation:**
   ```bash
   npm list
   ```

---

## Development Workflow

### Start Development Server
```bash
npm run dev
```
**Output:**
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Key Development Commands

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code (if eslint configured)
npm run lint
```

---

## Project Structure

```
frontend/
├── public/                       # Static assets (favicon, manifest, etc)
├── src/
│   ├── components/
│   │   ├── About.jsx            # About page content
│   │   ├── Contact.jsx          # Contact form component
│   │   ├── Features.jsx         # Features page content
│   │   ├── Footer.jsx           # App footer
│   │   ├── FutureFeatures.jsx  # Future features section
│   │   ├── Hero.jsx             # Landing page hero
│   │   ├── HowItWorks.jsx      # How it works section
│   │   ├── Layout.jsx           # Main layout wrapper
│   │   ├── Modules.jsx          # Product modules display
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── ProtectedRoute.jsx  # Route protection HOC
│   │   ├── ScrollToTop.jsx     # Auto scroll on navigation
│   │   ├── Security.jsx         # Security features section
│   │   └── UIComponents.jsx    # **NEW** Reusable UI library
│   │
│   ├── context/
│   │   └── ToastContext.jsx    # **NEW** Global toast notifications
│   │
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Dashboard.jsx        # Dashboard router
│   │   ├── Features.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── FutureFeatures.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ResetPassword.jsx
│   │   └── dashboard/
│   │       ├── AdminMessages.jsx
│   │       ├── AdminUsers.jsx
│   │       ├── Containers.jsx   # **ENHANCED** + CSV export + History
│   │       ├── Documents.jsx    # **ENHANCED** + File download
│   │       ├── Overview.jsx     # **ENHANCED** + Recharts visualizations
│   │       ├── Reports.jsx
│   │       └── Shipments.jsx    # **ENHANCED** + CSV export + Pagination
│   │
│   ├── utils/
│   │   ├── api.js              # **NEW** Axios API client
│   │   └── helpers.js          # **NEW** Utility functions
│   │
│   ├── App.jsx                 # **UPDATED** With ToastProvider
│   ├── index.css               # Global styles
│   ├── main.jsx               # App entry point
│   └── setupTests.js          # Test configuration
│
├── FRONTEND_ARCHITECTURE.md    # **NEW** Architecture guide
├── COMPONENT_GUIDE.md          # **NEW** Component reference
├── index.html
├── package.json               # Project dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── jest.config.cjs           # Jest testing configuration
├── .gitignore
└── README.md
```

---

## Dependency Overview

### Core Dependencies
```json
{
  "react": "^18.3.1",                    // React library
  "react-dom": "^18.3.1",               // React DOM rendering
  "react-router-dom": "^7.13.1",        // Client-side routing
  "axios": "^1.6.5",                    // HTTP client
  "recharts": "^2.10.3",                // Data visualization
  "papaparse": "^5.4.1",                // CSV parsing/export
  "lucide-react": "^0.407.0",           // Icon library (100+ icons)
  "framer-motion": "^10.16.4",          // Animation library
  "tailwindcss": "^3.4.1",              // Utility CSS framework
  "autoprefixer": "^10.4.16"            // CSS vendor prefixes
}
```

### Dev Dependencies
```json
{
  "@vitejs/plugin-react": "^4.2.1",     // React support in Vite
  "tailwindcss": "^3.4.1",              // Tailwind build
  "postcss": "^8.4.31",                 // CSS processing
  "vite": "^5.0.8",                     // Build tool & dev server
  "@testing-library/react": "^14.1.2",  // React testing utilities
  "@testing-library/jest-dom": "^6.1.5", // Custom Jest matchers
  "jest": "^29.7.0"                     // Testing framework
}
```

---

## API Integration

### Backend API Base URL
- **Development:** `http://localhost:5000`
- **Production:** Configure via `VITE_API_BASE_URL`

### API Endpoints Used

```
Authentication:
  POST   /api/auth/login
  POST   /api/auth/register
  POST   /api/auth/forgot-password
  POST   /api/auth/reset-password
  POST   /api/auth/change-password

Shipments:
  GET    /api/shipments
  POST   /api/shipments
  PUT    /api/shipments/:id
  DELETE /api/shipments/:id

Containers:
  GET    /api/containers
  GET    /api/containers/:id/history
  POST   /api/containers
  PUT    /api/containers/:id
  DELETE /api/containers/:id

Documents:
  GET    /api/documents
  POST   /api/documents (multipart)
  DELETE /api/documents/:id

Dashboard:
  GET    /api/dashboard/stats
  GET    /api/dashboard/shipment-trends
  GET    /api/dashboard/container-types
  GET    /api/dashboard/port-activity
```

---

## Building for Production

### Production Build

```bash
# Create optimized production build
npm run build
```

**Outputs:**
- Minified JavaScript bundles
- Optimized CSS
- Asset hashing for caching
- Build output in `dist/` directory

### Build Configuration (vite.config.js)

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,        // Disable source maps in production
    minify: 'terser',        // JavaScript minification
    cssCodeSplit: true,      // Split CSS by route
    rollupOptions: {
      output: {
        manualChunks: {
          // Code splitting for vendor libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          utils: ['axios', 'papaparse', 'framer-motion']
        }
      }
    }
  }
})
```

### Serve Production Build Locally

```bash
# Preview production build
npm run preview
```

### Deploy to Production

**Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

**Option 2: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option 3: Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**Option 4: Traditional Server**
```bash
# SSH to server
ssh user@server.com

# Serve dist folder with nginx/apache
# Or use: http-server, express.static(), etc.
npx http-server dist -p 3000
```

---

## Testing

### Test Files Location
```
src/__tests__/
├── Contact.test.jsx
├── Login.test.jsx
├── Overview.test.jsx
└── ProtectedRoute.test.jsx
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Example Test

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '../pages/Login'

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  test('submits form with valid credentials', async () => {
    render(<Login />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard')
    })
  })
})
```

---

## Performance Optimization

### Bundle Analysis

```bash
# Install analyzer
npm install --save-dev rollup-plugin-visualizer

# Generate bundle analysis
npm run build -- --plugin visualizer
```

### Lighthouse Performance

Target metrics:
- **Lighthouse Score:** 90+
- **First Contentful Paint (FCP):** < 1.5s
- **Time to Interactive (TTI):** < 3.5s
- **Cumulative Layout Shift (CLS):** < 0.1

### Code Splitting

```javascript
// Lazy load dashboard sub-pages
const Overview = React.lazy(() => import('./pages/dashboard/Overview'))
const Shipments = React.lazy(() => import('./pages/dashboard/Shipments'))

// Use Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <Overview />
</Suspense>
```

---

## Troubleshooting

### Issue: Port 5173 Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Issue: Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: CSS Not Loading
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Issue: Tailwind Classes Not Working
1. Verify `tailwind.config.js` includes correct content paths
2. Check `src/index.css` includes `@tailwind` directives
3. Clear PostCSS cache: `rm -rf .postcss-cache`

### Issue: API Calls Failing
1. Verify backend is running on `http://localhost:5000`
2. Check CORS headers in backend
3. Verify JWT token in localStorage: `localStorage.getItem('auth_token')`
4. Check browser DevTools Network tab for actual error

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | Latest 2 versions ✅ |
| Firefox | Latest 2 versions ✅ |
| Safari | Latest 2 versions ✅ |
| Edge | Latest 2 versions ✅ |
| IE 11 | Not supported ❌ |

---

## Security Considerations

### Authentication
- JWT tokens stored in `localStorage`
- 7-day token expiration
- Auto-logout on 401 response
- Password minimum 8 characters with mixed case/numbers/symbols

### HTTPS
- Enforce HTTPS in production
- Set secure cookie flag for tokens
- Configure Content Security Policy (CSP) headers

### CORS
- Backend should allow requests from frontend domain
- Credentials included in requests (for session cookies)

### XSS Protection
- React auto-escapes JSX content
- Use `dangerouslySetInnerHTML` only for trusted content
- Content Security Policy headers

### CSRF Protection
- Backend should use CSRF tokens for state-changing operations
- SameSite cookie attribute set to 'Strict'

---

## Developer Tools Integration

### Chrome DevTools Extensions
- React Developer Tools
- Redux DevTools (if using Redux)
- Web Vitals extension

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)

---

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## Monitoring & Analytics

### Google Analytics Integration

```javascript
// Add to main.jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function AnalyticsTracker() {
  const location = useLocation()
  
  useEffect(() => {
    window.gtag?.('config', 'GA_MEASUREMENT_ID', {
      page_path: location.pathname,
    })
  }, [location])
  
  return null
}
```

### Error Tracking (Sentry)

```javascript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
})
```

---

## Maintenance & Updates

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Update specific package
npm update react@latest

# Audit security vulnerabilities
npm audit
npm audit fix
```

### Regular Tasks

- ✅ Run security audits monthly
- ✅ Update dependencies quarterly
- ✅ Review test coverage monthly
- ✅ Monitor performance metrics weekly
- ✅ Check browser compatibility quarterly

---

## Support & Resources

### Documentation
- [React Official Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/guide)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Vite Documentation](https://vitejs.dev)

### Community
- Stack Overflow (tag: reactjs)
- GitHub Discussions
- React Community Discord
- Tech community forums

### Getting Help
1. Check error message carefully
2. Search GitHub issues in project repo
3. Review troubleshooting section above
4. Check browser console for errors
5. Create detailed bug report with steps to reproduce

---

## Next Steps

### Phase 2 Enhancements (In Development)
- [ ] Real-time updates with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Offline support (Service Workers)
- [ ] Mobile app (React Native)
- [ ] Internationalization (i18n)
- [ ] Dark mode theme
- [ ] Advanced search with filters
- [ ] Custom report builder

### Phase 3 Features (Planned)
- [ ] AI-powered route optimization
- [ ] Predictive delivery times
- [ ] IoT device integration
- [ ] Mobile push notifications
- [ ] Video chat support
- [ ] Document OCR processing
- [ ] Custom workflows
- [ ] API marketplace

---

## License & Credits

MaritimeFlow © 2024 - All Rights Reserved

**Built with:**
- React.js
- Tailwind CSS
- Node.js & Express
- MySQL
- Recharts

**Team:** Maritime Logistics Solutions
