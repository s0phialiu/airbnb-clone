import {createContext, useState} from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}) { 
    // User context can indicate changes to all paths, like when a user has been logged in
    const [user,setUser] = useState(null);
    return (
        <UserContext.Provider value={{user,setUser}}>
            {children} 
        </UserContext.Provider>
    );
}