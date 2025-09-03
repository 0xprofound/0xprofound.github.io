// Component loader for consistent header, navigation, and footer
class PortfolioComponents {
    constructor() {
        this.componentsLoaded = false;
    }

    // Load all components
    async loadAllComponents() {
        if (this.componentsLoaded) return;
        
        try {
            await this.loadMenu();
            await this.loadFooter();
            await this.loadParticles();
            this.initializeComponents();
            this.componentsLoaded = true;
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    // Load menu component
    async loadMenu() {
        const menuPlaceholder = document.getElementById('menu-placeholder');
        if (!menuPlaceholder) return;

        try {
            const response = await fetch('components/menu.html');
            if (response.ok) {
                menuPlaceholder.outerHTML = await response.text();
                this.setActiveNavLink(); // Set active link after loading menu
            }
        } catch (error) {
            console.error('Error loading menu:', error);
            // Fallback to basic menu if fetch fails
            menuPlaceholder.outerHTML = this.createFallbackMenu();
            this.setActiveNavLink();
        }
    }

    // Create fallback menu if component loading fails
    createFallbackMenu() {
        return `
            <header>
                <nav class="nav-container">
                    <div class="nav-brand">
                        <span class="logo-text">0xProfound</span>
                    </div>
                    <ul class="nav-menu" id="navMenu">
                        <li><a href="../index.html" class="nav-link">Home</a></li>
                        <li><a href="../pages/about.html" class="nav-link">About</a></li>
                        <li><a href="../pages/machines.html" class="nav-link">HTB Machines</a></li>
                        <li><a href="../blog/index.html" class="nav-link">Blog</a></li>
                        <li><a href="../pages/contact.html" class="nav-link">Contact</a></li>
                    </ul>
                </nav>
            </header>
            <div class="mobile-menu-btn" id="mobileMenuBtn">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
    }

    // Load footer component
    async loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (!footerPlaceholder) return;

        try {
            const response = await fetch('components/footer.html');
            if (response.ok) {
                footerPlaceholder.outerHTML = await response.text();
            }
        } catch (error) {
            console.error('Error loading footer:', error);
            // Fallback to basic footer
            footerPlaceholder.outerHTML = this.createFallbackFooter();
        }
    }

    // Create fallback footer
    createFallbackFooter() {
        return `
            <footer class="footer">
                <div class="section-container">
                    <div class="footer-content">
                        <div class="footer-brand">
                            <h3>0xProfound</h3>
                            <p>Elite Cybersecurity Specialist</p>
                        </div>
                        <div class="footer-links">
                            <a href="../pages/contact.html">Contact</a>
                            <a href="https://github.com/0xProfound" target="_blank">GitHub</a>
                            <a href="https://linkedin.com/in/0xprofound" target="_blank">LinkedIn</a>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2024 0xProfound. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    }

    // Load particles background
    async loadParticles() {
        const particlesPlaceholder = document.getElementById('particles-placeholder');
        if (!particlesPlaceholder) return;

        particlesPlaceholder.outerHTML = '<div class="particles" id="particles"></div>';
    }

    // Initialize all components
    initializeComponents() {
        this.initMobileMenu();
        this.initBackToTop();
        this.initSmoothScrolling();
    }

    // Mobile menu functionality
    initMobileMenu() {
        // Wait a bit for DOM to be fully ready
        setTimeout(() => {
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const navMenu = document.getElementById('navMenu');
            
            if (mobileMenuBtn && navMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    mobileMenuBtn.classList.toggle('active');
                    navMenu.classList.toggle('active');
                    
                    // Prevent body scrolling when menu is open
                    if (navMenu.classList.contains('active')) {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = '';
                    }
                });
                
                // Close menu when clicking on links
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenuBtn.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    });
                });
                
                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (navMenu.classList.contains('active') && 
                        !navMenu.contains(e.target) && 
                        !mobileMenuBtn.contains(e.target)) {
                        mobileMenuBtn.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }
        }, 100);
    }

    // Back to top functionality
    initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Set active navigation link based on current page
    // Set active navigation link based on current page
setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    // First, remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Then find and activate the correct link
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Handle index page
        if (currentPage === 'index.html') {
            if (linkHref === '../index.html' || linkHref === 'index.html' || linkHref === '#') {
                link.classList.add('active');
            }
            // Handle hash links on homepage
            else if (linkHref.includes('#') && linkHref.startsWith('#')) {
                link.classList.add('active');
            }
        }
        // Handle about page
        else if (currentPage === 'about.html' && linkHref.includes('about')) {
            link.classList.add('active');
        }
        // Handle machines page
        else if (currentPage === 'machines.html' && linkHref.includes('machines')) {
            link.classList.add('active');
        }
        // Handle contact page
        else if (currentPage === 'contact.html' && linkHref.includes('contact')) {
            link.classList.add('active');
        }
        // Handle tools page
        else if (currentPage === 'tools.html' && linkHref.includes('tools')) {
            link.classList.add('active');
        }
        // Handle timeline page
        else if (currentPage === 'timeline.html' && linkHref.includes('timeline')) {
            link.classList.add('active');
        }
        // Handle blog pages
        else if (currentPage.includes('blog') && linkHref.includes('blog')) {
            link.classList.add('active');
         }
      });
  }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new PortfolioComponents();
    portfolio.loadAllComponents();
    
    // Also initialize particles
    if (typeof createParticles === 'function') {
        createParticles();
    }
});
