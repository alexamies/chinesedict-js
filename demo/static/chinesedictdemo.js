import { ChineseDict, NoFrameworkBuilder } from '/dist/index.js'

// Application JavaScript demonstrating use of the ChineseDict module

// Use the dictionary
const builder = new NoFrameworkBuilder('dist/words.json',
	                                   '.textbody',
	                                   'dict-dialog',
	                                   'all');
builder.buildDictionary();