import { PlainJSBuilder } from './index.js';
// Build and initialize the ChineseDict class
const builder = new PlainJSBuilder('assets/words.json', '.textbody', 'dict-dialog', 'all');
builder.buildDictionary();
