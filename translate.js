import { v2 } from "@google-cloud/translate";

import * as dotenv from 'dotenv'
dotenv.config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const translator = new v2.Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

export async function translate(text, target) {

    const translations = await translator.translate(text, target);
    console.log(`Translations: ${translations}`);
    return translations[0];
}