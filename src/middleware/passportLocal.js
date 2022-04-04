import httpStatus from 'http-status-codes';
import passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import connection from './postgresConnection';

function getUserById (id) {
  return connection.one(
    'SELECT * FROM "user" WHERE id = $1',
    id
  );
}

function getUserByUsername (rut) {
  return connection.oneOrNone(
    'SELECT * FROM "user" WHERE user_id = $1',
    rut
  );
}

passport.use(
  new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await getUserByUsername(username);
        const verified = user?.enabled && await bcrypt.compare(password, user.passwordHash);

        if (verified) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser(
  async (user, done) => {
    done(null, user.id);
  }
);

passport.deserializeUser(
  async (id, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch(error) {
      done(error);
    }
  }
);

function passportInit (app) {
  app.use(passport.initialize());
  app.use(passport.session());
}

function localAuthenticate (ctx, next) {
  return passport.authenticate(
    'local',
    (err, user) => {
      if (err || user === false) {
        ctx.status = err
          ? httpStatus.INTERNAL_SERVER_ERROR
          : httpStatus.UNAUTHORIZED;

        ctx.body = {
          success: false,
          message: err?.message || 'Wrong username or password.'
        };
      } else {
        ctx.body = {
          success: true,
          message: 'You have successfully entered the system.'
        };

        return ctx.login(user);
      }
    }
  )(ctx, next);
}

export {
  passportInit,
  localAuthenticate
};
