import { Telegraf, Markup, Scenes, session } from 'telegraf';
import translateWizard from './scenes/translateScene.js';

import * as dotenv from 'dotenv'
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([translateWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
    ctx.reply(`Welcome ${ctx.message.from.first_name ? ctx.message.from.first_name : 'anonymous'}!`)
    ctx.scene.enter('TRASLATE_WIZARD_SCENE_ID')
});

/* bot.on('photo', async (ctx) => {
    try {
        const photos = ctx.message.photo;
        const fileLink = await ctx.telegram.getFileLink(photos[photos.length - 1].file_id);
        const recognizedText = await recognize(fileLink);
        const translatedText = await translate(recognizedText, 'ru');

        await ctx.replyWithHTML(translatedText);
    } catch (error) {
        await ctx.reply(error);
    }
}); */

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));