// Interactive Terminal
document.addEventListener('DOMContentLoaded', function() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');

    const commands = {
        'help': 'Available commands: whoami, ls, cat, ps, netstat, history, clear, about, skills, machines, htb, tools',
        'whoami': '0xProfound - Elite Penetration Tester',
        'ls': 'writeups/  scripts/  tools/  notes/  exploits/  reports/',
        'cat /etc/passwd': 'root:x:0:0:0xProfound:/root:/bin/bash\n0xprofound:x:1000:1000:Cybersecurity Specialist:/home/0xprofound:/bin/bash',
        'ps aux': 'PID   CMD\n1337  nmap -sS -sV target\n1338  python3 exploit.py\n1339  nc -lvnp 4444\n1340  bloodhound --no-sandbox',
        'netstat -tulpn': 'Proto  Local Address    State       PID/Program\ntcp    0.0.0.0:4444     LISTEN      1339/nc\ntcp    0.0.0.0:8080     LISTEN      1341/python3',
        'about': 'Cybersecurity enthusiast with 37+ HTB machines solved. Currently mastering the DEPI VAPT track while building automation tools and sharing knowledge.',
        'skills': 'Core Skills:\n→ Network Penetration Testing (95%)\n→ Web Application Security (90%)\n→ Python/Bash Scripting (92%/89%)\n→ Privilege Escalation (88%)\n→ Active Directory (82%)',
        'machines': 'HTB Stats:\n→ Total Solved: 37\n→ Easy: 15 | Medium: 12 | Hard: 8 | Insane: 2\n→ Linux: 22 | Windows: 15\n→ Latest: Rope (Insane)',
        'htb': 'Recent HTB Activity:\n→ Rope (Insane) - Advanced binary exploitation\n→ Forest (Medium) - Active Directory attack\n→ Blue (Easy) - EternalBlue exploitation\n→ Cronos (Hard) - DNS + SQLi + Cron privesc',
        'tools': 'Arsenal:\n→ Reconnaissance: Nmap, Gobuster, ffuf, AutoRecon.py\n→ Web Testing: Burp Suite, SQLMap, OWASP ZAP\n→ Exploitation: Metasploit, Empire, Custom Scripts\n→ Post-Exploit: LinEnum, WinPEAS, BloodHound',
        'history': 'Command History:\n1. nmap -sC -sV 10.10.10.37\n2. gobuster dir -u http://10.10.10.37\n3. python3 exploit.py\n4. nc -lvnp 4444\n5. find / -perm -4000 2>/dev/null',
        'clear': 'CLEAR_TERMINAL',
        'banner': `
    ██████╗ ██╗  ██╗██████╗ ██████╗  ██████╗ ███████╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗ 
   ██╔═████╗╚██╗██╔╝██╔══██╗██╔══██╗██╔═══██╗██╔════╝██╔═══██╗██║   ██║████╗  ██║██╔══██╗
   ██║██╔██║ ╚███╔╝ ██████╔╝██████╔╝██║   ██║█████╗  ██║   ██║██║   ██║██╔██╗ ██║██║  ██║
   ████╔╝██║ ██╔██╗ ██╔═══╝ ██╔══██╗██║   ██║██╔══╝  ██║   ██║██║   ██║██║╚██╗██║██║  ██║
   ╚██████╔╝██╔╝ ██╗██║     ██║  ██║╚██████╔╝██║     ╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝
    ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝ 
                                    Elite Penetration Tester
            `
    };

    terminalInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim().toLowerCase();
            const output = commands[command] || `Command not found: ${command}. Type 'help' for available commands.`;
            
            // Add command to terminal
            const commandLine = document.createElement('div');
            commandLine.className = 'terminal-line';
            commandLine.innerHTML = `<span style="color: var(--primary-color);">root@0xProfound:~# </span><span style="color: #fff;">${this.value}</span>`;
            terminalBody.appendChild(commandLine);
            
            if (output === 'CLEAR_TERMINAL') {
                // Clear terminal except welcome messages
                terminalBody.innerHTML = `
                    <div class="terminal-line" style="color: var(--primary-color);">Welcome to 0xProfound's Interactive Terminal</div>
                    <div class="terminal-line" style="color: var(--text-light);">Type 'help' to see available commands</div>
                `;
            } else {
                // Add output
                const outputLine = document.createElement('div');
                outputLine.className = 'terminal-line';
                outputLine.style.color = 'var(--text-color)';
                outputLine.innerHTML = output.replace(/\n/g, '<br>');
                terminalBody.appendChild(outputLine);
            }
            
            // Add new input line
            const newInputLine = document.createElement('div');
            newInputLine.className = 'terminal-line';
            newInputLine.innerHTML = `<span style="color: var(--primary-color);">root@0xProfound:~# </span><input type="text" class="terminal-input" placeholder="Type a command..." autocomplete="off">`;
            terminalBody.appendChild(newInputLine);
            
            // Focus new input and remove old one
            const newInput = newInputLine.querySelector('.terminal-input');
            newInput.focus();
            this.remove();
            
            // Scroll to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
            
            // Add event listener to new input
            newInput.addEventListener('keypress', arguments.callee);
        }
    });
});
