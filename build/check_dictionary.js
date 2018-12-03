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
 * Check that the protobuf dictionary file was saved correctly.
 */

const fs = require('fs');
const chinesedict_pb = require('../chinesedict_pb.js');

read_dict()

/**
 * Read the dictionary file
 */
function read_dict() {
  console.log('Reading the proto file');
  const filename = 'words.pb';
  const bytes = fs.readFile(filename, (err, data) => {
    if (err) {
      console.log(`Error reading dictionary file: ${err}`);
    } else {
      const dict = new chinesedict_pb.Dictionary.deserializeBinary(data);
      const entries = dict.getEntriesList();
      console.log(`Read ${entries.length} from ${filename}`);
      const trad1 = entries[0].getTraditional();
      console.log(`First entry ${trad1}`);
    }
  });
}