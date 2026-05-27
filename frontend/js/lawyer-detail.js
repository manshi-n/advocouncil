document.addEventListener('DOMContentLoaded', function() {
    loadLawyerDetails();
});

function loadLawyerDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const lawyerId = urlParams.get('id');
    
    if (!lawyerId) {
        window.location.href = 'lawyers.html';
        return;
    }
    
    const lawyer = getLawyerById(lawyerId);
    
    if (!lawyer) {
        document.getElementById('lawyerProfile').innerHTML = '<div class="error">Lawyer not found</div>';
        return;
    }
    
    displayLawyerProfile(lawyer);
}

function displayLawyerProfile(lawyer) {
    const container = document.getElementById('lawyerProfile');
    
    container.innerHTML = `
        <div class="profile-main">
            <div class="profile-header">
                <h1>${lawyer.name}</h1>
                <div class="specialization-badge">${lawyer.specialization}</div>
            </div>
            
            <div class="profile-stats">
                <div class="stat-item">⭐ <span class="stat-value">${lawyer.rating}</span></div>
                <div class="stat-item">📅 <span class="stat-value">${lawyer.experience}</span> years</div>
                <div class="stat-item">📍 <span class="stat-value">${lawyer.location}</span></div>
                <div class="stat-item">🏆 <span class="stat-value">${lawyer.casesWon}</span> cases won</div>
            </div>
            
            <div class="profile-section">
                <h3>About</h3>
                <p>${lawyer.fullBio || lawyer.description}</p>
            </div>
            
            <div class="profile-section">
                <h3>Contact Information</h3>
                <div class="contact-info">
                    <p>📧 <a href="mailto:${lawyer.email}">${lawyer.email}</a></p>
                    <p>📞 ${lawyer.phone}</p>
                </div>
            </div>
        </div>
        
        <div class="profile-sidebar">
            <div class="price">
                <div class="amount">$${lawyer.hourlyRate}</div>
                <div class="period">per hour</div>
            </div>
            
            <form id="quickBookingForm">
                <div class="form-group">
                    <label for="date">Date</label>
                    <input type="date" id="date" name="date" required>
                </div>
                
                <div class="form-group">
                    <label for="time">Time</label>
                    <input type="time" id="time" name="time" required>
                </div>
                
                <div class="form-group">
                    <label for="notes">Notes (optional)</label>
                    <textarea id="notes" name="notes" rows="3" placeholder="Describe your legal need..."></textarea>
                </div>
                
                <button type="submit" class="btn-primary">Book Appointment</button>
            </form>
            
            <div class="signin-notice">
                You need to <a href="signin.html">sign in</a> to book
            </div>
        </div>
    `;
    
    // Add booking form handler
    const bookingForm = document.getElementById('quickBookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            
            if (!isLoggedIn) {
                showNotification('Please sign in to book an appointment', 'error');
                setTimeout(() => {
                    window.location.href = 'signin.html';
                }, 1500);
                return;
            }
            
            // Proceed with booking
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const notes = document.getElementById('notes').value;
            
            if (!date || !time) {
                showNotification('Please select date and time', 'error');
                return;
            }
            
            // Save booking to localStorage
            const booking = {
                lawyerId: lawyer.id,
                lawyerName: lawyer.name,
                date: date,
                time: time,
                notes: notes,
                bookedAt: new Date().toISOString()
            };
            
            let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            showNotification(`Appointment booked with ${lawyer.name} on ${date} at ${time}!`, 'success');

            // Save current booking
            localStorage.setItem('selectedLawyer', JSON.stringify(lawyer));
            localStorage.setItem('lawyerFee',lawyer.hourlyRate);
            localStorage.setItem('appointmentDate', date);
            localStorage.setItem('appointmentTime', time);
            localStorage.setItem('appointmentNotes', notes);

            // Open payment page
            setTimeout(() => {
            window.location.href = 'book-appointment.html';
            }, 1000);

            // Reset form
            bookingForm.reset();
        });
    }
}