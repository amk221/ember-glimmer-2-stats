import inject from 'ember-service/inject';
const { Ember } = window;

export function initialize() {

  Ember.Router.reopen({
    metrics: inject(),

    didTransition() {
      this._super(...arguments);
      this.get('metrics').routerTransition(this.get('url'));
    }
  });

  Ember.Route.reopen({
    metrics: inject(),

    activate() {
      this._super(...arguments);
      this.get('metrics').routeActivation(this);
    }
  });

}

export default {
  name: 'metrics',
  initialize
};
