import { useSession } from '@/context/SessionContext';
import { redirect } from "next/navigation";

const useHandlePrivateRoute = () =>{
    const {isLoggedIn} = useSession();
    
    if(!isLoggedIn()){
        redirect("/login")
    }
}

export default useHandlePrivateRoute;