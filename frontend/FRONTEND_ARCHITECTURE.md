# MaritimeFlow Frontend Architecture

## Overview

The MaritimeFlow frontend is a React 18 application built with modern best practices, featuring a comprehensive maritime logistics management interface with real-time data visualization, role-based access control, and a professional UI/UX design.

**Technology Stack:**
- React 18.3.1 + React Router DOM 7.13.1
- Tailwind CSS for responsive styling
- Recharts for data visualization
- Axios with request/response interceptors
- React Context API for global state management
- Lucide React for 100+ professional icons
- Framer Motion for smooth animations

## Architecture Layers

### 1. Presentation Layer (`src/components/` & `src/pages/`)

#### Core Components
- **Layout.jsx** - Main layout wrapper with Navbar and Footer
- **ProtectedRoute.jsx** - Role-based route protection (Admin/Operator/Viewer)
- **Navbar.jsx** - Navigation with auth status and user menu
- **ScrollToTop.jsx** - Automatic scroll-to-top on navigation

#### UI Component Library (`UIComponents.jsx`)
Reusable, themeable components:
- **LoadingSpinner** - Animated loading indicator (sizes: sm/md/lg)
- **Skeleton** - Pulse loading placeholders
- **TableSkeleton** - Multi-row table skeleton
- **EmptyState** - Display empty state with icon and CTA
- **StatCard** - Statistics card with icon and custom colors
- **Modal** - Responsive modal dialog (sizes: sm/md/lg/xl/2xl)
- **Badge** - Status badges with shipment/container-specific styles
- **Button** - Variants (primary/secondary/danger/success) and sizes
- **Breadcrumb** - Navigation breadcrumbs
- **Alert** - Notification alerts (info/success/warning/error)

#### Pages
- **LandingPage** - Hero, features, testimonials
- **Dashboard** - Main dashboard with sub-pages
  - **Overview** - Recharts visualizations (pie/line/bar charts)
  - **Shipments** - CRUD with search, filter, pagination, CSV export
  - **Containers** - CRUD with status history timeline
  - **Documents** - Upload, preview, download management
  - **Reports** - PDF generation and download
  - **AdminUsers** - User management (Admin only)
  - **AdminMessages** - Contact messages (Admin only)
- **Login/Register/ForgotPassword/ResetPassword** - Auth flows

### 2. Business Logic Layer (`src/utils/`)

#### API Client (`utils/api.js`)
Centralized Axios-based API service with:
- **Request Interceptor** - Auto-adds JWT token to all requests
- **Response Interceptor** - Auto-redirects to login on 401
- **Endpoint Groups:**
  - `auth` - Login, register, password management
  - `shipments` - CRUD + list operations
  - `containers` - CRUD + history tracking
  - `documents` - Upload, create, delete, download
  - `reports` - PDF generation and download
  - `dashboard` - Statistics and analytics
  - `users` - Admin user management
  - `contact` - Contact form submissions

```javascript
// Example usage:
const { data } = await api.shipments.list()
await api.documents.upload(formData)
```

#### Utilities (`utils/helpers.js`)
Pure utility functions for common tasks:
- **formatDate()** - Format date as MM/DD/YYYY
- **getStatusColor()** - Map status to color class
- **getStatusLabel()** - Map status code to readable label
- **exportToCSV()** - Convert array of objects to CSV file
- **formatFileSize()** - Format bytes to human-readable (KB/MB)
- **getInitials()** - Extract initials from name
- **truncate()** - Truncate string with ellipsis
- **validateEmail()** - RFC 5322 email validation
- **validatePassword()** - Password strength validation
- **validateUrl()** - URL format validation
- **validateRequiredFields()** - Check object field requirements

### 3. State Management Layer (`src/context/`)

#### ToastContext.jsx
Global notification system using React Context:

```javascript
// Usage:
const { toast } = useToast()
toast({ type: 'success', message: 'Saved successfully' })
// Types: 'success', 'error', 'warning', 'info'
// Auto-dismisses after 3 seconds, manual dismiss available
```

Features:
- Multiple toast types with distinct colors
- Auto-dismiss with customizable duration
- Manual dismiss button
- Toast queue management
- Stacked layout (bottom-right)

## Data Flow

```
User Action (click, form submit)
    ↓
Component Handler
    ↓
Axios API Client
    ↓
JWT Interceptor (adds auth token)
    ↓
Backend API
    ↓
Response Interceptor (handles 401)
    ↓
useToast() → Toast notification
    ↓
UI Update via setState/Context
```

## Feature Modules

### 1. Dashboard Analytics
- **Real-time Charts:** Shipment status pie chart, 30-day trends line chart
- **Port Activity:** Top origin/destination ports bar charts
- **Container Types:** Container distribution pie chart
- **Key Metrics:** Total shipments, in-transit, delivered, containers

### 2. Shipment Management
- **CRUD Operations:** Create, read, update, delete shipments
- **Search & Filter:** By tracking number, vessel, routes
- **Status Tracking:** Pending → In Transit → Delivered
- **CSV Export:** Download shipment data as CSV
- **Pagination:** Load more or scroll-based pagination

### 3. Container Management
- **CRUD Operations:** Full container lifecycle management
- **Status History:** Timeline view of all status changes
- **Audit Trail:** Who changed status and when
- **Container Types:** 20ft, 40ft, HC, reefer, open-top, flat-rack
- **Weight Tracking:** Cargo weight in KG
- **CSV Export:** Download container data as CSV

### 4. Document Management
- **Upload:** File upload with drag-and-drop support
- **Download:** Direct file download from storage
- **Categorization:** 8 document types (BoL, Manifest, etc.)
- **Search & Filter:** By name, type, shipment
- **Permissions:** Operator can upload, Admin can delete

### 5. Authentication
- **JWT-based:** 7-day token expiration
- **Password Security:** Bcryptjs hashing with change-password endpoint
- **Account Recovery:** Forgot password → Email reset link
- **Role-based Access:** Admin, Operator, Viewer roles

## Styling System

### Tailwind Configuration
- **Primary Color:** `#0B3D91` (maritime blue)
- **Responsive Breakpoints:** Mobile-first design
- **Custom Theme:** Extended with maritime-specific colors

### Color Palette

| Component | Color |
|-----------|-------|
| Primary Button | `#0B3D91` (maritime blue) |
| Success | `#22C55E` (green) |
| Warning | `#F59E0B` (amber) |
| Danger | `#EF4444` (red) |
| Info | `#3B82F6` (blue) |

### Component Spacing
- **Card Padding:** `px-5 py-3` to `px-6 py-4`
- **Gap Between Elements:** `gap-2` to `gap-4`
- **Border Radius:** `rounded-lg` to `rounded-2xl`

## Performance Optimization

### Code Splitting
- Lazy-loaded dashboard pages with React.lazy()
- Route-based code splitting via React Router

### Memoization
- Reusable components wrapped with React.memo()
- Expensive computations memoized with useMemo()

### Network Optimization
- Axios request/response compression
- JWT token stored in localStorage (secure for SPA)
- Automatic token refresh on 401 response

### Rendering Optimization
- Conditional rendering using ternary operators
- Skeleton loaders for perceived performance
- Virtualized lists for large datasets (containers can be added)

## Testing Strategy

### Unit Tests
- Component render tests with React Testing Library
- Utility function tests with Jest
- API client mock tests

### Integration Tests
- Dashboard data flow tests
- CRUD operation workflows
- Authentication flows

### Test Coverage Targets
- Components: 80%+ coverage
- Utilities: 90%+ coverage
- Overall: 85%+ coverage

## Accessibility

### WCAG 2.1 Compliance
- Semantic HTML tags (`<nav>`, `<main>`, `<section>`)
- ARIA labels for icon-only buttons
- Color contrast ratios meet AA standards
- Keyboard navigation support

### Screen Reader Optimization
- Descriptive link text (not "click here")
- Form labels associated with inputs
- Role attributes on custom components
- Alt text for meaningful images

## API Contract

### Request Format
```json
{
  "method": "GET|POST|PUT|DELETE",
  "url": "/api/<resource>",
  "headers": {
    "Authorization": "Bearer <jwt_token>",
    "Content-Type": "application/json"
  }
}
```

### Response Format
```json
{
  "data": {},
  "message": "Success message",
  "status": 200
}
```

### Error Handling
```javascript
try {
  await api.shipments.create(data)
} catch (error) {
  // error.response.status: HTTP status code
  // error.response.data: Error response from backend
  // error.message: Error message
  toast({ type: 'error', message: error.message })
}
```

## Directory Structure

```
frontend/
├── public/
├── src/
│   ├── context/
│   │   └── ToastContext.jsx
│   ├── components/
│   │   ├── UIComponents.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── dashboard/
│   │       ├── Overview.jsx
│   │       ├── Shipments.jsx
│   │       ├── Containers.jsx
│   │       ├── Documents.jsx
│   │       ├── Reports.jsx
│   │       ├── AdminUsers.jsx
│   │       └── AdminMessages.jsx
│   ├── utils/
│   │   ├── api.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Common Patterns

### Data Fetching Pattern
```javascript
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

async function load() {
  setLoading(true)
  setError('')
  try {
    const { data } = await api.resource.list()
    setData(data)
  } catch (e) {
    setError(e.message)
    toast({ type: 'error', message: e.message })
  } finally {
    setLoading(false)
  }
}

useEffect(() => { load() }, [])
```

### Form Handling Pattern
```javascript
const [form, setForm] = useState(initialState)
const [saving, setSaving] = useState(false)
const [errors, setErrors] = useState('')

const handleChange = e => 
  setForm(p => ({ ...p, [e.target.name]: e.target.value }))

async function handleSubmit(e) {
  e.preventDefault()
  setSaving(true)
  setErrors('')
  try {
    await api.resource.create(form)
    toast({ type: 'success', message: 'Created successfully' })
    closeModal()
    load()
  } catch (e) {
    setErrors(e.message)
  } finally {
    setSaving(false)
  }
}
```

### CRUD Operations Pattern
```javascript
// Create
await api.shipments.create({ tracking_number, origin, destination })

// Read
const { data } = await api.shipments.list()
const { data: single } = await api.shipments.get(id)

// Update
await api.shipments.update(id, { status: 'delivered' })

// Delete
await api.shipments.delete(id)
```

## Environment Variables

Create `.env.local` in frontend directory:
```
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=MaritimeFlow
```

## Development Workflow

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Run Tests:**
   ```bash
   npm test
   ```

5. **Generate Coverage:**
   ```bash
   npm test -- --coverage
   ```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] HTTPS enabled
- [ ] CORS headers configured
- [ ] Minification enabled
- [ ] Source maps disabled for production
- [ ] Analytics integrated
- [ ] Error reporting configured
- [ ] Performance monitoring enabled
- [ ] Security headers set

## Future Enhancements

1. **Real-time Updates:** WebSocket integration for live shipment tracking
2. **Offline Support:** Service workers for offline functionality
3. **Advanced Analytics:** Machine learning predictions for delivery times
4. **Mobile App:** React Native mobile application
5. **Internationalization:** Multi-language support (i18n)
6. **Dark Mode:** Theme switcher with system preference detection
7. **Advanced Permissions:** Granular RBAC with custom roles
8. **Audit Trail:** Complete user action logging and compliance
