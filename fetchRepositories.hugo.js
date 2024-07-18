const axios = require('axios');
const fs = require('fs');
const { execSync } = require('child_process');

const githubUsername =
  process.env.GH_USERNAME || require('./secrets').githubUsername;

async function fetchRepositories() {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${githubUsername}/repos`
    );
    let repositories = response.data.map((repo) => ({
      name: repo.name,
      description: repo.description,
      created_at: repo.created_at,
      url: repo.html_url,
      updated_at: repo.updated_at,
    }));

    // Sort repositories by the most recent update time
    repositories = repositories.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );

    fs.writeFileSync(
      'data/repositories.json',
      JSON.stringify(repositories, null, 2)
    );
    console.log('repositories.json has been updated.');
  } catch (error) {
    console.error('Error fetching repositories:', error);
  }
}

fetchRepositories();
