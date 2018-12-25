// Application JavaScript demonstrating use of the ChineseDict module
import { ChineseDict, NoFrameworkBuilder } from './index.js';

// Build and initialize the ChineseDict class
const builder = new NoFrameworkBuilder('assets/words.json',
                                       '.textbody',
                                       'dict-dialog',
                                       'all');
builder.buildDictionary();