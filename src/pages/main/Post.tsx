import { addDoc,getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { Posts } from "./Main"
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface Props {
    post : Posts
}

interface Like {
    id : string,
    userid : string
}

export const Post = (props : Props)=>{

    const {post} = props;
    const [user] = useAuthState(auth);
    const [likes, setLikes] = useState<Like[] | null>(null);
    // reference to the likes collection in our firestore db
    const likeRef = collection(db, "likes");

    const likesDoc = query(likeRef, where("postid", "==", post.id))
    
    const getLikes = async ()=>{
        const data = await getDocs(likesDoc)
        setLikes(data.docs.map((doc)=>({userid : doc.data().userid, id : doc.id})));
    }

    const onLikePost = async ()=>{
        try {
        const newDoc = await addDoc(likeRef,{
            userid : user?.uid,
            postid : post.id
        })
        if (user){
            setLikes((prev)=> prev ? [...prev,{userid : user?.uid, id : newDoc.id}] : [{userid : user?.uid, id : newDoc.id}])
        }
    }catch(e){
        console.log(e);
    }
    }

    const removeLikePost = async ()=>{
        try {
            const likeTodeletequery = query(likeRef, where("postid","==",post.id),where("userid","==",user?.uid))
            
            const likeToDeleteData = await getDocs(likeTodeletequery)
            const likeid = likeToDeleteData.docs[0].id;
            const likeTododelete = doc(db, "likes", likeid);
        await deleteDoc(likeTododelete)
        if (user){
            setLikes((prev)=> prev && prev.filter((like)=> like.id !== likeid ))
        }
    }catch(e){
        console.log(e);
    }
    }


    const hasUserLiked = likes?.find((like)=> like.userid === user?.uid )

    useEffect(()=>{
        getLikes()
    },[]);
    return <div>
        <div className="title">
            <h1>{post.title}</h1>
        </div>
        <div className="body">
            <p>{post.description}</p>
        </div>
        <div className="footer">
            <p>@{post.username}</p>
            <button onClick={hasUserLiked ?removeLikePost : onLikePost}>{hasUserLiked ?<>&#128078;</> :<>&#128077;</>}</button>
            {likes && <p>Likes : {likes.length}</p>}
        </div>
    </div>
}