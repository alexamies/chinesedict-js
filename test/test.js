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

/**
 * Browser-based Mocha unit tests
 */

import { assert } from 'chai';
import { DictionaryCollection,
         DictionaryEntry,
	       DictionaryLoader,
	       DictionarySource,
	       DictionaryView,
	       PlainJSBuilder,
	       Term,
	       TextParser,
	       WordSense } from '@alexamies/chinesedict-js';

console.log('Running unit tests');

const source = new DictionarySource('/assets/words.json',
                                     'Test dictionary',
                                     'For testing purposes');
const traditional = '他';
const hwid = '518';
const pinyin = 'tā';
const english = 'other, another, some other';
const grammar = 'noun';
const notes = '';
const ws = new WordSense(traditional,
                         traditional,
                         pinyin,
                         english,
                         grammar,
                         notes);
const simplified1 = '长';
const traditional1 = '長';
const pinyin1 = 'zhǎng';
const english1 = 'chief';
const grammar1 = 'noun';
const ws1 = new WordSense(simplified1,
                          traditional1,
                          pinyin1,
                          english1,
                          grammar1,
                          notes);
const pinyin2 = 'cháng';
const english2 = 'long';
const grammar2 = 'adjective';
const ws2 = new WordSense(simplified1,
                          traditional1,
                          pinyin2,
                          english2,
                          grammar2,
                          notes);
const simplified3 = '台';
const traditional3 = '台';
const pinyin3 = 'tái';
const english3 = 'platform';
const grammar3 = 'noun';
const ws3 = new WordSense(simplified3,
                          traditional3,
                          pinyin3,
                          english3,
                          grammar3,
                          notes);
const simplified4 = '台';
const traditional4 = '臺';
const pinyin4 = 'tái';
const english4 = 'platform';
const grammar4 = 'noun';
const ws4 = new WordSense(simplified4,
                          traditional4,
                          pinyin4,
                          english4,
                          grammar4,
                          notes);
const simplified5 = '台';
const traditional5 = '檯';
const pinyin5 = 'tái';
const english5 = 'platform';
const grammar5 = 'noun';
const ws5 = new WordSense(simplified5,
                          traditional5,
                          pinyin5,
                          english5,
                          grammar5,
                          notes);
const simplified6 = '台';
const traditional6 = '颱';
const pinyin6 = 'tái';
const english6 = 'typhoon';
const grammar6 = 'noun';
const ws6 = new WordSense(simplified6,
                          traditional6,
                          pinyin6,
                          english6,
                          grammar6,
                          notes);
const simplified7 = '四面八方';
const traditional7 = '四面八方';
const pinyin7 = 'sìmiànbāfāng';
const english7 = 'in all directions, all around/far and near';
const grammar7 = '';
const ws7 = new WordSense(simplified7,
                          traditional7,
                          pinyin7,
                          english7,
                          grammar7,
                          notes);

describe('TextParser', function() {
  describe('#segmentExludeWhole', function() {
    it('Parse text 他力 into two terms', function(done) {
      const dictionaries = new DictionaryCollection();
      const loader = new DictionaryLoader([source], dictionaries);
      const observable = loader.loadDictionaries();
      observable.subscribe(
        () => {
          const parser = new TextParser(dictionaries);
          const terms = parser.segmentExludeWhole('他力');
          assert.equal(terms.length, 2);
          terms.forEach((t) => {
            const entries = t.getEntries();
            assert(entries, "entries is defined");
            assert(entries.length > 0, "entries has some elements");
            entries.forEach((entry) => {
              assert(entry.getPinyin(), "pinyin is not empty");
            });
          });
          done();
        },
        (err) => { done(err); },
      );
    });
  });
  describe('#segmentText', function() {
    it('Parse text 他力 into one term', function(done) {
      const dictionaries = new DictionaryCollection();
      const loader = new DictionaryLoader([source], dictionaries);
      const observable = loader.loadDictionaries();
      observable.subscribe(
        () => {
          const parser = new TextParser(dictionaries);
          const terms = parser.segmentText('他力');
          assert.equal(terms.length, 1);
          done();
        },
        (err) => { done(err); },
      );
    });
  });
});
