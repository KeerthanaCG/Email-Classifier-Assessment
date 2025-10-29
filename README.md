 Email Classifier Application
## Overview

The Email Classifier is a full-stack web application that allows users to sign in with Google, fetch and categorize emails, and view detailed email content in a user-friendly interface.
The app uses Node.js and Express for the backend, and Next.js for the frontend.

## Features

* Google OAuth authentication
* Fetch emails from Gmail API
* Dynamic email categorization (Promotions, Social, Important, Delivery, Shipped, etc.)
* Filter and view emails based on categories
* Adjustable number of emails to fetch
* Split-view layout to read emails while keeping the list visible
* API key storage with validation
* User session handling and logout functionality

## Project Structure

Email_Classifier/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── CategoryChip.tsx
│   │   │   │
│   │   │   ├── molecules/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── EmailCard.tsx
│   │   │   │
│   │   │   └── organisms/
│   │   │       ├── FilterBar.tsx
│   │   │       └── EmailGrid.tsx
│   │   │
│   │   ├── context/
│   │   │   └── SessionContext.tsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useSession.ts
│   │   │
│   │   └── services/
│   │       └── api.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   │
│   │   ├── config.ts
│   │   │  
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── emailController.ts
│   │   │
│   │   ├── services/
│   │   │   ├── googleService.ts
│   │   │   ├── openaiService.ts
│   │   │   └── sessionService.ts
│   │   │
│   │   ├── middlewares/
│   │   │   ├── requireSession.ts
│   │   │   └── errorHandler.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── emailRoutes.ts
│   │   │
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── README.md




## Installation and Setup

### 1. Clone the Repository


git clone https://github.com/KeerthanaCG/Email-Classifier.git
cd Email-Classifier


### 2. Backend Setup


cd backend
npm install


#### Create a `.env` file


PORT=5001
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5001/auth/google/callback
SESSION_SECRET=your_session_secret


#### Start the Backend

npm run dev


Server runs at `http://localhost:5001`



### 3. Frontend Setup


cd ../frontend
npm install


#### Create a `.env.local` file


NEXT_PUBLIC_BACKEND_URL=http://localhost:5001


#### Start the Frontend


npm run dev


App runs at `http://localhost:3000`



## Usage

1. Open the app in the browser (`http://localhost:3000`)
2. Sign in using Google
3. Enter and save your Gmail API key (only once)
4. Choose how many emails to fetch and select a category
5. Click on an email to view its full content on the right panel
6. Logout securely using the provided button



## Technologies Used

**Frontend:** Next.js, React, Tailwind CSS
**Backend:** Node.js, Express.js, Google APIs
**Database/Session:** Local Storage



## Future Enhancements

* Add pagination for emails
* Enable marking emails as read/unread
* Implement backend database for API key and session persistence
* Support multiple email accounts
