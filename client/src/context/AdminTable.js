import React, {createContext, useState} from 'react';

export const AdminTableContext = createContext();

export const AdminTableContextProvider = props => {
    const [AdminTable, setAdminTable] = useState(null);
    return (
        <AdminTableContext.Provider value={{AdminTable, setAdminTable}}>
            {props.children}
        </AdminTableContext.Provider>
    )
}