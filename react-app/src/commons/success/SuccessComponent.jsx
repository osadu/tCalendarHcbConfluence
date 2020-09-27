import React from "react";
import style from "./success.module.css";

const SuccessComponent = (props) => {

    let {
       messages
    } = props;

    return (
        <div className={style.successBlock}>
            <ul className={style.successMessages}>
                {messages.map((m,index) => { 
                    return <li key={index}>{m}</li>
                })}
            </ul>
        </div>
    );
}

export default SuccessComponent;