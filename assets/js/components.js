// components.js - Universal Navbar and Footer System
// This file should be placed in assets/js/components.js

class NavigationComponent {
    constructor() {
        this.currentPath = window.location.pathname;
        this.baseDepth = this.calculateDepth();
        this.init();
    }

    calculateDepth() {
        const path = this.currentPath;
        
        // Root level (index.html)
        if (path === '/' || path.endsWith('/index.html') || path.match(/\/portfolio\/?$/)) {
            return '';
        }
        
        // First level (pages/, blog/, projects/, writeups/)
        if (path.includes('/pages/') || path.includes('/blog/') || 
            path.includes('/projects/') || path.includes('/writeups/')) {
            return '../';
        }
        
        // Could be extended for deeper levels if needed
        return '../';
    }

    getNavHTML() {
        const basePath = this.baseDepth;
        
        return `
        <header>
            <nav class="nav-container">
                <div class="nav-brand">
                    <a href="${basePath}index.html" class="logo-link">
                        <span class="logo-text">0xProfound</span>
                    </a>
                </div>
                
                <!-- Mobile menu button -->
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul class="nav-menu" id="navMenu">
                    <li><a href="${basePath}index.html" class="nav-link ${this.isActive('index.html') ? 'active' : ''}">Home</a></li>
                    <li><a href="${basePath}index.html#terminal" class="nav-link">Terminal</a></li>
                    <li><a href="${basePath}pages/about.html" class="nav-link ${this.isActive('about.html') ? 'active' : ''}">About</a></li>
                    <li><a href="${basePath}index.html#skills" class="nav-link">Skills</a></li>
                    <li><a href="${basePath}pages/machines.html" class="nav-link ${this.isActive('machines.html') ? 'active' : ''}">HTB Machines</a></li>
                    <li><a href="${basePath}writeups/index.html" class="nav-link ${this.isActive('writeups') ? 'active' : ''}">Writeups</a></li>
                    <li><a href="${basePath}blog/index.html" class="nav-link ${this.isActive('blog') ? 'active' : ''}">Blog</a></li>
                    <li><a href="${basePath}projects/index.html" class="nav-link ${this.isActive('projects') ? 'active' : ''}">Projects</a></li>
                    <li><a href="${basePath}pages/timeline.html" class="nav-link ${this.isActive('timeline.html') ? 'active' : ''}">Journey</a></li>
                    <li><a href="${basePath}pages/tools.html" class="nav-link ${this.isActive('tools.html') ? 'active' : ''}">Tools</a></li>
                    <li><a href="${basePath}pages/contact.html" class="nav-link ${this.isActive('contact.html') ? 'active' : ''}">Contact</a></li>
                </ul>
            </nav>
        </header>`;
    }

    getFooterHTML() {
        const basePath = this.baseDepth;
        const currentYear = new Date().getFullYear();
        
        return `
        <footer class="footer">
            <div class="section-container">
                <div class="footer-content">
                    <div class="footer-brand">
                        <h3>0xProfound</h3>
                        <p>Jr Penetration Tester | DEPI VAPT Track | HTB Pro Hacker</p>
                        <div class="footer-social">
                            <a href="https://github.com/0xprofound" class="social-icon" aria-label="GitHub">
                                <i class="fab fa-github"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/josephgamil" class="social-icon" aria-label="LinkedIn">
                                <i class="fab fa-linkedin"></i>
                            </a>
                            <a href="#" class="social-icon" aria-label="Twitter">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="https://app.hackthebox.com/profile/1335712" class="social-icon" aria-label="Hack The Box">
                                <i class="fas fa-cube"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div class="footer-links">
                        <h4>Quick Links</h4>
                        <a href="${basePath}pages/about.html">About Me</a>
                        <a href="${basePath}pages/machines.html">HTB Machines</a>
                        <a href="${basePath}blog/index.html">Blog Posts</a>
                        <a href="${basePath}pages/timeline.html">Journey</a>
                    </div>
                    
                    <div class="footer-links">
                        <h4>Resources</h4>
                        <a href="${basePath}writeups/index.html">Writeups</a>
                        <a href="${basePath}projects/index.html">Projects</a>
                        <a href="${basePath}pages/tools.html">Tools</a>
                        <a href="${basePath}pages/contact.html">Contact</a>
                    </div>
                    
                    <div class="footer-links">
                        <h4>Learning</h4>
                        <a href="https://hackthebox.com" target="_blank">Hack The Box</a>
                        <a href="https://tryhackme.com" target="_blank">TryHackMe</a>
                        <a href="https://portswigger.net/web-security" target="_blank">PortSwigger Academy</a>
                        <a href="https://owasp.org" target="_blank">OWASP</a>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p class="footer-credits">&copy; ${currentYear} 0xProfound. All rights reserved.</p>
                    <p>Built with passion for cybersecurity</p>
                </div>
            </div>
        </footer>`;
    }

    isActive(page) {
        const currentFile = this.currentPath.split('/').pop() || 'index.html';
        const currentDir = this.currentPath.split('/').slice(-2)[0];
        
        // Handle index.html cases
        if (page === 'index.html') {
            return currentFile === 'index.html' && !this.currentPath.includes('/pages/') && 
                   !this.currentPath.includes('/blog/') && !this.currentPath.includes('/projects/') && 
                   !this.currentPath.includes('/writeups/');
        }
        
        // Handle directory-based navigation
        if (page === 'blog' && (currentDir === 'blog' || this.currentPath.includes('/blog/'))) return true;
        if (page === 'projects' && (currentDir === 'projects' || this.currentPath.includes('/projects/'))) return true;
        if (page === 'writeups' && (currentDir === 'writeups' || this.currentPath.includes('/writeups/'))) return true;
        
        // Handle specific pages
        return currentFile === page;
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking nav links
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                    mobileMenuBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    setupSmoothScrolling() {
        // Handle smooth scrolling for anchor links
        const anchorLinks = document.querySelectorAll('a[href*="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only handle internal anchor links
                if (href.startsWith('#') || href.includes('index.html#')) {
                    const targetId = href.split('#')[1];
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        // If we're on a different page, redirect with hash
                        if (href.includes('index.html#') && !window.location.pathname.endsWith('index.html')) {
                            window.location.href = href.replace('index.html', this.baseDepth + 'index.html');
                            return;
                        }
                        
                        // Smooth scroll to target
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update URL
                        history.pushState(null, null, '#' + targetId);
                    }
                }
            });
        });
    }

    addBackToTopButton() {
        // Create back to top button
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);

        // Show/hide on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // Scroll to top on click
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    init() {
        // Inject navbar
        const menuPlaceholder = document.getElementById('menu-placeholder');
        if (menuPlaceholder) {
            menuPlaceholder.innerHTML = this.getNavHTML();
        } else {
            // Fallback: insert at beginning of body
            document.body.insertAdjacentHTML('afterbegin', this.getNavHTML());
        }

        // Inject footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = this.getFooterHTML();
        }

        // Initialize functionality
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.addBackToTopButton();
        
        // Handle hash navigation on page load
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }
}

// Particles Component (Optional - for pages that want particles)
class ParticlesComponent {
    constructor(containerId = 'particles-placeholder') {
        this.container = document.getElementById(containerId);
        if (this.container) {
            this.init();
        }
    }

    init() {
        // Create particles container
        const particlesDiv = document.createElement('div');
        particlesDiv.className = 'particles';
        particlesDiv.id = 'particles';
        this.container.appendChild(particlesDiv);

        // Create particles
        this.createParticles();
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = Math.min(50, Math.max(20, window.innerWidth / 20));

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.innerHTML = Math.random() > 0.5 ? '0' : '1';
            
            // Random positioning and animation
            particle.style.cssText = `
                position: absolute;
                color: rgba(0, 255, 0, 0.3);
                font-family: 'Courier New', monospace;
                font-size: ${Math.random() * 20 + 10}px;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 20}s;
                animation-duration: ${Math.random() * 10 + 15}s;
            `;
            
            particlesContainer.appendChild(particle);
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    new NavigationComponent();
    
    // Initialize particles if placeholder exists
    new ParticlesComponent();
    
    console.log('🔐 0xProfound Navigation System Loaded');
});

// Export for manual initialization if needed
window.NavigationComponent = NavigationComponent;
window.ParticlesComponent = ParticlesComponent;
