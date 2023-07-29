import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import server from "../apis/server"
import { FlightsContext } from "../context/FlightsContext";

const SearchForm = () => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [when, setWhen] = useState(new Date());
    const {setFlights} = useContext(FlightsContext);
    const handleSubmit = async (e) =>{
      setFlights([])
        e.preventDefault();
        const when_p = when.getFullYear() + '-' + (when.getMonth() + 1) + '-' + when.getDate();
        try{
            const response = await server.get('/flights', {params: {from: from, to: to, when: when_p}});
            console.log(response.data.data);
            setFlights(response.data.data);
        }catch(error){
            console.log(error)
        }
      }
    return (
        <div className='mb-4'>
        <form>
        <div className="form-group row">
        <div className="col-4">
          <input type="text" className="form-control" placeholder="Departure" value={from} onChange={(e) => setFrom(e.target.value)}/>
        </div>
        <div className="col-4">
          <input type="text" className="form-control" placeholder="Arrival" value={to} onChange={(e) => setTo(e.target.value)}/>
        </div>
        <div className='col-2'>
            <DatePicker selected={when} onChange = {(date) => setWhen(date)}/>
        </div>
        <div className='col-2'>
        <button className='btn bg-primary bg-opacity-50' onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </form>
        </div>
    )
}

export default SearchForm