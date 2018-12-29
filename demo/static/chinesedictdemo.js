import { PlainJSBuilder } from '/index.js'

// Application JavaScript demonstrating use of the ChineseDict module

// Use the dictionary
const builder = new PlainJSBuilder('dist/words.json',
	                                '.textbody',
	                                'dict-dialog',
	                                'all');
builder.buildDictionary();