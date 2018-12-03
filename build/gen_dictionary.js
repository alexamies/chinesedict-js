/**
 *  @license
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
 * @fileoverview
 * A Nodejs utility to generate a dictionary file in tab separated variable and
 * save as protobuf3.
 */

const assert = require('assert');
const fs = require('fs');
const parse = require('csv-parse');
const chinesedict_pb = require('../chinesedict_pb.js');

parse_dict()

/**
 * Parse the dictionary tab separated variable file
 */
function parse_dict() {
  console.log('Parsing tsv dictionary file');
  const parser = parse({delimiter: '\t'}, function(err, data){
    write_proto(data);
  });
  fs.createReadStream('words.tsv').pipe(parser);
}

/**
 * Write to protobuf
 */
function write_proto(data) {
  console.log('Generating dictionary file');
  const entries = [];
  for (let i = 0; i < data.length; i++) {
  	const rec = data[i];
  	assert(rec.length == 16,
  		   `Wrong number of columns in row ${i}, cols: ${rec.length}`)
  	const luid = rec[0];
    const simplified = rec[1];
    let traditional = rec[2];
    const pinyin = rec[3];
    const english = rec[4];
    const pos = rec[5];
    const concept_cn = rec[6];
    const concept_en = rec[7];
    const topic_cn = rec[8];
    const topic_en = rec[9];
    const parent_cn = rec[10];
    const parent_en = rec[11];
    const image = rec[12];
    const mp3 = rec[13];
    const notes = rec[14];
    const headword = rec[15];
    if (traditional == '\\N') {
      traditional = simplified;
    }
    console.log(`simplified: ${simplified}, traditional ${traditional}`);
    const entry = new chinesedict_pb.Dictionary.Entry();
    entry.setHeadwordId(headword);
    entry.setSimplified(simplified);
    entry.setTraditional(traditional);
    entry.setPinyin(pinyin);
    entry.setEnglish(english);
    entry.setPos(pos);
    entry.setConceptCn(concept_cn);
    entry.setConceptEn(concept_en);
    entry.setTopicCn(topic_cn);
    entry.setTopicEn(topic_en);
    entry.setParentCn(parent_cn);
    entry.setParentEn(parent_en);
    entry.setImage(image);
    entry.setMp3(mp3);
    entry.setNotes(notes);
    entry.setLuid(luid);
    entries.push(entry);
  }
  const dict = new chinesedict_pb.Dictionary();
  dict.setEntriesList(entries);

  const bytes = dict.serializeBinary();
  const filename = 'words.pb';
  fs.writeFile(filename, bytes, (err) => {
    if (err) {
      console.log(`Error saving dictionary: ${err}`);
    }
  });
  console.log(`Wrote ${entries.length} to ${filename}`);
}