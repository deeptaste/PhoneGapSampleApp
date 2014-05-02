PhoneGap Demo App
=================

This mobile app uses HTML5, CSS3 and Javascript technologies. JQuery Mobile has been used as UI framework. 
This cross-platform mobile application has been developed with the help of PhoneGap Build.

This mobile app test some of the mobile device features such as Accelerometer, Camera, Geolocation, and others.
Also, the client-server architecture has been implemented for login and some other features.
 
This mobile app has been developed as a part of my dissertation project for MSc. in Software Engineering.

Developer's Details:
	Name	: Diptesh Shrestha 
	Email 	: diptesh.shrestha@gmail.com

Version 1.0
-----------
- Main page with links for testing some mobile device features.
- Links include Device Info, Accelerometer, Camera, Geolocation, Contacts and Media.
- Funcationalities for Device Info, Accelerometer, Camera and Geolocation has been added.
- Funcationalities for Contacts and Media will be added on next version.
- Right side bar includes user login or resistration form.
- User login and registration funcationalities have been included but implements basic testing with server web-service. 
- Proper implementation of user login and registration funcationalities will be included in next version.
- Pages for Device Info, Accelerometer, Camera and Geolocation also have right side bar for quick navigation. 

Version 1.1
-----------
- Changed to SPA (Single Page Application). Therefore, all separate HTML files merged into index.html. 
- Also, the code for respective js files for each HTML pages are placed either in 'index.js' or 'general.js'.
- Changes done to fix jQuery Mobile event handling issues.

Version 1.2
-----------
- Code changed to make sure PhoneGap & jQuery.Mobile libraries are loaded properly before executing any other events.
- Font-awesome used for some cool icons on left side bar of sub-pages.
- All custom js code are now placed under one file named app.js.
- These new js codes make use of object notion to make the code more organized rather than having them in same level
- Some other minor changes in files and folder structure.
- Other bug-fixing.

Version 1.3
-----------
- FastClick library added for quick navigation between pages.
- Custom css file renamed to 'app.css'.
- In config.xml file, Core plugins added directly as in PhoneGap 3 the core api are no more included by default.
- All the necessary icons for different platforms are now added, also the design of app icon has been modified.
- Other bug-fixing.