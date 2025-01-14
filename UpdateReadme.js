const fs = require("fs");
const path = require("path");

// Readme file path
const readmeFilePath = path.join(__dirname, "README.md");

// Repository folder path
const repoDirPath = path.join(__dirname, "");

// Read the README file
fs.readFile(readmeFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the README file:", err);
    return;
  }

  // Get list of directories in the repository
  fs.readdir(repoDirPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error("Error reading the directory:", err);
      return;
    }

    // Filter out only directories (folders)
    const folderNames = files
      .filter((file) => file.isDirectory())
      .map((file) => file.name);

    // Process the README file content
    let updatedData = data;

    // Process each table row (second column is the folder name in bold, third column is "정리")
    updatedData = updatedData.replace(
      /\|(.+?)\|(.+?)\|(.+?)\|/g,
      (match, date, folderName, cleanup) => {
        // Get the folder name from the bold text
        const boldFolderName = folderName.trim().replace(/\*\*(.+?)\*\*/, "$1");
        // Check if the folder exists
        if (folderNames.includes(boldFolderName)) {
          // If the "cleanup" cell is empty, add the link
          if (cleanup.trim().length === 6) {
            const folderLink = `[정리](https://github.com/Frontend-Gang-Study/modern-javascript-deep-dive/tree/main/${encodeURIComponent(
              boldFolderName
            )})`;
            return `|${date}|${folderName}|${folderLink}|`; // Add the link to the "Cleanup" column
          }
        }
        return match; // If "cleanup" already has content, don't change it
      }
    );

    // Write the updated content back to the README file
    fs.writeFile(readmeFilePath, updatedData, "utf8", (err) => {
      if (err) {
        console.error("Error saving the README file:", err);
        return;
      }
      console.log("The README file has been updated!");
    });
  });
});
