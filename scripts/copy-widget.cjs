const fs = require("fs")
const path = require("path")

// Define source and destination paths
const sourcePath = path.join(__dirname, "../dist/widget/chatbot-widget.iife.js")
const destPath = path.join(__dirname, "../dist/widget/chatbot-bundle.js")

// Copy the file
try {
  fs.copyFileSync(sourcePath, destPath)
  console.log("Successfully copied widget file")
} catch (err) {
  console.error("Error copying widget file:", err)
  process.exit(1)
}
