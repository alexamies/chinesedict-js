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
// Application JavaScript demonstrating extending the chinesedict module
import { BasicDictionaryBuilder, DictionaryViewConfig, DictionarySource } from '@alexamies/chinesedict-js';
console.log('Loading demo_extend_app');
// Build and initialize the dictionary
const source = new DictionarySource('/assets/ntireader.json', 'NTI Reader Dictionary', 'Creative Commons Attribution-Share Alike 3.0 License (CCASE 3.0).');
const config = new DictionaryViewConfig();
const builder = new BasicDictionaryBuilder([source], config);
const dictView = builder.buildDictionary();
