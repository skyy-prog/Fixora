import React from 'react'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom';
const ProtactedRoute = ({children}) => {
    const token = Cookies.get('token');
    if(token){
        console.log(token)
        return <Navigate to={'/profile'} replace/> 
         
    }
    return children
}

export default ProtactedRoute