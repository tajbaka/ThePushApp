# The Push Program

* **Google Play**: https://play.google.com/store/apps/details?id=com.thepushprogram&hl=en
* **Itunes**: https://itunes.apple.com/us/app/the-push-program/id1332530157?mt=8

![Alt text](/dashboard.png)?raw=true "Dashboard"){width=40px height=400px}

## Summary:
The Push Program is a meditation/breathing/posture application.

### Tech Involved: 
* **Mobile Application Front End**: React Native for the front-end of mobile application.
* **Web Application Front End**: ReactJS for front-end of web application.
* **Back End**: Firebase functions, Authentication, Database, Storage, and Cloud Messaging.

### Challenges:
### Challenge 1: Registration
* **Goal**: To allow approval of each registration from the web application front-end.
* **Reasoning**: Our client wanted to approve or reject each user registering their account.
* **What We Did**: Each user that registered through the mobile would be denied entry upon approval from the web application front-end.

### Challenge 2: Dynamic Content
* **Goal**: Allow content on mobile to be modified through the web application.
* **Reasoning**:  Client wanted to have access to written content and voice recordings that are displayed on the mobile application.
* **What We Did**: We used connected the web application and mobile applications to one central database and allowed the web application to change generic components of the database.

### Challenge 3: Push Notifications
* **Goal**: Allow timed Push Notifications to remind users of their exercises.
* **Reasoning**: CLient wanted to have a reminder system for users to notify themselves of their exercise.
* **What We Did**: We used cronjob.org to call our endpoint every minute. Our backend would check if any notifications were due and if so use firebase cloud messaging to push the appropriate message to it's unique user. From the mobile front-end, we used react-native-fcm to retrieve the appropriate message and render the respective screen if clicked.

### Challenge 4: Recordings
* **Goal**: Create a mini music player
* **Reasoning**: Client wanted to allow users to follow recordings that give step by step instruction on how to perform the exercises.
* **What We Did**: We used react-native-sound, a commonly used npm package that gives access to both android and ios sound playing functionalities.From there, we kept in mind the state of the music player and allowed for basic functionalities: Play, Stop, Pause, Fast Forward 30 seconds, and Rewind 30 Seconds.
