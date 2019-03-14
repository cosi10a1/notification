import { date, name, internet, address, fake, random } from 'faker/locale/en';

import { randomDate, weightedBoolean } from './utils';

export default (db, { serializeDate }) =>
  Array.from(Array(900).keys()).map(id => {
    const app_id = randomDate();
    const created_at = randomDate();
    const message = random.words();
    const received_id = random.number(1000);
    const sender = random.words();
    const title = random.words();
    const is_read = random.boolean();
    const updated_at = date.recent(10);
    return {
      id,
      app_id,
      created_at,
      message,
      received_id,
      sender,
      title,
      is_read,
      updated_at
    };
  });
