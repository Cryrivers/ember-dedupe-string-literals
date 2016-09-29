/* jshint node: true */
'use strict';

var BabelDedupeStringLiterals = require('./lib/BabelDedupeStringLiterals');

module.exports = {
  name: 'ember-string-obfuscator',
  included: function(app) {
    this._super.included.apply(this, arguments);

    var dedupeStringLiterals = BabelDedupeStringLiterals();

    dedupeStringLiterals.baseDir = function() {
      return __dirname;
    };

    if (app.options.babel.plugins) {
      app.options.babel.plugins.push(dedupeStringLiterals);
    } else {
      app.options.babel.plugins = [dedupeStringLiterals];
    }
  }
};
