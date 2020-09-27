import React from "react";
import style from "./errors.module.css";

const ErrorsComponent = (props) => {

    let { errors } = props;

    return (

        <div className={style.errorBlock}>
            <ul className={style.errorMessages}>
                {errors.map((m,index) => { 
                    return <li key={index}>{m}</li>
                })}
            </ul>
        </div>

    );
}

export default ErrorsComponent;