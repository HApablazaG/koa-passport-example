import Promise from 'bluebird';
import pgp from 'pg-promise';
import { dbUri } from '../config.json';

function camelizeColumns (data) {
  const template = data[0];

  for (let prop in template) {
    const camel = pgp.utils.camelize(prop);

    if (!Object.hasOwnProperty.call(template, camel)) {
      for (let index = 0; index < data.length; index++) {
        let row = data[index];
        row[camel] = row[prop];
        delete row[prop];
      }
    }
  }
}

const postgres = pgp({
  promiseLib: Promise,
  receive: camelizeColumns
});

const connection = postgres(dbUri);

export default connection;
