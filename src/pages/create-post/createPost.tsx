import { CreateForm } from "./createForm"
import {auth} from "../../config/firebase"
import {useAuthState} from "react-firebase-hooks/auth";
import { Login } from "../Login";
export const CreatePost = ()=>{
    const [user] = useAuthState(auth);
    //const navigate = useNavigate();
    if(user)
        return <div className="createPost">
        <CreateForm />
    </div>
    else 
        return <Login />
}