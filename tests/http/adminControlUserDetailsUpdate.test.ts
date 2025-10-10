import request from 'sync-request-curl';
const SERVER_URL = "http://127.0.0.1:3200";
describe('HTTP tests for ControlUserdetailsUpdate', () => {

  test('header is invalid', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`,{
      json:{email:'1234@qq.com',nameFirst:'Ka',nameLast:'Ka'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('ControlUserSessionId is invalid');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });

  test('sesionid is not a number', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: 'aaa' },
      json:{email:'1234@qq.com',nameFirst:'Ka',nameLast:'Ka'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('ControlUserSessionId is not a number');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });
  test('User not found', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '999' } ,
      json:{email:'1234@qq.com',nameFirst:'Ka',nameLast:'Ka'}
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(401);
    expect(body.error).toBe('User not found');
    expect(body.errorCategory).toBe('INVALID_CREDENTIALS'); 
  });
  test('email is invalid', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '1' },
      json: { email: 'emailxxx', nameFirst: 'Bill', nameLast: 'Ryker' }
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('this email is invalid');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('name is invalid', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '1' },
      json: { email: 'kitty123@qq.com', nameFirst: '', nameLast: '' }
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('this name is invalid');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('email already exists', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '1' },
      json: { email: 'existing@qq.com', nameFirst: 'Bill', nameLast: 'Ryker' }
      // wait db.json
    });
    const body = JSON.parse(res.body.toString());
    expect(res.statusCode).toBe(400);
    expect(body.error).toBe('excluding the current authorised user');
    expect(body.errorCategory).toBe('BAD_INPUT');
  });
  test('request successfully ', () => {
    const res = request('PUT', `${SERVER_URL}/v1/admin/controluser/details`, {
      headers: { ControlUserSessionId: '1' },
      json: { email: 'bill.ryker@starfleet.com', nameFirst: 'Bill', nameLast: 'Ryker' }
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