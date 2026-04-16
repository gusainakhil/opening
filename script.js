// ===================== INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initHamburger();
    initScrollProgress();
    initBackToTop();
    initAOS();
    initFormSubmission();
    initTestimonialCarousel();
    initCounterAnimation();
    initLightboxGallery();
    initMountainParallax();
    animateOnScroll();
});

// ===================== NAVBAR FUNCTIONALITY =====================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            closeHamburger();
        });
    });
}

// ===================== HAMBURGER MENU =====================
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

function closeHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// ===================== SCROLL PROGRESS BAR =====================
function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

// ===================== BACK TO TOP BUTTON =====================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===================== SMOOTH SCROLL TO SECTION =====================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        closeHamburger();
    }
}

// ===================== AOS (ANIMATE ON SCROLL) =====================
function initAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// ===================== COUNTER ANIMATION =====================
function initCounterAnimation() {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateCounters(entry.target);
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-number').forEach(el => {
        observer.observe(el);
    });
}

function animateCounters(container) {
    const counters = container.parentElement.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 50);
        let current = 0;

        const updateCounter = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(updateCounter);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 50);
    });
}

// Trigger counter animation immediately on page load if in view
window.addEventListener('load', () => {
    document.querySelectorAll('.stat-number').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (!el.parentElement.parentElement.classList.contains('animated')) {
                animateCounters(el.parentElement.parentElement);
                el.parentElement.parentElement.classList.add('animated');
            }
        }
    });
});

// ===================== FORM SUBMISSION =====================
function initFormSubmission() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = {
                name: contactForm.querySelector('input[type="text"]').value,
                email: contactForm.querySelector('input[type="email"]').value,
                phone: contactForm.querySelector('input[type="tel"]').value,
                eventType: contactForm.querySelector('select').value,
                message: contactForm.querySelector('textarea').value
            };

            console.log('Form submitted with data:', data);

            // Show success message
            showNotification('Thank you! We will contact you soon.', 'success');

            // Reset form
            contactForm.reset();
        });
    }

    // Newsletter form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            console.log('Newsletter subscription:', email);
            showNotification('Successfully subscribed to newsletter!', 'success');
            form.reset();
        });
    });
}

// ===================== NOTIFICATION SYSTEM =====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2d5016' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInDown 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===================== TESTIMONIAL CAROUSEL =====================
function initTestimonialCarousel() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('carouselDots');

    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToTestimonial(index));
        dotsContainer.appendChild(dot);
    });

    // Auto-rotate testimonials
    let currentSlide = 0;
    setInterval(() => {
        currentSlide = (currentSlide + 1) % cards.length;
        updateTestimonial(currentSlide);
    }, 5000);
}

function updateTestimonial(index) {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');

    cards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    cards[index].classList.add('active');
    dots[index].classList.add('active');
}

function goToTestimonial(index) {
    updateTestimonial(index);
}

function nextTestimonial() {
    const currentActive = document.querySelector('.testimonial-card.active');
    const cards = document.querySelectorAll('.testimonial-card');
    let nextIndex = 0;

    cards.forEach((card, index) => {
        if (card === currentActive) {
            nextIndex = (index + 1) % cards.length;
        }
    });

    updateTestimonial(nextIndex);
}

function prevTestimonial() {
    const currentActive = document.querySelector('.testimonial-card.active');
    const cards = document.querySelectorAll('.testimonial-card');
    let prevIndex = 0;

    cards.forEach((card, index) => {
        if (card === currentActive) {
            prevIndex = (index - 1 + cards.length) % cards.length;
        }
    });

    updateTestimonial(prevIndex);
}

// ===================== LIGHTBOX GALLERY =====================
function initLightboxGallery() {
    const images = document.querySelectorAll('.gallery-item img');
    window.galleryImages = Array.from(images).map(img => img.src);
    window.currentLightboxIndex = 0;
}

function openLightbox(button) {
    const img = button.closest('.gallery-item').querySelector('img').src;
    window.galleryImages.forEach((image, index) => {
        if (image === img) {
            window.currentLightboxIndex = index;
        }
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    lightboxImg.src = window.galleryImages[window.currentLightboxIndex];
    lightbox.classList.add('active');

    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextLightbox() {
    window.currentLightboxIndex = (window.currentLightboxIndex + 1) % window.galleryImages.length;
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = window.galleryImages[window.currentLightboxIndex];
}

function prevLightbox() {
    window.currentLightboxIndex = (window.currentLightboxIndex - 1 + window.galleryImages.length) % window.galleryImages.length;
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = window.galleryImages[window.currentLightboxIndex];
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Close lightbox on background click
document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});

// ===================== ANIMATE ON SCROLL ELEMENTS =====================
function animateOnScroll() {
    const elementsToAnimate = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;

                if (parseInt(delay) > 0) {
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, parseInt(delay));
                } else {
                    entry.target.classList.add('aos-animate');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// ===================== HIDE LOADER =====================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.display = 'none';
    }, 2500);
});

// ===================== SMOOTH HOVER EFFECTS =====================
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        if (!this.classList.contains('nav-link')) {
            this.style.transform = 'translateY(-2px)';
        }
    });

    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ===================== MOUNTAIN PARALLAX EFFECT =====================
function initMountainParallax() {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Hero content parallax
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }

        // Mountain silhouettes parallax
        const heroBefore = document.querySelector('.hero-background::before');
        const heroAfter = document.querySelector('.hero-background::after');
        
        if (scrollPosition < window.innerHeight) {
            const parallaxStrength = 0.3;
            const offset = scrollPosition * parallaxStrength;
            
            // Apply parallax to mountain layers
            const mountLayers = document.querySelectorAll('[data-parallax]');
            mountLayers.forEach(layer => {
                const strength = parseFloat(layer.getAttribute('data-parallax'));
                layer.style.transform = `translateY(${offset * strength}px)`;
            });
        }

        // Section animations on scroll
        document.querySelectorAll('section').forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
            
            if (scrollPercent > 0 && scrollPercent < 1) {
                section.style.opacity = Math.min(1, scrollPercent * 1.2);
            }
        });
    });
}

// ===================== PARALLAX EFFECT =====================
window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const scrollPosition = window.scrollY;
        heroContent.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
});

// ===================== SERVICE CARD TILT EFFECT =====================
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// ===================== KEYBOARD NAVIGATION =====================
document.addEventListener('keydown', (e) => {
    // Skip to main content with 'S' key
    if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    }

    // Go to contact with 'C' key
    if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
});

// ===================== PERFORMANCE OPTIMIZATION =====================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================== FORM VALIDATION =====================
const inputs = document.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '' && this.hasAttribute('required')) {
            this.style.borderColor = '#d97706';
        } else {
            this.style.borderColor = '#e5e0d0';
        }
    });

    input.addEventListener('focus', function() {
        this.style.borderColor = '#d97706';
    });

    input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.style.borderColor = '#2d5016';
        }
    });
});

// ===================== DYNAMIC YEAR IN FOOTER =====================
document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    const footerText = document.querySelector('.footer-bottom p:first-child');
    if (footerText) {
        footerText.innerHTML = `&copy; ${year} Royal Himalayan Heights. All rights reserved.`;
    }
});

// ===================== INTERSECTION OBSERVER FOR STATS =====================
const animateStatsOnce = (() => {
    let hasAnimated = false;
    return () => {
        if (hasAnimated) return;

        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    document.querySelectorAll('.stat-number').forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        animateStat(stat, target);
                    });
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    };
})();

function animateStat(stat, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            stat.textContent = target;
            clearInterval(timer);
        } else {
            stat.textContent = Math.floor(current);
        }
    }, duration / 100);
}

window.addEventListener('scroll', animateStatsOnce);

// ===================== ADD ANIMATION STYLES =====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideOutUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===================== CONSOLE LOG =====================
console.log('%cRoyal Himalayan Heights', 'color: #d97706; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to our premium event venue website!', 'color: #2d5016; font-size: 14px;');
console.log('%cKeyboard shortcuts: Ctrl+S (Services), Ctrl+C (Contact)', 'color: #666; font-size: 12px;');
