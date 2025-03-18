import { database, ref, set } from './firebase.js';

function writeSomeData() {
  set(ref(database, 'people/'), {
    firstName: 'foo',
    lastName: 'bar'
  });

  set(ref(database, 'seasons/'), {
    year: 2025,
    season: 'spring'
  });

  set(ref(database, 'scores/'), {
    person: 'name',
    round: '00'
  });
}

// writeSomeData();