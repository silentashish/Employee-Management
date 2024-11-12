import { useSession } from '@/context/SessionContext';
import { redirect } from "next/navigation";
import { useEffect } from 'react';

const useHandlePrivateRoute = () =>{
    const {session,isLoggedIn} = useSession();

    useEffect(()=>{
        if(!isLoggedIn()){
            redirect("/login")
        }
    },[session])

}

export default useHandlePrivateRoute;