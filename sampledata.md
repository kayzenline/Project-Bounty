# Data Model

## Example Data Store State
```javascript
let data = {
  controlUsers: [
    {
      controlUserId: 1,
      email: 'strongbeard@starfleet.com.au',
      password: 'strongbeard123',
      nameFirst: 'Bill',
      nameLast: 'Ryker',
      numSuccessfulLogins: 3,
      numFailedPasswordsSinceLastLogin: 1,
      passwordHistory: ['strongbeard123']
    }
  ],
  spaceMissions: [
    {
      missionId: 1,
      controlUserId: 1,
      name: 'Mercury',
      description: 'Place a manned spacecraft in orbital flight...',
      target: 'Earth orbit',
      timeCreated: 1683125870,
      timeLastEdited: 1683125871
    }
  ],
  sessions: [
    {
      userSessionId: '123y'
      authUserId: 123
    }
  ]
  nextControlUserId: 2,
  nextMissionId: 2
};
```

## Short description of the Data Model

Here you should describe what each property of data model object does. Remember to list the properties of *both* `mission control users` and `space missions`. Do not forget the properties that you can only see from the sample outputs!

| Property          | Type                    | Description                                                    |
|-------------------|-------------------------|----------------------------------------------------------------|
| controlUsers      | MissionControlUser[]    | Registered mission control users                                |
| spaceMissions     | Mission[]               | Missions created by control users                               |
| nextControlUserId | Number                  | Next ID to issue during user registration                       |
| nextMissionId     | Number                  | Next ID to issue when creating a mission                        |

### MissionControlUser

| Property                       | Type     | Description                                                     |
|--------------------------------|----------|-----------------------------------------------------------------|
| controlUserId                  | Number   | Unique identifier for login and authorisation                   |
| email                          | String   | User email address, used for login                              |
| password                       | String   | Current password in plain text                                  |
| nameFirst                      | String   | First name used for greetings and display                       |
| nameLast                       | String   | Last name used for greetings and display                        |
| numSuccessfulLogins            | Number   | Count of successful logins to date                              |
| numFailedPasswordsSinceLastLogin | Number | Failed login attempts since the last successful login           |
| passwordHistory                | String[] | Previously used passwords to prevent reuse                      |

### Mission

| Property       | Type   | Description                                                     |
|----------------|--------|-----------------------------------------------------------------|
| missionId      | Number | Unique identifier for a space mission                           |
| controlUserId  | Number | Owner of the mission; must match an existing control user       |
| name           | String | Mission name shown in listings                                  |
| description    | String | Mission description provided by the owner                       |
| target         | String | Mission target destination                                      |
| timeCreated    | Number | Unix timestamp when the mission was created                     |
| timeLastEdited | Number | Unix timestamp of the most recent update to mission details     |


