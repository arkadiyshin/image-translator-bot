import { recognize } from './ocr.js';
import { Telegraf } from 'telegraf';
import { translate } from './translate.js'

import * as dotenv from 'dotenv'
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.on('photo', async (ctx) => {
    try {
        const photos = ctx.message.photo;
        const fileLink = await ctx.telegram.getFileLink(photos[photos.length - 1].file_id);
        const recognizedText = await recognize(fileLink);
        const translatedText = await translate(recognizedText, 'en');

        await ctx.reply(translatedText);
    } catch (error) {
        await ctx.reply(error);
    }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));