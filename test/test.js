/* eslint-env mocha */

var postcss = require('postcss');
var expect = require('chai').expect;

var plugin = require('../');

var testProcess = function (input, output, opts) {
  expect(postcss(plugin(opts)).process(input).css).to.eql(output);
};

var input = 'a{ decl: value; }';

var multilineText = [
  '',
  'multi',
  'line',
  'comment'
].join('\n');

var multilineResult = '' +
  '/*\n' +
  ' * multi\n' +
  ' * line\n' +
  ' * comment\n' +
  ' */';

describe('postcss-banner', function () {
  describe('banner', function () {
    it('should add banner', function () {
      testProcess(input, '/*\n * LOL\n */\na{ decl: value; }', {banner: '\nLOL'});
    });

    it('should render the comment inline', function () {
      testProcess(input, '/* LOL */\na{ decl: value; }', {banner: ' LOL ', inline: true});
    });

    it('should add multiline banner', function () {
      testProcess(input, multilineResult + '\na{ decl: value; }', {banner: multilineText});
    });
  });

  describe('footer', function () {
    it('should add footer', function () {
      testProcess(input, 'a{ decl: value; }\n/*\n * LOL\n */', {footer: '\nLOL'});
    });

    it('should add footer inline', function () {
      testProcess(input, '/* LOL */\na{ decl: value; }', {banner: ' LOL ', inline: true});
    });

    it('should add multiline footer', function () {
      testProcess(input, 'a{ decl: value; }\n' + multilineResult, {footer: multilineText});
    });
  });

  describe('both', function () {
    it('should add banner and footer', function () {
      testProcess(input, '/*\n * banner\n */\na{ decl: value; }\n/*\n * footer\n */', {
        footer: '\nfooter',
        banner: '\nbanner'
      });
    });

    it('should convert values to string', function () {
      testProcess(input, '/*undefined*/\na{ decl: value; }\n/*undefined*/', {
        banner: undefined,
        footer: undefined,
        inline: true
      });
    });

    it('should ignore not set values', function () {
      testProcess(input, input, {});
    });
  });
});
