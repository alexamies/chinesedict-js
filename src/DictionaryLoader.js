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
import { AjaxDataLoader } from "./AjaxDataLoader";
import { DictionaryLoaderHelper } from "./DictionaryLoaderHelper";
import { Observable, of } from "rxjs";
/**
 * Loads the dictionaries from source files.
 */
export class DictionaryLoader {
    /**
     * Create an empty DictionaryLoader instance
     *
     * @param {string} sources - Names of the dictionary files
     * @param {DictionaryCollection} dictionaries - To load the data into
     * @param {boolean} indexSimplified - Whether to index by Simplified
     * @param {IDataLoader} dataLoader - Where to load data from, default AJAX
     */
    constructor(sources, dictionaries, indexSimplified = false, dataLoader = null) {
        console.log("DictionaryLoader constructor");
        this.sources = sources;
        this.headwords = new Map();
        this.dictionaries = dictionaries;
        this.indexSimplified = indexSimplified;
        if (dataLoader !== null) {
            this.dataLoader = dataLoader;
        }
        else {
            this.dataLoader = new AjaxDataLoader();
        }
    }
    /**
     * Returns an Observable that will complete on loading all the dictionaries
     * @return {Observable} will complete after loading
     */
    loadDictionaries() {
        console.log("loadDictionaries enter");
        const observable = new Observable((subscriber) => {
            const sources = this.sources;
            let numLoaded = 0;
            for (const source of sources) {
                const filename = source.filename;
                console.log(`loadDictionaries loading ${filename}`);
                if (filename) {
                    const reqObs = this.dataLoader.getObservable(filename);
                    const subscribe = reqObs.subscribe((res) => {
                        console.log(`loadDictionaries: for ${filename}`);
                        const helper = new DictionaryLoaderHelper();
                        helper.loadDictionary(source, res, this.headwords, this.indexSimplified);
                        numLoaded++;
                        if (numLoaded >= sources.length) {
                            console.log(`loadDictionaries: ${this.headwords.size} terms`);
                            this.dictionaries.setHeadwords(this.headwords);
                            subscriber.next(numLoaded);
                            subscriber.complete();
                        }
                    }, (error) => {
                        console.log(`Error fetching dictionary: ${error}`);
                        subscriber.next(error);
                        return of(error);
                    });
                }
                else {
                    subscriber.next("Error no filename provided");
                }
            }
        });
        return observable;
    }
}
