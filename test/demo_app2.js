// Application JavaScript demonstrating use of the ChineseDict module
import { DictionarySource, PlainJSBuilder } from '../index.js';
const { fromEvent } = rxjs;
console.log('Loading demo_app');
// Build and initialize the ChineseDict class
const source1 = new DictionarySource('/assets/ntireader_sample.json',
  'NTI Reader sample',
  'Nan Tien Institute Reader dictionary sample');
const source2 = new DictionarySource('/assets/cccedict_sample.json',
  'CC-CEDICT Sample',
  'CC-CEDICT Chinese-English Sample');
const builder = new PlainJSBuilder([source1, source2], '.textbody', 'dict-dialog', 'all');
const dictView = builder.buildDictionary();
const button = document.querySelector('#lookup_button');
const tf = document.querySelector('#lookup_input');
const pSpan = document.querySelector('#pinyin_span');
const eSpan = document.querySelector('#english_span');
// Lookup a value in the dictionary
fromEvent(button, 'click')
    .subscribe(() => {
    const term = dictView.lookup(tf.value);
    console.log(`Value: ${tf.value}`);
    const entry = term.getEntries()[0];
    if (entry) {
      pSpan.innerHTML = entry.getPinyin();
      eSpan.innerHTML = entry.getEnglish();
    } else {
      console.log('entry is not defined');
    }
});
