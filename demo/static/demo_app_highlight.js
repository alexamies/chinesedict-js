import { DictionarySource, PlainJSBuilder } from '/index.js'

// Application JavaScript demonstrating use of the ChineseDict module

// Use the dictionary
const source = new DictionarySource('dist/words_all.json',
    'NTI Reader Dictionary',
	`Nan Tien Temple Reader Dictionary,
	<a href='https://github.com/alexamies/buddhist-dictionary'
	  >https://github.com/alexamies/buddhist-dictionary</a>`)
const builder = new PlainJSBuilder([source],
                                   '.textbody',
                                   'dict-dialog',
                                   'proper');
builder.buildDictionary();
