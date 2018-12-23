// Application JavaScript demonstrating use of the ChineseDict module
import { ChineseDict } from './chinesedict.js';

// Use the ChineseDict class
new ChineseDict('assets/words.json', '.textbody', 'dict-dialog', 'nohighlight');
