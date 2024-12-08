# Instapics

Instapics is a social media platform that allows users to post and share photos and stories, as well as like and comment on other users' posts. This repository contains the code for the frontend and backend of the application.

## Getting Started

To run the application, you will need to set up a MongoDB database and install the necessary dependencies. Here is a step-by-step guide to setting up the application:

### Install dependencies

Install the dependencies for the frontend and backend by running the following commands in the terminal:

    yarn install
    cd client && yarn install && cd ..

You will also need to add the following environment variables to your .env file:

MONGO_URI=
CLOUDINARY_NAME=
CLOUDINARY_APIKEY=
CLOUDINARY_SECRETKEY=
CLOUDINARY_UPLOAD_PRESET=
JWT_SECRET_KEY=
NODE_ENV=
EMAIL=
EMAIL_PASSWORD=
CLIENT_URL=
JWT_ACCESS_TOKEN_EXPIRY=
JWT_REFRESH_TOKEN_EXPIRY=

### Start the application

Start the application by running the following commands in the terminal:

    yarn dev
    cd client && yarn dev && cd ..

This will start the frontend and backend servers.
