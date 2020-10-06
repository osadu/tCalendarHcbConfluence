import React from "react";

type RadioButtonComponentType = {
    onChangeValue: (e:any) => void
}

const RadioButtonComponent = (props: RadioButtonComponentType) => {

    return (
      <div onChange={props.onChangeValue}>
        <p><input type="radio" value="true" name="isFilterName" /> Имя фильтра</p>
        <p><input type="radio" value="false" name="isFilterName" /> Имя системы</p>
      </div>
    );

}


export default RadioButtonComponent;