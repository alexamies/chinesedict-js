// Application JavaScript demonstrating use of the ChineseDict module
import ChineseDict from './index.js';

// Uncomment after installing and adding the dialog-polyfill module to the dist
// directory for cross-browser compatibility
//dialogPolyfill.registerDialog(dialog);

// Use the ChineseDict class
new ChineseDict('words.json', '.textbody', 'dict-dialog');
