

# **Email Classifier**

An AI-powered email classification platform that connects to Gmail via Google OAuth, fetches emails, and categorizes them (e.g., Important, Delivery, Shipped, etc.) using OpenAI API.
Built using **Next.js**, **Node.js**, **Express**, **TypeScript**, and **Material UI**.

---

## **Features**

* Google OAuth-based secure login
* Fetch and display Gmail emails
* Classify emails using OpenAI API
* Filter and view categorized emails
* Responsive dashboard UI built with Material UI
* Persistent session management
* API key storage and validation

---

## **Tech Stack**

### **Frontend**

* Next.js 14 (App Router)
* TypeScript
* Material UI
* Context API (Session management)
* CSS Modules

### **Backend**

* Node.js
* Express.js
* TypeScript
* Google APIs
* OpenAI API
* dotenv for environment variables

---

## **Project Structure**

### **Frontend**

```
frontend/
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── dashboard/
    │       └── page.tsx
    ├── components/
    │   ├── atoms/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   └── CategoryChip.tsx
    │   ├── molecules/
    │   │   ├── Navbar.tsx
    │   │   └── EmailCard.tsx
    │   └── organisms/
    │       ├── FilterBar.tsx
    │       └── EmailGrid.tsx
    ├── context/
    │   └── SessionContext.tsx
    ├── hooks/
    │   └── useSession.ts
    └── services/
        └── api.ts
```

### **Backend**

```
backend/
└── src/
    ├── app.ts
    ├── server.ts
    ├── config.ts
    │  
    ├── controllers/
    │   ├── authController.ts
    │   └── emailController.ts
    ├── services/
    │   ├── googleService.ts
    │   ├── openaiService.ts
    │   └── sessionService.ts
    ├── middlewares/
    │   ├── requireSession.ts
    │   └── errorHandler.ts
    ├── routes/
    │   ├── authRoutes.ts
    │   └── emailRoutes.ts
    └── types/
        └── index.ts
```

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone https://github.com/KeerthanaCG/Email-Classifier.git
cd Email-Classifier
```

---

### **2. Backend Setup**

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5001/auth/google/callback
SESSION_SECRET=your_session_secret
OPENAI_API_KEY=your_openai_api_key
```

Run the backend:

```bash
npm run dev
```

---

### **3. Frontend Setup**

```bash
cd frontend
npm install
```

Create a `.env.local` file inside `frontend/`:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

Run the frontend:

```bash
npm run dev
```

---

## **How It Works**

1. The user logs in with Google.
2. The backend handles OAuth and retrieves a session ID.
3. Emails are fetched from Gmail API.
4. The OpenAI API classifies each email.
5. The frontend displays categorized emails using Material UI components.

---

## **Future Enhancements**

* Add pagination for large inboxes
* Enable multi-account login
* Improve classification accuracy
* Add dark/light mode toggle
* Store email classifications in a database

---

## **License**

This project is licensed under the MIT License.

---


