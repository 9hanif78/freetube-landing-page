
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {

            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all elements with class 'reveal'
    document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });

    // Immediately reveal elements already in view on page load
    document.querySelectorAll('#hero .reveal').forEach(el => {
      el.classList.add('revealed');
    });

    // ═══════════════════════════════════════════════════════════════
    // 2. STICKY NAVBAR — Change style on scroll
    // ═══════════════════════════════════════════════════════════════

    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {

      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // ═══════════════════════════════════════════════════════════════
    // 3. ACTIVE NAV LINKS — Highlight current section
    // 
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            // Remove active from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active to the matching link
            const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-80px 0px -40% 0px'
        /*
          -80px top margin (nav height) + -40% bottom margin
          = only trigger when section is in the MIDDLE of the screen.
          This prevents flickering between sections at scroll boundaries.
        */
      }
    );

    sections.forEach(section => sectionObserver.observe(section));

    // ═══════════════════════════════════════════════════════════════
    // 4. HAMBURGER MENU
    // ═══════════════════════════════════════════════════════════════

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');

      mobileMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen.toString());

    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // ═══════════════════════════════════════════════════════════════
    // 5. COUNTER ANIMATION
    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'));
      /*
        getAttribute('data-target') returns the string "250".
        parseInt() converts string to integer: "250" → 250.
      */
      const duration = 2000; // ms
      const start = performance.now();
      /*
        performance.now() — high-precision timestamp in milliseconds.
        More accurate than Date.now() for animations.
      */
      
      function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        /*
          progress goes from 0 (just started) to 1 (complete).
          Math.min ensures it never exceeds 1.
        */
        
        // Ease-out: progress² creates a deceleration effect
        const eased = 1 - (1 - progress) * (1 - progress);

        
        el.textContent = Math.round(target * eased);
        /* Update the DOM with the current count value */
        
        if (progress < 1) {
          requestAnimationFrame(update);

        } else {
          el.textContent = target + (target > 10 ? '+' : '');
          /* Final value with + suffix */
        }
      }
      
      requestAnimationFrame(update);
    }

    // Watch counter elements
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target); // Only animate once
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('[data-target]').forEach(el => {
      counterObserver.observe(el);
    });

    // ═══════════════════════════════════════════════════════════════
    // 6. SKILL BAR ANIMATION
    // ═══════════════════════════════════════════════════════════════

    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(bar => {
              bar.style.width = bar.getAttribute('data-width') + '%';
            });
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('.skills-list').forEach(el => {
      skillObserver.observe(el);
    });

    // ═══════════════════════════════════════════════════════════════
    // 7. TESTIMONIAL SLIDER
    // ═══════════════════════════════════════════════════════════════

    let currentSlide = 0;
    const slides = document.getElementById('testimonialSlides');
    const dots = document.querySelectorAll('.slider-dot');
    const totalSlides = dots.length;
    
    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      
      slides.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    
    // Dot click navigation
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-index')));
      });
    });
    
    // Auto-play every 5 seconds
    const autoPlay = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);

    // Stop auto-play when user interacts
    document.getElementById('testimonialSlider').addEventListener('mouseenter', () => {
      clearInterval(autoPlay);
      /* Pause on hover — respect user control */
    });

    // ═══════════════════════════════════════════════════════════════
    // 8. FAQ ACCORDION
    // ═══════════════════════════════════════════════════════════════

    document.querySelectorAll('.faq-question').forEach(button => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        
        const isOpen = item.classList.contains('active');
        
        // Close all open items first (one-at-a-time accordion behavior)
        document.querySelectorAll('.faq-item.active').forEach(openItem => {
          openItem.classList.remove('active');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });9
        
        // Open clicked item (unless it was already open)
        if (!isOpen) {
          item.classList.add('active');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // ═══════════════════════════════════════════════════════════════
    // 9. PORTFOLIO FILTER
    // ═══════════════════════════════════════════════════════════════

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        document.querySelectorAll('.portfolio-item').forEach(item => {
          const category = item.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.pointerEvents = 'auto';
          } else {
            item.style.opacity = '0.2';
            item.style.transform = 'scale(0.95)';
            item.style.pointerEvents = 'none';
          }
        });
      });
    });

    // ═══════════════════════════════════════════════════════════════
    // 10. CONTACT FORM
    // ═══════════════════════════════════════════════════════════════

    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      // Get form data
      const formData = new FormData(this);

      // Simulate sending (in production: replace with actual API call)
      const btn = this.querySelector('[type="submit"]');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      
      setTimeout(() => {
        // Simulate API response after 1.5s
        this.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      }, 1500);
    });

    // ═══════════════════════════════════════════════════════════════
    // 11. BACK TO TOP BUTTON
    // ═══════════════════════════════════════════════════════════════

    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });

    });

    // ═══════════════════════════════════════════════════════════════
    // 12. SMOOTH ANCHOR SCROLLING (with offset for fixed nav)
    // ═══════════════════════════════════════════════════════════════

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const navHeight = 80;
          const targetPosition = target.offsetTop - navHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

