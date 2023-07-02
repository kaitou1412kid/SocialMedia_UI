import {getDocs, collection} from "firebase/firestore"
import { db } from "../../config/firebase"
import {useState, useEffect} from "react"
import { Post } from "./Post"

export interface Posts {
    id : string,
    userid : string,
    username : string,
    title : string,
    description : string
}

export const Main = ()=>{
    const postsRef = collection(db, "posts");
    const [postList, setPostList] = useState<Posts[] | null>(null);
    const getPosts = async ()=>{
        const data = await getDocs(postsRef);
        setPostList(data.docs.map((doc)=>({...doc.data(), id : doc.id})) as Posts[])
    }

    useEffect(()=>{
        getPosts();
    },[])
    return <div>
        {postList?.map((post)=> <Post post={post}/>)}
    </div>
}