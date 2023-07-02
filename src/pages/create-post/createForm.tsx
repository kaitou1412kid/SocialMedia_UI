import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup"
import {addDoc, collection} from "firebase/firestore"
import { db, auth } from "../../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";

interface CreateFormData {
    title : string;
    description : string
}


export const CreateForm = ()=>{
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    //using yup for validation
    const schema = yup.object().shape({
        title : yup.string().required("Title is required"),
        description : yup.string().required("Description is required")
    })

    //using yup and react-hook-form
    const {register, handleSubmit, formState : {errors}} = useForm<CreateFormData>({
        resolver : yupResolver(schema)
    });

    // reference to the posts collection in our firestore db
    const postRef = collection(db, "posts");

    // function to create post after clicking the button
    const onCreatePost = async (data : CreateFormData)=>{
        await addDoc(postRef, {
            title : data.title,
            description : data.description,
            username : user?.displayName,
            userid : user?.uid
        })
        navigate("/");
    }
    return <form onSubmit={handleSubmit(onCreatePost)}>
        <input placeholder="title" {...register("title")}/>
        <p style={{color : "red"}}>{errors.title?.message}</p>
        <textarea placeholder="description" {...register("description")}/>
        <p style={{color : "red"}}>{errors.description?.message}</p>
        <input type="submit" className="submitForm"/>
    </form>
}