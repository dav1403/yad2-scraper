const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Define the data directory
const dataDir = path.join(__dirname, 'data');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`Directory created: ${dataDir}`);
} else {
    console.log(`Directory already exists: ${dataDir}`);
}

async function scrape() {
    const apiToken = process.env.API_TOKEN;
    const chatId = process.env.CHAT_ID;
    const topic = "Jerusalem Apartments to Rent";
    const url = "https://www.yad2.co.il/realestate/forsale?topArea=100&area=7&city=3000&zoom=11";

    console.log(`Starting scanning for topic: ${topic}`);
    console.log(`Scanning URL: ${url}`);

    try {
        // Fetch the HTML content of the page
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Parse the listings
        const listings = [];
        $('.feeditem').each((i, element) => {
            const title = $(element).find('.title').text().trim();
            const price = $(element).find('.price').text().trim();
            const link = $(element).find('.feeditem a').attr('href');

            if (title && price && link) {
                listings.push({
                    id: i + 1,
                    title,
                    price,
                    link: `https://www.yad2.co.il${link}`
                });
            }
        });

        console.log(`Found ${listings.length} listings.`);

        if (listings.length === 0) {
            console.log("No new listings found.");
            return;
        }

        // Save data to JSON file
        const dataFilePath = path.join(dataDir, `${topic.replace(/ /g, "_")}.json`);
        fs.writeFileSync(dataFilePath, JSON.stringify(listings, null, 2));
        console.log(`Saved data to file: ${dataFilePath}`);

        // Send Telegram notifications
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
        throw error;
    }
}

// Run the scraper
scrape()
    .then(() => console.log("Scraper completed successfully."))
    .catch((error) => {
        console.error("Scraper failed:", error);
        process.exit(1);
    });
