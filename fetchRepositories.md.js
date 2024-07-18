const axios = require('axios');
const fs = require('fs');
let githubUsername;

// Check if running in GitHub Actions
if (process.env.GITHUB_ACTIONS) {
  githubUsername = process.env.GITHUB_USERNAME;
} else {
  const { githubUsername: localGithubUsername } = require('./secrets');
  githubUsername = localGithubUsername;
}

async function fetchRepositories() {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${githubUsername}/repos`
    );
    let repositories = response.data.map((repo) => ({
      name: repo.name,
      description: repo.description,
      created_at: repo.created_at,
      html_url: repo.html_url,
      updated_at: repo.updated_at,
    }));

    // Sort repositories by the most recent update time
    repositories = repositories.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );

    fs.writeFileSync(
      'repositories.json',
      JSON.stringify(repositories, null, 2)
    );
    console.log('repositories.json has been created');
  } catch (error) {
    console.error('Error fetching repositories:', error);
  }
}

fetchRepositories();
