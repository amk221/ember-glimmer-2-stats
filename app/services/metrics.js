import Service from 'ember-service';
import { scheduleOnce, bind , next } from 'ember-runloop';
import { classify } from 'ember-string';
import { subscribe } from 'ember-instrumentation';

export default Service.extend({
  init() {
    this._super(...arguments);
    this._instrumentComponents();
  },

  _instrumentComponents() {
    subscribe('render.component', {
      before: bind(this, '_beforeRenderComponent'),
      after:  bind(this, '_afterRenderComponent')
    });
  },

  _beforeRenderComponent(name, timestamp) {
    return timestamp;
  },

  routerTransition(url) {
    this.set('currentUrl', url);
    scheduleOnce('afterRender', this, '_afterFullRouteTransition');
  },

  routeActivation(route) {
    scheduleOnce('afterRender', this, '_afterRenderRoute', route, Date.now());
  },

  _afterFullRouteTransition() {
    if (!this.get('appBooted')) {
      this._afterBoot();
      this.set('appBooted', true);
    }
  },

  _checkSlowClient(time) {
    if (time > 150) {
      console.log('slow client');
    }
  },

  _afterRenderComponent(name, end, payload, start) {
    name = (payload.containerKey || '').replace('component:', '');
    const time = (end - start);
    if (time > 100) {
      console.log('slow component', name, time);
    }
  },

  _afterRenderRoute(route, startTime) {
    const name = classify(route.get('routeName'));
    const time = (Date.now() - startTime);
    this._checkSlowClient(time);
    next(() => {
      console.log('render route', name, time);
    });
  },

  _afterBoot() {
    const times      = window.timing.getTimes();
    const painted    = times.firstPaintTime;
    const response   = times.requestTime;
    const displayed  = (Date.now() - times.firstPaint);
    const currentUrl = this.get('currentUrl');

    console.log('url', currentUrl);
    console.log('request time', response);
    console.log('start to first paint', painted);
    console.log('first paint to displayed', displayed);
  }
});
