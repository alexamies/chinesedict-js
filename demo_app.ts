/**
 * Licensed  under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Application JavaScript demonstrating use of the chinesedict module

import { DictionarySource, PlainJSBuilder } from './index.js';
import { fromEvent } from 'rxjs';

console.log('Loading demo_app');

// Build and initialize the dictionary
const source = new DictionarySource('/assets/words.json',
    'Demo Dictionary',
	'Just for a demo, see instrucitons for building a full dictionary')
const builder = new PlainJSBuilder([source],
                                   '.textbody',
                                   'dict-dialog',
                                   'all');
const dictView = builder.buildDictionary();

// Add some HTML elements that use the dictionary API to look up terms
const button = <HTMLElement>document.querySelector('#lookup_button');
const tf = <HTMLInputElement>document.querySelector('#lookup_input');
const pSpan = <HTMLElement>document.querySelector('#pinyin_span');
const eSpan = <HTMLElement>document.querySelector('#english_span');

// Lookup a value in the dictionary
fromEvent(button, 'click')
  .subscribe(() => {
  	const term = dictView.lookup(tf.value);
  	console.log(`Value: ${ tf.value }`);
    const entry = term.getEntries()[0];
  	pSpan.innerHTML = entry.getPinyin();
  	eSpan.innerHTML = entry.getEnglish();
  });