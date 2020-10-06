import React from "react";

type RadioButtonComponentType = {
    onChangeValue: (e:any) => void
}

const RadioButtonComponent = (props: RadioButtonComponentType) => {

    return (
      <div onChange={props.onChangeValue}>
        <input type="radio" value="true" name="FilterName" /> Имя фильтра
        <input type="radio" value="false" name="SystemName" /> Имя системы
      </div>
    );

}


export default RadioButtonComponent;