import request from 'sync-request-curl';
const SERVER_URL = 'http://localhost:3000';
describe('HTTP tests for ControlUserdetails', () => {

  test('header is invalid', () => {
    const res = request('GET', `${SERVER_URL}/v1/admin/controluser/details`);
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('ControlUserSessionId is invalid');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });

  test('sesionid is not a number', () => {
    const res = request('GET', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: 'aaa' } 
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('ControlUserSessionId is not a number');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });

  test('request successfully ', () => {
    const res = request('GET', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '1' } 
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(200);
    expect(body.user).toBeDefined();
    expect(body.user.controlUserId).toBe(1);
  });

});