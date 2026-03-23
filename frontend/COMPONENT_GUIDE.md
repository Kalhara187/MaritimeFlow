# MaritimeFlow Frontend - Component Guide

## Quick Navigation

### UIComponents Library
Import and use reusable components:

```javascript
import {
  LoadingSpinner,
  Skeleton,
  EmptyState,
  StatCard,
  Modal,
  Badge,
  Button,
  Alert
} from '../../components/UIComponents'
```

## Component Reference

### LoadingSpinner
Animated loading indicator for async operations.

```jsx
<LoadingSpinner size="md" /> // sm, md, lg
```

**Props:**
- `size` - Size variant (default: 'md')

**Use Cases:**
- Data loading states
- Form submission feedback
- API calls in progress

---

### Badge
Status indicators with shipment/container-specific styling.

```jsx
// Status-based badge
<Badge status="delivered" type="shipment" />
<Badge status="cleared" type="container" />

// Label-based badge
<Badge label="New" color="green" />
```

**Props:**
- `status` - Status code (e.g., 'delivered', 'cleared')
- `type` - 'shipment' or 'container' (required for status badges)
- `label` - Text label (for custom badges)
- `color` - Color variant (gray, blue, green, red, yellow, orange)

**Available Statuses:**

**Shipment Statuses:**
- `pending` - Yellow badge
- `in_transit` - Blue badge
- `arrived` - Green badge
- `delivered` - Emerald badge
- `cancelled` - Red badge

**Container Statuses:**
- `at_sea` - Blue badge
- `at_port` - Indigo badge
- `under_inspection` - Amber badge
- `cleared` - Green badge
- `released` - Gray badge

---

### Button
Flexible button component with multiple variants.

```jsx
<Button variant="primary" size="md" loading={false}>
  Save Changes
</Button>

<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>
```

**Props:**
- `variant` - 'primary', 'secondary', 'danger', 'success' (default: 'primary')
- `size` - 'sm', 'md', 'lg' (default: 'md')
- `loading` - Boolean loading state (default: false)
- Standard HTML button props (`onClick`, `disabled`, etc.)

---

### Modal
Responsive modal dialog component.

```jsx
{showModal && (
  <Modal isOpen={showModal} onClose={handleClose} title="Edit Shipment" size="lg">
    {/* Content here */}
  </Modal>
)}
```

**Props:**
- `isOpen` - Boolean to show/hide modal
- `onClose` - Callback when user closes modal
- `title` - Modal header title
- `size` - 'sm', 'md', 'lg', 'xl', '2xl' (default: 'md')
- `children` - Modal content

---

### StatCard
Statistics display card with icon and customizable color.

```jsx
<StatCard
  label="Total Shipments"
  value="1,234"
  icon={Ship}
  color="blue"
/>
```

**Props:**
- `label` - Card label/title
- `value` - Main metric value
- `icon` - Lucide React icon component
- `color` - 'blue', 'green', 'orange', 'red', 'purple' (default: 'blue')

---

### EmptyState
Display message for empty states with optional action.

```jsx
<EmptyState
  icon={FileText}
  title="No Documents"
  description="Upload your first document to get started"
  action={<Button onClick={handleCreate}>Add Document</Button>}
/>
```

**Props:**
- `icon` - Lucide React icon component
- `title` - Main message
- `description` - Secondary message
- `action` - Optional React element (button, link, etc.)

---

### Alert
Notification alert for messages and status updates.

```jsx
<Alert
  type="success"
  title="Success!"
  message="Your changes have been saved."
  onClose={handleClose}
/>
```

**Props:**
- `type` - 'info', 'success', 'warning', 'error' (default: 'info')
- `title` - Alert header (optional)
- `message` - Alert message
- `onClose` - Callback for close button click (optional)

---

### Skeleton & TableSkeleton
Loading placeholders for tables and content.

```jsx
// Simple skeleton
<Skeleton className="h-10 w-full rounded" />

// Table skeleton with 5 rows, 5 columns
<TableSkeleton rows={5} columns={5} />
```

**Props:**
- `className` - Custom Tailwind classes
- `rows` - Number of skeleton rows (TableSkeleton only)
- `columns` - Number of skeleton columns (TableSkeleton only)

---

## API Utilities

### api.js - Centralized API Client

```javascript
import api from '../../utils/api'

// Shipments
await api.shipments.list()
await api.shipments.create(data)
await api.shipments.update(id, data)
await api.shipments.delete(id)

// Containers
await api.containers.list()
await api.containers.create(data)
await api.containers.getHistory(id) // Get status history

// Documents
await api.documents.list()
await api.documents.upload(formData) // Multipart upload
await api.documents.delete(id)

// Dashboard
await api.dashboard.stats()
await api.dashboard.trends()
await api.dashboard.containerTypes()
await api.dashboard.portActivity()
```

**Error Response Structure:**
```javascript
// Axios automatically throws errors with:
error.response.status     // HTTP status code (401, 404, 500, etc)
error.response.data       // { message: "Error description", ... }
error.message             // Error message string
```

---

## Helper Functions

### helpers.js - Utility Functions

```javascript
import {
  formatDate,
  getStatusColor,
  getStatusLabel,
  exportToCSV,
  formatFileSize,
  getInitials,
  truncate,
  validateEmail,
  validatePassword,
  validateUrl,
  validateRequiredFields
} from '../../utils/helpers'
```

### formatDate(dateString)
Convert date string to MM/DD/YYYY format.

```javascript
formatDate('2024-01-15') // "01/15/2024"
```

### exportToCSV(dataArray, filename)
Export array of objects as CSV file.

```javascript
const data = [
  { name: 'MSC Gülsün', origin: 'Shanghai', destination: 'Rotterdam' },
  { name: 'EVERGREEN', origin: 'Singapore', destination: 'Los Angeles' }
]
exportToCSV(data, 'ships.csv')
```

### formatFileSize(bytes)
Format bytes to human-readable size.

```javascript
formatFileSize(1024) // "1 KB"
formatFileSize(1048576) // "1 MB"
```

### getStatusLabel(status)
Convert status code to readable label.

```javascript
getStatusLabel('in_transit') // "In Transit"
getStatusLabel('at_port') // "At Port"
```

### validateEmail(email)
Validate email format (RFC 5322).

```javascript
validateEmail('user@example.com') // true
validateEmail('invalid-email') // false
```

### validatePassword(password)
Check password strength (8+ chars, mix of case, numbers, symbols).

```javascript
validatePassword('SecurePass123!') // true
validatePassword('weak') // false
```

### truncate(str, length)
Truncate string with ellipsis.

```javascript
truncate('Very long vessel name here', 20) // "Very long vessel n..."
```

---

## Toast Notifications

### useToast Hook

```javascript
import { useToast } from '../../context/ToastContext'

export function MyComponent() {
  const { toast } = useToast()

  const handleSave = async () => {
    try {
      await api.shipments.create(data)
      toast({
        type: 'success',
        message: 'Shipment created successfully'
      })
    } catch (error) {
      toast({
        type: 'error',
        message: error.message
      })
    }
  }

  return <button onClick={handleSave}>Save</button>
}
```

**Props:**
- `type` - 'success', 'error', 'warning', 'info'
- `message` - Toast message text

**Features:**
- Auto-dismiss after 3 seconds
- Manual dismiss button
- Multiple toasts queue
- Stacked layout (bottom-right corner)

---

## Common Implementation Patterns

### CRUD with Toast Feedback

```javascript
import { useToast } from '../../context/ToastContext'
import api from '../../utils/api'
import { LoadingSpinner } from '../../components/UIComponents'

export function ShipmentsView() {
  const { toast } = useToast()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.shipments.list()
      setRecords(data)
    } catch (e) {
      setError(e.message)
      toast({ type: 'error', message: e.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!window.confirm('Delete this shipment?')) return
    try {
      await api.shipments.delete(id)
      toast({ type: 'success', message: 'Deleted successfully' })
      load()
    } catch (e) {
      toast({ type: 'error', message: e.message })
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <Alert type="error" message={error} />

  return (
    <div>
      {records.map(record => (
        <div key={record.id}>
          {record.tracking_number}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  )
}
```

### CSV Export Pattern

```javascript
import { exportToCSV } from '../../utils/helpers'

const handleExport = () => {
  try {
    const data = filtered.map(item => ({
      'Tracking #': item.tracking_number,
      'Vessel': item.vessel_name,
      'Status': getStatusLabel(item.status),
      'Date': formatDate(item.created_at),
    }))
    exportToCSV(data, 'shipments.csv')
    toast({ type: 'success', message: 'Exported successfully' })
  } catch (e) {
    toast({ type: 'error', message: 'Export failed' })
  }
}
```

### Form Validation Pattern

```javascript
import {
  validateEmail,
  validatePassword,
  validateRequiredFields
} from '../../utils/helpers'

const validateForm = (formData) => {
  if (!validateRequiredFields(formData, ['email', 'password', 'name'])) {
    return 'All fields are required'
  }
  if (!validateEmail(formData.email)) {
    return 'Invalid email address'
  }
  if (!validatePassword(formData.password)) {
    return 'Password must be 8+ characters with mix of upper/lower case, numbers, and symbols'
  }
  return null
}

async function handleSubmit(e) {
  e.preventDefault()
  const error = validateForm(form)
  if (error) {
    setFormError(error)
    toast({ type: 'error', message: error })
    return
  }
  // Submit form
}
```

---

## Testing Components

### Example Test

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../components/UIComponents'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalled()
  })

  test('shows loading spinner when loading prop is true', () => {
    render(<Button loading={true}>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

---

## Accessibility Guidelines

### Screen Reader Support
- Use `title` attributes on icon-only buttons
- Ensure all form inputs have associated labels
- Use semantic HTML (`<nav>`, `<main>`, `<section>`)

### Keyboard Navigation
- All buttons accessible with Tab key
- Modals trap focus and restore on close
- Forms navigable with Tab and Shift+Tab

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio)
- Status indicators don't rely on color alone (use badges)

---

## Performance Tips

1. **Lazy Load Dashboard Pages:**
   ```javascript
   const Overview = React.lazy(() => import('./Overview'))
   const Shipments = React.lazy(() => import('./Shipments'))
   ```

2. **Memoize Expensive Components:**
   ```javascript
   export default React.memo(ShipmentsTable)
   ```

3. **Use TableSkeleton for Large Lists:**
   ```javascript
   {loading && <TableSkeleton rows={10} columns={6} />}
   ```

4. **Batch API Calls:**
   ```javascript
   const [cData, sData] = await Promise.all([
     api.containers.list(),
     api.shipments.list()
   ])
   ```

---

## Troubleshooting

### Toast Not Showing
- Ensure `<ToastProvider>` wraps your app in `App.jsx`
- Check that `useToast()` hook is called within ToastProvider scope

### API Calls Failing with 401
- JWT token may have expired
- Check localStorage for 'auth_token'
- Axios interceptor should auto-redirect to login

### Styles Not Applying
- Import Tailwind CSS in `index.css`
- Ensure Tailwind config includes component paths
- Check for CSS class conflicts

### Components Not Rendering
- Verify component is exported correctly
- Check import path matches file location
- Ensure all required props are provided

---

## Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Recharts Guide](https://recharts.org)
- [Axios Documentation](https://axios-http.com)
- [Lucide Icons](https://lucide.dev)
