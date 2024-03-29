const express = require('express');
require('dotenv').config();
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json()); // middleware ; use to retrieve info in body/ jason sent from client into a js, so we can maniputale

//Get all flights

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
            console.log(email);
            results = await db.query(`select userid, email, password from _user where privilege <> 1 and email LIKE '%${email}%';`);
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
            status: 'failed'
    
       })
    }
})

//Get one user by id from Admin
app.get('/api/admin/users/:id', async(req, res) =>{
    try{
								   
										 
        const {id} = req.params;
									  
						
				   
		 
        const results = await db.query("SELECT userid, email, password FROM _user WHERE userid = $1;",[id]);
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

// Update user id from admin
app.put('/api/admin/users/:id', async(req, res) =>{
    const {id} = req.params;
    try{
        const{email, password} = req.body;
        console.log(email, password);
        const results = await db.query('update _user set email = $1, password = $2 where userid = $3 returning *;', [email, password, id]);
        res.status(200).json({
            results: results.rows.length, 
            status: 'update success',
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

// Delete a user by id from admin
app.delete('/api/admin/users/:id', async (req, res) =>{
    const {id} = req.params;
					
    try{
        // update capacity,

        await db.query(

            "UPDATE flight SET capacity = capacity+1 WHERE flightid IN(SELECT associatedwith FROM ticket WHERE bookedby = $1);", [id]);
        
                            // // delete tickets (if no constraints, un-comment the below query)
        // await db.query("DELETE FROM ticket WHERE bookedby = $1;", [id]);

        // delete user. 
        const results = await db.query('delete from _user where userid = $1 returning *;',[id]);
        res.status(200).json({
            results: results.rows.length, 
            status: 'delete success',
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

// Get one tickets by ticketid from admin
app.get('/api/user/tickets/:id' ,async(req,res) =>{
    const {id} = req.params;
    try{
        const results = await db.query('SELECT * FROM  user_ticket_info WHERE userid = $1 ORDER BY ticketid;', [id]);
									  
																				  
		 
			 
																																				
		 
        res.status(200).json({
            results: results.rows.length, 
            status: 'success',
            data: {
                tickets: results.rows
            }
        })
    }catch(err){
        console.log(err);
							
	
		 
    }
})

// Cancel a ticket by ticket id
app.delete('/api/user/tickets/:id', async (req, res) =>{
    const {id} = req.params;
    try{
        // capacity +1
        await db.query("UPDATE flight SET capacity = capacity+1 WHERE flightid =(SELECT associatedwith FROM ticket WHERE ticketid = $1);", [id]);
        const results = await db.query('DELETE FROM ticket WHERE ticketid = $1 returning *;',[id]);
        res.status(200).json({
            results: results.rows.length, 
            status: 'delete success',
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

// Get all travelers
app.get('/api/admin/travelers', async(req, res) =>{
    const { traveler_name } = req.query;
    try{
        var results;
        if(traveler_name===undefined){
            results = await db.query('select * from traveler order by lastname;');
        }
        else{
            results = await db.query(`select * from traveler where firstname LIKE '%${traveler_name}%' or lastname LIKE '%${traveler_name}%';`);
        }
        res.status(200).json({
            results: results.rows.length, 
            status: 'success',
            data: {
                travelers: results.rows
            }
        })
    }catch(err){
        res.status(200).json({
            status: 'failed'
    
       })
    }
})

app.put('/api/admin/travelers', async(req, res) =>{
    const {id, firstname, lastname, email, phonenum, passportid, dob} = req.body;
    try{
        const results = await db.query('update traveler set firstname = $1, lastname = $2, email = $3, phonenum = $4, passportid = $5 dob = $6 where travelerid = $7 returning *;',
                                        [firstname, lastname, email, phonenum, passportid, dob, id]);
        res.status(200).json({
            results: results.rows.length, 
            status: 'success',
            data: {
                travelers: results.rows
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

app.post('/api/admin/travelers', async (req, res) =>{
    try{
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let phonenum = req.body.phonenum;
        let passportid = req.body.passportid;
        let dob = req.body.dob;
        const res_id = await db.query('select max(travelerid)+1 as newid from traveler;');
        let id = res_id.rows[0].newid;
        if(id === null){
            id = 0;
        }
        const results = await db.query("insert into traveler (travelerid, firstname, lastname, email, phonenum, passportid, dob) values ($1, $2, $3, $4, $5, $6, $7) returning * ;",
                                         [id, firstname, lastname, email, phonenum, passportid, dob]);
        res.status(200).json({
            results: results.rows.length, 
            status: 'success',
            data: {
                travelers: results.rows
            }
        })
    }catch(err){
        console.log(err);
    }
})

app.delete('/api/admin/travelers', async (req, res) =>{
    const { id } = req.query;
    // console.log(id);
    try{
        const results = await db.query('delete from traveler cascade where travelerid = $1 returning *;', [id]);
        res.status(200).json({
            results: results.rows.length, 
            status: 'success',
            data: {
                travelers: results.rows
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

// Get tickets for a traveler
app.get('/api/admin/travelers/tickets', async(req, res) =>{
    const { id } = req.query;
    try{
        const results = await db.query('select * from ticket where bookedfor = $1;', [id]);
        console.log(id);
        res.status(200).json({
            results: results.rows.length, 
            status: 'success',
            data: {
                tickets: results.rows,
            }
        })
    }catch(err){
        res.status(200).json({
            status: 'failed'
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
        }
        const new_user = await db.query("insert into traveler (travelerid, firstname, lastname, email, phonenum, dob) values ($1, $2, $3, $4, $5, $6) returning *;", [id, fn, ln, email, phone, dob]);
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