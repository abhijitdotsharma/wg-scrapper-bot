import 'dotenv/config';
import { Bot, webhookCallback } from 'grammy';
import express from 'express';

const COMMANDS = {
    START: 'start',
    HELP: 'help',
    GET_LISTINGS: 'getlistings'
};

if(!process.env.BOT_TOKEN || !process.env.SCRAPPER_SERVER_URL) {
    throw new Error(`Please provide BOT_TOKEN and SCRAPPER_SERVER_URL in the .env file`);
}

const bot = new Bot(process.env.BOT_TOKEN);
const GET_LISTINGS_URL = process.env.SCRAPPER_SERVER_URL;

bot.command(COMMANDS.START, (ctx) => {
 console.log('Received /start command');
 ctx.reply(`Welcome ${ctx.from?.first_name}`);
});

bot.command(COMMANDS.HELP, (ctx) => {
 console.log('Received /help command');
 ctx.reply('Send /start to start the bot.');
});

// Respond to the /getlistings command
bot.command(COMMANDS.GET_LISTINGS, async (ctx) => {
    try {
        const response = await fetch(GET_LISTINGS_URL); // hits the express scrapper endpoint currently running on localhost / render
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('bot.js \t 34 data: ', data);
        ctx.reply(`Data fetched: ${data}`);
    } catch (error) {
        console.error(error);
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
