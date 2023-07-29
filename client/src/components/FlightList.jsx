import React, { useContext, useEffect } from 'react'
import server from '../apis/server';
import moment from 'moment';

import { FlightsContext } from '../context/FlightsContext';

const FlightList = () => {
  const {flights, setFlights} = useContext(FlightsContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await server.get("/admin/flights");
        setFlights(response.data.data.flights);
      } catch(err) { }
    };

    fetchData();
  }, []);

  const SearchFor = async (flight_text) => {
    if (flight_text !== "") {
      try {
        const req = await server.get("/admin/flights", { params: { flight_text: flight_text }});
        setFlights(req.data.data.flights);
      } catch (err) {}
    }
    else if(flight_text === ""){
      try {
        const response = await server.get("/admin/flights");
        setFlights(response.data.data.flights);
      } catch (err) {}
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <h1 className="">Upcoming Flights</h1>
        </div>
        <div className="col-4">
          <input
            className="form-control"
            placeholder="Look for a flight"
            onChange={(e) =>SearchFor(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <table class="table">
          <thead class="thead-dark">
            <tr className='bg-dark text-white'>
              <td className='col-2'>From</td>
              <td className='col-2'>To</td>
              <td className='col-4'>Departure Time</td>
              <td className='col-4'>Arrival Time</td>
            </tr>
          </thead>
          <tbody>
            {flights && flights.map((flight) => {
              return(
                <>
                  <tr key={flight.flightid}>
                  <td>{flight.fromairport}</td>
                  <td>{flight.toairport}</td>
                  <td>{moment(flight.departuretime).format('MM/DD/YYYY h:mm a')}</td>
                  <td>{moment(flight.arrivaltime).format('MM/DD/YYYY h:mm a')}</td>
                  </tr>
                </>
              )
          })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FlightList
