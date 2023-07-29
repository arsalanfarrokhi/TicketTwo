import React, {createContext, useState} from 'react';

export const TravelersContext = createContext();

export const TravelersContextProvider = props => {
    const [travelers, setTravelers] = useState([]);
    return (
        <TravelersContext.Provider value={{travelers, setTravelers}}>
            {props.children}
        </TravelersContext.Provider>
    )
}