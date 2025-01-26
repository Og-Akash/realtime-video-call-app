import {useEffect, useState} from "react";
import "./avatar.css"

export function Avatar({name}){
    const [avatar, setAvatar] = useState("")
    useEffect(() => {
       setAvatar(name[0].toUpperCase())
    }, []);

    return (
        <div className="avatar">
            <span className="avatar-text">{avatar}</span>
        </div>
    )
}