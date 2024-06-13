import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.component.jsx';
import UserAuthForm from './pages/userAuthForm.page.jsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { createContext,useEffect,useState } from 'react';

import {lookInSession} from "./common/session"
import { createBox } from 'framer-motion';

export const UserContext =createContext({})
const App = () => {

 const {UserAuth,setUserAuth}=useState();

 useEffect(()=>{

    let useInSession=lookInSession("User");
    userInSession ? setUserAuth(JSON.parse(userInSession)):
    setUserAuth ({access_token:null})
 },[]) 
return (
        <UserContext.Provider value={{UserAuth,setUserAuth}}>
                 <Routes>
            <Route path="/" element={<Navbar />} >
                <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                <Route path="signup" element={<UserAuthForm type="sign-up" />} />
            </Route>
        </Routes>
        </UserContext.Provider>
    );
       
   
}

export default App;
