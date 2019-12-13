const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getMachines', mid.requiresLogin, controllers.Machine.getMachines);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Machine.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Machine.makeMachine);
  app.get('/delete', mid.requiresLogin, controllers.Machine.deleteMachine);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', mid.requiresSecure, controllers.Account.notFound);
};

module.exports = router;
