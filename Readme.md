A Fullstack Youtube Clone Application.

Model's Link followed throughtout the project : https://app.eraser.io/workspace/3v90aH438AJbbI1XImQ1

1) Created a Public folder and a folder named temp (to store the images on the server from cloud temporarily).
2) Use git ignore generator : https://mrkandreev.name/snippets/gitignore-generator/ to generate git ignore.
3) Install Dev Dependency Nodemon (npm i -D nodemon)
4) Add a script dev in package.json
5) Add a npm package "Prettier" and add files (.prettierrc,.prettierignore(env,envsample etc))
6) Used MongoDB atlas to create a DB and add allow connections from anywhere ("0.0.0.0/0")
7) Establish DB index.js and put informations.
8) Import express app.js
9) Install Cookie parser and cors package
10) Import these packages in app.js
11) Configure Cors in app.js and .env.
12) Make a try catch utility asyncHandler (to handle async await try catch).
13) To make sending errors and json as a standard method we take use of Nodejs's error class (utils->ApiError and ApiResponse.js).