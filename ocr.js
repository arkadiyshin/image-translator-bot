import { createWorker } from 'tesseract.js';

const worker = createWorker({
});

await worker.load();
await worker.loadLanguage('deu');
await worker.loadLanguage('eng');

export async function recognize(fileURL, lang = 'eng') {
    try {
        await worker.initialize(lang);
        const { data: { text } } = await worker.recognize(`https://api.allorigins.win/raw?url=${fileURL}`);
        return text;
    } catch (error) {
        return error;
    }
};

export default worker;