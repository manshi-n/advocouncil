# AdvoCouncil Final Working Flow

## Run
1. Open `backend/.env` and set your Atlas `MONGO_URI` and Razorpay test keys.
2. In terminal:

```bash
cd backend
npm install
npm run seed
npm run dev
```

3. Open `frontend/index.html` using VS Code Live Server.

## Demo accounts after seed
- Admin: `admin@demo.com` / `password123`
- Customer: `customer@demo.com` / `password123`
- Student: `student@demo.com` / `password123`
- Lawyer: `rahul@advocouncil.com` / `password123`
- Lawyer: `priya@advocouncil.com` / `password123`

## Customer flow
1. Login as customer.
2. Open Find Lawyers.
3. Choose a lawyer and send appointment request.
4. Status is stored in MongoDB as `Pending`.
5. Lawyer approves/rejects.
6. If approved, customer sees `Pay Now`.
7. Razorpay payment success changes appointment to `Confirmed` and `Paid` in MongoDB.

## Lawyer flow
1. Login as lawyer.
2. View profile, cases, appointments.
3. Approve/reject appointment requests.
4. Post internship opportunities.
5. View student applicants, download resumes, approve/reject with message/contact.

## Student flow
1. Login as student.
2. Complete LinkedIn-style profile.
3. Upload resume.
4. Search internships.
5. Apply to internships with resume/message.
6. Track status and see lawyer message/contact if approved.

## Admin flow
1. Login as admin.
2. View users, lawyers, appointments, internships, applications, and payments.

Everything above is stored in MongoDB through backend APIs.
