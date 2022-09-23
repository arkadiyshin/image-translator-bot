import { createWorker } from 'tesseract.js';
import { RECOGNITION_LANGUGES } from './const.js';

const worker = createWorker({
});

await worker.load();

RECOGNITION_LANGUGES.forEach( async e => {
    await worker.loadLanguage(e.id);
})

export async function recognize(fileURL, lang = 'eng') {
    try {
        await worker.initialize(lang);
        const { data: { text } } = await worker.recognize(`https://api.allorigins.win/raw?url=${fileURL}`);
        console.log(`original text: ${text}`);
        return text;
    } catch (error) {
        return error;
    }
};

export default worker;