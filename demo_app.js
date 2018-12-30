// Application JavaScript demonstrating use of the ChineseDict module
import { PlainJSBuilder } from './index.js';
const { fromEvent } = rxjs;
console.log('Loading demo_app');
// Build and initialize the ChineseDict class
const builder = new PlainJSBuilder('assets/words.json', '.textbody', 'dict-dialog', 'all');
const dict = builder.buildDictionary();
const button = document.querySelector('#lookup_button');
const tf = document.querySelector('#lookup_input');
const pSpan = document.querySelector('#pinyin_span');
const eSpan = document.querySelector('#english_span');
// Lookup a value in the dictionary
fromEvent(button, 'click')
    .subscribe(() => {
    const term = dict.lookup(tf.value);
    console.log(`Value: ${tf.value}`);
    pSpan.innerHTML = term.getPinyin();
    eSpan.innerHTML = term.getEnglish();
});
