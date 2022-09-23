import { v2 } from "@google-cloud/translate";

import * as dotenv from 'dotenv'
dotenv.config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const translator = new v2.Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

export async function translate(text, targetLang) {
    console.log('start translation');
    const translations = await translator.translate(text, targetLang);
    console.log(`Translations: ${translations}`);
    console.log('end translation');
    return translations[0];

}