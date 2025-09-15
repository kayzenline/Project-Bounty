# Data Model

## Example Data Store State
```javascript
let data = {
    missionControlUsers: [
    {
      controlUserId: 1,
      name: 'Bill Ryker',
      email: 'strongbeard@starfleet.com.au',
      numSuccessfulLogins: 3,
      numFailedPasswordsSinceLastLogin: 1
    }
  ], 
    spaceMissions: [
    {
      missionId: 1,
      name: 'Mercury',
      description: 'Place a manned spacecraft in orbital flight...',
      target: 'Earth orbit',
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
    }
  ]
}
```

## Short description of the Data Model

Here you should describe what each property of data model object does. Remember to list the properties of *both* `mission control users` and `space missions`. Do not forget the properties that you can only see from the sample outputs!

| Property          | Type   | Description                                        |
|-------------------|--------|----------------------------------------------------|
| controlUserId     | Number | for login,registration,updating details            |
| ------------------|--------|----------------------------------------------------|
| name              | String | Full name of control user                          |
|-------------------|--------|----------------------------------------------------|
| email             | String | Email address of the user                          |
|-------------------|--------|----------------------------------------------------|
|numSuccessfulLogins| Number | Number of times user logged in successfully        |
|-------------------|--------|----------------------------------------------------|
|numFailedPasswords |        | Number of failed password attempts (sincelastlogin)|
|SinceLastLogin     | Number |                                                    |
|-------------------|--------|----------------------------------------------------|
|missionId          | Number | Unique identifier for a space mission              |
|-------------------|--------|----------------------------------------------------|
|name               | String | Name of the space mission                          |
|-------------------|--------|----------------------------------------------------|
|description        | String | Description of the space mission                   |
|-------------------|--------|----------------------------------------------------|
|target             | String | Target of the space mission                        |
|-------------------|--------|----------------------------------------------------|
|timeCreated Number | Number | Timestamp when the mission was created             |
|-------------------|--------|----------------------------------------------------|
|timeLastEdited     | Number | Timestamp of the last edit to the mission          | 
|-------------------|--------|----------------------------------------------------|


