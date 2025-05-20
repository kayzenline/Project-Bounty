# DPST1093 Major Project

**✨ 👨‍🚀 Mission Control 👩‍🚀 ✨**

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

The 25T2 cohort of DPST1093 students will build the **backend Javascript server** for a new mission control platform, **Xecaps**. We plan to task future COMP6080 students to build the frontend for Xecaps, something you won't have to worry about.

**XecapS** is an organisation tool that lets students plan a space mission, add launch vehicles, payloads, mission controllers and astronauts. Then they can simulate how effective their space mission will be in dealing with the various challenges one encounters in a space mission.

We have already specified a **common interface** for the frontend and backend to operate on. This allows both courses to go off and do their own development and testing under the assumption that both parties will comply with the common interface. This is the interface **you are required to use**.

The specific capabilities that need to be built for this project are described in the interface at the bottom. This is clearly a lot of features, but not all of them are to be implemented at once.

## 🛰️ 2. Iteration 0: Getting Started

**NOTE** We will update this area with an introductionary video soon

[You can watch the iteration 0 introductory video.](https://echo360.net.au/lesson/f6dc0e32-8d9c-43e0-8e5a-cb9693796c5d/classroom) This video is not required watching (the specification is clear by itself) though many students find it useful as a starting point.


### 🛰️ 2.1. Task

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
// Sample stub for the adminAuthLogin function
// Return stub value matches table below
function adminAuthLogin(email, password) {
  return {
    controlUserId: 1,
  }
}
```
2. Design an object structure to store all the data needed for Xecaps, and place this in the [code block](https://www.markdownguide.org/extended-syntax/#fenced-code-blocks) inside the `sampledata.md` file. Specifically, you must consider how to store information about **mission control users** and **space missions** and populate ONE example `control user` and `space mission` in your data structure (any values are fine - see example below).
    * Use the interface table (2.2) to help you decide what data might need to be stored. This will require making some educated guesses about what would be required to be stored in order to return the types of data you see. **Whilst the data structure you describe in data.md might be similar to the interface, it is a different thing to the interface.** If you're still confused, think of the interface like a restaurant menu, and `sampledata.md` like where the food is stored in the back. It's all the same food, but the menu is about how it's packaged up and received from the kitchen, and `sampledata.md` is describing the structure of how it's all stored behind the scenes. 
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
3. Follow best practices for git and teamwork as discussed in lectures.
    * Create a group contract by completing `contract.md` - you may add/edit this template as you see fit.
    * You are expected to have **at least 1 meeting** with your group, and document the meeting(s) in meeting minutes which should be stored at a timestamped location in your repo (e.g. uploading a word doc/pdf or writing in the GitLab repo Wiki after each meeting). We have provided you with a `minutes-template.md` which you may use if you choose.
    * For this iteration each team member will need to make a minimum of **1 merge request per person** in your group into the default (`master` or `main`) branch.
    * **1 merge request per function** must be made (13 in total).
    * Check out the lab on Git from week 1 to get familiar with using Git.
    * Create a Milestone for this Iteration
    * Expand your Issue Board with `In-Progress` and `In-Review` stages
    * Create Issues for your Iteration 0 tasks and assign them to the appropriate team members with deadlines.

### 🛰️ 2.2. Functions to stub

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
    controlUserId: 1,
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

### 🛰️ 2.3 Marking Criteria
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
      <li>At least 1 merge request per person and 1 merge request per function (13 in total) made into the default (<code>master</code> or <code>main</code>) branch</li>
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

### 🛰️ 2.4. Dryrun

We have provided a dryrun for iteration 0 consisting of one test for each function. Passing these tests means you have a correct implementation for your stubs, and have earned the marks for the automarking component iteration 0.**NOTE** This will only be applicable to Iteration 0 - from Iteration 1 onwards the dryrun will not guarantee the automarking marks, just a sanity check for the presence of all the required functions.

To run the dryrun, you should on a CSE machine (i.e. using `VLAB` or `ssh`'ed into CSE) be in the root directory of your project (e.g. `/project-backend`) and use the command:

```bash
~dp1093/bin/xecaps/dryrun 0
```

### 🛰️ 2.5. Submission

Please see section 6 for information on **due date** and on how you will **demonstrate this iteration**.

## 🚀 3. Iteration 1: Basic Functionality and Tests

Coming Soon

## 📡 4. Iteration 2: Building a Web Server

Coming Soon

## 🛸 5. Iteration 3: Completing the Lifecycle

Coming Soon


## 🌸 6. Due Dates and Weightings

| Iteration | Due date                            | Demonstration to tutor(s)      | Assessment weighting (%) |
| --------- | ----------------------------------- | ------------------------------ | ------------------------ |
| 0         | 9am Mon 26th May (**week  3**)  | No demonstration               | 10% of Project Stage 1 ( 3% overall)  |
| 1         | 9am Friday 6th June (**week  4**)  | In YOUR **week  5** tutorial or lab | 90% of Project Stage 1 mark (27% overall)  |
| 2         | 9am Friday 4th July (**week  8**)  | In YOUR **week  9** tutorial or lab | 100% of Project Stage 2 mark (30% overall)  |
| 3         | 9am Wednesday 30th July (**week 12**)  | In YOUR **week 12** tutorial | 100% of Project Stage 3 mark (30% overall)  |

### 🌸 6.1. Submission & Late Penalties

To submit your work, simply have your default (`master` or `main`) branch on the gitlab website contain your groups most recent copy of your code. I.E. "Pushing to default (`master` or `main`)" is equivalent to submitting. When marking, we take the most recent submission on your default (`master` or `main`) branch that is prior to the specified deadline for each iteration.

The following late penalties apply depending on the iteration:
 * Iteration 0: No late submissions at all
 * Iteration 1: Can submit up to 5 days late, with 5% penalty applied every time a 24 hour window passes, starting from the due date 
 * Iteration 2: Can submit up to 5 days late, with 5% penalty applied every time a 24 hour window passes, starting from the due date 
 * Iteration 3: Can submit up to 5 days late, with 5% penalty applied every time a 24 hour window passes, starting from the due date 

We will not mark commits pushed to default (`master` or `main`) branch after the final submission time for a given iteration.

If the deadline is approaching and you have features that are either untested or failing their tests, **DO NOT MERGE IN THOSE MERGE REQUESTS**. In some rare cases, your tutor will look at unmerged branches and may allocate some reduced marks for incomplete functionality, but the default branch (`master` or `main`) should only contain working code.

Minor isolated fixes after the due date are allowed but may carry a penalty to the automark. If the isolated fixes result in a higher automark result (minus the penalty), then we will update your mark. E.g. imagine that your initial automark is 20%, on re-run you get a raw automark of 86%, and your fixes attract a 30% penalty: since the 30% penalty will reduce the mark of 86% to 60%, your final **automark** will be 60%.

If the re-run automark after penalty is lower than your initial mark, we will keep your initial mark. E.g. imagine that your initial automark is 50%, on re-run you get a raw automark of 70%, and your fixes attract a 30% penalty: since the 30% penalty will reduce the mark of 70% to 49%, your final **automark** will still be 50% (i.e. your initial mark).Minor isolated fixes after the due date are allowed but carry a penalty to the automark, if the automark after re-running the autotests is greater than your initial automark. This penalty can be up to 30% of the automarking component for that iteration, depending on the number and nature of your fixes. Note that if the re-run automark after penalty is lower than your initial mark, we will keep your initial mark, meaning your automark cannot decrease after a re-run. E.g. imagine that your initial automark is 50%, on re-run you get a raw automark of 70%, and your fixes attract a 30% penalty: since the 30% penalty will reduce the mark of 70% to 49%, your final automark will still be 50% (i.e. your initial mark).

#### How to request a re-run

* Create a branch, e.g. `iter[X]-fix`, based off the submission commit.
* Make the minimal number of necessary changes (i.e. only fix the trivial bugs that cost you many automarks).
* Create a merge request for this branch, and take note of merge request ID in the URL
  * It is the number at the end of the URL
  * "https://nw-syd-gitlab.cseunsw.tech/DPST1093/25T2/groups/T15A_DESSERT/project-backend/-/merge_requests/**67**"
* Request a re-run on the 're-run request' channel of MS-TEAMS for this course
* Once you request it, it may take up to 72 hours for you to receive the results of the rerun.
  

Please note: The current limit on reruns is **once each week per group**.

##### What constitutes a "trivial fix”?
* Fixing spelling/capitalisation/naming issues with values specified in spec documentation
* Swapping a variable type e.g. token from 'number' to 'string'
* Changing the return value type e.g. returning {} rather than null, to match spec documentation
* Changing route versions e.g. v1 to v2 to match spec documentation
* Fixing import values
* Fixing a regex/logical equality check e.g. num === 0 to num === 1
* Fixing constant variable values e.g. loginAttempts = 1 to loginAttempts = 0
* As a general rule, any change that is < 3 lines of code

### 🌸 6.2. Demonstration

The demonstrations in weeks 5,9 and 12 will take place during your tutorial or lab sessions. All team members **must** attend these demonstrations. Team members who do not attend a demonstration may receive a mark of 0 for that iteration. If you are unable to attend a demonstration due to circumstances beyond your control, you must apply for special consideration.

Demonstrations consist of a 15-20 minute Question and Answer session in front of your tutor. Each team member will be asked to explain their code.

## 👌 7. Individual Assessment

Coming in Iteration 1


## 💻 8. Automarking & Previews

Coming in Iteration 1

## 👀 9. Plagiarism

The work you and your group submit must be your own work. Submission of work partially or completely derived from any other person or jointly written with any other person is not permitted. The penalties for such an offence may include negative marks, automatic failure of the course and possibly other academic discipline. Assignment submissions will be examined both automatically and manually for such submissions.
Relevant scholarship authorities will be informed if students holding scholarships are involved in an incident of plagiarism or other misconduct.
Do not provide or show your project work to any other person, except for your group and the teaching staff of DPST1093. If you knowingly provide or show your assignment work to another person for any reason, and work derived from it is submitted, you may be penalized, even if the work was submitted without your knowledge or consent. This may apply even if your work is submitted by a third party unknown to you.
Note: you will not be penalized if your work has the potential to be taken without your consent or knowledge.
