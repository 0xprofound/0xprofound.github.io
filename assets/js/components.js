// Component loader for consistent header, navigation, and footer
class PortfolioComponents {
    constructor() {
        this.componentsLoaded = false;
    }

    // Load all components
    async loadAllComponents() {
        if (this.componentsLoaded) return;
        
        try {
            await this.loadHeader();
            await this.loadFooter();
            await this.loadParticles();
            this.initializeComponents();
            this.componentsLoaded = true;
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    // Load header component
    async loadHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (!headerPlaceholder) return;

        const response = await fetch('components/header.html');
        if (response.ok) {
            headerPlaceholder.outerHTML = await response.text();
        }
    }

    // Load footer component
    async loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (!footerPlaceholder) return;

        const response = await fetch('components/footer.html');
        if (response.ok) {
            footerPlaceholder.outerHTML = await response.text();
        }
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
        this.setActiveNavLink();
    }

    // Mobile menu functionality
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking on links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
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
    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || 
                (currentPage === 'index.html' && linkPage === '../index.html') ||
                (linkPage.includes(currentPage.replace('.html', '')) && currentPage !== 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new PortfolioComponents();
    portfolio.loadAllComponents();
});
