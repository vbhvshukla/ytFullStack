A Fullstack Youtube Clone Application.

Model's Link followed throughtout the project : https://app.eraser.io/workspace/3v90aH438AJbbI1XImQ1

1. Created a Public folder and a folder named temp (to store the images on the server from cloud temporarily).
2. Use git ignore generator : https://mrkandreev.name/snippets/gitignore-generator/ to generate git ignore.
3. Install Dev Dependency Nodemon (npm i -D nodemon)
4. Add a script dev in package.json
5. Add a npm package "Prettier" and add files (.prettierrc,.prettierignore(env,envsample etc))
6. Used MongoDB atlas to create a DB and add allow connections from anywhere ("0.0.0.0/0")
7. Establish DB index.js and put informations.
8. Import express app.js
9. Install Cookie parser and cors package
10. Import these packages in app.js
11. Configure Cors in app.js and .env.
12. Make a try catch utility asyncHandler (to handle async await try catch).
13. To make sending errors and json as a standard method we take use of Nodejs's error class (utils->ApiError and ApiResponse.js).
14. Make model user and video in models.
15. Install a package mongoose aggregate paginate v2(used in video model) and bcryptjs
16. Added jsonwebtoken
17. As soon as the data is going to be saved in database, we can run pre hook of mongoose (encrypt password). (In user.model.js Prehook) (comparePassword method in user.model.js)
18. Install jsonwebtoken , Make Access/Refresh Token Secret in ENV
19. File upload (utility / cloudnary or fileupload) using Cloudinary and Multer(install)
20. Add utils/cloudinary to env variables.
21. Added Multer(fileuploader) middleware
22. Make controllers first being user.
23. Make user route in routes and import in app.js
24. In user.controller.js Create userRegister using asynchandler , take avatar localfilepath using req.files upload files on cloudinary.
25. Create user from User schema (User.create) and send the response as return res.json(userCreated);
26. In cloudinary.js in utils we added fs.unlink to delete file from temp after successfully getting uploaded as well as upon failing.
27. Added generateToken , generateRefreshToken in user.model.js
28. Making a Controller -> loginUser
29. Designing a middleware for Controller -> logoutUser
30. Making a auth.middleware.js
31. Add route in user.route.js
32. Make an endpoint to refresh a user token so that frontend people can use it to reauthenticate a user if accesstoken is expired or user not logged in. (in user.controller.js refreshAccessToken Method).
33. Added a refreshToken endpoint in user.routes.js

