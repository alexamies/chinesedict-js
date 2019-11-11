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
import { DictionaryEntry,
	       DictionaryLoader,
	       DictionarySource,
	       DictionaryView,
	       PlainJSBuilder,
	       Term,
	       TextParser,
	       WordSense } from '@alexamies/chinesedict-js';

console.log('Running unit tests');

describe('DictionaryCollection', function() {
  describe('#has', function() {
    it('Small dictionary has term 夫家', function(done) {
      const source = new DictionarySource('../assets/words.json',
                                        'Test dictionary',
                                        'For testing purposes');
      const loader = new DictionaryLoader([source]);
      const observable = loader.loadDictionaries();
      observable.subscribe({
        error(err) { done(err); },
        complete() {
      	  const dictionaries = loader.getDictionaryCollection();
          assert.equal(dictionaries.has('夫家'), true);
          done();
        }
      });
    });
  });
  describe('#isLoaded', function() {
    it('Small dictionary has correct loaded status', function(done) {
      const source = new DictionarySource('../assets/words.json',
                                        'Test dictionary',
                                        'For testing purposes');
      const loader = new DictionaryLoader([source]);
      const observable = loader.loadDictionaries();
      observable.subscribe({
        error(err) { done(err); },
        complete() {
      	  const dictionaries = loader.getDictionaryCollection();
          assert.equal(dictionaries.isLoaded(), true);
          done();
        }
      });
    });
  });
  describe('#lookup', function() {
    it('Term 夫家 can be looked up in small dictionary', function(done) {
      const source = new DictionarySource('../assets/words.json',
                                        'Test dictionary',
                                        'For testing purposes');
      const loader = new DictionaryLoader([source]);
      const observable = loader.loadDictionaries();
      observable.subscribe({
        error(err) { done(err); },
        complete() {
      	  const dictionaries = loader.getDictionaryCollection();
      	  const headword = '夫家';
      	  const term = dictionaries.lookup(headword);
          assert.equal(term.getChinese(), headword);
          done();
        }
      });
    });
  });
});

describe('DictionaryEntry', function() {
  describe('#addWordSense', function() {
    it('Add a word sense to headword 他', function() {
      const source = new DictionarySource('../assets/words.json',
                                        'Test dictionary',
                                        'For testing purposes');
      const traditional = '他';
      const hwid = '518';
      const pinyin = 'tā';
      const english = 'other / another / some other';
      const grammar = 'noun';
      const notes = '';
      const entry = new DictionaryEntry(traditional, source, [], hwid);
      const ws = new WordSense(traditional,
                               traditional,
                               pinyin,
                               english,
                               grammar,
                               notes);
      entry.addWordSense(ws);
      const senses = entry.getSenses();
      assert.equal(senses.length, 1);
    });
  });
});

describe('DictionaryLoader', function() {
  describe('#has', function() {
    it('Small dictionary is loaded and includes 力', function(done) {
      const source = new DictionarySource('../assets/words.json',
                                        'Test dictionary',
                                        'For testing purposes');
      const loader = new DictionaryLoader([source]);
      const observable = loader.loadDictionaries();
      observable.subscribe({
        error(err) { done(err); },
        complete() {
      	  const dictionaries = loader.getDictionaryCollection();
          assert.equal(dictionaries.has('力'), true);
          done();
        }
      });
    });
  });
  describe('#loadDictionaries', function() {
    it('Multiple dictionaries loaded', function(done) {
      const s1 = new DictionarySource('../assets/cccedict_sample.json',
                                        'CC-CEDICT Sample',
                                        'For testing multple dictionaries');
      const s2 = new DictionarySource('../assets/words.json',
                                        'Test dictionary',
                                        'For testing purposes');
      const loader = new DictionaryLoader([s1, s2]);
      const observable = loader.loadDictionaries();
      observable.subscribe({
        error(err) { done(err); },
        complete() {
      	  const dictionaries = loader.getDictionaryCollection();
          assert.equal(dictionaries.has('四面'), true);
          assert.equal(dictionaries.has('力'), true);
          done();
        }
      });
    });
  });
});

describe('DictionarySource', function() {
  it('filename should be set properly', function() {
  	const filename = 'test.json'
    const source = new DictionarySource(filename,
                       'Test Dictionary',
                       'A test dictionary');
    assert.equal(source.filename, filename);
  });
});

describe('DictionaryView', function() {
  describe('#lookup', function() {
    it('Can lookup a term in the test dictionary if loaded', function() {
      const source = new DictionarySource('../assets/words.json',
                                      'Test dictionary',
                                      'For testing purposes');
      const builder = new PlainJSBuilder([source],
                                   '.textbody',
                                   'dict-dialog',
                                   'all');
      const dictView = builder.buildDictionary();
      const chinese = '夫家';
      const term = dictView.lookup(chinese);
      console.log(`dictView.isLoaded() ${ dictView.isLoaded() }`);
      if (dictView.isLoaded()) {
        assert.equal(1, term.getEntries().length);
        const entry = term.getEntries()[0];
        assert.equal(entry.getPinyin(), 'fūjiā');
      }
    });
  });
});

describe('PlainJSBuilder', function() {
  describe('#buildDictionary', function() {
    it('Should execute without errors', function() {
      const source = new DictionarySource('../assets/words.json',
                                      'Test dictionary',
                                      'For testing purposes');
      const builder = new PlainJSBuilder([source],
                                   '.textbody',
                                   'dict-dialog',
                                   'all');
      builder.buildDictionary();
    });
  });
});

describe('Term', function() {
  describe('#getEntries', function() {
    it('filename should be set properly', function() {
      const source = new DictionarySource('../assets/words.json',
                                      'Test dictionary',
                                      'For testing purposes');
      const traditional = '他';
      const hwid = '518';
      const pinyin = 'tā';
      const english = 'other / another / some other';
      const grammar = 'noun';
      const notes = '';
      const entry = new DictionaryEntry(traditional, source, [], hwid);
      const term = new Term(traditional, [entry]);
      assert.equal(term.getEntries().length, 1);
    });
  });
});

describe('TextParser', function() {
  describe('#segmentExludeWhole', function() {
    it('Parse text 他力 into two terms', function(done) {
      const source = new DictionarySource('../assets/words.json',
                                        'Test dictionary',
                                        'For testing purposes');
      const loader = new DictionaryLoader([source]);
      const observable = loader.loadDictionaries();
      observable.subscribe({
        error(err) { done(err); },
        complete() {
      	  const dictionaries = loader.getDictionaryCollection();
          const parser = new TextParser(dictionaries);
          const terms = parser.segmentExludeWhole('他力');
          assert.equal(terms.length, 2);
          done();
        }
      });
    });
  });
  describe('#segmentText', function() {
    it('Parse text 他力 into one term', function(done) {
      const source = new DictionarySource('../assets/words.json',
                                        'Test dictionary',
                                        'For testing purposes');
      const loader = new DictionaryLoader([source]);
      const observable = loader.loadDictionaries();
      observable.subscribe({
        error(err) { done(err); },
        complete() {
      	  const dictionaries = loader.getDictionaryCollection();
          const parser = new TextParser(dictionaries);
          const terms = parser.segmentText('他力');
          assert.equal(terms.length, 1);
          done();
        }
      });
    });
  });
});
