
# AdvoCouncil Project Updated

## Added Features
- MongoDB Database Connection
- Express.js and Node.js Backend
- Razorpay Payment Gateway Integration
- Indian Rupees (INR) Payment Support
- Appointment confirmation only after successful payment

## Installation

### Backend
cd backend
npm install

### Frontend
Open frontend/index.html in browser

## Start Backend
npm run dev

## MongoDB
Add your MongoDB Atlas connection string in:
backend/.env

## Razorpay Setup
1. Create account on Razorpay
2. Generate Key ID and Secret
3. Add them in backend/.env
4. Replace YOUR_RAZORPAY_KEY_ID in frontend/js/payment.js

## Payment Flow
1. User books appointment
2. Razorpay payment popup opens
3. Payment done in INR
4. Appointment confirms only after payment success
