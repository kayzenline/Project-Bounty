import { clear } from '../../src/other';
import { getData, Mission, MissionControlUser } from '../../src/dataStore';

describe('clear', () => {
  test('clears all users and missions and resets counters', () => {
    // define a special data
    let data = getData();
    let missionOrigin: Mission = {
      missionId: 1,
      controlUserId: 1,
      name: 'Mercury',
      description: "Place a manned spacecraft in orbital flight around the earth. Investigate a persons performance capabilities and their ability to function in the environment of space. Recover the person and the spacecraft safely",
      target: 'Earth orbit',
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
    };
    let controlUser: MissionControlUser = {
      controlUserId: 1,
      email: 'strongbeard@starfleet.com.au',
      password: 'xxxxxxxxx',
      nameFirst: 'Bill',
      nameLast: 'Ryker',
      numSuccessfulLogins: 3,
      numFailedPasswordsSinceLastLogin: 1,
      passwordHistory: ['xxxxxxxxx'],
    };
    data.controlUsers.push(controlUser);
    data.spaceMissions.push(missionOrigin);
    data.nextControlUserId = 2;
    data.nextMissionId = 2;

    expect(clear()).toEqual({});
    const newData = getData();
    expect(newData).toStrictEqual({
      controlUsers: [],
      spaceMissions: [],
      nextControlUserId: 1,
      nextMissionId: 1,
    });

  });
});
