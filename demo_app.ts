// Application JavaScript demonstrating use of the ChineseDict module
import { DictionarySource, PlainJSBuilder } from './index.js';

declare var rxjs;

const { fromEvent } = rxjs;

console.log('Loading demo_app');

// Build and initialize the ChineseDict class
const source = new DictionarySource('assets/words.json',
    'Demo Dictionary',
	'Just for a demo, see instrucitons for building a full dictionary')
const builder = new PlainJSBuilder([source],
                                   '.textbody',
                                   'dict-dialog',
                                   'all');
const dictView = builder.buildDictionary();

const button = document.querySelector('#lookup_button');
const tf = <HTMLInputElement>document.querySelector('#lookup_input');
const pSpan = document.querySelector('#pinyin_span');
const eSpan = document.querySelector('#english_span');

// Lookup a value in the dictionary
fromEvent(button, 'click')
  .subscribe(() => {
  	const term = dictView.lookup(tf.value);
  	console.log(`Value: ${ tf.value }`);
    const entry = term.getEntries()[0];
  	pSpan.innerHTML = entry.getPinyin();
  	eSpan.innerHTML = entry.getEnglish();
  });