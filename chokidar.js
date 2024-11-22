const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

const sharedDir = path.join(__dirname, "shared", "prisma-client");
const clientDir = path.join(__dirname, "client", "src", "prisma-types");
const serverDir = path.join(__dirname, "server", "src", "prisma-types");

// Helper function to copy files and folders recursively
function copyFiles(srcDir, destDir) {
  fs.readdirSync(srcDir).forEach((item) => {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);

    if (fs.statSync(srcPath).isDirectory()) {
      // If the item is a directory, create the destination directory if it doesn't exist, then recurse
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      copyFiles(srcPath, destPath); // Recursively copy the folder contents
    } else {
      // If it's a file, copy it
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${item} to ${destDir}`);
    }
  });
}

// Initial copy to ensure both client and server have the latest types
copyFiles(sharedDir, clientDir);
copyFiles(sharedDir, serverDir);

// Watch for changes in the shared directory
chokidar.watch(sharedDir).on("all", (event, path) => {
  if (["add", "change", "unlink"].includes(event)) {
    console.log(`Detected ${event} in ${path}, updating types...`);
    copyFiles(sharedDir, clientDir);
    copyFiles(sharedDir, serverDir);
  }
});
