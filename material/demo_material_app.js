import { DictionarySource, PlainJSBuilder } from '@alexamies/chinesedict-js';
const source = new DictionarySource('/words.json',
                                    'Demo Dictionary',
                                    'Just for a demo');
const builder = new PlainJSBuilder([source], '', '', 'all');
const dictView = builder.buildDictionary(); 
// Matching terms will be highlighted
// If the user clicks on a word then a dialog will be shown
// You can also look a word up directly
const term = dictView.lookup('力'); // Example word
const entry = term.getEntries()[0]; // Get the entry from the first dictionary
if (entry) {
  console.log(`English: ${ entry.getEnglish() }`);
  console.log(`Pinyin: ${ entry.getPinyin() }`);
} else {
	console.log('Term not found');
}