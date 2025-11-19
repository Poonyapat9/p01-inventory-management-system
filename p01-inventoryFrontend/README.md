# StockMe - Inventory Management Frontend

A modern, full-featured inventory management system frontend built with Next.js 14, TypeScript, Redux, and Tailwind CSS.

## 🚀 Features

### User Authentication

- User registration with role selection (Admin/Staff)
- JWT-based authentication
- Protected routes with role-based access control
- Persistent authentication state with Redux Persist

### Product Management

- **Public Access**: View product catalog without authentication
- **Admin Features**:
  - Add new products
  - Edit existing products
  - Delete products
  - Full CRUD operations

### Transaction Request Management

- **Staff Users**:
  - Create stock-in requests (unlimited quantity)
  - Create stock-out requests (max 50 units)
  - View and edit own requests
  - Cancel own requests
- **Admin Users**:
  - View all transaction requests
  - Edit any request
  - Cancel any request

### Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify
- **Date Formatting**: date-fns

## 📦 Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:
   Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── products/          # Product management
│   │   ├── new/
│   │   └── [id]/
│   ├── requests/          # Request management
│   │   ├── new/
│   │   └── [id]/
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── auth/             # Auth-related components
│   ├── layout/           # Layout components
│   └── ui/               # UI components (Button, Input, etc.)
├── store/                # Redux store configuration
│   ├── slices/          # Redux slices
│   ├── hooks.ts         # Typed Redux hooks
│   └── index.ts         # Store setup with persist
├── services/            # API services
│   ├── authService.ts
│   ├── productService.ts
│   └── requestService.ts
├── types/               # TypeScript type definitions
├── lib/                # Utilities and configurations
│   └── axios.ts        # Axios instance with interceptors
```

## 🎨 Key Topics Covered

This project demonstrates mastery of the following concepts:

1. **Web Development Fundamentals**: HTML5, CSS3, responsive design
2. **JavaScript/TypeScript**: ES6+, TypeScript types and interfaces
3. **React Framework**: Components, hooks, context
4. **Pages, Props, Styling**: Next.js pages, component props, Tailwind CSS
5. **Forms, Interaction, Events**: Form handling, event listeners, validation
6. **React State**: useState, useEffect, complex state management
7. **Router and Navigation**: Next.js App Router, dynamic routes, navigation
8. **Hooks**: Custom hooks, useAppSelector, useAppDispatch
9. **Data Fetching**: Axios, async/await, API integration
10. **Data Posting, Auth**: POST requests, JWT authentication, NextAuth ready
11. **Redux**: Redux Toolkit, slices, actions, reducers
12. **Redux Persist, Responsive**: State persistence, mobile-first design

## 🔐 Access Control Rules

### Admin Role

- ✅ Add/Edit/Delete products
- ✅ View all transaction requests
- ✅ Edit/Cancel any request
- ✅ Full system access

### Staff Role

- ✅ View products (public)
- ✅ Create stock-in requests (unlimited)
- ✅ Create stock-out requests (max 50 units)
- ✅ View/Edit/Cancel own requests
- ❌ Cannot manage products
- ❌ Cannot view others' requests

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 API Integration

The frontend connects to the StockMe backend API:

- Base URL: `http://localhost:5000/api/v1`
- Authentication: Bearer token in Authorization header
- Automatic token injection via Axios interceptors
- Error handling with toast notifications

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive grid layouts
- Adaptive navigation
- Touch-friendly UI elements
- Breakpoints: sm (640px), md (768px), lg (1024px)

## 🔄 State Management

Redux store with three main slices:

- **Auth Slice**: User authentication state
- **Product Slice**: Product data and operations
- **Request Slice**: Transaction request management

Redux Persist: Automatically saves auth state to localStorage

## 🎯 Learning Outcomes

This project demonstrates:

- Modern React patterns and best practices
- Type-safe development with TypeScript
- Scalable state management with Redux
- RESTful API integration
- Role-based authorization
- Responsive UI development
- Form validation and error handling
- Code organization and modularity

## 📄 License

ISC

## 👥 Support

For questions or issues, please refer to the backend API documentation or contact the development team.
