const express = require('express');
require('dotenv').config();
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/flights', async (req, res) =>{
    const {from, to, when} = req.query;
    try{
        
        const results = await db.query("select * from flight where fromairport = $1 and toairport = $2 and date(departuretime) = $3;", [from, to, when]); 
        console.log(results.rows);
        res.status(200).json({
        results: results.rows.length, 
        status: 'success',
        data: results.rows
    })
    } catch(err){
        console.log(err);
    }
});
app.get('/api/login', async (req, res) =>{
    const {email, password} = req.query;
    try{
        
        const results = await db.query("select * from _user where email=$1;", [email]);
        const user = results.rows[0];
        if(user.password !== password){
            res.status(200).json({
                results: 0, 
                status: 'Incorrect password',
                data: []
            })
        }
        else{
            console.log(results.rows);
            res.status(200).json({
            results: results.rows.length, 
            status: 'success',
            data: results.rows[0]
            })
        }
    } catch(err){
        console.log(err);
    }
});

app.get('/api/admin/users', async(req, res) =>{
    const {email} = req.query;
    try{
        var results;
        if(email===undefined){
            results = await db.query('select userid, email, password from _user where privilege <> 1 order by userid;');
        }
        else{
            results = await db.query(`select userid, email, password from _user where privilege <> 1 and email like '${email}%';`);
        }
            res.status(200).json({
                results: results.rows.length, 
                status: 'success',
                data: {
                    users: results.rows
                }
        
           })
    }catch(err){
        res.status(200).json({
            results: results.rows.length, 
            status: 'failed',
            data: {
                users: results.rows
            }
    
       })
    }
})

app.post('/api/admin/users', async (req, res) =>{
    try{
        let email = req.body.email;
        let password = req.body.password;
        const res_id = await db.query('select max(userid)+1 as newid from _user;');
        let id = res_id.rows[0].newid;
        if(id === null){
            id = 0;
        }
        const results = await db.query("insert into _user (userid, email, password, privilege) values ($1, $2, $3, $4) returning * ;", [id, email, password, 0]);
        res.status(200).json({
            results: results.rows.length, 
            status: 'success',
            data: {
                users: results.rows
            }
        })
    }catch(err){
        console.log(err);
    }
})

app.put('/api/admin/users', async(req, res) =>{
    const {id, email, password} = req.body;
    try{
        const results = await db.query('update _user set email = $1, password = $2 where userid = $3 returning *;', [email, password, id]);
        res.status(200).json({
            results: results.rows.length, 
            status: 'success',
            data: {
                users: results.rows
            }
        })
    }catch(err){
        console.log(err);
        res.json({ 
            status: 'failed',
            data: {
            }
        })
    }
})

app.delete('/api/admin/users', async (req, res) =>{
    const {id} = req.query;
    console.log(id);
    try{
        const results = await db.query('delete from _user cascade where userid = $1 returning *;', [id]);
        res.status(200).json({
            results: results.rows.length, 
            status: 'success',
            data: {
                users: results.rows
            }
        })
    }catch(err){
        console.log(err);
        res.json({ 
            status: 'failed',
            data: {
            }
        })
    }
})
app.post('/api/admin/tickets', async (req, res) =>{
    const {email, fn, ln, phone, dob, flightid} = req.body;
    try{
        console.log(email);
        const user = await db.query(`select * from _user where email = '${email}';`);
        var userid;
        if(user.rows.length === 0){
            const res_id = await db.query('select max(userid)+1 as newid from _user;');
            userid = res_id.rows[0].newid;
            if(userid === null){
                userid = 0;
            }
            const results = await db.query("insert into _user (userid, email, password, privilege) values ($1, $2, $3, $4) returning * ;", [userid, email, "12345", 0]);
        }
        else{
            userid = user.rows[0].userid;
        }
        const res_id = await db.query('select max(travelerid)+1 as newid from traveler;');
        let id = res_id.rows[0].newid;
        if(id === null){
            id = 0;
            const new_user = await db.query("insert into traveler (travelerid, firstname, lastname, email, phonenum, dob) values ($1, $2, $3, $4, $5, $6) returning *;", [id, fn, ln, email, phone, dob]);
        }
        const res_ticket_id = await db.query('select max(ticketid)+1 as newid from ticket');
        let ticket_id = res_ticket_id.rows[0].newid;
        if(ticket_id === null){
            ticket_id = 0;
        }
        const results = await db.query("insert into ticket values ($1, $2, $3, $4) returning *;", [ticket_id, flightid, id, userid]);
        const new_flight = await db.query("update flight set capacity = capacity - 1 where flightid = $1;", [flightid]);
        res.status(200).json({ 
            status: 'success',
        })
    }catch(err){
        console.log(err);
    }
})

const port = process.env.port;
app.listen(port, () => {
    console.log("listening on ", port);
});