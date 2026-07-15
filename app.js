/* ==========================================================================
   URBAN SPICE - PREMIUM FINE DINING WEBSITE
   INTERACTIVE LOGIC & BEHAVIOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. STICKY NAV & HEADER SCROLL EFFECT
       ========================================== */
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially on load


    /* ==========================================
       2. MOBILE BURGER MENU TOGGLE
       ========================================== */
    const burgerMenu = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    /* ==========================================
       3. NAVIGATION LINK HIGHLIGHT ON SCROLL
       ========================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNav = () => {
        const scrollPosition = window.scrollY + 120; // Offset for header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    };
    window.addEventListener('scroll', highlightNav);


    /* ==========================================
       4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
       ========================================== */
    const revealElements = [
        document.getElementById('about-content'),
        document.getElementById('about-images'),
        document.getElementById('chef-image'),
        document.getElementById('chef-content'),
        document.getElementById('reservation-container'),
        document.getElementById('contact-info'),
        document.getElementById('contact-map-container')
    ].filter(el => el !== null);

    const menuItems = document.querySelectorAll('.menu-item');
    const galleryItems = document.querySelectorAll('.gallery-item');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Animation runs once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    menuItems.forEach(item => revealObserver.observe(item));
    galleryItems.forEach(item => revealObserver.observe(item));


    /* ==========================================
       5. INTERACTIVE MENU TABS FILTERING
       ========================================== */
    const filterButtons = document.querySelectorAll('.menu-tab-btn');
    const menuGrid = document.getElementById('menu-grid');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');

            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Fade grid out
            menuGrid.classList.add('fade-out');

            setTimeout(() => {
                menuItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'flex';
                        // Force layout recalculation and re-apply transition classes
                        setTimeout(() => {
                            item.classList.add('revealed');
                        }, 50);
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('revealed');
                    }
                });

                // Fade grid back in
                menuGrid.classList.remove('fade-out');
            }, 400); // Matches transitions in CSS
        });
    });


    /* ==========================================
       6. GALLERY LIGHTBOX MODAL
       ========================================== */
    const galleryContainer = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (galleryContainer && lightbox) {
        // Open Lightbox
        galleryContainer.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (!item) return;

            const src = item.getAttribute('data-src');
            const caption = item.getAttribute('data-caption');

            lightboxImg.src = src;
            lightboxCaption.textContent = caption;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock body scroll
        });

        // Close Lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Unlock body scroll
            setTimeout(() => {
                lightboxImg.src = '';
                lightboxCaption.textContent = '';
            }, 300);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Escape key to close lightbox
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }


    /* ==========================================
       7. TESTIMONIALS SLIDER
       ========================================== */
    const testimonialWrapper = document.getElementById('testimonials-wrapper');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    if (testimonialWrapper && testimonialSlides.length > 0) {
        const updateSlider = (index) => {
            // Remove active state
            testimonialSlides.forEach(slide => slide.classList.remove('active'));
            testimonialDots.forEach(dot => dot.classList.remove('active'));

            currentSlide = index;

            // Shift wrapper
            testimonialWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
            testimonialSlides[currentSlide].classList.add('active');
            testimonialDots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            let nextIndex = currentSlide + 1;
            if (nextIndex >= testimonialSlides.length) {
                nextIndex = 0;
            }
            updateSlider(nextIndex);
        };

        const startSlideShow = () => {
            slideInterval = setInterval(nextSlide, 5000); // Auto shift every 5s
        };

        const stopSlideShow = () => {
            clearInterval(slideInterval);
        };

        // Dots click controls
        testimonialDots.forEach(dot => {
            dot.addEventListener('click', () => {
                stopSlideShow();
                const index = parseInt(dot.getAttribute('data-index'));
                updateSlider(index);
                startSlideShow();
            });
        });

        // Auto start
        startSlideShow();
    }


    /* ==========================================
       8. RESERVATION FORM VALIDATION & MODAL
       ========================================== */
    const bookingForm = document.getElementById('booking-form');
    const successModal = document.getElementById('success-modal');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    // Prevent past dates
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    if (bookingForm && successModal) {
        
        // Custom validations helper
        const validateInput = (input) => {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return true;

            let isValid = true;

            if (input.required && !input.value.trim()) {
                isValid = false;
            }

            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    isValid = false;
                }
            }

            if (input.type === 'date' && input.value.trim()) {
                const selectedDate = new Date(input.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                    isValid = false;
                }
            }

            if (isValid) {
                formGroup.classList.remove('error');
            } else {
                formGroup.classList.add('error');
            }

            return isValid;
        };

        // Live input validation on typing/blur
        bookingForm.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup && formGroup.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });

        // Form Submit
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let formIsValid = true;
            bookingForm.querySelectorAll('.form-control').forEach(input => {
                const isInputValid = validateInput(input);
                if (!isInputValid) {
                    formIsValid = false;
                }
            });

            if (formIsValid) {
                // Collect Form Details
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const guests = document.getElementById('guests').value;
                const date = document.getElementById('date').value;
                const time = document.getElementById('time').value;
                const seating = document.getElementById('seating').value;

                // Format Date for Summary
                const formattedDate = new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Set summary in modal
                document.getElementById('summary-name').textContent = name;
                document.getElementById('summary-guests').textContent = `${guests} Guest(s)`;
                document.getElementById('summary-datetime').textContent = `${formattedDate} @ ${time}`;
                document.getElementById('summary-seating').textContent = seating;

                // Show Success Modal
                successModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock scroll
            }
        });

        // Close Success Modal
        const closeSuccess = () => {
            successModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Unlock scroll
            bookingForm.reset();
            
            // Clear any error states if form was reset
            bookingForm.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
        };

        closeSuccessBtn.addEventListener('click', closeSuccess);
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeSuccess();
            }
        });
    }

    // Scroll button under hero section
    const scrollBtn = document.getElementById('scroll-to-about');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
