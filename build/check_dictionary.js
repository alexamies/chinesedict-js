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
 * Check that the protobuf dictionary file was saved correctly.
 */

 'use strict';

const fs = require('fs');
var words = require('./words.json');

const filename = 'words.json';
console.log(`Read ${words.length} entries`);

/**
 * Read the dictionary file
 * @param {!string} filename - The name of the JSON file to deserialize
 * @return {Array.<Array.<String>>} The deserialized dictionary terms
 */
function read_dict(filename) {
  console.log('Reading the dictionary JSON file');
  const bytes = fs.readFile(filename, (err, data) => {
    if (err) {
      console.log(`Error reading dictionary file: ${err}`);
    } else {
      return JSON.parse(bytes);
    }
  });
}