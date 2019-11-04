import { DictionarySource, PlainJSBuilder } from '/index.js'

// Application JavaScript demonstrating use of the ChineseDict module

// Use the dictionary
const source1 = new DictionarySource('/assets/ntireader.json',
  'NTI Reader dictionary',
  `Shared via <a href='http://ntireader.org/about.html'
   >CCA-SA 3.0</a>`);
const builder = new PlainJSBuilder([source1], '.textbody', 'dict-dialog', 'all');
const dictView = builder.buildDictionary();
