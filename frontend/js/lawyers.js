document.addEventListener('DOMContentLoaded', function() {
    loadLawyers();
    
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('specializationFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterLawyers);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', filterLawyers);
    }
});

function loadLawyers() {
    const lawyers = getAllLawyers();
    displayLawyers(lawyers);
}

function displayLawyers(lawyers) {
    const grid = document.getElementById('lawyersGrid');
    if (!grid) return;
    
    if (lawyers.length === 0) {
        grid.innerHTML = '<div class="no-results">No lawyers found matching your criteria.</div>';
        return;
    }
    
    grid.innerHTML = lawyers.map(lawyer => `
        <div class="lawyer-card">
            <div class="lawyer-card-content">
                <div class="lawyer-name">${lawyer.name}</div>
                <div class="lawyer-specialization">${lawyer.specialization}</div>
                <p class="lawyer-description">${lawyer.description.substring(0, 100)}...</p>
                <div class="lawyer-details">
                    <span>⭐ ${lawyer.rating}</span>
                    <span>📅 ${lawyer.experience} yrs</span>
                    <span>📍 ${lawyer.location}</span>
                    <span>🏆 ${lawyer.casesWon} won</span>
                </div>
                <div class="lawyer-footer">
                    <div class="lawyer-price">$${lawyer.hourlyRate}/hr</div>
                    <button class="btn-book" data-id="${lawyer.id}">Book Appointment</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click event listeners to all book buttons
    const bookButtons = document.querySelectorAll('.btn-book');
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const lawyerId = this.getAttribute('data-id');
            window.location.href = `lawyer-detail.html?id=${lawyerId}`;
        });
    });
}

function filterLawyers() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const specialization = document.getElementById('specializationFilter')?.value || 'all';
    
    let filtered = getAllLawyers();
    
    // Filter by specialization
    if (specialization !== 'all') {
        filtered = filtered.filter(lawyer => lawyer.specialization === specialization);
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(lawyer => 
            lawyer.name.toLowerCase().includes(searchTerm) || 
            lawyer.specialization.toLowerCase().includes(searchTerm) ||
            lawyer.location.toLowerCase().includes(searchTerm)
        );
    }
    
    displayLawyers(filtered);
}