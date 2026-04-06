

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // MOBILE MENU TOGGLE
   
    
    // Get references to HTML elements
    const menuBtn = document.getElementById('menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    // Add click event to menu button
    menuBtn.addEventListener('click', function() {
        // Toggle 'active' class on nav menu
        // If active class exists, remove it; if not, add it
        navMenu.classList.toggle('active');
    });
    
    // Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Remove active class to close menu
            navMenu.classList.remove('active');
        });
    });
    
    
    // ========================================
    // 2. HEADER SCROLL EFFECT
    // ========================================
    
    const header = document.querySelector('.header');
    
    // Listen for scroll events
    window.addEventListener('scroll', function() {
        // Check if page is scrolled more than 50 pixels
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(202, 190, 211, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    
  
    // 3. CONTACT FORM HANDLING
   
    
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(event) {
        // Prevent the form from submitting normally
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (name.trim() === '' || phone.trim() === '') {
            alert('Please fill in all required fields!');
            return;
        }
        
        // Create WhatsApp message
        const whatsappMessage = `Hello! I am ${name}.%0A%0APhone: ${phone}%0A%0AMessage: ${message}`;
        
        // Open WhatsApp with pre-filled message
        const whatsappURL = `https://wa.me/923147367769?text=${whatsappMessage}`;
        window.open(whatsappURL, '_blank');
        
        // Reset the form
        contactForm.reset();
        
        // Show success message
        alert('Redirecting to WhatsApp...');
    });
    
    
    
 
    // ========================================
    // 5. ACTIVE NAV LINK HIGHLIGHT
    // ========================================
    
    // Highlight the current section in navigation
    window.addEventListener('scroll', function() {
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        // Check which section is currently in view
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const scrollPosition = window.scrollY;
            
            // If current scroll position is within this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const currentId = section.getAttribute('id');
                
                // Remove active class from all links
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's link
                const activeLink = document.querySelector(`.nav-link[href="#${currentId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
    
    
    // ========================================
    // CONSOLE MESSAGE FOR BEGINNERS
    // ========================================
    
    console.log('Welcome to Multisensa Physiotherapy Website!');
    console.log('This JavaScript file handles:');
    console.log('1. Mobile menu toggle');
    console.log('2. Header scroll effect');
    console.log('3. Contact form submission');
    console.log('4. Active navigation highlighting');
    console.log('5. Services Carousel with auto-play');
    
});


// ========================================
// 6. SERVICES CAROUSEL (jQuery + Slick)
// ========================================

$(document).ready(function() {
    
    // ----------------------------------------
    // CAROUSEL CONFIGURATION
    // ----------------------------------------
    
    var $carousel = $('.services-carousel');
    var totalSlides = $carousel.find('.service-card').length;
    
    // Initialize Slick Carousel with configuration
    $carousel.slick({
        infinite: true,              // INFINITE LOOP: Slick clones slides internally
        slidesToShow: 3,             // Desktop: Show 3 cards
        slidesToScroll: 1,           // Move exactly ONE card per click
        autoplay: true,              // AUTO-PLAY: Enabled
        autoplaySpeed: 5000,         // 5 seconds interval
        pauseOnHover: true,          // PAUSE ON HOVER: Built-in Slick feature
        pauseOnFocus: true,          // Pause when focused
        arrows: false,               // Custom buttons used instead
        dots: false,                 // No dots navigation
        cssEase: 'ease-in-out',      // Smooth transition
        speed: 400,                  // Transition duration (ms)
        responsive: [
            {
                breakpoint: 1024,    // Tablet: 768px - 1023px
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,     // Mobile: < 768px
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    
    // ----------------------------------------
    // NAVIGATION CONTROLS (jQuery Event Handling)
    // ----------------------------------------
    
    // Previous Button - slides exactly ONE card backward
    $('#prev-btn').on('click', function() {
        $carousel.slick('slickPrev');
    });
    
    // Next Button - slides exactly ONE card forward
    $('#next-btn').on('click', function() {
        $carousel.slick('slickNext');
    });
    
    // ----------------------------------------
    // SLIDE COUNTER (Dynamic Update)
    // ----------------------------------------
    
    /**
     * Updates the slide counter display
     * Shows: "Showing X of Y" where X = current first visible card index
     * Works correctly with infinite loop (Slick handles index normalization)
     */

    function updateSlideCounter() {
        // slickCurrentSlide returns 0-indexed, we add 1 for display
        var currentSlide = $carousel.slick('slickCurrentSlide') + 1;
        $('#slide-counter').text('Showing ' + currentSlide + ' of ' + totalSlides);
    }
    
    // Update counter after each slide change (afterChange event)
    $carousel.on('afterChange', function(event, slick, currentSlide) {
        updateSlideCounter();
    });
    
    // Initial counter update on page load
    updateSlideCounter();
    
    // ----------------------------------------
    // HOW IT WORKS - TECHNICAL NOTES
    // ----------------------------------------
    
    /**
     * INFINITE LOOP:
     * - Slick internally clones first/last slides
     * - When reaching boundary, it seamlessly jumps
     * - User perceives continuous infinite scrolling
     * 
     * COUNTER UPDATES:
     * - 'afterChange' event fires after animation completes
     * - slickCurrentSlide() returns normalized index (0 to n-1)
     * - Works correctly even with cloned slides
     * 
     * AUTO-PLAY PAUSE/RESUME:
     * - pauseOnHover: true - Slick's native feature
     * - When mouse enters ANY slide, autoplay pauses
     * - When mouse leaves, autoplay resumes automatically
     * - No custom mouseenter/mouseleave handlers needed
     */
    
    console.log('Services Carousel initialized successfully!');
    console.log('- Total slides:', totalSlides);
    console.log('- Auto-play: 5 seconds');
    console.log('- Pause on hover: enabled');
});



   //  SMOOTH SCROLL FOR NAV LINKS 

    
    // This is already handled by CSS (scroll-behavior: smooth)
    // But here's how you would do it with JavaScript:
    
    /*
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to that section
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    */
    
    