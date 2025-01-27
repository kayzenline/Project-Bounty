# DPST1093 Major Project

**✨ 📡🚀 Mission Control 🚀👩‍🚀 ✨**

## Contents

[[_TOC_]]

## Change Log

## 🫡 0. Aims:

1. Demonstrate effective use of software development tools to build full-stack end-user applications.
2. Demonstrate effective use of static testing, dynamic testing, and user testing to validate and verify software systems.
3. Understand key characteristics of a functioning team in terms of understanding professional expectations, maintaining healthy relationships, and managing conflict.
4. Demonstrate an ability to analyse complex software systems in terms of their data model, state model, and more.
5. Understand the software engineering life cycle in the context of modern and iterative software development practices in order to elicit requirements, design systems thoughtfully, and implement software correctly.
6. Demonstrate an understanding of how to use version control and continuous integration to sustainably integrate code from multiple parties.

## 🌈 1. Overview

The students at UNSW College are always striving upwards and now have decided that teaching shouldn't be bound to just the seats in their class - they want to hold classes in Space! In order to get there, the students will need something to help plan and resource their trips to this exciting new frontier!

The 25T1 cohort of DPST1093 students will build the **backend Javascript server** for a new mission control platform, **Xecaps**. We plan to task future COMP6080 students to build the frontend for Xecaps, something you won't have to worry about.

**XecapS** is an organisation tool that lets students plan a space mission, add launch vehicles, payloads, mission controllers and astronauts. Then they can simulate how effective their space mission will be in dealing with the various challenges one encounters in a space mission.

We have already specified a **common interface** for the frontend and backend to operate on. This allows both courses to go off and do their own development and testing under the assumption that both parties will comply with the common interface. This is the interface **you are required to use**.

The specific capabilities that need to be built for this project are described in the interface at the bottom. This is clearly a lot of features, but not all of them are to be implemented at once.

## 🐭 2. Iteration 0: Getting Started

[You can watch the iteration 0 introductory video.](empty) This video is not required watching (the specification is clear by itself) though many students find it useful as a starting point.


### 🐭 2.1. Task

This iteration is designed as a warm-up to help you setup your project, learn Git and project management practises (see Marking Criteria), and understand how your team works together. In this task you will be introduced to two main pieces of information you will need to represent for this system:
 - `Mission Control User` - a `user` who can log onto this system and plan future missions
 - `Space Mission` - a `mission` that a mission control user plans.


In this iteration, you are expected to:
1. Write stub code for the basic functionality of Xecaps. Each function is generally described as a three stage name: access level, then item type being accessed, fially the action to carry out. The basic functionality is defined as the `adminAuth*`, `adminControlUser*`, `adminMission*` capabilities/functions, as per the interface section below (2.2).
    * A stub is a function declaration and sample return value (see example below). **Do NOT write the implementation** for the stubbed functions - that is for the next iteration. In this iteration you are just focusing on setting up your function declarations and getting familiar with Git.
    * Each team member must stub **AT LEAST 2** function each.
    * Function stub locations should be inside files named a corresponding prefix e.g. `adminAuth` and `adminControl*` inside `auth.js`, `adminMission*` inside `mission.js`
    * Return values should match the interface table below (see example below).
```javascript
// Sample stub for the adminControlLogin function
// Return stub value matches table below
function adminAuthLogin(email, password) {
  return {
    controlUserId: 1,
  }
}
```
1. Design a structure to store all the data needed for Xecaps, and place this in the [code block](https://www.markdownguide.org/extended-syntax/#fenced-code-blocks) inside the `sampledata.md` file. Specifically, you must consider how to store information about **mission control users** and **space missions** and populate ONE example `control user` and `space mission` in your data structure (any values are fine - see example below).
    * Use the interface table (2.2) to help you decide what data might need to be stored. This will require making some educated guesses about what would be required to be stored in order to return the types of data you see. **Whilst the data structure you describe in data.md might be similar to the interface, it is a different thing to the interface.** If you're still confused, think of the interface like a restaurant menu, and `data.md` like where the food is stored in the back. It's all the same food, but the menu is about how it's packaged up and received from the kitchen, and `data.md` is describing the structure of how it's all stored behind the scenes. 
    * As functions are called, this structure would be populated with more mission control users and more space missions, so consider this in your solution.
    * Focus on the structure itself (object/list composition), rather than the example contents.
```javascript
// Example values inside of a 'control user' object might look like this
// NOTE: this object's data is not exhaustive,
// - you may need more/fewer fields stored as you complete this project. 
// We won't be marking you down for missing/adding too much sample data in this iteration.
{
  controlUserId: 1,
  nameFirst: 'James',
  nameLast: 'Tiberius',
  email: 'thisisntmyemail@gmail.com',
}
```
1. Follow best practices for git and teamwork as discussed in lectures.
    * Create a group contract by completing `contract.md` - you may add/edit this template as you see fit.
    * You are expected to have **at least 1 meeting** with your group, and document the meeting(s) in meeting minutes which should be stored at a timestamped location in your repo (e.g. uploading a word doc/pdf or writing in the GitLab repo Wiki after each meeting). We have provided you with a `minutes-template.md` which you may use if you choose.
    * For this iteration each team member will need to make a minimum of **1 merge request per person** in your group into the `master` branch.
    * **1 merge request per function** must be made (13 in total).
    * Check out the lab on Git from week 1 to get familiar with using Git.

### 🐭 2.2. Functions to stub

The following are strings: `email`, `password`, `nameFirst`, `nameLast`, `name`, `description`, `target`.

The following are integers: `controlUserId`, `missionId`.

In terms of file structure:
 * All functions starting with `adminAuth` or `adminControlUser` go in `auth.js`
 * All functions starting with `adminMission` go in `mission.js`
 * `clear` goes in `other.js`

<table>
  <tr>
    <th>Name & Description</th>
    <th style="width:18%">Data Types</th>
  </tr>
  <tr>
    <td>
      <code>adminAuthRegister</code>
      <br /><br />
      Register a mission control user with an email, password, and names, then returns their <code>controlUserId</code> value.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( email, password, nameFirst, nameLast )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{
  controlUserId: 1
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminAuthLogin</code>
      <br /><br />
      Given a registered user's email and password returns their <code>controlUserId</code> value.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( email, password )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{
  controlUserId: 1
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminControlUserDetails</code>
      <br /><br />
      Given a mission control user's controlUserId, return details about the user.
      <li>"<code>name</code>" is the first and last name concatenated with a single space between them</li>
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( controlUserId )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ user:
  {
    userId: 1,
    name: 'Bill Ryker ',
    email: 'strongbeard@starfleet.com.au',
    numSuccessfulLogins: 3,
    numFailedPasswordsSinceLastLogin: 1,
  }
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminControlUserDetailsUpdate</code>
      <br /><br />
      Given a mission control user's controlUserId and a set of properties, update the properties of this logged in mission control user.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( controlUserId, email, nameFirst, nameLast )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ }</code> empty object
    </td>
  </tr>
  <tr>
    <td>
      <code>adminControlUserPasswordUpdate</code>
      <br /><br />
      Given details relating to a password change, update the password of a logged in control user.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( controlUserId, oldPassword, newPassword )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ }</code> empty object
    </td>
  </tr>
  <tr>
    <td>
      <code>adminMissionList</code>
      <br /><br />
      Provide a list of all space missions that are owned by the currently logged in control user.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( controlUserId )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ missions: [
    {
      missionId: 1,
      name: 'Mercury',
    },
    {
      missionId: 2,
      name: 'Apollo',
    },
    
  ]
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminMissionCreate</code>
      <br /><br />
      Given basic details about a new space mission, create one for the logged in control user.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( controlUserId, name, description, target )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{
  missionId: 2
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminMissionRemove</code>
      <br /><br />
      Given a particular missionId, permanently remove the space mission.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( controlUserId, missionId )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ }</code> empty object
    </td>
  </tr>
  <tr>
    <td>
      <code>adminMissionInfo</code>
      <br /><br />
      Get all of the relevant information about the current space mission identified by the missionId.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( controlUserId, missionId )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{
  missionId: 1,
  name: 'Mercury',
  timeCreated: 1683125870,
  timeLastEdited: 1683125871,
  description: 'Place a manned spacecraft in orbital flight around the earth. Investigate man's performance capabilities and his ability to function in the environment of space. Recover the man and the spacecraft safely',
  target: 'Earth orbit'
}</code>
    </td>
  </tr>
  <tr>
    <td>
      <code>adminMissionNameUpdate</code>
      <br /><br />
      Update the name of the relevant space mission.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( controlUserId, missionId, name )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ }</code> empty object
    </td>
  </tr>
  <tr>
    <td>
      <code>adminMissionDescriptionUpdate</code>
      <br /><br />
      Update the description of the relevant space mission.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( controlUserId, missionId, description )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ }</code> empty object
    </td>
  </tr>
  <tr>
    <td>
      <code>adminMissionTargetUpdate</code>
      <br /><br />
      Update the target of the relevant space mission.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>( controlUserId, missionId, description )</code>
      <br /><br />
      <b>Return object:</b><br />
      <code>{ }</code> empty object
    </td>
  </tr>
  <tr>
    <td>
      <code>clear</code>
      <br /><br />
      Reset the state of the application back to the start.
    </td>
    <td>
      <b>Parameters:</b><br />
      <code>()</code> no parameters
      <br /><br />
      <b>Return object:</b><br />
      <code>{ }</code> empty object
    </td>
    <td>
    </td>
  </tr>
</table>

### 🐭 2.3 Marking Criteria
<table>
  <tr>
    <th>Section</th>
    <th>Weighting</th>
    <th>Criteria</th>
  </tr>
  <tr>
    <td>Automarking (Implementation)</td>
    <td>20%</td>
    <td><ul>
      <li>Correct implementation of specified stubs</li>
    </ul></td>
  </tr>
  <tr>
  <tr>
    <td>Data Model Documentation</td>
    <td>20%</td>
    <td><ul>
      <li>Clear and obvious effort and time gone into thinking about possible representation of data structure for the project containing mission control users and space missions, inside of <code>data.md</code>.</li>
    </ul></td>
  </tr>
  <tr>
    <td>Git Practices</td>
    <td>30%</td>
    <td><ul>
      <li>Meaningful and informative git commit messages being used (see <a href="https://initialcommit.com/blog/git-commit-messages-best-practices#:~:text=commit%20message%20style.-,General%20Commit%20Message%20Guidelines,-As%20a%20general">examples</a>)</li>
      <li>Effective use of merge requests (from branches being made) across the team (as covered in lectures)</li>
      <li>At least 1 merge request per person and 1 merge request per function (13 in total) made into the <code>master</code> branch</li>
    </ul></td>
  </tr>
  <tr>
    <td>Project Management & Teamwork</td>
    <td>30%</td>
    <td><ul>
      <li>Completed group contract.</li>>
      <li>A generally equal contribution between team members.</li>
      <li>Effective use of course-provided MS Teams for communication, demonstrating an ability to competently manage teamwork online.</li>
      <li>Had a meeting together that involves planning and managing tasks, and taken notes from said meeting (and stored in a logical place in the repo e.g. Wiki section).</li>
    </ul></td>
  </tr>
</table>