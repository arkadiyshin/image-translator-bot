import { Markup, Scenes } from 'telegraf';
import { recognize } from '../ocr.js';
import { translate } from '../translate.js'
import { RECOGNITION_LANGUGES, TRANSLATION_LANGUGES, REC_PREFIX } from '../const.js';


const translateWizard = new Scenes.WizardScene(
    'TRASLATE_WIZARD_SCENE_ID',

    async (ctx) => {
        await ctx.replyWithHTML('Choose source language', Markup.inlineKeyboard([
            RECOGNITION_LANGUGES.map((e) => Markup.button.callback(e.alias, e.id))
        ]))
        //await ctx.replyWithHTML('Choose source language');
        return ctx.wizard.next();
    },

    async (ctx) => {
        console.log(ctx.update.callback_query.data);
        ctx.wizard.state.sourseLanguage = ctx.update.callback_query.data;
        await ctx.replyWithHTML(`You chose <b>${ctx.wizard.state.sourseLanguage}</b> language`);
        await ctx.replyWithHTML('Choose target language', Markup.inlineKeyboard([
            TRANSLATION_LANGUGES.map((e) => Markup.button.callback(e.alias, e.id))
        ]))

        return ctx.wizard.next();
    },

    async (ctx) => {
        ctx.wizard.state.targetLanguage = ctx.update.callback_query.data;
        await ctx.replyWithHTML(`You chose <b>${ctx.wizard.state.targetLanguage}</b> language`);
        await ctx.replyWithHTML('Send me an image');
        return ctx.wizard.next();
    },

    async (ctx) => {

        try {
            const photos = ctx.message.photo;
            const fileLink = await ctx.telegram.getFileLink(photos[photos.length - 1].file_id);
            const recognizedText = await recognize(fileLink, ctx.wizard.state.sourseLanguage);
            ctx.wizard.state.recognizedText = recognizedText;
            await ctx.replyWithHTML('Your recognized text: ');
            await ctx.replyWithHTML(recognizedText);
            await ctx.replyWithHTML(`Do you want to translate it into <b>${ctx.wizard.state.targetLanguage}</b>?`, Markup.inlineKeyboard([
                [Markup.button.callback('YES', 'yes')],
                [Markup.button.callback('NO', 'no')],
            ]))
            return ctx.wizard.next();
        } catch (error) {
            await ctx.reply(error);
        }
    },

    async (ctx) => {
        if (ctx.update.callback_query.data === 'yes') {
            const translatedText = await translate(ctx.wizard.state.recognizedText, ctx.wizard.state.targetLanguage);
            await ctx.replyWithHTML(translatedText);
        }
        return ctx.scene.leave();
    },

);

export default translateWizard;