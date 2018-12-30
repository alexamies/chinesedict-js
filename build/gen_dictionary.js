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
 * @fileoverview
 * A Nodejs utility to generate a dictionary file in tab separated variable and
 * save as JSON.
 */

'use strict';

const assert = require('assert');
const argv = require('yargs').argv
const fs = require('fs');
const parse = require('csv-parse');

let tsvfile = 'words.tsv';
if (argv._.length > 0) {
  tsvfile = argv._[0];
}
let topic = '';
if ((typeof argv.topic !== 'undefined') && (argv.topic.length > 0)) {
  topic = argv.topic;
}

gen_dict(tsvfile, argv.topic)

/**
 * Parse the dictionary tab separated variable file and generate the protobuf
 * file.
 * @param {!string} tsvfile - The name of the TSV file to parse
 * @param {!string} topic - The name of the topic to restrict entries to
 */
function gen_dict(tsvfile, topic) {
  console.log(`Parsing tsv dictionary file - ${tsvfile}`);
  const parser = parse({
    delimiter: '\t',
    comment: '#'
    }, function(err, data){
    if (err) {
      console.log(`Error parsing TSV file: ${err}`);
      return;
    }
    write_json(data, topic);
  });
  fs.createReadStream(tsvfile).pipe(parser);
}

/**
 * Write to JSON
 * @param {!Array.<Array.<string>>} data - The parsed TSV data
 * @param {!string} topic - The name of the topic to restrict entries to
 */
function write_json(data, topic_en) {
  console.log(`Generating dictionary file ${topic}`);
  const entries = [];
  let jsonData = '[';
  let n = 0;
  for (let i = 0; i < data.length; i++) {
  	const rec = data[i];
  	assert(rec.length == 16,
  		   `Wrong number of columns in row ${i}, cols: ${rec.length}`)
  	const luid = rec[0];
    const simplified = rec[1];
    let traditional = rec[2];
    const pinyin = rec[3];
    const english = rec[4];
    const grammar = rec[5];
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
    //console.log(`simplified: ${simplified}, traditional ${traditional}`);
    if ((topic === '') || (topic_en === topic)) {
      let t = `"t":"${traditional}",`;
      if (traditional === '\\N') {
        t = `"t":"${simplified}",`;
      }
      let e = '';
      if (english !== '\\N') {
        e = `"e":"${english}",`;
      }
      let p = '';
      if (pinyin !== '\\N') {
        p = `"p":"${pinyin}",`;
      }
      let g = '';
      if (grammar !== '\\N') {
        g = `"g":"${grammar}",`;
      }
      jsonData += `{"s":"${simplified}",${t}${p}${e}${g}"h":"${headword}"}`;
      if (i < (data.length - 1)) {
        jsonData += ',\n'
      }
      n++;
    }
  }
  jsonData += ']'

  const filename = 'words.json';
  fs.writeFile(filename, jsonData, (err) => {
    if (err) {
      console.log(`Error saving dictionary: ${err}`);
    }
  });
  console.log(`Wrote ${n} terms to ${filename}`);
}