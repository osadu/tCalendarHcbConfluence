import React from "react";
import TCalendars from "./tcalendars/TCalendars";
import TEvents from "./tevents/TEvents";
import {EventAPI} from "../api/EventAPI";
import {EventType} from "../commons/Commons";
import {getAjs} from "../utils/jira.util";
import AddUpdateEventFormComponent from "../modals/AddUpdateEventFormComponent";

type StateType = {
   
   events: Array<EventType>
   calendarMainErrors: Array<string>
   calendarModalFormErrors: Array<string>
   successEvent: Array<string>

   formEventId:string
   formEventName:string
   formFilterName:string

}

class TCalendarsHcbConfluence extends React.Component{

    state: StateType = {
        events: [],
        calendarMainErrors: [],
        calendarModalFormErrors: [],
        successEvent: [],

        formEventId: "0",
        formEventName: "",
        formFilterName: ""
    }

    _getEvents = () => {
        EventAPI.getEvents().then((data:any) => {
            this.setState({
                events: data.responseObject
            });
        }).catch((error:any) => {
            if(error.response.data.errorText){
                this.setState({
                    calendarMainErrors: [...this.state.calendarMainErrors, error.response.data.errorText]
                })
            }
        })
    }

    _resetAddUpdateEventForm = () => {
        this.setState({
            formEventId: "0",
            formEventName: "",
            formFilterName: ""
        });
    }

    _closeModal = () => {
        this._resetAddUpdateEventForm();
        getAjs().dialog2("#addUpdateEvent-dialog").hide();
    }


    /*_localizingCalendarsDays = () => {
        let tables = document.getElementsByClassName("e-outer-table");
        let days = tables[0].getElementsByClassName("e-schedule-table")[0].getElementsByClassName("e-header-cells");

        for(let i = 0 ; i < days.length ; i++){
            switch(i){
                case 0:
                    days[i].getElementsByTagName("span")[0].innerHTML = "Понедельник";
                    break;
                case 1:
                    days[i].getElementsByTagName("span")[0].innerHTML = "Вторник";
                    break;
                case 2:
                    days[i].getElementsByTagName("span")[0].innerHTML = "Среда";
                    break;
                case 3:
                    days[i].getElementsByTagName("span")[0].innerHTML = "Четверг";
                    break;
                case 4:
                    days[i].getElementsByTagName("span")[0].innerHTML = "Пятница";
                    break;
                case 5:
                    days[i].getElementsByTagName("span")[0].innerHTML = "Суббота";
                    break;
                case 6:
                    days[i].getElementsByTagName("span")[0].innerHTML = "Воскресенье";
                    break;
                    
            }
        }
    }*/

    componentDidMount(){
        this._getEvents();
    }

    /*componentDidUpdate(){

        this._localizingCalendarsDays();

    }*/
    

    handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let errors:Array<string> = [];
        if(!this.state.formEventName)
           errors = [...errors, 'Заполните имя собитии'];
        if(!this.state.formFilterName)
           errors = [...errors, 'Заполните имя фильтра'];

        if(errors.length > 0){
            this.setState({ calendarModalFormErrors: errors });
            return;
        }

        if(this.state.formEventId === "0"){
            EventAPI.createEvent(this.state.formEventName,this.state.formFilterName).then((data:any) => {
                this.setState({
                    successEvent: [...this.state.successEvent, "Успешно добавлено"]
                });
                this._closeModal();
                this._getEvents();
            }).catch((error:any) => {
                if(error.response.data.errorText){
                    this.setState({
                        calendarModalFormErrors: [...this.state.calendarModalFormErrors, error.response.data.errorText]
                    })
                }
            });
        }else{
            EventAPI.updateEvent(this.state.formEventId, this.state.formEventName,this.state.formFilterName).then((data:any) => {
                this.setState({
                    successEvent: [...this.state.successEvent, "Успешно обновлен"]
                });
                this._closeModal();
                this._getEvents();
            }).catch((error:any) => {
                    if(error.response.data.errorText){
                        this.setState({
                            calendarModalFormErrors: [...this.state.calendarModalFormErrors, error.response.data.errorText]
                        })
                    }
            });
        }

    }

    handleDeleteEvent = (e:React.MouseEvent<HTMLElement>) => {
        EventAPI.deleteEvent(e.currentTarget.dataset.id).then((data:any) => {
            this._getEvents();
            this.setState({
                successEvent: [...this.state.successEvent, "Успешно удален"]
            });
        }).catch((error:any) => {
            if(error.response.data.errorText){
                this.setState({
                    calendarMainErrors: [...this.state.calendarMainErrors, error.response.data.errorText]
                })
            }
        });
    }

    handleUpdateEvent = (e:React.MouseEvent<HTMLElement>) => {
        this.setState({
            formEventId: e.currentTarget.dataset.id,
            formEventName: e.currentTarget.dataset.eventname,
            formFilterName: e.currentTarget.dataset.filtername
        });
        getAjs().dialog2("#addUpdateEvent-dialog").show();
    }

    handleAddEvent = (e:React.MouseEvent<HTMLElement>) => {
        this._resetAddUpdateEventForm();
        getAjs().dialog2("#addUpdateEvent-dialog").show();
    }

    AddUpdateEventFormCloseButton = (e:React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        this._closeModal();
    }

    handleEventNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            formEventName: e.currentTarget.value
        });
    }

    handleFilterNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            formFilterName: e.currentTarget.value
        });
    }

    render(){

        let { 
              events,
              formEventId,
              formEventName,
              formFilterName
               } = this.state;

        return (
            <div className="tCalendarsHcbBody">
                <TCalendars />
                <TEvents events={events} 
                         addEvent={this.handleAddEvent} 
                         updateEvent={this.handleUpdateEvent}
                         deleteEvent={this.handleDeleteEvent}/>

                <div className="modals">
                    <AddUpdateEventFormComponent id={formEventId}
                                                 eventName={formEventName}
                                                 filterName={formFilterName}
                                                 handleEventNameChange={this.handleEventNameChange}
                                                 handleFilterNameChange={this.handleFilterNameChange}
                                                 AddUpdateEventFormCloseButton={this.AddUpdateEventFormCloseButton}
                                                 formSubmit={this.handleFormSubmit}
                                                />
                </div>

            </div>
        );
    }
}

export default TCalendarsHcbConfluence;