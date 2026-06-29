/* -------------------------------------------------------------
 * Premium JavaScript Functions for Hi-Tech House & SilkLink Cooperation Website
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initScrollSpy();
    initScrollProgress();
    initCarousels();
    initLightbox();
    initSearch();
});

/* -------------------------------------------------------------
 * Theme Management (Dark / Light Mode Toggle)
 * ------------------------------------------------------------- */
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (!themeToggleBtn) return;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButtonIcon(themeToggleBtn, savedTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButtonIcon(themeToggleBtn, newTheme);
    });
}

function updateThemeButtonIcon(button, theme) {
    if (theme === 'dark') {
        button.innerHTML = '<i class="fas fa-sun"></i><span>الوضع المضيء</span>';
    } else {
        button.innerHTML = '<i class="fas fa-moon"></i><span>الوضع الداكن</span>';
    }
}

/* -------------------------------------------------------------
 * Mobile Navigation Menu Toggle
 * ------------------------------------------------------------- */
function initMobileNav() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (!hamburgerBtn || !sidebar) return;
    
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && e.target !== hamburgerBtn) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Close sidebar when clicking a link
    const navLinks = sidebar.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });
}

/* -------------------------------------------------------------
 * Scroll Spy (Highlight active section in Sidebar)
 * ------------------------------------------------------------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('.chapter-section');
    const navItems = document.querySelectorAll('.nav-menu .nav-item');
    
    if (!sections.length || !navItems.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the middle of the viewport
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navItems.forEach(item => {
                    item.classList.remove('active');
                    const link = item.querySelector('a');
                    if (link && link.getAttribute('href') === `#${activeId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

/* -------------------------------------------------------------
 * Custom Slideshow Carousels
 * ------------------------------------------------------------- */
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(carousel => {
        const slidesContainer = carousel.querySelector('.carousel-slides');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn-prev');
        const nextBtn = carousel.querySelector('.carousel-btn-next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        
        if (!slidesContainer || !slides.length) return;
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        // Generate dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Slide ${i+1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
        
        const dots = carousel.querySelectorAll('.carousel-dot');
        
        function updateCarousel() {
            // In RTL layouts, translate goes positive to move to the left slides
            const translatePercent = currentIndex * 100;
            slidesContainer.style.transform = `translateX(${translatePercent}%)`;
            
            // Update dots
            if (dots.length) {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        }
        
        function goToSlide(index) {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = totalSlides - 1;
            if (currentIndex >= totalSlides) currentIndex = 0;
            updateCarousel();
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                // In RTL, "previous" button moves to the right index (subtract index)
                goToSlide(currentIndex - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                // In RTL, "next" button moves to the left index (add index)
                goToSlide(currentIndex + 1);
            });
        }
        
        // Init state
        updateCarousel();
    });
}

/* -------------------------------------------------------------
 * Custom Lightbox / Full-screen Image Modal
 * ------------------------------------------------------------- */
function initLightbox() {
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    
    if (!lightbox || !lightboxImg) return;
    
    // Select all images inside slide panel media or carousels that are zoomable
    const zoomableElements = document.querySelectorAll('.slide-panel-media img, .carousel-slide img, .zoomable-img');
    
    zoomableElements.forEach(img => {
        // Add cursor style to make it obvious
        img.style.cursor = 'zoom-in';
        
        // Add zoom hint trigger
        const mediaParent = img.closest('.slide-panel-media, .carousel-slide');
        if (mediaParent && !mediaParent.querySelector('.media-zoom-hint')) {
            const hint = document.createElement('div');
            hint.className = 'media-zoom-hint';
            hint.innerHTML = '<i class="fas fa-search-plus"></i>';
            mediaParent.appendChild(hint);
            
            hint.addEventListener('click', (e) => {
                e.stopPropagation();
                openImage(img);
            });
        }
        
        img.addEventListener('click', () => {
            openImage(img);
        });
    });
    
    function openImage(imgElement) {
        lightboxImg.src = imgElement.src;
        
        // Try to find custom caption
        let captionText = imgElement.alt || '';
        
        // Check if there is an overlay caption
        const overlay = imgElement.closest('.slide-panel-media')?.querySelector('.media-overlay-caption');
        const carouselCaption = imgElement.closest('.carousel-slide')?.querySelector('.carousel-caption');
        
        if (overlay) {
            captionText = overlay.textContent.trim();
        } else if (carouselCaption) {
            captionText = carouselCaption.textContent.trim();
        }
        
        lightboxCaption.textContent = captionText;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable page scrolling
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Enable page scrolling
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
            closeLightbox();
        }
    });
    
    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* -------------------------------------------------------------
 * Dynamic Search and Filter across Slides & Cards
 * ------------------------------------------------------------- */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        const cards = document.querySelectorAll('.premium-card');
        const slidePanels = document.querySelectorAll('.slide-panel');
        const tableWrappers = document.querySelectorAll('.table-wrapper');
        const sections = document.querySelectorAll('.chapter-section');
        
        if (query === '') {
            // Restore everything
            cards.forEach(c => c.style.display = '');
            slidePanels.forEach(p => p.style.display = '');
            tableWrappers.forEach(t => {
                t.style.display = '';
                t.querySelectorAll('tbody tr').forEach(r => r.style.display = '');
            });
            sections.forEach(s => s.style.display = '');
            return;
        }
        
        // Loop over cards
        cards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const text = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
            const bullets = Array.from(card.querySelectorAll('.card-bullets li')).map(li => li.textContent.toLowerCase()).join(' ');
            
            const match = title.includes(query) || text.includes(query) || bullets.includes(query);
            card.style.display = match ? '' : 'none';
        });
        
        // Loop over slide panels
        slidePanels.forEach(panel => {
            const title = panel.querySelector('.slide-panel-title')?.textContent.toLowerCase() || '';
            const text = panel.querySelector('.slide-panel-text')?.textContent.toLowerCase() || '';
            const badge = panel.querySelector('.slide-panel-badge')?.textContent.toLowerCase() || '';
            
            const match = title.includes(query) || text.includes(query) || badge.includes(query);
            panel.style.display = match ? '' : 'none';
        });

        // Loop over table wrappers
        tableWrappers.forEach(wrapper => {
            const rows = wrapper.querySelectorAll('tbody tr');
            let hasVisibleRow = false;
            
            rows.forEach(row => {
                const cellsText = Array.from(row.querySelectorAll('td')).map(td => td.textContent.toLowerCase()).join(' ');
                const match = cellsText.includes(query);
                
                row.style.display = match ? '' : 'none';
                if (match) hasVisibleRow = true;
            });
            
            // Check if query matches table headers
            const headersText = Array.from(wrapper.querySelectorAll('th')).map(th => th.textContent.toLowerCase()).join(' ');
            const matchHeaders = headersText.includes(query);
            
            if (hasVisibleRow || matchHeaders) {
                wrapper.style.display = '';
                if (matchHeaders && !hasVisibleRow) {
                    // Show all rows if header matched
                    rows.forEach(row => row.style.display = '');
                }
            } else {
                wrapper.style.display = 'none';
            }
        });
        
        // Hide entire sections if all children are hidden
        sections.forEach(section => {
            const visibleCards = Array.from(section.querySelectorAll('.premium-card')).some(c => c.style.display !== 'none');
            const visiblePanels = Array.from(section.querySelectorAll('.slide-panel')).some(p => p.style.display !== 'none');
            const visibleTables = Array.from(section.querySelectorAll('.table-wrapper')).some(t => t.style.display !== 'none');
            
            // Check headings inside the section
            const headings = Array.from(section.querySelectorAll('h2, h3, h4')).map(h => h.textContent.toLowerCase()).join(' ');
            const matchHeadings = headings.includes(query);
            
            if (visibleCards || visiblePanels || visibleTables || matchHeadings) {
                section.style.display = '';
            } else {
                section.style.display = 'none';
            }
        });
    });
}

/* -------------------------------------------------------------
 * Scroll Progress Bar Indicator
 * ------------------------------------------------------------- */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + '%';
    });
}
