import React from "react";
import TCalendars from "./tcalendars/TCalendars";
import TEvents from "./tevents/TEvents";
import {EventAPI} from "../api/EventAPI";
import {EventType, IssueType} from "../commons/Commons";
import {getAjs} from "../utils/jira.util";
import AddUpdateEventFormComponent from "../modals/AddUpdateEventFormComponent";
import { resolve } from "dns";

type StateType = {
   
   events: Array<EventType>
   calendarMainErrors: Array<string>
   calendarModalFormErrors: Array<string>
   successEvent: Array<string>

   formEventId:string
   formEventName:string
   formFilterName:string

   issues: Array<IssueType>
   selectedIndex: number

}

class TCalendarsHcbConfluence extends React.Component{

    state: StateType = {
        events: [],
        calendarMainErrors: [],
        calendarModalFormErrors: [],
        successEvent: [],

        formEventId: "0",
        formEventName: "",
        formFilterName: "",

        issues: [],
        selectedIndex: 0
    }

    _getEvents = () => {
        
        EventAPI.getEvents().then((data:any) => {

            new Promise(resolve => {    
                this.setState({
                    events: data.responseObject
                },()=>{
                    resolve();
                });
            }).then(()=>{
                if(data.responseObject.length > 0){
                    this._getIssues(this.state.selectedIndex);
                }else{
                    this.setState({
                        issues: []
                    });
                }
            });

          
        }).catch((error:any) => {
            if(error.response.data.errorText){
                this.setState({
                    calendarMainErrors: [...this.state.calendarMainErrors, error.response.data.errorText]
                })
            }
        })
    }

    _getIssues = (selectedIndex:number) => {
        EventAPI.getJiraIssuesByFilterName(this.state.events[selectedIndex].filterName).then( issues => {

            this.setState({
                selectedIndex: selectedIndex,
                issues: issues.map((issue:any) => {
                    return {
                        Id: Number.parseInt(issue.id),
                        Subject: issue.key,
                        //StartTime: Date.parse(issue.customfield_11600),
                        StartTime: new Date(issue.fields.duedate+"T00:00:00.000+0600"),
                        EndTime: new Date(issue.fields.duedate+"T00:00:00.000+0600"),
                        Description: issue.fields.description,
                        Status: issue.fields.status.name,
                        Creator: issue.fields.creator.displayName,
                        IsAllDay: false
                    };
                })
            });

        });
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


    componentDidMount(){
        let AJS = getAjs();
        this._getEvents();
        AJS.$("#tCalendarDropDown").dropDown("Standard");
    }

    
    onPopupOpen = (args:any) => {
        console.log(args);
    } 


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

    handleClickEventLi = (e:React.MouseEvent<HTMLElement>) => {
        this._getIssues(Number.parseInt(e.currentTarget.dataset.index || "0"));
    }

    handleDeleteEvent = (e:React.MouseEvent<HTMLElement>) => {

        let selectedIndex = Number.parseInt(e.currentTarget.dataset.index || "0");

        EventAPI.deleteEvent(e.currentTarget.dataset.id).then((data:any) => {
            
            if(this.state.selectedIndex === selectedIndex){
                new Promise(resolve=>{
                    this.setState({
                        selectedIndex: 0
                    }, ()=>{
                        resolve();
                    });
                }).then(()=>{
                    this._getEvents();
                });

                return;
            }

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
              formFilterName,

              selectedIndex,
              issues

            } = this.state;

        return (
            <div className="tCalendarsHcbBody">
                <TCalendars onPopupOpen={this.onPopupOpen} 
                            issues={issues}/>
                <TEvents events={events} 
                         addEvent={this.handleAddEvent} 
                         updateEvent={this.handleUpdateEvent}
                         deleteEvent={this.handleDeleteEvent}
                         handleClickEventLi={this.handleClickEventLi}
                         selectedIndex={selectedIndex}/>

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