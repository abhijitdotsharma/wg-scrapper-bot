import { Bot, webhookCallback } from "grammy";
import fetch from "node-fetch";
import "dotenv/config";
import express from "express";


if(!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is unset");
}

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("gg", (ctx) => {
    ctx.reply("start command entered")
});

export default webhookCallback(bot, "std/http");






/*

bot.on("message", (ctx) => ctx.reply("Got message!"));

const GET_LISTINGS_URL = `${process.env.EXPRESS_SERVER_URL}/get-listings`;

// Respond to the /fetchdata command
bot.command("fetchdata", async (ctx) => {
    try {
        const response = await fetch(GET_LISTINGS_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('data', data);
        ctx.reply(`Data fetched: ${data}`);
    } catch (error) {
        console.error(error);
        ctx.reply(`Failed to fetch data: ${error.message}`);
    }
});

bot.command("gg", (ctx) => {
    ctx.reply("start command entered")
});


*/


