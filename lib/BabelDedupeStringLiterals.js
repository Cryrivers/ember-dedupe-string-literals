/*jshint node:true*/
/* global module */
module.exports = function() {
  return function(babel) {
    var t = babel.types;
    return new babel.Transformer('babel-dedupe-string-literals', {
      Literal(node, parent, scope) {

        if (t.isModuleDeclaration(parent)) { return; }
        if (parent.type === 'Property' && parent.key === node) { return; }

        var value = node.value;

        if (typeof value === 'string') {
          // Get parent scope
          var _scope = scope;
          while (_scope.parent !== null) {
            _scope = _scope.parent;
          }
          if (!_scope._dedupe_string_cache) {
            _scope._dedupe_string_cache = new Map();
          }
          var cache = _scope._dedupe_string_cache;

          if (!cache.has(value)) {
            var uid = _scope.generateUidIdentifier('_so_');
            cache.set(value, uid);
            this.replaceWith(uid);

            var newString = t.Literal(value);
            newString._from_edsl = true;
            _scope.push({
              id: t.variableDeclarator(uid, newString)
            });
          } else {
            var cachedUid = cache.get(value);
            if (!node._from_edsl) {
              this.replaceWith(cachedUid);
            }
          }
        }
      }
    });
  };
};
