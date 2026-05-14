// ===================================
// PORTFOLIO PAGE SPECIFIC SCRIPTS
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    // Gallery Carousel
    const gallerySlider = document.querySelector('.gallery-slider');
    const galleryImages = document.querySelectorAll('.gallery-image');
    const galleryDots = document.querySelectorAll('.gallery-dots .dot');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    let currentSlide = 0;
    const totalSlides = galleryImages.length;
    let autoRotate = null;

    if (!gallerySlider || totalSlides === 0) return;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;

        // Slide all images via translateX
        galleryImages.forEach(function (img) {
            img.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        });

        // Update dots
        galleryDots.forEach(function (dot, i) {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Dot navigation
    galleryDots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            goToSlide(index);
        });
    });

    // Arrow navigation
    if (galleryPrev) {
        galleryPrev.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(currentSlide - 1);
        });
    }
    if (galleryNext) {
        galleryNext.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(currentSlide + 1);
        });
    }

    // Start auto-rotate
    function startAutoRotate() {
        stopAutoRotate();
        autoRotate = setInterval(function () {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    function stopAutoRotate() {
        if (autoRotate) {
            clearInterval(autoRotate);
            autoRotate = null;
        }
    }

    // Pause auto-rotate on hover
    gallerySlider.addEventListener('mouseenter', stopAutoRotate);
    gallerySlider.addEventListener('mouseleave', startAutoRotate);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    gallerySlider.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    gallerySlider.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentSlide + 1);
            else goToSlide(currentSlide - 1);
        }
    }, { passive: true });

    // Initialize first slide and start autoplay
    goToSlide(0);
    startAutoRotate();

    // Preview Button
    var previewButton = document.querySelector('.preview-button');
    if (previewButton) {
        previewButton.addEventListener('click', function () {
            window.open('#', '_blank');
        });
    }
});
