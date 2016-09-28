/*jshint node:true*/
/* global module */
module.exports = function() {
  return function(babel) {
    var t = babel.types;
    return new babel.Transformer('babel-string-obfuscator', {
      Literal(node, parent, scope) {
        // Get parent scope
        var _scope = scope;
        while (_scope.parent !== null) {
          _scope = _scope.parent;
        }
        if (!_scope._obfuscator_cache) {
          _scope._obfuscator_cache = new Map();
        }
        var cache = _scope._obfuscator_cache;
        var value = node.value;

        if (typeof value === 'string') {
          if (t.isModuleDeclaration(parent)) {
            return;
          }
          if (!cache.has(value)) {
            var uid = _scope.generateUidIdentifier('_so_');
            cache.set(value, uid);
            this.replaceWith(uid);

            var newString = t.Literal(value);
            newString._from_obfuscator = true;
            _scope.push({
              id: t.variableDeclarator(uid, newString)
            });
          } else {
            var cachedUid = cache.get(value);
            if (!node._from_obfuscator) {
              this.replaceWith(cachedUid);
            }
          }
        }
      }
    });
  };
};
