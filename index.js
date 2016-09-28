/* jshint node: true */
'use strict';

var BabelStringObfuscator = require('./lib/BabelStringObfuscator');

module.exports = {
  name: 'ember-string-obfuscator',
  included: function(app) {
    this._super.included.apply(this, arguments);

    var obfuscator = BabelStringObfuscator();

    obfuscator.baseDir = function() {
      return __dirname;
    };

    if (app.options.babel.plugins) {
      app.options.babel.plugins.push(obfuscator);
    } else {
      app.options.babel.plugins = [obfuscator];
    }
  }
};
