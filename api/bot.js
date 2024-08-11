import 'dotenv/config';
import { Bot, webhookCallback } from 'grammy';
import express from 'express';

const bot = new Bot(process.env.BOT_TOKEN);


bot.command('start', (ctx) => {
 console.log('Received /start command');
 ctx.reply(`Welcome ${ctx.from?.first_name}`);
});

bot.command('help', (ctx) => {
 console.log('Received /help command');
 ctx.reply('Send /start to start the bot.');
});

const app = express();
app.use(express.json());

// Set up the webhook
app.use(webhookCallback(bot, 'express'));

app.get("/test", (req, res) => res.send("/test Express on Vercel"));


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
 console.log(`Server is running on port ${PORT}`);
});

// export default app
