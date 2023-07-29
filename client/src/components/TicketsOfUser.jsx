import React, {useEffect, useContext, useState} from 'react'
import server from "../apis/server"
import { UsersTicketsContext } from '../context/UsersTicketsContext';
import Modal from 'react-bootstrap/Modal';
import Overlay from 'react-bootstrap/Overlay';
import { useHistory } from 'react-router-dom';
import Cookies from "js-cookie";

const TicketsOfUser = (props) => {

  const{tickets, setTickets} = useContext(UsersTicketsContext);
  const[popupform, setPopupfirm] = useState(false);
  const[manipulateticketid, setManipulateticketlid] = useState({id:null});
  const[showticket, setShowticket] = useState(false);
  const [userid] = useState(Cookies.get('userid'));

  useEffect(()=>{
    // Define function, sent api calls
    const fetchdata = async ()=> {
      try {
        const response = await server.get(`/user/tickets/${userid}`);
        setTickets(response.data.data.tickets);
      }catch(err){
        console.log("error");
      }
    }
    fetchdata();
    }, [])

    const handleConfirm = async(id) =>{
      try{
        const response = await server.delete(`/user/tickets/${id}`)
        // delete in setTickets
        setTickets(tickets.filter(ticket=>{
          return ticket.ticketid !== id 
        }))
        alert("Cancel Successfully!");
        setPopupfirm(!popupform);

      }catch(err){

      }
    }

    const handlePop= (id) =>{
      setPopupfirm(!popupform);
      setManipulateticketlid(id);
    } 

    const handleShowticket= (id)=>{
      try {
        setShowticket(!showticket);
        if(showticket)
          setManipulateticketlid(null);
        else
          setManipulateticketlid(id);
        console.log(manipulateticketid);
      } catch (err) {}
      
    } 

    console.log()
    return (
      
          <div className="list-group">
            <table className="table table-success table-striped">
              <thead>
                <tr className="bh-success">
                  <th scope = "col" > Ticket ID </th>
                  <th scope = "col" > Flight  ID </th>
                  <th scope = "col" > Flying FROM </th> 
                  <th scope = "col" > Flying TO </th> 
                  <th scope = "col" > Departure </th>  
                  <th scope = "col" > Arrival </th> 
                  <th scope = "col" > Detail </th>
                  <th scope = "col" > Cancel </th> 
                </tr>
              </thead>
              <tbody>
                {tickets&&tickets.map((ticket) => {
                  
                  return(
                    <>
                    <tr key={tickets.ticketid}>
                      <td key={tickets.ticketid}>{ticket.ticketid}</td>
                      <td key={tickets.ticketid}>{ticket.flightid}</td>
                      <td key={tickets.ticketid}>{ticket.fromairport}</td>
                      <td key={tickets.ticketid}>{ticket.toairport}</td>
                      <td key={tickets.ticketid}>{ticket.departuretime}</td>
                      <td key={tickets.ticketid}>{ticket.arrivaltime}</td>
                      <td><button onClick={()=>handleShowticket(ticket.ticketid)} className="btn btn-success">Detail</button></td>
                      <td><button onClick={()=>handlePop(ticket.ticketid)} className="btn btn-success">Cancel</button></td>
                    </tr>
                    {showticket&& ticket.ticketid === manipulateticketid&&(
                    <>
                      <tr>
                        <th></th>
                        <th>Traveler ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                        <th>Passport ID</th>
                      </tr>
                      <tr>
                        <td></td>
                        <td>{ticket.travelerid}</td>
                        <td>{ticket.firstname}</td>
                        <td>{ticket.lastname}</td>
                        <td>{ticket.dob}</td>
                        <td>{ticket.passportid}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </>
                  )
                }
                    </>
                  );
                })} 
                
              </tbody>
            </table>
              
              {popupform &&(
                
                <Modal show={popupform} tabIndex="-1" role="dialog">
                  <Modal.Dialog role="document">
                    <Overlay ></Overlay>
                     <body>
                      <Modal.Header>
                        <Modal.Title><h5>Cancel Ticket Confirmation</h5></Modal.Title>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={()=>setPopupfirm(false)}
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Cancel will not be redo after click "Confirm" </p>
                      </Modal.Body>
                      <Modal.Footer>
                        <button
                          type="button"
                          onClick={()=>handleConfirm(manipulateticketid)}
                          className="btn btn-primary"
                        >
                        Confirm
                        </button>
                          <button
                            type="button"
                            onClick={()=>setPopupfirm(false)}
                            className="btn btn-secondary"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                      </Modal.Footer>
                    </body>
                  </Modal.Dialog>
                </Modal>
              )
            }
            
          </div>
  );
}

export default TicketsOfUser;