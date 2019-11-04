import { DictionarySource, PlainJSBuilder } from '/index.js'

// Application JavaScript demonstrating use of the ChineseDict module

// Use the dictionary
const source1 = new DictionarySource('/assets/ntireader.json',
  'NTI Reader dictionary',
  `Shared via <a href='http://ntireader.org/about.html'
   >CCA-SA 3.0</a>`);
const source2 = new DictionarySource('/assets/cccedict_sample.json',
  'CC-CEDICT Dictionary',
  `Shared via <a
  href='https://www.mdbg.net/chinese/dictionary?page=cc-cedict'
  >CCA-SA 3.0</a>`);
const builder = new PlainJSBuilder([source1, source2], '.textbody', 'dict-dialog', 'proper');
const dictView = builder.buildDictionary();
