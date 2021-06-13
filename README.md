# Full-stack File Upload Exercise 

### Description

This application demonstrates how a single page front-end application can send csv file data to a backend API and receive calculated results back.

### Run Setup Requirement

Before running this project make sure Node.js and npm is installed (see https://nodejs.org/en/download/).

For this project to work correctly, make sure that the single page application and back-end API application are running concurrently. This will require running the application start commands on two different terminals.

The file that needs to be uploaded using the single page application is "100 Sales Records".csv which is located in the [file-upload-application/files](file-upload-application/files) directory. From this file, the back-end API is designed to calculate the Total Units Sold for each region and send it back to the single page application.

## Single Page Application

### Features

Application was developed using React library.

The main components of application page are:
- A file input for the user to upload the csv file.
- A button which submits the uploaded file to the back-end API application.
- A column chart which displays the Total Units Sold per Region data (only displayed once data received from the back-end API). 

### Repo Root Directory

[file-upload-application](https://github.com/SB4647/Full-stack-code-test/tree/master/file-upload-application)

### Run command

Run the command 'npm start' from the [file-upload-application](./file-upload-application) root directory in terminal. The application should then run on [http://localhost:3000](http://localhost:3000) in the web browser.

## Back-end API 

### Features

Application was developed using Node.js runtime and Express.js framework.

The basic flow of application involves:

1. Listening to port 8000 for a request (containing the file data) from the single page application.
2. When a request is received, the csv file is saved into the file-upload-api/public folder.
3. The csv file data is then converted into a JSON array.
4. Sales records where region = Europe is removed from the array.
5. The array data is sorted alphabetically by Region.
6. The array is reduced into an array containing the Total Units Sold for each region.
7. The array data is then sent back to the single page application.

### Repo Root Directory

[file-upload-api](https://github.com/SB4647/Full-stack-code-test/tree/master/file-upload-api)

### Run command

Run the command 'node app.js' from the [file-upload-api](./file-upload-api) root directory in terminal. The application should then start running and show the message "App running on port 8000" in the terminal.

