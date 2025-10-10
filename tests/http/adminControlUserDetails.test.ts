import request from 'sync-request-curl';
const SERVER_URL = "http://127.0.0.1:3200";
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

  test('User not found', () => {
    const res = request('GET', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '999' } 
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('User not found');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });

  test('request successfully ', () => {
    const res = request('GET', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '1' } 
    });
    const body = JSON.parse(res.body.toString());
    const user = body.user;
    expect(res.statusCode).toBe(200);
    expect(user.controlUserId).toBe(1);
    expect(user.email).toBe('strongbeard@starfleet.com.au');
    expect(user.name).toBe('Bill Ryker'); 
    expect(user.numSuccessfulLogins).toBe(3);
    expect(user.numFailedPasswordsSinceLastLogin).toBe(1);//wait db.json
  });

});