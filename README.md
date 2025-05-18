# Blog-App-Backend

A RESTful API backend for a blogging platform, built using Node.js, Express, and MongoDB. This backend supports user authentication, blog management (create, read, update, delete), and filtering blogs by category and author.

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete blogs with authorization
- Filter blogs by category and author
- Timestamps for blog creation and updates
- Data validation and error handling

## Tech Stack

- Node.js
- Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- bcrypt for password hashing
- dotenv for environment variables

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB instance (local or cloud)
- Postman or similar tool for testing APIs

### Installation

1. Clone the repo:

git clone https://github.com/prasanth2817/Blog-App-Backend.git
cd Blog-App-Backend

2. Install dependencies:

npm install

3.Create a .env file in the root directory and add:

PORT=8000
DbUrl=your_mongodb_connection_string
DbName=your_DbName
JWT_SECRECT=your_jwt_secret_key
JWT_EXPIRE=1d
SALT_ROUNDS=10

4. Start the server:

npm start

API Endpoints
Method	Endpoint	      Description       	Auth Required
POST	/auth/register	Register a new user     	No
POST	/auth/login	Login and get JWT token     	No
POST	/blogs	Create a new blog	                Yes
GET	  /blogs	Get all blogs or filter blogs	    Yes
GET	  /blogs/user	Get blogs by logged-in user	  Yes
PUT	  /blogs/:id	Update a blog by ID	          Yes
DELETE /blogs/:id	Delete a blog by ID	          Yes

Testing
Use Postman or any API client to test the routes. Make sure to include the Authorization header with the JWT token for protected routes:

Authorization: Bearer <token>

Contributing
Feel free to open issues or submit pull requests!
