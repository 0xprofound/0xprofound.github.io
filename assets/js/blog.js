// Blog Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Table of Contents Generator
    generateTOC();
    
    // Code Copy Functionality
    addCopyButtonsToCodeBlocks();
    
    // Image Lazy Loading
    lazyLoadImages();
    
    // Syntax Highlighting
    highlightCodeBlocks();
    
    // Scroll to Anchor Smoothly
    smoothScrollToAnchors();
    
    // Reading Progress Indicator
    addReadingProgress();
});

// Generate Table of Contents
function generateTOC() {
    const tocContainer = document.getElementById('toc');
    if (!tocContainer) return;
    
    const headings = document.querySelectorAll('.post-content h2, .post-content h3');
    if (headings.length === 0) return;
    
    let tocHTML = '<h3>Table of Contents</h3><ul>';
    
    headings.forEach(heading => {
        // Add ID if not present
        if (!heading.id) {
            heading.id = heading.textContent.toLowerCase().replace(/[^\w]+/g, '-');
        }
        
        const level = heading.tagName.substring(1); // Get the number from H2, H3, etc.
        const className = `toc-level-${level}`;
        
        tocHTML += `
            <li class="${className}">
                <a href="#${heading.id}">${heading.textContent}</a>
            </li>
        `;
    });
    
    tocHTML += '</ul>';
    tocContainer.innerHTML = tocHTML;
}

// Add Copy Buttons to Code Blocks
function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        button.title = 'Copy to clipboard';
        
        button.addEventListener('click', () => {
            const text = block.textContent;
            navigator.clipboard.writeText(text).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
        
        block.style.position = 'relative';
        button.style.position = 'absolute';
        button.style.top = '0.5rem';
        button.style.right = '0.5rem';
        button.style.background = 'rgba(0, 255, 0, 0.1)';
        button.style.color = 'var(--primary-color)';
        button.style.border = '1px solid var(--primary-color)';
        button.style.borderRadius = '4px';
        button.style.padding = '0.25rem 0.5rem';
        button.style.cursor = 'pointer';
        button.style.fontSize = '0.8rem';
        
        block.appendChild(button);
    });
}

// Lazy Load Images
function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.image-container img');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Basic Syntax Highlighting
function highlightCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const text = block.textContent;
        
        // Basic highlighting for common patterns
        let highlighted = text
            // Comments
            .replace(/(#.*|<!--.*-->|\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
            // Strings
            .replace(/(".*?"|'.*?')/g, '<span class="string">$1</span>')
            // Numbers
            .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
            // Keywords
            .replace(/\b(function|var|let|const|if|else|for|while|return|class|import|export|from)\b/g, '<span class="keyword">$1</span>')
            // Commands
            .replace(/(\$ [^\n]+)/g, '<span class="command">$1</span>')
            // Flags and options
            .replace(/(-\w+|--[\w-]+)/g, '<span class="option">$1</span>');
        
        block.innerHTML = highlighted;
    });
}

// Smooth Scroll to Anchors
function smoothScrollToAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

// Reading Progress Indicator
function addReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'var(--primary-color)';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '1000';
    progressBar.style.transition = 'width 0.2s ease';
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Estimate Reading Time
function estimateReadingTime() {
    const content = document.querySelector('.post-content');
    if (!content) return;
    
    const text = content.textContent;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
    
    const readingTimeElement = document.getElementById('reading-time');
    if (readingTimeElement) {
        readingTimeElement.textContent = `${readingTime} min read`;
    }
}

// Social Sharing
function addSocialSharing() {
    const shareContainer = document.createElement('div');
    shareContainer.className = 'social-sharing';
    shareContainer.style.margin = '2rem 0';
    shareContainer.style.textAlign = 'center';
    
    const title = encodeURIComponent(document.title);
    const url = encodeURIComponent(window.location.href);
    
    shareContainer.innerHTML = `
        <span style="margin-right: 1rem;">Share this post:</span>
        <a href="https://twitter.com/intent/tweet?text=${title}&url=${url}" target="_blank" style="margin: 0 0.5rem; color: var(--primary-color);">Twitter</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" target="_blank" style="margin: 0 0.5rem; color: var(--primary-color);">LinkedIn</a>
        <a href="https://www.reddit.com/submit?url=${url}&title=${title}" target="_blank" style="margin: 0 0.5rem; color: var(--primary-color);">Reddit</a>
    `;
    
    const postContent = document.querySelector('.post-content');
    if (postContent) {
        postContent.appendChild(shareContainer);
    }
}

// Dark/Light Mode Toggle
function addThemeToggle() {
    const toggleButton = document.createElement('button');
    toggleButton.id = 'theme-toggle';
    toggleButton.textContent = '🌙';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '2rem';
    toggleButton.style.right = '2rem';
    toggleButton.style.background = 'rgba(0, 255, 0, 0.1)';
    toggleButton.style.color = 'var(--primary-color)';
    toggleButton.style.border = '1px solid var(--primary-color)';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.width = '3rem';
    toggleButton.style.height = '3rem';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '1000';
    
    toggleButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        toggleButton.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        // Save preference
        localStorage.setItem('theme', newTheme);
    });
    
    document.body.appendChild(toggleButton);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        toggleButton.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Initialize blog functionality
function initBlog() {
    generateTOC();
    addCopyButtonsToCodeBlocks();
    lazyLoadImages();
    highlightCodeBlocks();
    smoothScrollToAnchors();
    addReadingProgress();
    estimateReadingTime();
    addSocialSharing();
    addThemeToggle();
}

// Call initialization
initBlog();
