/* ============================================================
   FEEDBACK PAGE INTERACTION & SUBMISSION SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackSuccess = document.getElementById('feedbackSuccess');
    const categoryChips = document.querySelectorAll('.feedback-chip');
    const starButtons = document.querySelectorAll('.rating-star-btn');
    const ratingValueInput = document.getElementById('ratingValue');
    const ratingFeedbackText = document.getElementById('ratingFeedbackText');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const charCount = document.getElementById('charCount');
    const detectedDeviceEl = document.getElementById('detectedDevice');
    const deviceDetailsHidden = document.getElementById('deviceDetails');

    // 1. Detect User Environment (Non-invasive browser & screen details)
    function detectEnvironment() {
        const ua = navigator.userAgent;
        let browser = 'Unknown Browser';
        if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
        else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
        else if (ua.includes('Trident')) browser = 'IE';
        else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Microsoft Edge';
        else if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Safari')) browser = 'Safari';

        let os = 'Unknown OS';
        if (ua.includes('Win')) os = 'Windows';
        else if (ua.includes('Mac')) os = 'macOS';
        else if (ua.includes('Linux')) os = 'Linux';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('like Mac')) os = 'iOS';

        const screenRes = `${window.innerWidth}x${window.innerHeight}`;
        const envInfo = `${browser} on ${os} (${screenRes})`;

        if (detectedDeviceEl) {
            detectedDeviceEl.textContent = envInfo;
        }
        if (deviceDetailsHidden) {
            deviceDetailsHidden.value = envInfo;
        }
    }
    detectEnvironment();

    // 2. Category Chip Selection & Dynamic Placeholder
    const placeholders = {
        'suggestion': 'What idea or improvement do you have for this website? How can I make it more useful for you?',
        'bug': 'What happened? Please describe the issue and the steps to reproduce it...',
        'design': 'Which visual element, color, spacing, or UI component can be refined?',
        'performance': 'Did a page take too long to load or feel sluggish? Please tell me which page and device you were using...',
        'feature': 'What tool, feature, or service would you love to see added to this portfolio?',
        'praise': 'What did you like most about the website? Thank you so much for taking the time to share!'
    };

    categoryChips.forEach(chip => {
        chip.addEventListener('click', function () {
            categoryChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                const cat = radio.value;
                if (placeholders[cat] && feedbackMessage) {
                    feedbackMessage.placeholder = placeholders[cat];
                }
            }
        });
    });

    // 3. Interactive Star Satisfaction Rating
    const ratingLabels = {
        '1': 'Needs Work 😕',
        '2': 'Fair 🙂',
        '3': 'Good Experience 😊',
        '4': 'Great Experience! 😃',
        '5': 'Exceptional / Loved It! 🤩'
    };

    starButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const rating = parseInt(this.getAttribute('data-rating'), 10);
            if (ratingValueInput) ratingValueInput.value = rating;

            // Highlight all stars up to selected
            starButtons.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'), 10);
                if (sRating <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });

            if (ratingFeedbackText && ratingLabels[rating]) {
                ratingFeedbackText.textContent = ratingLabels[rating];
                ratingFeedbackText.style.color = '#F59E0B';
            }
        });
    });

    // 4. Character Counter
    if (feedbackMessage && charCount) {
        feedbackMessage.addEventListener('input', function () {
            charCount.textContent = `${this.value.length} / 1000`;
        });
    }

    // 5. Form Submission Handling with Web3Forms
    if (feedbackForm && feedbackSuccess) {
        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = feedbackForm.querySelector('.feedback-submit-btn');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
                </svg>
                Submitting Feedback...
            `;
            submitBtn.disabled = true;

            const formData = new FormData(feedbackForm);
            if (!formData.get('access_key')) {
                formData.append('access_key', '06375459-1d3a-48b4-b4da-b5685a59dade');
            }

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    feedbackForm.style.display = 'none';
                    feedbackSuccess.classList.add('active');
                    feedbackSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    feedbackForm.reset();
                } else {
                    alert(data.message || 'Something went wrong. Please try again or email directly to 4malikabdullah@gmail.com');
                }
            })
            .catch(error => {
                console.error('Feedback submission notice:', error);
                alert('Could not submit feedback. Please email directly to 4malikabdullah@gmail.com or info@abdullahzafar.me');
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;
            });
        });
    }
});
