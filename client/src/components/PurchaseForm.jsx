import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import server from "../apis/server"
import { FlightsContext } from "../context/FlightsContext";

const PurchaseForm = () => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [when, setWhen] = useState(new Date());
    const {flights, setFlights} = useContext(FlightsContext);
    const [showFlights, setShowFlights] = useState(0);
    const [showForm, setShowForm] = useState(0);
    const [email, setEmail] = useState("");
    const [fN, setFN] = useState("");
    const [lN, setLN] = useState("");
    const [passport, setPassport] = useState("");
    const [phone, setPhone] =  useState("");
    const [dob, setDOB] = useState(null);
    const handleSubmit = async (e) =>{
      setFlights([])
        e.preventDefault();
        const when_p = when.getFullYear() + '-' + (when.getMonth() + 1) + '-' + when.getDate();
        try{
          console.log(from, to, when_p);
            const response = await server.get('/flights', {params: {from: from, to: to, when: when_p}});
            setFlights(response.data.data);
            console.log(showFlights);
            setShowFlights(1);
            setShowForm(0);
        }catch(error){
            console.log(error);
        }
      }
    const PurchaseTicket = async (id) => {
      setShowForm({show: 1, id: id});
      console.log(id);
    } 
    const handlePurchase = async (id) =>{
      console.log(email, fN, lN, phone, dob, id);

      const response = await server.post('/admin/tickets', {email: email, fn: fN, ln: lN, phone: phone, dob: dob.getFullYear() + '-' + (dob.getMonth() + 1) + '-' + dob.getDate(), flightid: id});
        setShowForm(0);
        setShowFlights(0);
    }
    return (
      <div className="container">
        <form className="row mb-5">
          
        <div className="container">
          <div className="form-group row">
            <div className="col-4">
              <input type="text" className="form-control" placeholder="Departure" value={from} onChange={(e) => setFrom(e.target.value)}/>
            </div>
            <div className="col-4">
              <input type="text" className="form-control" placeholder="Arrival" value={to} onChange={(e) => setTo(e.target.value)}/>
            </div>
            <div className='col-2 mr-1'>
                <DatePicker selected={when} onChange = {(date) => setWhen(date)}/>
            </div>
            <div className='col-2 ml-1 justify-content-end'>
            <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
            </div>
          </div>
      </div>
      </form>
      {showFlights === 1 && <div>
        <table class="table">
          <thead class="thead-dark">
            <tr className='bg-dark text-white'>
              <td className='col-3'>From</td>
              <td className='col-3'>To</td>
              <td className='col-2'>Departure Time</td>
              <td className='col-2'>Arrival Time</td>
              <td className='col-2'>Capcity</td>
              <td className='col-2'>Purchase</td>
            </tr>
          </thead>
          <tbody>
          {flights && flights.map((flight) => {
            const depTime = new Date(flight.departuretime);
            const arTime = new Date(flight.arrivaltime);
            
            return(
              <><tr key={flight.flightid}>
                <td>{flight.fromairport}</td>
                <td>{flight.toairport}</td>
                <td>{depTime.getHours()} : {depTime.getMinutes().toString()}</td>
                <td>{arTime.getHours()} : {arTime.getMinutes().toString()}</td>
                <td>{flight.capacity}</td>
                <td><button className="btn bg-primary text-whitepsql" onClick={() => PurchaseTicket(flight.flightid)}>Purchase</button></td>
                </tr>
                {showForm.show === 1 && showForm.id === flight.flightid && <tr>
                  <td colSpan={6}>
                    <div className="container">
                      <div className="row mb-2">
                        <div className="col-3">
                          <label>Email</label>
                        </div>
                        <div className="col-4">
                        <input className="form-control" placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-3">
                        <label>Enter first and last name</label>
                        </div>
                        <div className="col-4">
                        <input className="form-control" placeholder="First name" onChange={(e) => setFN(e.target.value)}/>
                        </div>
                        <div className="col-4">
                        <input className="form-control" placeholder="Last name" onChange={(e) => setLN(e.target.value)}/>
                        </div>

                      </div>
                      <div className="row mb-2">
                      <div className="col-3">
                          Phone Number                        
                        </div>
                        <div className="col-4">
                        <input className="form-control" placeholder="Phone number" onChange={(e) => setPhone(e.target.value)}/>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-3">
                          Select Date of Birth                        
                        </div>
                        <div className="col-4">
                          <DatePicker selected={when} onChange = {(date) => setDOB(date)}/>
                        </div>

                      </div>
                      <div className="row justify-content-end">
                        <button className="btn col-2 btn-primary" onClick={() => handlePurchase(flight.flightid)}>Purchase</button>
                      </div>
                    </div>
                  </td>
                </tr>}
              </>

            )
          })}
          </tbody>
        </table>
    </div>}
      </div>
    )
}

export default PurchaseForm