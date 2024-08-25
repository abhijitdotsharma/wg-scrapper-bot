import 'dotenv/config';
import { Bot, webhookCallback } from 'grammy';
import express from 'express';

const COMMANDS = {
    START: 'start',
    HELP: 'help',
    TEMP: 'temp',
    GET_LISTINGS: 'getlistings'
};


const getFormattedListingData = (listings) => {
        try {
          if (!listings || listings.length === 0) {
            return "No listings available at the moment.";
          }
      
          let formattedMessage = "Here are the latest listings:\n\n";
          listings.forEach(listing => {
            const { url, rent, availableFrom, size } = listing;
            const baseUrl = "https://www.wg-gesucht.de"; 
            formattedMessage += `[${size} for €${rent}, available from ${availableFrom}](${baseUrl}${url})\n\n`;
          });
          return formattedMessage;
        } catch (error) {
          console.error("Error formatting listing data:", error);
          return "An error occurred while fetching the listings.";
        }
};


if(!process.env.BOT_TOKEN || !process.env.SCRAPPER_SERVER_URL) {
    throw new Error(`Please provide BOT_TOKEN and SCRAPPER_SERVER_URL in the .env file`);
}

const bot = new Bot(process.env.BOT_TOKEN);
const GET_LISTINGS_URL = process.env.SCRAPPER_SERVER_URL;

console.log('bot.js \t 16 GET_LISTINGS_URL: ', GET_LISTINGS_URL);

bot.command(COMMANDS.START, (ctx) => {
 console.log('Received /start command');
 ctx.reply(`Welcome ${ctx.from?.first_name}`);
});

bot.command(COMMANDS.HELP, (ctx) => {
 console.log('Received /help command');
 ctx.reply('Send /start to start the bot.');
});

bot.command(COMMANDS.TEMP, (ctx) => {
    console.log('Received /temp command');
    ctx.reply('This is a temporary command.');
});

// Respond to the /getlistings command
bot.command(COMMANDS.GET_LISTINGS, async (ctx) => {
    try {
        const response = await fetch(GET_LISTINGS_URL); // hits the express scrapper endpoint currently running on localhost / render
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // console.log('bot.js \t 33 response: ', JSON.parse(response.json()));
        const data = await response.json();
        console.log('bot.js \t 34 data: ', data);
        ctx.reply(`Data fetched: ${getFormattedListingData(data)}`);
    } catch (error) {
        console.error('error ----', error);
        ctx.reply(`Failed to fetch data: ${error.message}`);
    }
});

const app = express();
app.use(express.json());

// Set up the webhook for telegram bot
app.use(webhookCallback(bot, 'express'));

app.get("/test", (req, res) => res.send("/test Express on Vercel"));


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
 console.log(`Server is running on port ${PORT}`);
});
