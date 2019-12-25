/*
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
  * @fileoverview Unit tests for DictionaryEntry
  */

import { DictionaryEntry } from "../src/DictionaryEntry";
import { DictionarySource } from "../src/DictionarySource";
import { WordSense } from "../src/WordSense";
import {} from "jasmine";

const source = new DictionarySource('/assets/words.json',
                                     'Test dictionary',
                                     'For testing purposes');
const simplified = '他';
const traditional = '他';
const hwid = '518';
const pinyin = 'tā';
const english = 'other, another, some other';
const grammar = 'noun';
const notes = '';
const ws = new WordSense(simplified,
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

describe('DictionaryEntry', () => {
  describe('#addWordSense', () => {
    it('Add a word sense to headword 他', () => {
      const entry = new DictionaryEntry(traditional, source, [], hwid);
      entry.addWordSense(ws);
      const senses = entry.getSenses();
      expect(senses.length).toEqual(1);
    });
  });
  describe('#getChinese', () => {
    it('Get the Chinese when the simplified and trad are the same', () => {
      const entry = new DictionaryEntry(traditional, source, [ws], hwid);
      expect(entry.getChinese()).toEqual(ws.getSimplified());
    });
    it('Get the Chinese when there are variants', () => {
      const hwid = '821';
      const entry = new DictionaryEntry(traditional,
                                        source,
                                        [ws3, ws4, ws5, ws6],
                                        hwid);
      const expected = '台（台、臺、檯、颱）';
      expect(entry.getChinese()).toEqual(expected);
    });
  });
  describe('#getEnglish', () => {
    it('Get the English equivalent when there is one sense', () => {
      const entry = new DictionaryEntry(traditional, source, [ws], hwid);
      expect(entry.getEnglish()).toEqual(english);
    });
    it('Get the English equivalent when there are multiple senses', () => {
      const hwid = '1322';
      const entry = new DictionaryEntry(traditional, source, [ws1, ws2], hwid);
      const expected = 'chief; long';
      expect(entry.getEnglish()).toEqual(expected);
    });
    it('Get the English equivalent when there are / delimiters', () => {
      const hwid = '1322';
      const entry = new DictionaryEntry(traditional, source, [ws7], hwid);
      const expected = 'in all directions, all around, far and near';
      expect(entry.getEnglish()).toEqual(expected);
    });
  });
  describe('#getPinyin', () => {
    it('Get the pinyin when there is one pronunciation', () => {
      const hwid = '1322';
      const entry = new DictionaryEntry(traditional, source, [ws], hwid);
      expect(entry.getPinyin()).toEqual(pinyin);
    });
    it('Get the pinyin when there are two pronunciations', () => {
      const hwid = '1322';
      const entry = new DictionaryEntry(traditional, source, [ws1, ws2], hwid);
      const expected = 'zhǎng, cháng';
      expect(entry.getPinyin()).toEqual(expected);
    });
  });
  describe('#getSimplified', () => {
    it('Get the simplfied Chinese when there is only one variant', () => {
      const hwid = '1322';
      const entry = new DictionaryEntry(traditional, source, [ws], hwid);
      const expected = ws.getSimplified();
      expect(entry.getSimplified()).toEqual(expected);
    });
    it('Get the simplfied Chinese when there are trad variants', () => {
      const hwid = '821';
      const entry = new DictionaryEntry(traditional,
                                        source,
                                        [ws3, ws4, ws5, ws6],
                                        hwid);
      //const traditional = '台、臺、檯、颱';
      const expected = '台';
      expect(entry.getSimplified()).toEqual(expected);
    });
  });
  describe('#getTraditional', () => {
    it('Get the traditional Chinese when there is only one variant', () => {
      const hwid = '1322';
      const entry = new DictionaryEntry(traditional, source, [ws], hwid);
      const expected = ws.getTraditional();
      expect(entry.getTraditional()).toEqual(expected);
    });
    it('Get the traditional Chinese when there are many variants', () => {
      const hwid = '821';
      const entry = new DictionaryEntry(traditional,
                                        source,
                                        [ws3, ws4, ws5, ws6],
                                        hwid);
      const expected = '台、臺、檯、颱';
      expect(entry.getTraditional()).toEqual(expected);
    });
  });
});