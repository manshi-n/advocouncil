# Updated Appointment + Payment Flow

Customer appointment flow is now:

1. Customer sends appointment request from `book-appointment.html`.
2. Appointment is saved in MongoDB with:
   - `status: Pending`
   - `paymentStatus: Unpaid`
3. Lawyer opens `lawyer-dashboard.html` and approves or rejects the request.
4. If rejected, customer dashboard shows sorry/rejected message.
5. If approved, customer dashboard shows `Pay Now` button.
6. Customer pays through Razorpay.
7. Backend verifies payment signature.
8. Appointment becomes:
   - `status: Confirmed`
   - `paymentStatus: Paid`
9. Customer can see lawyer contact details after confirmation.

Profile photo upload added to:
- Customer Dashboard
- Lawyer Dashboard
- Student Dashboard

Profile photo API:
`POST /api/auth/me/profile-picture`
Field name: `profilePicture`
