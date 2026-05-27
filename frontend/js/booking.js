document.addEventListener('DOMContentLoaded', function() {
    // Add any homepage-specific functionality here
    animateStats();
});

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-card h3');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        if (finalValue.includes('+')) {
            const number = parseInt(finalValue);
            animateNumber(stat, 0, number, 1000);
        }
    });
}

function animateNumber(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}