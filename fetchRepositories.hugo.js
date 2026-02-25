const axios = require("axios");
const fs = require("fs");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const githubUsername = process.env.GH_USERNAME;
const githubToken = process.env.GITHUB_TOKEN;

if (!githubUsername) {
  console.error("Error: GitHub username is not defined.");
  process.exit(1);
}

async function fetchAllRepositories() {
  let allRepos = [];
  let page = 1;
  const headers = {};
  if (githubToken) {
    headers["Authorization"] = `Bearer ${githubToken}`;
  }

  while (true) {
    const response = await axios.get(
      `https://api.github.com/users/${githubUsername}/repos`,
      {
        params: { per_page: 100, page: page },
        headers: headers,
      },
    );
    const repos = response.data;
    if (repos.length === 0) break;
    allRepos = allRepos.concat(repos);
    if (repos.length < 100) break;
    page++;
  }

  return allRepos;
}

async function fetchRepositories() {
  try {
    const allRepos = await fetchAllRepositories();
    let repositories = allRepos.map((repo) => ({
      name: repo.name,
      description: repo.description,
      created_at: repo.created_at,
      url: repo.html_url,
      updated_at: repo.updated_at,
    }));

    // Sort repositories by the most recent update time
    repositories = repositories.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
    );

    const dataDir = path.join(__dirname, "data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    const dataPath = path.join(dataDir, "repositories.json");

    fs.writeFileSync(dataPath, JSON.stringify(repositories, null, 2));
    console.log("repositories.json has been updated.");
  } catch (error) {
    console.error("Error fetching repositories:", error.message);
    process.exit(1);
  }
}

fetchRepositories();
