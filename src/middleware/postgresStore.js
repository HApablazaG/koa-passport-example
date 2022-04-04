import hasValue from 'has-values';
import { CronJob } from 'cron';
import db from './postgresConnection';

class PgStore {
  async destroy (key) {
    return db.none('DELETE FROM session WHERE sid = $1', key);
  }

  async get (key) {
    let { sess } = (await db.oneOrNone('SELECT sess FROM session WHERE sid = $1', key)) || {};

    return sess;
  }

  async set (key, sess, maxAge, { rolling, changed }) {
    if (changed || rolling) {
      if (hasValue(sess.passport)) {
        await db.none(
          `INSERT INTO session (sid, sess, max_age) VALUES ($1, $2, $3)
          ON CONFLICT (sid)
          DO UPDATE
          SET sess = $2, max_age = $3`,
          [key, sess, maxAge]
        );
      } else {
        await this.destroy(key);
      }
    }

    return sess;
  }

  static cleanStore () {
    db.none(
      `DELETE FROM session WHERE (sess->>'_expire')::BIGINT < $1`,
      Date.now()
    );
  }

  static create () {
    return new PgStore();
  }
}

// Clean expired sessions every 2 minutes.
const scheduler = new CronJob('0 */2 * * * *', PgStore.cleanStore);
scheduler.start();

export default PgStore;
