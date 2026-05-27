# AdvoCouncil Fixed Flow

## Backend
```bash
cd backend
npm install
npm run dev
```

## MongoDB Atlas
Your `.env` now uses database name `advocouncil`. Atlas will create it automatically after first signup/seed.

## Seed demo data
```bash
cd backend
npm run seed
```
Demo accounts:
- customer@demo.com / password123
- student@demo.com / password123
- rahul@advocouncil.com / password123
- priya@advocouncil.com / password123

## Razorpay
Add real Razorpay test keys in `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```
Booking uses Razorpay Checkout and then stores appointment in MongoDB.

## Frontend
Open `frontend/index.html` or `frontend/signin.html` using Live Server.

## Working flows
1. Customer login -> Find Lawyers -> Book Appointment -> Razorpay payment -> appointment saved in MongoDB -> Customer dashboard shows pending/approved/rejected.
2. Lawyer login -> Dashboard -> Approve/Reject appointment -> Customer dashboard updates with contact/message.
3. Lawyer -> Post Internship -> saved in MongoDB.
4. Student -> Search Internships -> Upload Resume + Apply -> application saved in MongoDB.
5. Lawyer -> Internship Applicants -> Download Resume -> Approve/Reject with message -> Student dashboard shows result/contact.
