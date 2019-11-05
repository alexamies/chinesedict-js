import { fromEvent } from 'rxjs';
import { MDCRipple } from '@material/ripple/index';
import { MDCDialog } from "@material/dialog";
import { DictionarySource, PlainJSBuilder } from '@alexamies/chinesedict-js';

const ripple = new MDCRipple(document.querySelector('.my-button'));

const source = new DictionarySource('/words.json',
                                    'Demo Dictionary',
                                    'Just for a demo');
const builder = new PlainJSBuilder([source], '', '', 'all');
const dictView = builder.buildDictionary(); 

const button = document.querySelector('#lookup_button');
const tf = document.querySelector('#lookup_input');
const cSpan = document.querySelector('#chinese_span');
const pSpan = document.querySelector('#pinyin_span');
const eSpan = document.querySelector('#english_span');
const document_text = document.querySelector('#document_text');
const target_text = document.querySelector('#target_text');
const dialogDiv = document.querySelector("#CnotesVocabDialog")
const wordDialog = new MDCDialog(dialogDiv);

/**
 * Respond to a button click
 */
fromEvent(button, 'click')
    .subscribe(() => {
    document_text.style.display = "none";
    const term = dictView.lookup(tf.value);
    console.log(`Value: ${tf.value}`);
    const entry = term.getEntries()[0];
    cSpan.innerHTML = tf.value;
    pSpan.innerHTML = entry.getPinyin();
    eSpan.innerHTML = entry.getEnglish();
});


/**
 * Respond to a text click
 */
fromEvent(target_text, 'click')
    .subscribe(() => {
    showVocabDialog();
});


/** Shows the vocabular dialog with details of the given word
 * @param {MDCDialog} dialog - The dialog object shown
 * @param {string} link - The link element to extract the word details from
 */
function showVocabDialog() {
  const titleElem = document.querySelector("#VocabDialogTitle");
  const chinese = target_text.textContent;
  const term = dictView.lookup(chinese);
  console.log(`Value: ${chinese}`);
  const entry = term.getEntries()[0];
  const pinyin = entry.getPinyin();
  const english = entry.getEnglish();
  let pinyinSpan = document.querySelector("#PinyinSpan");
  let englishSpan = document.querySelector("#EnglishSpan");
  titleElem.innerHTML = chinese;
  pinyinSpan.innerHTML = pinyin;
  if (english) {
    englishSpan.innerHTML = english;
  } else {
    englishSpan.innerHTML = "";
  }
  wordDialog.open();
}
