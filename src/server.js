import Koa from 'koa';
import koaBody from 'koa-body';
import koaSession from 'koa-session';
import koaRouter from '@koa/router';
import httpStatus from 'http-status-codes';
import { secret, sessionMaxAge } from './config.json';
import PgStore from './middleware/postgresStore';
import formValidator from './middleware/formValidator';
import { localAuthenticate, passportInit } from './middleware/passportLocal';

// Init koa server instance.
const app = new Koa();

// Secret keys for sessions
app.keys = secret;
app.use(koaSession({
  store: PgStore.create(),
  maxAge: sessionMaxAge,
  rolling: true
}, app));

// Add body parser to koa server.
app.use(koaBody());

// // Add authentication routes to server.
passportInit(app);

// Init koa router for requests.
const router = new koaRouter();

router.post(
  '/auth/login',
  (ctx, next) => {
    const validation = formValidator.loginForm(ctx.request.body);

    if (validation.isValid) {
      return next();
    } else {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = validation;
    }
  },
  localAuthenticate
);

router.get('/auth/login-status', async ctx => {
  ctx.status = httpStatus.OK;
  ctx.body = {
    logged: ctx.isAuthenticated()
  };
});

router.get('/auth/logout', async ctx => {
  ctx.logOut();

  // This should be a redirect to the system login page.
  // ctx.redirect('/login');
  // This example doesn't have any front end system.
  // so instead we will response with a OK status.
  ctx.status = httpStatus.OK;
  ctx.body = {
    message: 'You have successfully logged out.'
  };
});

// Resolve requests to a not defined URI.
router.all('/(.*)', async ctx => {
  ctx.status = httpStatus.BAD_REQUEST;
  ctx.body = {
    error: httpStatus.getStatusText(httpStatus.BAD_REQUEST),
    message: 'The HTTP request path is not recognized by the server.',
  };
});

app.use(router.routes());

// Error handler.
app.on('error', error => {
  console.error('Server error', error);
});

// Listen server port.
const port = 8080;

// Server init.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
