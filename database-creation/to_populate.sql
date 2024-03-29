CREATE DATABASE db_design;
\c db_design;

CREATE TABLE _user (
    UserID INTEGER PRIMARY KEY,
    Email varchar(255) UNIQUE NOT NULL,
    Password VARCHAR(30) NOT NULL,
    Privilege integer NOT NULL DEFAULT 0) ;



CREATE TABLE Airport (
    AirportID CHAR(3),
    City VARCHAR(50) NOT NULL,
    State VARCHAR(50),
    Country VARCHAR(56) NOT NULL,
    CONSTRAINT airport_pk PRIMARY KEY(AirportID));



CREATE TABLE Traveler (
    TravelerID INTEGER,
    FirstName VARCHAR(30) NOT NULL,
    LastName VARCHAR(60) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    PhoneNum VARCHAR(16) NOT NULL,
    PassportID VARCHAR(15),
    DOB DATE NOT NULL,
    CONSTRAINT t_pk PRIMARY KEY(TravelerID),
    CONSTRAINT t_uniq UNIQUE (PassportID));



CREATE TABLE Flight (
    FlightID INTEGER,
    FromAirport CHAR(3) NOT NULL REFERENCES Airport ON UPDATE CASCADE ON DELETE CASCADE,
    ToAirport CHAR(3) NOT NULL REFERENCES Airport ON UPDATE CASCADE ON DELETE CASCADE,
    Capacity INTEGER NOT NULL,
    DepartureTime TIMESTAMP(0) WITH TIME ZONE NOT NULL,
    ArrivalTime TIMESTAMP(0) WITH TIME ZONE NOT NULL,
    CONSTRAINT pk PRIMARY KEY (FlightID));


CREATE TABLE Ticket (
    TicketID INTEGER,
    AssociatedWith INTEGER NOT NULL,
    BookedFor INTEGER NOT NULL,
    BookedBy INTEGER NOT NULL,
    CONSTRAINT ticket_pk PRIMARY KEY(TicketID),
    CONSTRAINT ticket_fk_flight FOREIGN KEY(AssociatedWith) REFERENCES Flight ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT ticket_fk_traveler FOREIGN KEY(BookedFor) REFERENCES Traveler ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT ticket_fk_user FOREIGN KEY (BookedBy) REFERENCES _user ON UPDATE CASCADE ON DELETE CASCADE);

CREATE VIEW flight_view as (select FromAirport, ToAirport, DepartureTime, ArrivalTime from flight where capacity > 0);

\copy _user FROM 'Users.csv' WITH DELIMITER ',' CSV HEADER;

\copy Airport FROM 'Airports.csv' WITH DELIMITER ',' CSV HEADER;

\copy Traveler FROM 'Travelers.csv' WITH DELIMITER ',' CSV HEADER;

\copy Flight FROM 'Flights.csv' WITH DELIMITER ',' CSV HEADER;

\copy Ticket FROM 'Tickets.csv' WITH DELIMITER ',' CSV HEADER;

CREATE VIEW user_ticket_info AS SELECT ticketid , F.flightid AS flightid, fromairport , toairport, departuretime, arrivaltime, firstname, lastname, DATE(dob),bookedby as userid, bookedfor as travelerid, passportid  
FROM (traveler RIGHT JOIN ticket ON traveler.travelerid = ticket.bookedfor) AS T LEFT JOIN flight F ON T.associatedwith = F.flightid ORDER BY ticketid;