# 🏨 Hotel Booking Application (Full Stack MERN)

A full-stack hotel booking application built using the MERN stack.  
Users can register, log in, browse hotels, view hotel details, select booking dates, and manage their own hotels from a dashboard.

This project focuses on real-world frontend and backend integration including authentication, protected routes, hotel management, image uploads, and booking flow.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication stored in HTTP cookies
- Persistent login state
- Protected routes (unauthenticated users are redirected to sign-in)
- Secure password hashing with bcrypt

---

### 🏨 Hotels Management
- Add new hotels with images
- Edit existing hotels
- View your own hotels (My Hotels dashboard)
- View hotel details page
- Search, sort, and filter hotels
- Upload hotel images using Cloudinary

---

### 📅 Booking Flow
- Date selection using calendar
- Booking summary
- Store booking information in database
- View bookings per hotel

(Currently payment integration is planned as a future improvement.)

---

### 🧑‍💼 My Hotels Dashboard
- View all hotels created by the logged-in user
- Edit hotel information
- View bookings for each hotel

---

### 🧪 Testing
- End-to-end testing using Playwright
- Separate test database to avoid affecting development data

---

## 🛠 Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- React Query
- React Hook Form
- React Router

---

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image uploads)
- dotenv
- bcrypt

---

## 🎯 Key Learnings From This Project

- Implemented full authentication flow with JWT + cookies
- Built protected routes on frontend
- Managed image uploads with Cloudinary
- Designed hotel and booking schemas in MongoDB
- Used React Query for server state
- Debugged real-world issues like auth sync, API errors, and routing problems
- Practiced production-style project structure

---

## 🚧 Future Improvements

- Stripe payment integration
- Reviews & ratings
- Admin panel
- Email confirmations
- Improved UI/UX
- Mobile responsiveness

---

⭐ If you find this project useful, feel free to star the repository!

