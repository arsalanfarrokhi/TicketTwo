require('dotenv').config();
const morgan = require('morgan');

const db = require("./db");

const express = require("express")

const app = express()


app.use(express.json()); //middleware

const port = process.env.PORT || 3001;
app.listen(port, () =>{
    console.log(`server is up and listending on port ${port}`);
})

// retrieve all flight;
app.get("/api/v1/flight", async (req,res)=>{

    try{
        const result = await db.query("SELECT * FROM flight");

        console.log(result);
        res.status(200).json({
            status:"success",
            results: result.rows.length,
            data:{
                flight: result.rows
            }
        })
    }catch(err){
        console.log(err)
    }
});

// retrieve one flight;
app.get("/api/v1/flight/:flightid", async (req, res)=> {
    console.log(req.params.flightid);

    try{
        const result = await db.query("SELECT * FROM flight WHERE flightid= $1", [
            req.params.flightid
        ]);
        
        res.status(200).json({
            status:"Success",
            data:{
                flight: result.rows[0]
            },
        }); 
    }catch(err){
        console.log(err)
    }
});

// Create flight;
app.post("/api/v1/flight", async (req, res) => {
    console.log(req.body);

    try{
        const result = await db.query(
            "INSERT INTO flight (flightid, fromairport, toairport, capacity, departuretime, arrivaltime) VALUES ($1,$2,$3,$4,$5,$6) returning *" ,
            [req.body.flightid, req.body.fromairport, req.body.toairport, req.body.capacity, req.body.departuretime, req.body.arrivaltime]
        );
        console.log(result);
        res.status(201).json({
            status:"Success",
            data:{
                flight: result.rows[0],
            },
        });
    }catch(err){
        console.log(err);
    }
});

// Update flight;
app.put("/api/v1/flight/:flightid", async (req,res)=>{

    try{
        const results = await db.query(
            "UPDATE flight SET fromairport = $1, toairport = $2, capacity = $3, departuretime = $4, arrivaltime = $5 WHERE flightid = $6 returning *",
            [req.body.fromairport, req.body.toairport, req.body.capacity, req.body.departuretime, req.body.arrivaltime, req.params.flightid]
        );
        console.log(results);
        res.status(200).json({
            status:"Success",
            data:{
                flight: results.rows[0],
            },
        });
    }catch(err){
        console.log(err)
    }
});

// Delete flight;
app.delete("/api/v1/flight/:flightid", async (req, res)=> {
    try{
        const results = await db.query(
            "DELETE FROM flight where flightid = $1",
            [req.params.flightid]
        );
        res.status(204).json({
        status:"success",
        // no data sending back, so it just delete. 
        });
    }catch(err){
        console.log(err);
    }
});



// retrive all airport;
// retrive one airport;
// Update airport;
// Create airport;
// Delete airport;

// retrieve one user;
// Create user;
// Update user;

// Retrieve one traveler;
// Create traveler;
// Update traveler;
// Delete traveler;

// Retrieve one traveler;
// Create traveler;
// Update traveler;
// Delete traveler;

// Retrieve one ticket;
// Create ticket;
// Update ticket;
// Delete ticket;


