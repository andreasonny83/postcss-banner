var postcss = require('postcss');

module.exports = postcss.plugin('postcss-banner', function configure(opts) {
  opts = opts || {};

  function process(value) {
    var text = String(value);
    var comment = text;

    if (!opts.inline) {
      comment = text.split('\n')
        .join('\n * ')
        .concat('\n ');
    }

    comment = ['/*', comment, '*/'].join('');

    return comment;
  }

  return function andBanner(css) {
    if ('banner' in opts) {
      css.prepend(process(opts.banner));

      // New line after banner
      if (css.nodes[1]) {
        css.nodes[1].raws.before = '\n';
      }
    }

    if ('footer' in opts) {
      var footer = process(opts.footer);
      css.append(footer);
      css.nodes[css.nodes.length - 1].raws.before = '\n';
    }
  };
});
