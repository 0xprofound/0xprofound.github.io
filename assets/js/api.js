// API integration for GitHub, HTB, and other services
class PortfolioAPI {
    constructor() {
        this.githubUsername = '0xProfound';
        this.htbProfileId = '0xProfound';
    }

    // GitHub API integration
    async fetchGitHubStats() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.githubUsername}`);
            const data = await response.json();
            
            return {
                repos: data.public_repos,
                followers: data.followers,
                following: data.following,
                avatar: data.avatar_url,
                profileUrl: data.html_url
            };
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
            return null;
        }
    }

    // Fetch GitHub repositories
    async fetchGitHubRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.githubUsername}/repos?sort=updated`);
            const repos = await response.json();
            
            return repos.map(repo => ({
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                updated: repo.updated_at
            }));
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            return [];
        }
    }

    // Load local JSON data
    async loadLocalData(filename) {
        try {
            const response = await fetch(`assets/data/${filename}`);
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return null;
        }
    }

    // Simulate HTB API (would need proper API key in real implementation)
    async fetchHTBStats() {
        // This is a simulation - real implementation would require HTB API access
        return {
            rank: 420,
            points: 1250,
            ownership: 95.8,
            respect: 87,
            machines: 37,
            challenges: 24
        };
    }

    // Initialize all API data
    async init() {
        const [githubStats, githubRepos, htbStats, machinesData, projectsData, blogData] = await Promise.all([
            this.fetchGitHubStats(),
            this.fetchGitHubRepos(),
            this.fetchHTBStats(),
            this.loadLocalData('machines.json'),
            this.loadLocalData('projects.json'),
            this.loadLocalData('blog.json')
        ]);

        return {
            github: {
                stats: githubStats,
                repos: githubRepos
            },
            htb: htbStats,
            machines: machinesData,
            projects: projectsData,
            blog: blogData
        };
    }
}

// Initialize and export API
const portfolioAPI = new PortfolioAPI();
export default portfolioAPI;
