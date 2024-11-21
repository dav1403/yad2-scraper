const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Define the data directory
const dataDir = path.join(__dirname, 'data');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`Directory created: ${dataDir}`);
} else {
    console.log(`Directory already exists: ${dataDir}`);
}

// Replace this with your actual scraper logic
async function scrape() {
    const apiToken = process.env.API_TOKEN;
    const chatId = process.env.CHAT_ID;
    const topic = "Jerusalem Apartments to Rent"; // Example topic
    const url = "https://www.yad2.co.il/realestate/rent?city=3000";

    console.log(`Starting scanning for topic: ${topic}`);
    console.log(`Scanning URL: ${url}`);

    try {
        // Simulate fetching data (replace with actual HTTP request logic)
        const listings = [
            { id: 1, title: "Apartment 1", price: "5000 ILS", link: url },
            { id: 2, title: "Apartment 2", price: "6000 ILS", link: url }
        ];

        // Log the number of listings found
        console.log(`Found ${listings.length} listings.`);

        if (listings.length === 0) {
            console.log("No new listings found.");
            return;
        }

        // Save data to JSON file
        const dataFilePath = path.join(dataDir, `${topic.replace(/ /g, "_")}.json`);
        fs.writeFileSync(dataFilePath, JSON.stringify(listings, null, 2));
        console.log(`Saved data to file: ${dataFilePath}`);

        // Send a notification for each listing
        for (const listing of listings) {
            const message = `New Listing Found: ${listing.title}\nPrice: ${listing.price}\nView Listing: ${listing.link}`;
            await axios.post(`https://api.telegram.org/bot${apiToken}/sendMessage`, {
                chat_id: chatId,
                text: message,
            });
            console.log(`Notification sent for listing: ${listing.title}`);
        }

    } catch (error) {
        console.error(`Error occurred during scraping: ${error.message}`);
        throw new Error(error);
    }
}

// Run the scraper
scrape()
    .then(() => console.log("Scraper completed successfully."))
    .catch((error) => {
        console.error("Scraper failed:", error);
        process.exit(1); // Exit with an error code
    });
