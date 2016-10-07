/* jshint node: true */
'use strict';

var BabelDedupeStringLiterals = require('./lib/BabelDedupeStringLiterals');

module.exports = {
  name: 'ember-dedupe-string-literals',
  setupPreprocessorRegistry: function(type, registry) {
    if (registry.app.options) {
      this.dedupeStringLiterals = registry.app.options.dedupeStringLiterals || {};
      this.dedupeStringLiterals.enabled = this.dedupeStringLiterals.enabled || false;
      this.dedupeStringLiterals.minimumOccurence = this.dedupeStringLiterals.minimumOccurence || 2;
      this.dedupeStringLiterals.minimumStringLength = this.dedupeStringLiterals.minimumStringLength || 0;
      this.dedupeStringLiterals.dedupeObjectKeyString = this.dedupeStringLiterals.dedupeObjectKeyString || false;
      this.dedupeStringLiterals.dedupeObjectKeyIdentifier = this.dedupeStringLiterals.dedupeObjectKeyIdentifier || false;
    }
  },
  included: function(app) {
    this._super.included.apply(this, arguments);
    if (this.dedupeStringLiterals.enabled) {
      var dedupeStringLiterals = BabelDedupeStringLiterals(this.dedupeStringLiterals);
      dedupeStringLiterals.baseDir = function() {
        return __dirname;
      };
      if (app.options.babel.plugins) {
        app.options.babel.plugins.push(dedupeStringLiterals);
      } else {
        app.options.babel.plugins = [dedupeStringLiterals];
      }
    }
  }
};
