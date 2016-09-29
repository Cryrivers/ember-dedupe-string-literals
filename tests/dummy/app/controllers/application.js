import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  nice: {
    'abc': 'ddd',
    'test': 'lol'
  },
  actions: {
    go() {
      const store = this.get('store');
      store.unloadAll();
      return ['a', 'a', 'b', 'c'];
    }
  }
});
