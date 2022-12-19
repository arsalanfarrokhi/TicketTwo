const db = require('./db');
require('dotenv').config();

const airports = [
    {
        ID: 'TPA',
        City: 'Tampa',
        State: 'Fl',
        Country: 'United States'
    },
    {
        ID: 'JFK',
        City: 'New York City',
        State: 'NY',
        Country: 'United States'
    },
    {
        ID: 'MIA',
        City: 'Miami',
        State: 'Fl',
        Country: 'United States'
    }

];

const flights = [
    {
        FlightID: 1,
        From: 'TPA',
        To: 'JFK',
        Capacity: 60,
        DepartureTime: '2022-7-01 08:00:00 -4:00:00',
        ArrivalTime: '2022-7-01 10:30:00 -4:00:00' 
    },
    {
        FlightID: 2,
        From: 'JFK',
        To: 'TPA',
        Capacity: 60,
        DepartureTime: '2022-7-01 20:00:00 -4:00:00',
        ArrivalTime: '2022-7-01 22:30:00 -4:00:00' 
    },
    {
        FlightID: 3,
        From: 'TPA',
        To: 'MIA',
        Capacity: 60,
        DepartureTime: '2022-7-02 08:00:00 -4:00:00',
        ArrivalTime: '2022-7-02 10:30:00 -4:00:00' 
    },
    {
        FlightID: 4,
        From: 'MIA',
        To: 'TPA',
        Capacity: 60,
        DepartureTime: '2022-7-02 20:00:00 -4:00:00',
        ArrivalTime: '2022-7-02 22:30:00 -4:00:00' 
    },


]

const users = [
    {
        ID: 1,
        email: 'siu0@gmail.com',
        password: 'ababa',
        privelege: 0 
    },
    {
        ID: 2,
        email: 'siu1@gmail.com',
        password: 'abebe',
        privelege: 0 
    },
    {
        ID: 3,
        email: 'siuadmin0@gmail.com',
        password: 'ababa',
        privelege: 1
    }
]

const travelers = [
    {
        ID: 1,
        fn: 'Arsalan',
        ln: 'Farrokhi',
        email: 'siu0@gmail.com',
        phonenum: '+13322077934',
        passportid: null,
        dob: '2002-12-22'
    }
]
const populate_airports = async (airports) =>{
    for(let airport of airports){
        try{
            const result = await db.query("insert into airport values ($1, $2, $3, $4) returning *;", [airport.ID, airport.City, airport.State, airport.Country]);
            console.log(result.rows)
        } catch(err) {
            console.log(err);
        }
    }
};
const populate_flights= async (flights) =>{
    for(let flight of flights){
        try{
            
            const result = await db.query("insert into flight values ($1, $2, $3, $4, $5, $6) returning * ;", [flight.FlightID, flight.From, flight.To, flight.Capacity, flight.DepartureTime, flight.ArrivalTime]);
            console.log(result.rows)
            } catch(err) {
            console.log(err);
        }
    }
};

const populate_users= async (users) =>{
    for(let user of users){
        try{
            //console.log(user);
            const result = await db.query("insert into _user (userid, email, password, privilege) values ($1, $2, $3, $4) returning * ;", [user.ID, user.email, user.password, user.privelege]);
            console.log(result.rows)
            } catch(err) {
            console.log(err);
        }
    }
};
const populate_travelers = async (travelers) =>{
    for(let traveler of travelers){
        try {
            console.log([traveler.ID, traveler.fn, traveler.ln, traveler.email, traveler.phonenum, traveler.passportid, traveler.dob]);
            const result = await db.query("insert into traveler values ($1, $2, $3, $4, $5, $6, $7) returning * ;", [traveler.ID, traveler.fn, traveler.ln, traveler.email, traveler.phonenum, traveler.passportid, traveler.dob]);
            console.log(result.rows)
    
        } catch (err) {
            console.log(err);
            
        }
    }
}
//populate_airports(airports); //Call to populate airports
//populate_flights(flights); //Call to populate flights
// populate_users(users); //Call to populate users
// populate_travelers(travelers);//Call to populate travelers