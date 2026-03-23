# MaritimeFlow Backend

A comprehensive port and logistics management system API built with Node.js, Express, and MySQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- MySQL 5.7+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env file from template
cp .env.example .env

# 3. Initialize database
mysql -u root < config/schema.sql

# 4. Start development server
npm run dev
```

The server will be running at `http://localhost:5000`

## 📚 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete endpoint reference with examples
- **[Setup Guide](./SETUP_GUIDE.md)** - Detailed installation and configuration
- **[Completion Summary](./COMPLETION_SUMMARY.md)** - Features and improvements

## 🎯 Features

### Core Features
- ✅ **Shipment Tracking** - Create, update, and track shipments
- ✅ **Container Management** - Manage containers with status history
- ✅ **Document Management** - Upload and organize port documents
- ✅ **Report Generation** - Generate PDF reports for shipments and containers
- ✅ **Dashboard Analytics** - Real-time statistics and trends

### Advanced Features
- 🔍 **Advanced Search** - Search shipments by tracking number, vessel name
- 🔒 **Role-Based Access** - Admin, Operator, Viewer roles
- 📊 **Statistics Dashboard** - Port activity, container types, trends
- 🧾 **Audit Trail** - Complete history of container status changes
- 📧 **Email Notifications** - Password reset emails
- 🛡️ **Security** - JWT auth, rate limiting, input validation

## 📂 Project Structure

```
backend/
├── config/              # Database configuration
├── middleware/          # Auth & logging
├── routes/              # API endpoints
├── utils/               # Helpers & validators
├── uploads/             # Stored files & PDFs
├── __tests__/           # Test suite
├── server.js            # Main server
├── package.json         # Dependencies
├── .env                 # Environment vars
├── API_DOCUMENTATION.md # Endpoint docs
├── SETUP_GUIDE.md       # Installation guide
└── COMPLETION_SUMMARY.md# Feature summary
```

## 🔌 API Endpoints

### Quick Reference

| Category | Count | Key Endpoints |
|----------|-------|---------------|
| Authentication | 5 | Register, Login, Password Reset, Change Password |
| Users | 5 | List, Get, Create, Update, Delete |
| Shipments | 5 | CRUD + Search/Filter |
| Containers | 5 | CRUD + History Tracking |
| Documents | 5 | Upload, Manage, Retrieve |
| Reports | 4 | Generate, List, View, Delete |
| Dashboard | 4 | Stats, Trends, Types, Activity |
| Contact | 3 | Submit, List, Delete |

**Total: 50+ endpoints**

## 🔐 Security Features

- JWT-based authentication (7-day expiration)
- Role-based access control (RBAC)
- Bcryptjs password hashing
- Rate limiting (100 reqs/15 min)
- Helmet.js security headers
- Input validation on all endpoints
- SQL injection prevention
- CORS configuration
- Single-use password reset tokens

## 🛠️ Available Commands

```bash
# Development
npm run dev          # Start with hot-reload

# Production
npm start            # Start server

# Testing
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:verbose # Detailed output

# Installation
npm install          # Install dependencies
```

## 🔧 Configuration

Create a `.env` file with:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=maritimeflow
DB_PORT=3306
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=app-password
```

See `.env.example` for full reference.

## 📊 Database Schema

### Tables
- `users` - User accounts
- `shipments` - Shipment tracking
- `containers` - Container details
- `container_history` - Audit trail
- `documents` - Document storage
- `reports` - Generated reports
- `contact_messages` - Contact forms

### Relationships
```
shipments
  ├── containers (1:N)
  │   └── container_history (1:N)
  ├── documents (1:N)
  └── reports (1:N)

users
  ├── shipments (1:N)
  ├── documents (1:N)
  └── reports (1:N)
```

## 🧪 Testing

```bash
# Run all tests with coverage
npm test

# Watch mode for development
npm run test:watch

# Verbose output with details
npm run test:verbose
```

## 📝 API Example

### Create Shipment
```bash
curl -X POST http://localhost:5000/api/shipments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_number": "SHIP001",
    "vessel_name": "MS Ocean",
    "origin": "Shanghai",
    "destination": "Rotterdam",
    "status": "pending",
    "estimated_arrival": "2024-02-15"
  }'
```

### Search Shipments
```bash
curl http://localhost:5000/api/shipments?search=SHIP001&status=in_transit \
  -H "Authorization: Bearer <token>"
```

### Generate Report
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Shipment Report",
    "report_type": "shipment_summary",
    "shipment_id": 1
  }'
```

## 📈 Dashboard Endpoints

```bash
# Get statistics
GET /api/dashboard/stats

# Get trends (30 days)
GET /api/dashboard/shipment-trends

# Get container types
GET /api/dashboard/container-types

# Get port activity
GET /api/dashboard/port-activity
```

## 🔍 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access, user management, delete operations |
| **Operator** | Create/edit shipments, containers, documents |
| **Viewer** | Read-only access to all data |

## ⚙️ Performance

- Connection pooling (10 concurrent connections)
- Pagination support (max 100 items per page)
- Indexed database queries
- Rate limiting to prevent abuse
- Efficient JOIN queries

## 🌐 CORS Configuration

Configured for frontend at `http://localhost:5173`

To allow other origins, update in `server.js`:
```javascript
app.use(cors({ origin: 'your-domain.com', credentials: true }))
```

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Step Verification
2. Generate App Password
3. Use as EMAIL_PASS in .env

### Other Services
- SendGrid
- AWS SES
- Mailgun
- Office 365

Update EMAIL_HOST and credentials in .env

## 🚀 Deployment

### Setup Checklist
- [ ] Change JWT_SECRET to strong random string
- [ ] Configure production database
- [ ] Set FRONTEND_URL to production URL
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Configure email service
- [ ] Set NODE_ENV=production
- [ ] Set up monitoring/logging
- [ ] Configure firewall rules

### Docker (Optional)
```bash
docker build -t maritimeflow-backend .
docker run -p 5000:5000 --env-file .env maritimeflow-backend
```

## 📞 Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify DB credentials in .env
- Ensure database exists

### Port Already in Use
- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill -9`

### JWT Secret Error
- Set JWT_SECRET in .env
- Use strong random string (32+ chars)

### Email Not Sending
- Verify EMAIL_HOST, EMAIL_PORT, credentials
- For Gmail, ensure 2FA + App Password
- Check firewall/network settings

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io/)
- [PDFKit Documentation](http://pdfkit.org/)
- [Helmet.js Documentation](https://helmetjs.github.io/)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## ✨ Version History

### v1.0.0 - Complete Backend
- ✅ All CRUD operations
- ✅ Advanced search & filtering
- ✅ PDF report generation
- ✅ Container history tracking
- ✅ Dashboard statistics
- ✅ Security features
- ✅ Complete documentation

## 📞 Support

For issues or questions:
1. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
3. Review [COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)

---

**Backend Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: 2024
