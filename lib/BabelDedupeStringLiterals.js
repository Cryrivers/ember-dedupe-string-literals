/*jshint node:true*/
/* global module */
module.exports = function(options) {
  return function(babel) {
    var t = babel.types;

    function _replaceWithUid(thisRef, node, parent, uid) {
      if (
        (options.dedupeObjectKeyIdentifier && parent.type === 'Property' && parent.key === node) ||
        (options.dedupeMemberExpression && parent.type === 'MemberExpression' && parent.property === node)
      ) {
        parent.computed = true;
      }
      thisRef.replaceWith(uid);
    }

    function _getRootScope(scope) {
      var _scope = scope;
      while (_scope.parent !== null) {
        _scope = _scope.parent;
      }
      return _scope;
    }

    function _getCache(rootScope) {
      if (!rootScope._dedupe_string_cache) {
        rootScope._dedupe_string_cache = new Map();
      }
      return rootScope._dedupe_string_cache;
    }

    function _createCachedStringIdentifier(rootScope, value) {
      var uid = rootScope.generateUidIdentifier('_edsl_');
      var literal = t.Literal(value);
      literal._from_edsl = true;
      rootScope.push(t.variableDeclarator(uid, literal));
      return uid;
    }

    function _lookupInCache(cache, lookupValue, thisRef, node, parent) {
      if (!cache.has(lookupValue)) {
        cache.set(lookupValue, {
          uid: null,
          firstThisRef: thisRef,
          firstNode: node,
          firstParent: parent,
          count: 0
        });
      }
      var cachedValue = cache.get(lookupValue);
      cachedValue.count++;
      return cachedValue;
    }

    function _dedupe(thisRef, value, node, parent, scope) {
      if (value.length < options.minimumStringLength) {
        return;
      }
      var rootScope = _getRootScope(scope);
      var cache = _getCache(rootScope);
      var cachedValue = _lookupInCache(cache, value, thisRef, node, parent);
      if (cachedValue.count === options.minimumOccurence) {
        cachedValue.uid = _createCachedStringIdentifier(rootScope, value);
        _replaceWithUid(cachedValue.firstThisRef, cachedValue.firstNode, cachedValue.firstParent, cachedValue.uid);
        _replaceWithUid(thisRef, node, parent, cachedValue.uid);
      } else if (cachedValue.count > options.minimumOccurence && !node._from_edsl) {
        _replaceWithUid(thisRef, node, parent, cachedValue.uid);
      }
    }

    var visitor = {
      Literal(node, parent, scope) {
        if (t.isModuleDeclaration(parent)) {
          return;
        }
        if (!options.dedupeObjectKeyString && parent.type === 'Property' && parent.key === node) {
          return;
        }
        var value = node.value;
        if (typeof value === 'string') {
          _dedupe(this, value, node, parent, scope);
        }
      }
    };

    if (options.dedupeObjectKeyIdentifier || options.dedupeMemberExpression) {
      visitor.Identifier = function(node, parent, scope) {
        if (options.dedupeObjectKeyIdentifier && parent.type === 'Property' && parent.key === node && !parent.computed) {
          _dedupe(this, node.name, node, parent, scope);
        }
        if (options.dedupeMemberExpression && parent.type === 'MemberExpression' && parent.property === node && !parent.computed) {
          _dedupe(this, node.name, node, parent, scope);
        }
      };
    }

    return new babel.Transformer('babel-dedupe-string-literals', visitor);
  };
};
