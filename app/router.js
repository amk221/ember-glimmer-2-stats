import Router from 'ember-router';
import config from './config/environment';

const ExampleRouter = Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

ExampleRouter.map(function() {
  this.route('foo');
  this.route('bar');
});

export default ExampleRouter;
