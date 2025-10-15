import request from 'sync-request-curl';
import config from '../../src/config.json';
const { port, url } = config;
const SERVER_URL = `${url}:${port}`;

export function clearRequest() {
  const res = request('DELETE', `${SERVER_URL}/v1/clear`);
  return {
    statusCode: res.statusCode,
    body: res.body.toString(),
  };
}

describe('DELETE /v1/clear', () => {
  test('200 and {}', () => {
    const res = clearRequest();
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toStrictEqual({});
  });
});