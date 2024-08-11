import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { Telegraf } from 'telegraf';

config();

const expressApp = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

expressApp.use(express.static('static'));
expressApp.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);

expressApp.get("/", (req, res) => {
  res.send("Hello World");
});

expressApp.use(bot.webhookCallback('/secret-path'));
bot.telegram.setWebhook(`${process.env.DEPLOYED_BOT_URL}/secret-path`);


bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Hello there! Welcome to the Code Capsules telegram bot.nI respond to /ethereum. Please try it', {
    })
})

expressApp.listen(port, () => console.log(`Listening on ${port}`));

// bot.launch();