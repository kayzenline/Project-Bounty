import { adminMissionRemove, adminMissionCreate } from '../../src/mission';
import { adminAuthRegister } from '../../src/auth';
import { clear } from '../../src/other';
// remove successfully
describe('adminMissionRemove', () => {
  beforeEach(() => {
    clear();
  });
  test('remove successfully', () => {
    const { controlUserId } = adminAuthRegister('rosielover@gmail.com', 'a!b@AB1234', 'Kitty', 'Tan');
    const { missionId } = adminMissionCreate(controlUserId, 'M plan', 'first task', 'Mars');
    const result = adminMissionRemove(controlUserId, missionId);
    expect(result).toEqual({});
  });
  // remove failed
  test('remove failed-invalid userId', () => {
    const { controlUserId } = adminAuthRegister('rosielover@gmail.com', 'a!b@AB1234', 'Kitty', 'Tan');
    const { missionId } = adminMissionCreate(controlUserId, 'M plan', 'first task', 'Mars');
    const result = adminMissionRemove(999, missionId);
    expect(result).toEqual({ error: 'controlUserId not found', errorCategory: 'INVALID_CREDENTIALS' });
  });
  test('remove failed-Invalid missionid', () => {
    const { controlUserId } = adminAuthRegister('rosielover@gmail.com', 'a!b@AB1234', 'Kitty', 'Tan');
    const { missionId } = adminMissionCreate(controlUserId, 'M plan', 'first task', 'Mars');
    const result = adminMissionRemove(controlUserId, 999);
    expect(result).toEqual({ error: 'missionId not found', errorCategory: 'INACCESSIBLE_VALUE' });
  });
  // mission invalid
  test('mission has been deleted', () => {
    const { controlUserId } = adminAuthRegister('rosielover@gmail.com', 'a!b@AB1234', 'Kitty', 'Tan');
    const { missionId } = adminMissionCreate(controlUserId, 'M plan', 'first task', 'Mars');
    adminMissionRemove(controlUserId, missionId);
    const result = adminMissionRemove(controlUserId, missionId);
    expect(result).toEqual({ error: 'missionId not found', errorCategory: 'INACCESSIBLE_VALUE' });
  });
  // userid is not int
  test('userID is not integer', () => {
    const result = adminMissionRemove(1.1, 1);
    expect(result).toEqual({ error: 'controlUserId must be integer', errorCategory: 'BAD_INPUT' });
  });
  // missionid is not int
  test('missionID is not integer', () => {
    const { controlUserId } = adminAuthRegister('rosielover@gmail.com', 'a!b@AB1234', 'Kitty', 'Tan');
    const result = adminMissionRemove(controlUserId, 1.1);
    expect(result).toEqual({ error: 'missionId must be integer', errorCategory: 'BAD_INPUT' });
  });
  test('No permission to remove due to mission not owned by user', () => {
    const { controlUserId: user1 } = adminAuthRegister('rosielover@gmail.com', 'a!b@AB1234', 'Kitty', 'Tan');
    const { controlUserId: user2 } = adminAuthRegister('pcyyy@gmail.com', 'x!y@XY5678', 'jisoo', 'Kim');
    const { missionId } = adminMissionCreate(user1, 'M plan', 'first task', 'Mars');
    const result = adminMissionRemove(user2, missionId);
    expect(result).toEqual({
      error: 'Mission does not belong to this user',
      errorCategory: 'INACCESSIBLE_VALUE'
    });
  });
});
