import React, { useContext, useEffect, useState } from 'react'
import server from '../apis/server';
import moment from "moment";

import { TravelersContext } from '../context/TravelersContext';
 
const TravelerList = () => {
  const {travelers, setTravelers} = useContext(TravelersContext);
  const [add, setAdd] = useState(0);
  const [edit, setEdit] = useState({ show: 0, id: null });
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [email, setEmail] = useState(null);
  const [phonenum, setPhonenum] = useState(null);
  const [passportid, setPassportid] = useState(null);
  const [dob, setDob] = useState(null);
  const [newFirstname, setNewFirstname] = useState(null);
  const [newLastname, setNewLastname] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newPhonenum, setNewPhonenum] = useState(null);
  const [newPassportid, setNewPassportid] = useState(null);
  const [newDob, setNewDob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await server.get("/admin/travelers");
        setTravelers(response.data.data.travelers);
      } catch(err) {
        console.log(err);
      }
    };

    fetchData();
  }, [])

  const HandleDelete = async (id) => {
    try {
      const ans = window.confirm(
        "Deleting traveler will cause cascade deletion. Confirm?"
      );
      if (ans === true) {
        console.log("Deleting");
        await server.delete("/admin/travelers", {
          params: { id: id },
        });
        const new_resp = await server.get("/admin/travelers");
        setTravelers(new_resp.data.data.travelers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleSubmit = async (id) => {
    try {
      const traveler = travelers.filter((traveler) => traveler.travelerid === id)[0];
      const params = { id: id, firstname: firstname, lastname: lastname, 
        email: email, phonenum: phonenum, passportid: passportid, dob: dob};
      if (params.firstname === null) {
        params.firstname = traveler.firstname;
      }
      if (params.lastname === null) {
        params.lastname = traveler.lastname;
      }
      if (params.email === null) {
        params.email = traveler.email;
      }
      if (params.phonenum === null) {
        params.phonenum = traveler.phonenum;
      }
      if (params.passportid === null) {
        params.passportid = traveler.passportid;
      }
      if (params.dob === null) {
        params.dob = traveler.dob;
      }
      const response = await server.put("/admin/travelers", {
        id: params.id, 
        firstname: params.firstname, 
        lastname: params.lastname, 
        email: params.email, 
        phonenum: params.phonenum, 
        passportid: params.passportid, 
        dob: params.dob
      });
      console.log(response.data);
      setEdit({ show: 0, id: null });
      const new_resp = await server.get("/admin/travelers");
      setTravelers(new_resp.data.data.travelers);
    } catch (err) {
      console.log(err);
    }
  };

  const Edit = async (id) => {
    try {
      if (edit.show === 1) {
        setEdit({ show: 0, id: null });
      } else {
        setEdit({ show: 1, id: id });
      }
    } catch (err) {}
  };

  const AddTraveler = async () => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (newFirstname !== "" && newLastname !== "" && newEmail.match(validRegex) !== null && 
      newPhonenum !== "" && newDob !== "") {
      try {
          await server.post("/admin/travelers", {
          firstname: newFirstname,
          lastname: newLastname,
          email: newEmail, 
          phonenum: newPhonenum,
          passportid: newPassportid,
          dob: newDob,
        });
        setAdd(add + 1);
        const new_resp = await server.get("/admin/travelers");
        setTravelers(new_resp.data.data.travelers);
      } catch (err) {}
    }
  };

  const SearchFor = async (traveler_name) => {
    if (traveler_name !== "") {
      try {
        const req = await server.get("/admin/travelers", { params: { traveler_name: traveler_name }});
        setTravelers(req.data.data.travelers);
      } catch (err) {}
    }
    else if(traveler_name === ""){
      try {
        const req = await server.get("/admin/travelers");
        setTravelers(req.data.data.travelers);
      } catch (err) {}
    }
  }

  return (
    <div className='container'>
      <div className="row">
        <div className="col-6">
            <h1 className="">Travelers</h1>
        </div>
        <div className="col-4">
          <input
            className="form-control"
            placeholder="Look for a traveler"
            onChange={(e) =>SearchFor(e.target.value)}
          />
        </div>
        <div className="col-2">
          <button
            className=" btn btn-primary justify-content-end"
            onClick={() => setAdd(add + 1)}
          >
            Add a traveler
          </button>
        </div>
        {add % 2 === 1 && (
          <div className="row m-4 ml-3 p-4">
            <div className="col-5">
              <input
                type="firstname"
                className="form-control"
                placeholder="first name"
                onChange={(e) => setNewFirstname(e.target.value)}
              />
            </div>
            <div className="col-5">
              <input
                className="form-control"
                placeholder="lastname"
                onChange={(e) => setNewLastname(e.target.value)}
              />
            </div>
            <div className="col-5">
              <input
                type="email"
                className="form-control"
                placeholder="email"
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="col-5">
              <input
                className="form-control"
                placeholder="phonenum"
                onChange={(e) => setNewPhonenum(e.target.value)}
              />
            </div>
            <div className="col-5">
              <input
                className="form-control"
                placeholder="passportid"
                onChange={(e) => setNewPassportid(e.target.value)}
              />
            </div>
            <div className="col-5">
              <input
                className="form-control"
                placeholder="dob"
                onChange={(e) => setNewDob(e.target.value)}
              />
            </div>
            <div className="col-2">
              <button type="button" className="btn btn-primary btn-block justify-content-center" onClick={AddTraveler}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="row">
        <table class="table">
          <thead class="thead-dark">
            <tr className='bg-dark text-white'>
              <td className='col-2'>Name</td>
              <td className='col-2'>Date of Birth</td>
              <td className='col-2'>Phone Number</td>
              <td className='col-2'>Email</td>
              <td className='col-2'>Passport ID</td>
              <td className='col-1'>Edit</td>
              <td className='col-1'>Delete</td>
            </tr>
          </thead>
          <tbody>
            {travelers && travelers.map((traveler) => {
              return(
                <>
                  <tr key={traveler.travelerid}>
                    <td>{traveler.lastname}, {traveler.firstname}</td>
                    <td>{moment(traveler.dob).format('MM/DD/YYYY')}</td>
                    <td>{traveler.phonenum}</td>
                    <td>{traveler.email}</td>
                    <td>{traveler.passportid}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => Edit(traveler.travelerid)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-primary" onClick={() => HandleDelete(traveler.travelerid)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                  {edit.show === 1 && edit.id === traveler.travelerid && (
                    <>
                      <tr class="table-active">
                      <th className='col-2'></th>
                      <th className='col-3'>First Name</th>
                      <th className='col-2'>Last Name</th>
                      <th className='col-2'>Email</th>
                      <th className='col-2'>Phone Number</th>
                      <th className='col-3'>Passport</th>
                      <th className='col-2'>D.O.B.</th>
                      <th className='col-1'></th>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <input
                          type="firstname"
                          className="form-control"
                          defaultValue={traveler.firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          defaultValue={traveler.lastname}
                          onChange={(e) => setLastname(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          className="form-control col-md-6"
                          aria-describedby='emailHelp'
                          defaultValue={traveler.email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          defaultValue={traveler.phonenum}
                          onChange={(e) => setPhonenum(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          defaultValue={traveler.passportid}
                          onChange={(e) => setPassportid(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          defaultValue={traveler.dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </td>
                      <td>
                        <button type="submit" className="btn btn-primary" onClick={() => HandleSubmit(traveler.travelerid)}>
                          Submit
                        </button>
                      </td>
                    </tr></>
                  )}
                </>
              )
          })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TravelerList
