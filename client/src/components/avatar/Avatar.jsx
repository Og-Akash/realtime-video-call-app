import {useEffect, useState} from "react";
import "./avatar.css"

export function Avatar({name, className}){

    return (
        <div className={`avatar ${className}`}>
            <span className={`avatar-text ${className}`}>{name.charAt(0).toUpperCase()}</span>
        </div>
    )
}