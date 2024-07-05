Video Management Application

Description
This project is a video management platform built using Node.js, Express.js, and MongoDB. It provides secure authentication, customizable channels, personalized watch history, and a subscription system for channel and playlist management, enhancing user interaction by 25%.

Users can seamlessly manage their video content, including uploading, deleting, and updating videos.

Technical Highlights
Backend: Built with Node.js and Express.js
Database: MongoDB for data storage
Authentication: JWT (JSON Web Tokens) for secure authentication
Encryption: Bcrypt Hashing for password encryption
Video Storage: Cloudinary Integration for efficient video storage
File Uploads: Multer used for handling file uploads
RESTful API: Implemented for communication between frontend and backend
Installation
Clone the repository:

bash
Copy code
git clone [https://github.com/your-username/repository-name.git](https://github.com/vbhvshukla/ytFullStack.git)
Install dependencies:

bash
Copy code
cd repository-name
npm install
Set up environment variables:

Create a .env file in the root directory and add the following:

plaintext
Copy code
PORT=3000
MONGODB_URI=mongodb://localhost:27017/video_management_db
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Start the server:

bash
Copy code
npm start
Usage
Describe how to use your application here. Include examples of API endpoints if applicable.

Contributing
Fork the repository.
Create a new branch (git checkout -b feature/improvement).
Make your changes.
Commit your changes (git commit -am 'Add new feature').
Push to the branch (git push origin feature/improvement).
Create a new Pull Request.
