import { PlainJSBuilder } from '/dist/index.js'

// Application JavaScript demonstrating use of the ChineseDict module

// Use the dictionary
const builder = new PlainJSBuilder('dist/words_all.json',
	                               '.textbody',
	                               'dict-dialog',
	                               'proper');
builder.buildDictionary();