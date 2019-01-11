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

const fs = require('fs');
const re = new RegExp('( \\[|\\] /|/$)', 'u');
const vowelRe = new RegExp('(a|e|i|o|u|u:|A|E|I|O|U|U:){0,3}(m|n|ng|r|xx)?[1-5]', 'u');
const readline = require('readline');
const repl = require('repl');
const argv = require('yargs').argv

// Pinyin conversion from numbered format
const pMap = new Map();
pMap.set('a1', 'ā');
pMap.set('a2', 'á');
pMap.set('a3', 'ǎ');
pMap.set('a4', 'à');
pMap.set('a5', 'a');
pMap.set('ai1', 'āi');
pMap.set('ai2', 'ái');
pMap.set('ai3', 'ǎi');
pMap.set('ai4', 'ài');
pMap.set('ai5', 'ai');
pMap.set('an1', 'ān');
pMap.set('an2', 'án');
pMap.set('an3', 'ǎn');
pMap.set('an4', 'àn');
pMap.set('an5', 'an');
pMap.set('ang1', 'āng');
pMap.set('ang2', 'áng');
pMap.set('ang3', 'ǎng');
pMap.set('ang4', 'àng');
pMap.set('ang5', 'ang');
pMap.set('ao1', 'āo');
pMap.set('ao2', 'áo');
pMap.set('ao3', 'ǎo');
pMap.set('ao4', 'ào');
pMap.set('ao5', 'ao');
pMap.set('e1', 'ē');
pMap.set('e2', 'é');
pMap.set('e3', 'ě');
pMap.set('e4', 'è');
pMap.set('e5', 'e');
pMap.set('ei1', 'ēi');
pMap.set('ei2', 'éi');
pMap.set('ei3', 'ěi');
pMap.set('ei4', 'èi');
pMap.set('ei5', 'ei');
pMap.set('en1', 'ēn');
pMap.set('en2', 'én');
pMap.set('en3', 'ěn');
pMap.set('en4', 'èn');
pMap.set('en5', 'en');
pMap.set('eng1', 'ēng');
pMap.set('eng2', 'éng');
pMap.set('eng3', 'ěng');
pMap.set('eng4', 'èng');
pMap.set('eng5', 'eng');
pMap.set('er1', 'ēr');
pMap.set('er2', 'ér');
pMap.set('er3', 'ěr');
pMap.set('er4', 'èr');
pMap.set('er5', 'er');
pMap.set('i1', 'ī');
pMap.set('i2', 'í');
pMap.set('i3', 'ǐ');
pMap.set('i4', 'ì');
pMap.set('i5', 'i');
pMap.set('ia1', 'iā');
pMap.set('ia2', 'iá');
pMap.set('ia3', 'iǎ');
pMap.set('ia4', 'ià');
pMap.set('ia5', 'ia');
pMap.set('ian1', 'iān');
pMap.set('ian2', 'ián');
pMap.set('ian3', 'iǎn');
pMap.set('ian4', 'iàn');
pMap.set('ian5', 'ian');
pMap.set('iang1', 'iāng');
pMap.set('iang2', 'iáng');
pMap.set('iang3', 'iǎng');
pMap.set('iang4', 'iàng');
pMap.set('iang5', 'iang');
pMap.set('iao1', 'iāo');
pMap.set('iao2', 'iáo');
pMap.set('iao3', 'iǎo');
pMap.set('iao4', 'iào');
pMap.set('iao5', 'iao');
pMap.set('ie1', 'iē');
pMap.set('ie2', 'ié');
pMap.set('ie3', 'iě');
pMap.set('ie4', 'iè');
pMap.set('ie5', 'ie');
pMap.set('in1', 'īn');
pMap.set('in2', 'ín');
pMap.set('in3', 'ǐn');
pMap.set('in4', 'ìn');
pMap.set('in5', 'in');
pMap.set('ing1', 'īng');
pMap.set('ing2', 'íng');
pMap.set('ing3', 'ǐng');
pMap.set('ing4', 'ìng');
pMap.set('ing5', 'ing');
pMap.set('iong1', 'iōng');
pMap.set('iong2', 'ióng');
pMap.set('iong3', 'iǒng');
pMap.set('iong4', 'iòng');
pMap.set('iong5', 'iong');
pMap.set('iu1', 'iū');
pMap.set('iu2', 'iú');
pMap.set('iu3', 'iǔ');
pMap.set('iu4', 'iù');
pMap.set('iu5', 'iu');
pMap.set('m2', 'm');
pMap.set('m4', 'm');
pMap.set('o1', 'ōu');
pMap.set('o2', 'óu');
pMap.set('o3', 'ǒu');
pMap.set('o4', 'òu');
pMap.set('o5', 'ou');
pMap.set('ong1', 'ōng');
pMap.set('ong2', 'óng');
pMap.set('ong3', 'ǒng');
pMap.set('ong4', 'òng');
pMap.set('ong5', 'ong');
pMap.set('ou1', 'ōu');
pMap.set('ou2', 'óu');
pMap.set('ou3', 'ǒu');
pMap.set('ou4', 'òu');
pMap.set('ou5', 'ou');
pMap.set('r5', 'r');
pMap.set('u1', 'ū');
pMap.set('u2', 'ú');
pMap.set('u3', 'ǔ');
pMap.set('u4', 'ù');
pMap.set('u5', 'u');
pMap.set('u:1', 'ǖ');
pMap.set('u:2', 'ǘ');
pMap.set('u:3', 'ǚ');
pMap.set('u:4', 'ǜ');
pMap.set('u:5', 'ü');
pMap.set('ua1', 'uā');
pMap.set('ua2', 'uá');
pMap.set('ua3', 'uǎ');
pMap.set('ua4', 'uà');
pMap.set('ua5', 'ua');
pMap.set('uai1', 'uāi');
pMap.set('uai2', 'uái');
pMap.set('uai3', 'uǎi');
pMap.set('uai4', 'uài');
pMap.set('uai5', 'uai');
pMap.set('uan1', 'uān');
pMap.set('uan2', 'uán');
pMap.set('uan3', 'uǎn');
pMap.set('uan4', 'uàn');
pMap.set('uan5', 'uan');
pMap.set('uang1', 'uāng');
pMap.set('uang2', 'uáng');
pMap.set('uang3', 'uǎng');
pMap.set('uang4', 'uàng');
pMap.set('uang5', 'uang');
pMap.set('ue1', 'uē');
pMap.set('ue2', 'ué');
pMap.set('ue3', 'uě');
pMap.set('ue4', 'uè');
pMap.set('ue5', 'ue');
pMap.set('u:e1', 'üē');
pMap.set('u:e2', 'üé');
pMap.set('u:e3', 'üě');
pMap.set('u:e4', 'üè');
pMap.set('u:e5', 'e');
pMap.set('ui1', 'uī');
pMap.set('ui2', 'uí');
pMap.set('ui3', 'uǐ');
pMap.set('ui4', 'uì');
pMap.set('ui5', 'ui');
pMap.set('un1', 'ūn');
pMap.set('un2', 'ún');
pMap.set('un3', 'ǔn');
pMap.set('un4', 'ùn');
pMap.set('un5', 'un');
pMap.set('uo1', 'uō');
pMap.set('uo2', 'uó');
pMap.set('uo3', 'uǒ');
pMap.set('uo4', 'uò');
pMap.set('uo5', 'uo');
pMap.set('xx5', 'xx');

function cccedict_line(line) {
  if ((line.length > 0) && (line[0] === '#')) {
    return;
  }
  const tokens = line.split(re);
  if (!tokens) {
    console.log(`No tokens for line: ${line}`);
    return;
  }
  //console.log(`${ tokens.length } tokens found`);
  if (tokens.length < 5) {
  	console.log(`Got ${ tokens.length } tokens for ${ line }`);
  	return;
  }
  let chinese = tokens[0].split(' ');
  let t = chinese[0];
  let s = chinese[1];
  let p = convertPinyin(tokens[2]);
  let e = englishDelims(tokens[4]);
  return `{'t':'${ t }','s':'${ s }','p':'${ p }','e':'${ e }'}`;
}

/**
 * Write the entries of the CC-CEDICT dictionary to JSON
 * @param {!string} jsonData - String form of the JSON object
 */
function cccedict_write_json(jsonData) {
  const filename = 'assets/cccedict.json';
  console.log(`Writing ${ jsonData.length } characters to ${ filename }`);
  fs.writeFileSync(filename, jsonData, (err) => {
    if (err) {
      console.log(`Error saving CCCEDICT to JSON: ${err}`);
    }
  });
}

/**
 * Convert number based pinyin to use accents
 */
function convertPinyin(pNum) {
  const syllables = pNum.split(' ');
  let pinyin = '';
  for (let syllable of syllables) {
    const info = syllable.match(vowelRe);
    if (!info) {
  	  //console.log(`No medial match for '${ syllable }', pNum = ${ pNum }`);
  	  pinyin += syllable;
  	  continue;
    }
    const final = info[0].toLowerCase();
    const i = info['index'];
    const initial = syllable.substring(0, i);
    //console.log(`Pinyin match for '${ final }' at ${ i } with initial ${ initial }'`);
    if (pMap.has(final)) {
  	  let medialAccent = pMap.get(final);
  	  pinyin += initial + pMap.get(final);
    } else {
      console.log(`pMap does not have final '${ final }, for syllable '${ syllable }''`);
      pinyin += syllable;
    }
  }
  return pinyin;
}

/**
 * Convert '/' in English to ', '
 */
function englishDelims(englishSlash) {
  return englishSlash.replace('/', ', ')
}


/**
 * Parse the CC-CEDICT text file and generate JSON.
 *
 * Assumes that the text file is in CC-CEDICT format
 *
 * @param {!string} filename - The name of the file to parse
 */
function gen_cccedict(filename) {
  console.log(`Parsing CC-CEDICT dictionary file ${filename}`);
  let entries = '';
  let lc = 0;
  const rl = readline.createInterface({
    input: fs.createReadStream(filename),
    crlfDelay: Infinity
  });
  rl.on('line', (line) => {
    lc++;
    let data = cccedict_line(line);
    if (data) {
      if (entries) {
        entries += ',';
      }
      entries += data;
    }
  });
  rl.on('close', (line) => {
    console.log(`\nRead ${ lc } lines of the CC-CEDICT file`);
    cccedict_write_json(entries);
    process.exit();
  });
  repl.start({
    prompt: 'processing ...',
    replMode: repl.REPL_MODE_STRICT
  });
}

function test() {
  const line1 = '㒸 㒸 [sui4] /archaic variant of 遂[sui4]/';
  console.log(`Line 1: ${ line1 }`)
  const jsonStr1 = cccedict_line(line1)
  console.log(jsonStr1);

  const line2 = '三 三 [san1] /three/3/';
  console.log(`Line 2: ${ line2 }`)
  const jsonStr2 = cccedict_line(line2)
  console.log(jsonStr2);

  const line3 = '三角 三角 [san1 jiao3] /triangle/';
  console.log(`Line 3: ${ line3 }`)
  const jsonStr3 = cccedict_line(line3)
  console.log(jsonStr3);

  const line4 = '三角形 三角形 [san1 jiao3 xing2] /triangle/';
  console.log(`Line 4: ${ line4 }`)
  const jsonStr4 = cccedict_line(line4)
  console.log(jsonStr4);

  const line5 = '三論宗 三论宗 [San1 lun4 zong1] /Three Treatise School (Buddhism)/'
  console.log(`Line 5: ${ line5 }`)
  const jsonStr5 = cccedict_line(line5)
  console.log(jsonStr5);
}

let filename = 'cedict_ts.u8';
if (argv._.length > 0) {
  filename = argv._[0];
}
gen_cccedict(filename)