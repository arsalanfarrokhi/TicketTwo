# TicketTwo
WebDev PERN based project
## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
The project is a ticketing web application backed up by ReactJS and its ContextAPI, enabling the client side to function
smoothly and allow data to flow across the application. The backend is built on ExpressJS, used to retrieve and send data to the PostgreSQL database.

## Technologies
Project is created with:
* PostgreSQL
* NodeJS
* ExpressJS
* ReactJS
	
## Setup
To run this project:

Open command prompt and enter the command to enter the postgreSQL command propmt
```
$ psql
```
Copy the script from ./database_creation/to_populate.sql and enter in the command prompt

Create a new command prompt
```
$ cd ../client
$ npm install
$ npm start
```

Create a new command prompt
```
$ cd ../server
$ npm install
$ npm start
