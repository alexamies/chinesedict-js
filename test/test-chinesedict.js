const assert = require('assert');
const ChineseDict = require('../chinesedict.js');

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