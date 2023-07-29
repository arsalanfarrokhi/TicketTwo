import React, {useState, createContext} from "react";

export const UsersTicketsContext = createContext();

export const UsersTicketsContextProvider = props=> {
    const [tickets, setTickets] = useState([]);
    return(
        <UsersTicketsContext.Provider value={{tickets, setTickets}}>
            {props.children}
        </UsersTicketsContext.Provider>
    )
}

