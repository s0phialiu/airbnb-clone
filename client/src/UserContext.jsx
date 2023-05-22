import { useEffect } from "react";
import {createContext, useState} from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({children}) { 
    // User context can indicate changes to all paths, like when a user has been logged in
    const [user,setUser] = useState(null);
    const [ready,setReady] = useState(false);
    useEffect(() => {
        if (!user) {
            axios.get('/profile').then(({data}) => {
                setUser(data);
                setReady(true);
            });
        }
    }, []);
    return (
        <UserContext.Provider value={{user,setUser,ready}}>
            {children} 
        </UserContext.Provider>
    );
}