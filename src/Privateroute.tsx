import { Navigate } from 'react-router-dom';
import { auth } from './config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export const Privateroute = ({children} : any)=>{
    const [user] = useAuthState(auth);
    return user? children : <Navigate to="/login"/>
}