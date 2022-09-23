import { createWorker } from 'tesseract.js';
import { RECOGNITION_LANGUGES } from './const.js';

const worker = createWorker({
});

await worker.load();

RECOGNITION_LANGUGES.forEach(async e => {
    await worker.loadLanguage(e.id);
})

export async function recognize(fileURL, lang = 'eng') {
    try {
        await worker.initialize(lang);
        let { data: { text } } = await worker.recognize(`https://api.allorigins.win/raw?url=${fileURL}`);
        console.log(`reconized text: \n ${text}`);
        console.log(typeof(text));

        text = normalize(text);

        return text;
    } catch (error) {
        return error;
    }
};

function normalize(text) {
    
    // remove double line break
    text = text.replaceAll('\n\n', '\n');

    // remove double space
    text = text.replaceAll('  ', ' ');

    // remove word wrap
    text = text.replaceAll('-\n', '');

    // remove extra wraps
    const endSighs = ['.', '!', '?', '\"']; 
        
    endSighs.forEach( (e) => {
        text = text.replaceAll(`${e}\n`, `${e}\%`);
    });
    text = text.replaceAll('\n', ' ');
    endSighs.forEach( (e) => {
        text = text.replaceAll(`${e}\%`, `${e}\n\t`);
    });

    console.log(`${text} = return`);
    return text;
}

export default worker;