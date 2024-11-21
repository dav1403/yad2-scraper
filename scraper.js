const fs = require('fs');
const path = require('path');

// Define the data directory
const dataDir = path.join(__dirname, 'data');

try {
    // Check if the directory exists before creating it
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log(`Directory created: ${dataDir}`);
    } else {
        console.log(`Directory already exists: ${dataDir}`);
    }
} catch (error) {
    console.error(`Error creating directory: ${error.message}`);
    process.exit(1); // Exit the script with an error code
}

// The rest of your scraper logic goes here
console.log('Scraper setup complete.');
