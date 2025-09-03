// Writeups Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const writeupsGrid = document.getElementById('writeupsGrid');
    let allWriteups = [];
    let allMachines = [];

    // Load writeups from machines.json
    async function loadWriteups() {
        try {
            const response = await fetch('../assets/data/machines.json');
            if (!response.ok) {
                throw new Error('Failed to load machine data');
            }
            
            const data = await response.json();
            allMachines = data.machines || [];
            
            // Convert machines to writeup format
            allWriteups = allMachines.map(machine => ({
                title: machine.name,
                slug: machine.name.toLowerCase().replace(/\s+/g, '-'),
                excerpt: machine.description || `Detailed walkthrough of ${machine.name}, a ${machine.difficulty} ${machine.os} machine from Hack The Box.`,
                date: machine.date || new Date().toISOString().split('T')[0],
                read_time: estimateReadingTime(machine.difficulty),
                tags: [machine.difficulty, machine.os, ...machine.techniques],
                difficulty: machine.difficulty,
                os: machine.os,
                ip: machine.ip,
                techniques: machine.techniques || [],
                status: machine.status || 'completed',
                rating: machine.rating || 4
            }));
            
            // Update stats
            updateStats(data.stats);
            
            // Initial render
            renderWriteups(allWriteups);
            setupFiltering();
            setupSearch();
            
        } catch (error) {
            console.error('Error loading writeups:', error);
            writeupsGrid.innerHTML = `
                <div class="no-posts">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                    <p>Error loading writeups. Please try again later.</p>
                    <p style="font-size: 0.9rem; margin-top: 1rem;">${error.message}</p>
                </div>
            `;
        }
    }

    // Update stats from data
    function updateStats(stats) {
        if (stats) {
            const writeupCount = document.getElementById('writeupCount');
            if (writeupCount) writeupCount.textContent = stats.total;
            
            const easyCount = document.getElementById('easyCount');
            if (easyCount) easyCount.textContent = stats.easy || 0;
            
            const mediumCount = document.getElementById('mediumCount');
            if (mediumCount) mediumCount.textContent = stats.medium || 0;
            
            const hardCount = document.getElementById('hardCount');
            if (hardCount) hardCount.textContent = stats.hard || 0;
            
            const insaneCount = document.getElementById('insaneCount');
            if (insaneCount) insaneCount.textContent = stats.insane || 0;
        }
    }

    // Estimate reading time based on difficulty
    function estimateReadingTime(difficulty) {
        const readingTimes = {
            'Easy': '8 min',
            'Medium': '12 min',
            'Hard': '18 min',
            'Insane': '25 min'
        };
        return readingTimes[difficulty] || '10 min';
    }
    
    // Render writeups
    function renderWriteups(writeups) {
        writeupsGrid.innerHTML = '';
        
        if (writeups.length === 0) {
            writeupsGrid.innerHTML = `
                <div class="no-posts">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                    <p>No writeups found matching your filter.</p>
                </div>
            `;
            return;
        }
        
        // Sort writeups by date (newest first)
        writeups.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        writeups.forEach((writeup, index) => {
            const writeupCard = document.createElement('div');
            writeupCard.className = `writeup-card ${writeup.difficulty.toLowerCase()} ${writeup.os.toLowerCase()}`;
            
            // Difficulty color mapping
            const difficultyColors = {
                'Easy': '#4CAF50',
                'Medium': '#FF9800',
                'Hard': '#F44336',
                'Insane': '#9C27B0'
            };
            
            // OS icon mapping
            const osIcons = {
                'Linux': 'fab fa-linux',
                'Windows': 'fab fa-windows',
                'Other': 'fas fa-server'
            };
            
            writeupCard.innerHTML = `
                <div class="writeup-header">
                    <div class="writeup-meta-info">
                        <div class="writeup-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(writeup.date)}
                        </div>
                        <div class="writeup-os">
                            <i class="${osIcons[writeup.os] || osIcons['Other']}"></i>
                            ${writeup.os}
                        </div>
                    </div>
                    <div class="writeup-difficulty" style="color: ${difficultyColors[writeup.difficulty]};">
                        <i class="fas fa-signal"></i>
                        ${writeup.difficulty}
                    </div>
                </div>
                
                <h3 class="writeup-title">${writeup.title}</h3>
                
                ${writeup.ip ? `<div class="writeup-ip"><i class="fas fa-network-wired"></i> ${writeup.ip}</div>` : ''}
                
                <p class="writeup-excerpt">${writeup.excerpt}</p>
                
                <div class="writeup-techniques">
                    <div class="technique-tags">
                        ${writeup.techniques.slice(0, 3).map(tech => 
                            `<span class="technique-tag">${tech}</span>`
                        ).join('')}
                        ${writeup.techniques.length > 3 ? 
                            `<span class="technique-tag more">+${writeup.techniques.length - 3} more</span>` : ''
                        }
                    </div>
                </div>
                
                <div class="writeup-footer">
                    <div class="writeup-info">
                        <span class="read-time">
                            <i class="fas fa-clock"></i>
                            ${writeup.read_time}
                        </span>
                        ${writeup.rating ? `
                        <div class="writeup-rating">
                            ${generateStars(writeup.rating)}
                        </div>` : ''}
                    </div>
                    <a href="${writeup.slug}.html" class="writeup-read-btn">
                        Read Writeup <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
            
            writeupsGrid.appendChild(writeupCard);
            
            // Animate cards on load
            setTimeout(() => {
                writeupCard.classList.add('animate');
            }, index * 100);
        });
    }
    
    // Generate star rating
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
    
    // Format date to readable format
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    // Setup filtering functionality
    function setupFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                
                if (filter === 'all') {
                    renderWriteups(allWriteups);
                } else {
                    const filteredWriteups = allWriteups.filter(writeup => {
                        // Check difficulty
                        if (writeup.difficulty.toLowerCase() === filter.toLowerCase()) {
                            return true;
                        }
                        // Check OS
                        if (writeup.os.toLowerCase() === filter.toLowerCase()) {
                            return true;
                        }
                        // Check techniques
                        if (writeup.techniques.some(tech => 
                            tech.toLowerCase().includes(filter.toLowerCase())
                        )) {
                            return true;
                        }
                        return false;
                    });
                    renderWriteups(filteredWriteups);
                }
                
                // Clear search input if exists
                const searchInput = document.getElementById('writeupsSearch');
                if (searchInput) searchInput.value = '';
            });
        });
    }
    
    // Setup search functionality
    function setupSearch() {
        const searchInput = document.getElementById('writeupsSearch');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            
            if (searchTerm === '') {
                const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
                
                if (activeFilter === 'all') {
                    renderWriteups(allWriteups);
                } else {
                    const filteredWriteups = allWriteups.filter(writeup => 
                        writeup.difficulty.toLowerCase() === activeFilter.toLowerCase() ||
                        writeup.os.toLowerCase() === activeFilter.toLowerCase()
                    );
                    renderWriteups(filteredWriteups);
                }
                return;
            }
            
            const filteredWriteups = allWriteups.filter(writeup => 
                writeup.title.toLowerCase().includes(searchTerm) ||
                writeup.excerpt.toLowerCase().includes(searchTerm) ||
                writeup.techniques.some(tech => tech.toLowerCase().includes(searchTerm)) ||
                writeup.os.toLowerCase().includes(searchTerm) ||
                writeup.difficulty.toLowerCase().includes(searchTerm)
            );
            
            renderWriteups(filteredWriteups);
        });
    }
    
    // Add sorting functionality
    function addSortingControls() {
        const filtersContainer = document.querySelector('.writeups-filters');
        if (!filtersContainer) return;
        
        const sortContainer = document.createElement('div');
        sortContainer.className = 'sort-controls';
        sortContainer.style.marginTop = '1rem';
        sortContainer.style.textAlign = 'center';
        
        sortContainer.innerHTML = `
            <label style="color: var(--text-light); margin-right: 1rem;">Sort by:</label>
            <select id="sortSelect" style="background: rgba(0,0,0,0.8); border: 1px solid #333; color: var(--text-color); padding: 0.5rem; border-radius: 5px;">
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="difficulty-asc">Difficulty: Easy to Hard</option>
                <option value="difficulty-desc">Difficulty: Hard to Easy</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="rating-desc">Highest Rated</option>
            </select>
        `;
        
        filtersContainer.appendChild(sortContainer);
        
        // Add sorting event listener
        document.getElementById('sortSelect').addEventListener('change', function() {
            const sortBy = this.value;
            const currentlyDisplayed = Array.from(writeupsGrid.querySelectorAll('.writeup-card')).length > 0 ? 
                getCurrentlyDisplayedWriteups() : allWriteups;
            
            const sorted = sortWriteups(currentlyDisplayed, sortBy);
            renderWriteups(sorted);
        });
    }
    
    // Get currently displayed writeups
    function getCurrentlyDisplayedWriteups() {
        const displayedCards = writeupsGrid.querySelectorAll('.writeup-card');
        return Array.from(displayedCards).map(card => {
            const title = card.querySelector('.writeup-title').textContent;
            return allWriteups.find(w => w.title === title);
        }).filter(Boolean);
    }
    
    // Sort writeups function
    function sortWriteups(writeups, sortBy) {
        const sorted = [...writeups];
        
        switch(sortBy) {
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'difficulty-asc':
                const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3, 'Insane': 4 };
                return sorted.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
            case 'difficulty-desc':
                const diffOrderDesc = { 'Easy': 4, 'Medium': 3, 'Hard': 2, 'Insane': 1 };
                return sorted.sort((a, b) => diffOrderDesc[a.difficulty] - diffOrderDesc[b.difficulty]);
            case 'name-asc':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'name-desc':
                return sorted.sort((a, b) => b.title.localeCompare(a.title));
            case 'rating-desc':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default:
                return sorted;
        }
    }
    
    // Initialize
    loadWriteups();
    
    // Add sorting controls after a short delay to ensure filters are rendered
    setTimeout(() => {
        addSortingControls();
    }, 100);
});

// Additional utility functions for individual writeup pages
function initWriteupPage() {
    // Add navigation between writeups
    addWriteupNavigation();
    
    // Add copy buttons to code blocks
    addCopyButtonsToCodeBlocks();
    
    // Add image zoom functionality
    addImageZoom();
    
    // Generate table of contents
    generateWriteupTOC();
}

// Add navigation between writeups
function addWriteupNavigation() {
    const navContainer = document.createElement('div');
    navContainer.className = 'writeup-navigation';
    navContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin: 2rem 0;
        padding: 1rem;
        background: rgba(0,0,0,0.8);
        border-radius: 10px;
        border: 1px solid #333;
    `;
    
    // This would be populated based on the current writeup and available writeups
    navContainer.innerHTML = `
        <a href="javascript:history.back()" class="nav-btn">
            <i class="fas fa-arrow-left"></i> Back to Writeups
        </a>
        <div class="writeup-nav-links">
            <a href="#" class="nav-btn disabled">
                <i class="fas fa-chevron-left"></i> Previous
            </a>
            <a href="#" class="nav-btn disabled">
                Next <i class="fas fa-chevron-right"></i>
            </a>
        </div>
    `;
    
    const main = document.querySelector('main');
    if (main) {
        main.appendChild(navContainer);
    }
}

// Add copy functionality to code blocks
function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code, .code-block');
    
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerHTML = '<i class="fas fa-copy"></i>';
        button.title = 'Copy to clipboard';
        
        button.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: rgba(0, 255, 0, 0.1);
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
            border-radius: 4px;
            padding: 0.5rem;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('click', async () => {
            const text = block.textContent;
            try {
                await navigator.clipboard.writeText(text);
                button.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
        
        const parent = block.parentNode;
        if (parent && parent.tagName === 'PRE') {
            parent.style.position = 'relative';
            parent.appendChild(button);
        }
    });
}

// Add image zoom functionality
function addImageZoom() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            const modalImg = document.createElement('img');
            modalImg.src = this.src;
            modalImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
            `;
            
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            // Close on click
            modal.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });
    });
}

// Generate table of contents for writeups
function generateWriteupTOC() {
    const headings = document.querySelectorAll('h2, h3, h4');
    if (headings.length === 0) return;
    
    const tocContainer = document.createElement('div');
    tocContainer.className = 'writeup-toc';
    tocContainer.style.cssText = `
        background: rgba(0,0,0,0.8);
        border: 1px solid #333;
        border-radius: 10px;
        padding: 1.5rem;
        margin: 2rem 0;
        position: sticky;
        top: 2rem;
    `;
    
    let tocHTML = '<h3 style="color: var(--primary-color); margin-bottom: 1rem;">Contents</h3><ul style="list-style: none; padding: 0;">';
    
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const level = parseInt(heading.tagName.substring(1));
        const indent = (level - 2) * 20;
        
        tocHTML += `
            <li style="margin: 0.5rem 0; padding-left: ${indent}px;">
                <a href="#${heading.id}" style="color: var(--text-color); text-decoration: none; transition: color 0.3s ease;">
                    ${heading.textContent}
                </a>
            </li>
        `;
    });
    
    tocHTML += '</ul>';
    tocContainer.innerHTML = tocHTML;
    
    // Insert after the first paragraph
    const firstParagraph = document.querySelector('p');
    if (firstParagraph) {
        firstParagraph.parentNode.insertBefore(tocContainer, firstParagraph.nextSibling);
    }
}

// Export functions for use in individual writeup pages
window.initWriteupPage = initWriteupPage;
