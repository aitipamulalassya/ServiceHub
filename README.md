# ServiceHub

A full-stack service provider onboarding and verification portal built using the MERN stack.

ServiceHub allows service providers to register, create professional profiles, upload verification documents, submit applications, and track their application status.

Administrators can review provider applications, verify uploaded documents, approve providers, or reject applications with remarks.

---

## 🚀 Features

### 👤 Provider Features

- Provider registration and login
- JWT-based authentication
- Google Login
- Complete professional profile
- Select service categories
- Add professional skills
- Add years of experience
- Add service location
- Upload profile photo
- Upload verification documents
- View uploaded documents
- Submit application for admin review
- Track application status
- View rejection remarks
- Edit profile before approval
- Resubmit rejected applications
- Forgot password functionality
- Password reset functionality

### 👨‍💼 Admin Features

- Secure admin login
- Admin dashboard
- Provider statistics
- View all providers
- Search providers
- Filter providers by application status
- Pagination
- View provider details
- View provider profile photo
- View verification documents
- Approve provider applications
- Reject provider applications
- Add rejection remarks

### 🎨 UI & UX

- Responsive design
- Tailwind CSS
- Dark mode
- Protected frontend routes
- Confirmation modal before application submission
- Application status tracking
- Clean provider and admin dashboards

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- express-validator

### Authentication & Documentation

- Google OAuth
- Swagger UI

### Development & Deployment Tools

- Git
- GitHub
- Postman
- VS Code
- Docker
- Docker Compose
- Render
- Vercel

---

## 🏗️ Architecture

```text
                 ┌─────────────────────┐
                 │     React + Vite    │
                 │     Tailwind CSS    │
                 └──────────┬──────────┘
                            │
                          Axios
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Express.js API   │
                 │       Node.js       │
                 └──────────┬──────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       ┌─────────────┐             ┌─────────────────┐
       │   MongoDB   │             │ Cloudinary      │
       │  + Mongoose │             │Profile Photos & |
       │             |             |Verification Docs|
       └─────────────┘             └─────────────────┘
```

---

## 🔄 Application Workflow

```text
Provider Registration
        ↓
Provider Login / Google Login
        ↓
Complete Profile
        ↓
Upload Photo & Documents
        ↓
Submit Application
        ↓
Pending Review
        ↓
Admin Reviews Application
        ↓
   ┌───────────────┐
   ↓               ↓
Approved        Rejected
                   ↓
             View Remarks
                   ↓
             Edit Profile
                   ↓
                Resubmit
```

---

## 📊 Application Status

| Status | Description |
| ------ | ----------- |
| `draft` | Provider has not submitted the application |
| `pending` | Application is waiting for admin review |
| `approved` | Application has been approved |
| `rejected` | Application was rejected and can be updated |

---

## 📁 Project Structure

```text
ServiceHub/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │
│   ├── Dockerfile
│   ├── .dockerignore
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── uploads/
│   ├── Dockerfile
│   ├── .dockerignore
│
├── screenshots/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---


## 🚀 Installation

### 1. Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ServiceHub
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Backend Environment Variables

Create:

```text
server/.env
```

Add:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/servicehub
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

Do not commit `.env` to GitHub.

### 4. Start MongoDB

Make sure MongoDB is running locally.

Database:

```text
servicehub
```

### 5. Start Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 6. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

### 7. Configure Frontend Environment Variables

Create:

```text
client/.env

Add:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Do not commit `.env` to GitHub.

### 8. Start Frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```
### 9. Configure Cloudinary

Create a Cloudinary account and configure the following backend environment variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

---

## 👨‍💼 Create Admin

For local development, run:

```bash
cd server
node src/utils/createAdmin.js
```

### Local Demo Admin

```text
Email: admin@servicehub.com
Password: Admin@123
```

⚠️ **Important:** These credentials are intended only for local/demo development. Never expose production administrator credentials in the repository.

---

## 🔌 API Overview

### Authentication

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/api/auth/register` | Register provider |
| POST | `/api/auth/login` | Provider/Admin login |
| POST | `/api/auth/google` | Google login |
| POST | `/api/auth/forgot-password` | Generate password reset link |
| POST | `/api/auth/reset-password/:token` | Reset password |

### Provider

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/providers/profile` | Get provider profile |
| PUT | `/api/providers/profile` | Update provider profile |
| POST | `/api/providers/submit` | Submit application |
| GET | `/api/providers/status` | Get application status |

### Documents

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/api/providers/documents` | Upload verification document |
| POST | `/api/providers/documents/profile-photo` | Upload profile photo |
| GET | `/api/providers/documents` | Get uploaded documents |
| DELETE | `/api/providers/documents/:id` | Delete uploaded document |

### Admin

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/admin/stats` | Get dashboard statistics |
| GET | `/api/admin/providers` | Get/search/filter providers |
| GET | `/api/admin/providers/:id` | Get provider details |
| PATCH | `/api/admin/providers/:id/approve` | Approve provider |
| PATCH | `/api/admin/providers/:id/reject` | Reject provider |

---

## 📮 Postman API Collection

The project includes a Postman collection containing the ServiceHub REST API requests, organized by feature.

### Collection Structure

```text
postman/
└── ServiceHub.postman_collection.json
```

The collection contains the following API groups:

- Authentication
- Provider
- Documents
- Admin

### Import the Collection into Postman

1. Open Postman.
2. Click **Import**.
3. Select **File**.
4. Open:
   ```text
   postman/ServiceHub.postman_collection.json
   ```
5. Click **Import**.

After importing, the `ServiceHub` collection will appear in your Postman workspace with all API requests organized into folders.

### Postman Environment Variables

The collection uses variables for commonly required values:

```text
baseUrl
providerToken
adminToken
providerId
resetToken
```

For example:

```text
baseUrl = http://localhost:5000/api
```

Authentication tokens and IDs can be updated in Postman while testing protected APIs.

> **Security:** Do not commit real passwords, MongoDB credentials, JWT secrets, Google client secrets, or active password-reset tokens to the Postman collection or GitHub repository.
---
## 📚 Swagger API Documentation

ServiceHub provides interactive API documentation using Swagger UI.

Start the backend and open:

```text
http://localhost:5000/api-docs
```

Swagger documents the authentication, provider, document upload, and admin APIs.

---

## 🐳 Docker

ServiceHub supports containerized frontend and backend services using Docker and Docker Compose.

### Build and Start

From the project root:

```bash
docker compose up -d --build
```

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:5000
```

MongoDB can be configured through the `MONGO_URI` environment variable.

### Stop Containers

```bash
docker compose down
```
---


## Deployment section

### 🌐 Deployment
```text


ServiceHub is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **File Storage:** Cloudinary
```

### Production Architecture

```text
                    ┌──────────────────┐
                    │     Vercel       │
                    │ React + Vite     │
                    └────────┬─────────┘
                             │
                           Axios
                             │
                             ▼
                    ┌──────────────────┐
                    │      Render      │
                    │ Node + Express   │
                    └───────┬──────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
       ┌──────────────┐            ┌──────────────┐
       │ MongoDB Atlas│            │  Cloudinary  │
       │ Application  │            │ Documents &  │
       │ Data         │            │ Photos       │
       └──────────────┘            └──────────────┘
```
---
## 📸 Screenshots

The `screenshots` folder contains images showcasing the different features and user interfaces of the ServiceHub project, including the provider portal, admin dashboard, application workflow, document upload, and Swagger API documentation.

---

## 🔐 Security

ServiceHub implements several security mechanisms:

- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- Role-based authorization
- Input validation using express-validator
- Secure document upload handling
- Environment variables for sensitive configuration
- Authentication middleware for protected resources
- Google OAuth authentication
- Password reset token hashing and expiration
- Cloudinary-based persistent file storage
- File type and file size validation
- Protected document deletion

---

## 💡 Key Technical Highlights

- Built a complete provider onboarding workflow from registration to approval.
- Implemented role-based access for providers and administrators.
- Developed RESTful APIs using Node.js and Express.js.
- Integrated MongoDB using Mongoose.
- Implemented JWT authentication and bcrypt password hashing.
- Integrated Google OAuth login.
- Implemented password reset functionality.
- Implemented document and profile image uploads using Multer.
- Added provider search, filtering, and pagination for the admin dashboard.
- Implemented application rejection and resubmission workflow.
- Built a responsive frontend using React.js and Tailwind CSS.
- Added dark mode support.
- Added Swagger API documentation.
- Added Docker and Docker Compose support.
- Implemented document and profile image uploads using Multer and Cloudinary.
- Added persistent cloud storage for verification documents and profile photos.
- Implemented secure document deletion from MongoDB and Cloudinary.
- Added protected frontend routes based on user roles.

---




## 📄 License

This project is for educational and portfolio purposes.
