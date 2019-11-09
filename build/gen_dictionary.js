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
 * A Nodejs utility to generate a dictionary file from a tab separated variable
 * Chinese Notes or CC-CEDICT format and save as JSON for consumption by the
 * chinesedict-js JavaScript browser client.
 */

'use strict';

const argv = require('yargs').argv
const assert = require('assert');
const fs = require('fs');
const parse = require('csv-parse');

/**
 * Parse the dictionary tab separated variable file and generate JSON for the
 *
 * Assumes that the TSV file is in NTI Reader format
 *
 * @param {!string} tsvfile - The name of the TSV file to parse
 * @param {!string} topic - The name of the topic to restrict entries to
 */
function gen_dict(tsvfile, topic) {
  console.log(`Parsing tsv dictionary file ${tsvfile}`);
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
 * Write a line of the NTI Reader dictionary to JSON
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
    let notes = rec[14];
    if (notes == '\\N') {
      notes = '';
    }
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
      let n = '';
      if (notes !== '\\N') {
        n = `"n":"${notes}",`;
      }
      jsonData += `{"s":"${simplified}",${t}${p}${e}${g}${n}"h":"${headword}"}`;
      if (i < (data.length - 1)) {
        jsonData += ',\n'
      }
      n++;
    }
  }
  jsonData += ']'

  const filename = 'ntireader.json';
  fs.writeFile(filename, jsonData, (err) => {
    if (err) {
      console.log(`Error saving dictionary: ${err}`);
    }
  });
  console.log(`Wrote ${n} terms to ${filename}`);
}

// Entry point from the command line
let filename = 'build/words.tsv';
if (argv._.length > 0) {
  filename = argv._[0];
}
let topic = '';
if ((typeof argv.topic !== 'undefined') && (argv.topic.length > 0)) {
  topic = argv.topic;
}

// A TSV file in Chinese Notes / NTI Reader format
gen_dict(filename, argv.topic)
