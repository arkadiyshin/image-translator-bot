import { Markup, Scenes } from 'telegraf';
import { recognize } from '../ocr.js';
import { translate } from '../translate.js'

const translateWizard = new Scenes.WizardScene(
    'TRASLATE_WIZARD_SCENE_ID',
    
    async (ctx) => {
        await ctx.replyWithHTML('Choose source language');
        return ctx.wizard.next();
    },

    async (ctx) => {
        ctx.wizard.state.sourseLanguage = ctx.message.text;
        await ctx.replyWithHTML(`You chose ${ctx.wizard.state.sourseLanguage} language`);
        await ctx.replyWithHTML('Choose target language');
        
        return ctx.wizard.next();
    },

    async (ctx) => {
        ctx.wizard.state.targetLanguage = ctx.message.text;
        await ctx.replyWithHTML(`You chose ${ctx.wizard.state.targetLanguage} language`);
        await ctx.replyWithHTML('Send me a image');
        return ctx.wizard.next();
    },

    async (ctx) => {

        try {
            const photos = ctx.message.photo;
            const fileLink = await ctx.telegram.getFileLink(photos[photos.length - 1].file_id);
            const recognizedText = await recognize(fileLink, ctx.wizard.state.sourseLanguage);
            ctx.wizard.state.recognizedText = recognizedText;
            await ctx.replyWithHTML(recognizedText);
            await ctx.replyWithHTML('You agree?');
            return ctx.wizard.next();
        } catch (error) {
            await ctx.reply(error);
        }
    },
    
    async (ctx) => {
        const translatedText = await translate(ctx.wizard.state.recognizedText, ctx.wizard.state.targetLanguage);
        await ctx.replyWithHTML(translatedText);
        return ctx.scene.leave();
    },

);

export default translateWizard;