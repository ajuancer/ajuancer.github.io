const fs = require('fs');

function updateMarkdown() {
  const markdownFile = 'repositories.md';
  const repositoriesFile = 'repositories.json';

  if (!fs.existsSync(markdownFile)) {
    console.error(`The file ${markdownFile} does not exist.`);
    return;
  }

  if (!fs.existsSync(repositoriesFile)) {
    console.error(`The file ${repositoriesFile} does not exist.`);
    return;
  }

  const repositories = JSON.parse(fs.readFileSync(repositoriesFile, 'utf8'));

  let markdownContent = fs.readFileSync(markdownFile, 'utf8');

  // Define the start and end markers for the generated content section
  const startMarker = '<!-- GENERATED_CONTENT_START -->';
  const endMarker = '<!-- GENERATED_CONTENT_END -->';

  // Find the position of the start and end markers
  const startIndex = markdownContent.indexOf(startMarker);
  const endIndex = markdownContent.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    console.error('Generated content markers not found or invalid.');
    return;
  }

  // Extract the content before and after the generated section
  const beforeContent = markdownContent.substring(
    0,
    startIndex + startMarker.length
  );
  const afterContent = markdownContent.substring(endIndex + endMarker.length);

  // Generate the new content
  const generatedContent = repositories
    .map(
      (repo) =>
        `### ${repo.name}\n` +
        `**Description:** ${repo.description || 'No description'}\n` +
        `**Created at:** ${new Date(repo.created_at).toLocaleDateString()}\n` +
        `**Link:** [${repo.html_url}](${repo.html_url})\n` +
        `**Last updated:** ${new Date(repo.updated_at).toLocaleDateString()}\n`
    )
    .join('\n\n');

  // Concatenate the new markdown content
  const newMarkdownContent =
    beforeContent +
    '\n\n' +
    generatedContent +
    '\n\n' +
    endMarker +
    afterContent;

  // Write the updated markdown back to the file
  fs.writeFileSync(markdownFile, newMarkdownContent);
  console.log('Markdown file has been updated.');
}

updateMarkdown();
