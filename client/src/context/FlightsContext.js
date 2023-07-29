import React, {createContext, useState} from 'react';

export const FlightsContext = createContext();

export const FlightsContextProvider = props =>{
    const [flights, setFlights] = useState([]);
    return (
        <FlightsContext.Provider value={{flights, setFlights}}>
            {props.children}
        </FlightsContext.Provider>
    )
}