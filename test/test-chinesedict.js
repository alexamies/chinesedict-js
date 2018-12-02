// Mocha tests

const assert = require('assert');
const jsdom = require("jsdom");
const ChineseDict = require('../chinesedict.js');

const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Title</p>`);
global.document = dom.window.document;

describe('ChineseDict', function() {
  describe('#new()', function() {
    it('Trivial case', function() {
      new ChineseDict('', '');
    });
  });
});

describe('ChineseDict', function() {
  describe('#segment_text_()', function() {
    it('No headwords', function() {
      const dict = new ChineseDict('', '');
      const segments = dict.segment_text_('在哪裡？');
      assert.equal(segments.length, 4);
    });
  });
});