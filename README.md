# Saath Chaloge? – Travel Companion App for College Students

Live Site: [https://saath-chaloge.onrender.com](https://saath-chaloge.onrender.com)

---

## What is this project?

This is a full-stack web app I built for students of NIT Jamshedpur who frequently travel home or to other cities. Most students travel alone, and safety is a major concern — especially for women. This app makes it easy for students to find trusted co-travelers from their own college who are going to the same place around the same time.

It respects gender-based preferences, so users (especially girls) can choose to travel only with others of the same gender. The aim was to create something that actually solves a real problem faced by students.

---

## Key Features

- Google and manual login/signup with email verification
- College ID card upload (front and back)
- OCR to extract gender and branch from the ID card
- Trip creation with single or multiple legs (e.g. Kolkata → Ranchi → Pune)
- Matching logic based on:
  - Destination or matching leg
  - Same date and approximate time
  - Mutual gender preference
- Send/receive connection requests
- Real-time 1:1 chat with matched users (scoped per trip)
- Dashboard with trip stats, upcoming trips, and quick actions
- Notification system for new requests and unread messages

---

## Tech Stack Used

**Frontend**:  
React, Vite, Axios, Tailwind CSS

**Backend**:  
Node.js, Express, MongoDB (Atlas)

**Other Tools & Libraries**:  
- Google OAuth 2.0  
- JWT Authentication  
- Tesseract.js for OCR  
- Socket.IO for real-time chat  
- Render for deployment

---

## How to Run Locally

```bash
# Clone the repository
git clone https://github.com/rajarnav0906/nextSeat.git

# Backend setup
cd backend
npm install
npm start

# Frontend setup
cd ../frontend
npm install
npm run dev
