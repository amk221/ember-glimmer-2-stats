import Ember from 'ember';

export default Ember.Controller.extend({
  init() {
    this._super(...arguments);

    this.set('items', Ember.A());

    for (let i = 0; i < 1000; i++) {
      this.get('items').addObject({
        id: i,
        name: `Item ${i}`
      });
    }
  }
});
