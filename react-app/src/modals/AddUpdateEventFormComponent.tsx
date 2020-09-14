import React from "react";

type AddUpdateEventPropsType = {
    id: string
    eventName: string
    filterName: string
    handleEventNameChange: (e: React.FormEvent<HTMLInputElement>) => void
    handleFilterNameChange: (e: React.FormEvent<HTMLInputElement>) => void
    AddUpdateEventFormCloseButton: (e:React.MouseEvent<HTMLElement>) => void
    formSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const AddUpdateEventFormComponent = (props: AddUpdateEventPropsType) => {



    return (
        <section id="addUpdateEvent-dialog" className="aui-dialog2 aui-dialog2-small aui-layer" role="dialog" aria-hidden="true">
            <header className="aui-dialog2-header">
                <a href="#" className="aui-dialog2-header-close" aria-label="close">
                    <span className="aui-icon aui-icon-small aui-iconfont-close-dialog"></span>
                </a>
            </header>
            <div className="aui-dialog2-content">
                
                <form className="aui" onSubmit={props.formSubmit}>
                    
                    <div className="field-group">
                        <label htmlFor="eventName">Имя событии
                            <span className="aui-icon icon-required">(required)</span></label>
                        <input className="text medium-field" type="text"
                            id="eventName" placeholder="Имя событии" value={props.eventName} onChange={props.handleEventNameChange}/>
                    </div>
                
                    <div className="field-group">
                        <label htmlFor="filterName">Имя фильтра
                            <span className="aui-icon icon-required">(required)</span></label>
                        <input className="text medium-field" type="text"
                            id="filterName" placeholder="Имя фильтра" value={props.filterName} onChange={props.handleFilterNameChange}/>
                    </div>

                    <div className="buttons-container">
                        <div className="buttons">
                            <input className="button submit" type="submit" value="Отправить" id="comment-save-button"/>
                        </div>
                    </div>

                </form>

            </div>
            <footer className="aui-dialog2-footer">
                <div className="aui-dialog2-footer-actions">
                    <button id="dialog-submit-button" className="aui-button aui-button-primary"
                    onClick={props.AddUpdateEventFormCloseButton}>Закрыть</button>
                </div>
            </footer>
        </section>
    );
}

export default AddUpdateEventFormComponent;
