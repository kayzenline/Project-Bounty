import { v4 as uuid } from 'uuid';
// improte your request here!
import { getData } from '../../src/dataStore';
import { generateSessionId } from '../../src/helper';

function uniqueEmail(prefix = 'user') {
  return `${prefix}.${uuid().split('-').pop() || ''}@example.com`;
}

describe.skip('Need to write a description', () => {
  // some helpful functions you may use!
  uniqueEmail();
  getData();
  generateSessionId();
  
  test('Need to write a description of the test', () => {
    // write your own tests!
  });
});
