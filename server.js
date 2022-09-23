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
});

bot.command('translate', (ctx) => ctx.scene.enter('TRASLATE_WIZARD_SCENE_ID'));
bot.command('quit', async (ctx) => {
    await ctx.telegram.leaveChat(ctx.message.chat.id);
    await ctx.leaveChat();
});

/* function addActionButton(name, text) {
    bot.action(name, async (ctx) => {
        await ctx.replyWithHTML('Choose source language');
    })
} */


bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));