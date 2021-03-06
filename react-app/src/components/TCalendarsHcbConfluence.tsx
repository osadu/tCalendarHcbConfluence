import React from "react";
import TCalendars from "./tcalendars/TCalendars";
import TEvents from "./tevents/TEvents";
import {EventAPI} from "../api/EventAPI";
import {EventType, IssueType, SystemNameType} from "../commons/Commons";
import {getAjs,getAjsContextPath} from "../utils/jira.util";
import AddUpdateEventFormComponent from "../modals/AddUpdateEventFormComponent";
import "./tCalendarsHcb.css";

type StateType = {
   
   events: Array<EventType>
   calendarMainErrors: Array<string>
   calendarModalFormErrors: Array<string>
   successEvent: Array<string>

   formEventId:string
   formEventName:string
   formFilterName:string
   formSystemName:string

   issues: Array<IssueType>
   selectedIndex: number

   isModalOpen: boolean
   isFilterName: boolean

   systemNames: Array<SystemNameType>

}

const JIRA_BASE_URL = "http://localhost:2990/jira/";

class TCalendarsHcbConfluence extends React.Component{

    state: StateType = {
        events: [],
        calendarMainErrors: [],
        calendarModalFormErrors: [],
        successEvent: [],

        formEventId: "0",
        formEventName: "",
        formFilterName: "",
        formSystemName: "",

        issues: [],
        selectedIndex: 0,

        isModalOpen: false,
        isFilterName: true,

        systemNames: []
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
                    this._getIssues(this.state.selectedIndex, this.state.events[this.state.selectedIndex].filterName ? true : false);
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

    _getIssuesFromMap = (issues: any, selectedIndex: number) => {

        this.setState({
            selectedIndex: selectedIndex,
            issues: issues.map((issue:any) => {
                return {
                    Id: Number.parseInt(issue.id),
                    Subject: issue.key,
                    //StartTime: new Date(issue.customfield_11600),
                    //EndTime: new Date(issue.customfield_11600),
                    StartTime: new Date(issue.fields.duedate+"T00:00:00.000+0600"),
                    EndTime: new Date(issue.fields.duedate+"T00:00:00.000+0600"),
                    Description: issue.fields.description,
                    Status: issue.fields.status.name,
                    Creator: issue.fields.creator.displayName,
                    Assignee: issue.fields.assignee === null ? "Не назначено" : issue.fields.assignee.displayName,
                    Reference: JIRA_BASE_URL+"browse/"+issue.key,
                    IsAllDay: false
                };
            })
        });
        
    }

    _getIssues = (selectedIndex:number, isFilterName:boolean) => {

        if(isFilterName){
            EventAPI.getJiraIssuesByFilterName(this.state.events[selectedIndex].filterName).then( issues => {
                this._getIssuesFromMap(issues,selectedIndex);
            });
        }else{
            EventAPI.getJiraIssuesBySystemName(this.state.events[selectedIndex].systemName).then( issues => {
                this._getIssuesFromMap(issues,selectedIndex);
            });
        }
    
    }

    _resetAddUpdateEventForm = () => {
        this.setState({
            formEventId: "0",
            formEventName: "",
            formFilterName: "",
            formSystemName: "",
            isFilterName: true,
            systemNames: [],
            calendarModalFormErrors: [],
            successEvent: []
        });
    }

    _closeModal = () => {
        getAjs().dialog2("#addUpdateEvent-dialog").hide();
    }

    _setStateAfterDeleteEvent = (value:number) => {
        new Promise(resolve=>{
            this.setState({
                selectedIndex: value
            }, ()=>{
                resolve();
            });
        }).then(()=>{
            this._getEvents();
        });
    }

    _resetSuccessEventMessageAfterSomeSeconds = (seconds:number) => {
        setTimeout(()=>{
            this.setState({
                successEvent: []
            })
        },seconds);
    }

    _createCustomFieldElement = (fieldName:string, value:string, isLink: boolean) => {
        let div = document.createElement('div');
        div.className = "customFields";

        if(isLink)
            div.innerHTML = "<b>"+fieldName+"</b>: <a href=\""+value+"\" style=\"margin-left:5px\">Открыть</a>";
        else
            div.innerHTML = "<b>"+fieldName+"</b>: "+value;

        return div;
    }


    _dialogTrigger = (triggerName: string, isModalOpen: boolean) => {
        let AJS = getAjs();
        AJS.dialog2("#addUpdateEvent-dialog").on(triggerName,()=>{
            if(triggerName === "hide")
                this._resetAddUpdateEventForm();
            
            this.setState({
                isModalOpen: isModalOpen
            });
        });
    }

    _createOrUpdateEvent = (event: EventType) => {

        if(this.state.formEventId === "0"){
            EventAPI.createEvent(event).then((data:any) => {
                this.setState({
                    successEvent: [...this.state.successEvent, "Успешно добавлено"]
                });
                this._closeModal();
                this._getEvents();
                this._resetSuccessEventMessageAfterSomeSeconds(3000);
            }).catch((error:any) => {
                if(error.response.data.errorText){
                    this.setState({
                        calendarModalFormErrors: [...this.state.calendarModalFormErrors, error.response.data.errorText]
                    })
                }
            });
        }else{
            EventAPI.updateEvent(event).then((data:any) => {
                this.setState({
                    successEvent: [...this.state.successEvent, "Успешно обновлен"]
                });
                this._closeModal();
                this._getEvents();
                this._resetSuccessEventMessageAfterSomeSeconds(3000);
            }).catch((error:any) => {
                    if(error.response.data.errorText){
                        this.setState({
                            calendarModalFormErrors: [...this.state.calendarModalFormErrors, error.response.data.errorText]
                        })
                    }
            });
        }

    }

    componentDidMount(){
        let AJS = getAjs();
        this._getEvents();
        this._dialogTrigger("show", true);
        this._dialogTrigger("hide", false);
        AJS.$("#tCalendarDropDown").dropDown("Standard");
    }

    
    onPopupOpen = (args:any) => {
        args.element.getElementsByClassName("e-popup-content")[0].appendChild(this._createCustomFieldElement("Автор",args.data.Creator,false));
        args.element.getElementsByClassName("e-popup-content")[0].appendChild(this._createCustomFieldElement("Исполнитель",args.data.Assignee,false));
        args.element.getElementsByClassName("e-popup-content")[0].appendChild(this._createCustomFieldElement("Статус",args.data.Status,false));
        args.element.getElementsByClassName("e-popup-content")[0].appendChild(this._createCustomFieldElement("Запрос в Jira",args.data.Reference,true));                                 
    } 

    onPopupClose = (args:any) => {
    }


    handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let errors:Array<string> = [];
        if(!this.state.formEventName)
           errors = [...errors, 'Заполните имя собитии'];
        
        if(this.state.isFilterName){
            if(!this.state.formFilterName)
                errors = [...errors, 'Заполните имя фильтра'];
        }else{
            if(!this.state.formSystemName)
                errors = [...errors, 'Выберите имя системы'];
        }
        if(errors.length > 0){
            this.setState({ calendarModalFormErrors: errors });
            return;
        }

        if(this.state.isFilterName){
            EventAPI.getJqlByFilterName(this.state.formFilterName).then(() => {
               this._createOrUpdateEvent({
                   eventName:this.state.formEventName,
                   filterName:this.state.formFilterName
                });    
            }).catch(error => {
                if(error.response.data.message){
                    this.setState({calendarModalFormErrors: [ ...this.state.calendarModalFormErrors, error.response.data.message ]});
                    return;
                }
            });
        }else{
            this._createOrUpdateEvent({
                id:Number.parseInt(this.state.formEventId), 
                eventName:this.state.formEventName, 
                systemName:this.state.formSystemName
            });
        }

    }

    handleClickEventLi = (e:React.MouseEvent<HTMLElement>) => { 
        this._getIssues(Number.parseInt(e.currentTarget.dataset.index || "0"),JSON.parse(e.currentTarget.dataset.isfiltername ? e.currentTarget.dataset.isfiltername : "true"));
    }

    handleDeleteEvent = (e:React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();

        let selectedIndex = Number.parseInt(e.currentTarget.dataset.index || "0");

        EventAPI.deleteEvent(e.currentTarget.dataset.id).then((data:any) => {
            
            if(this.state.selectedIndex === selectedIndex){
                this._setStateAfterDeleteEvent(0);
            }else if(this.state.selectedIndex > selectedIndex){
                this._setStateAfterDeleteEvent(this.state.selectedIndex - 1);
            }else{
                this._getEvents();
            }

            this.setState({
                successEvent: [...this.state.successEvent, "Успешно удален"]
            });
            this._resetSuccessEventMessageAfterSomeSeconds(3000);

        }).catch((error:any) => {
            if(error.response.data.errorText){
                this.setState({
                    calendarMainErrors: [...this.state.calendarMainErrors, error.response.data.errorText]
                })
            }
        });
    }

    handleUpdateEvent = (e:React.MouseEvent<HTMLElement>) => {
        let isFilterName = JSON.parse(e.currentTarget.dataset.isfiltername ? e.currentTarget.dataset.isfiltername : "true");
        if(isFilterName){
            this.setState({
                formEventId: e.currentTarget.dataset.id,
                formEventName: e.currentTarget.dataset.eventname,
                formFilterName: e.currentTarget.dataset.filtername,
                isFilterName: isFilterName
            });
        }else{
            this.setState({
                formEventId: e.currentTarget.dataset.id,
                formEventName: e.currentTarget.dataset.eventname,
                formSystemName: e.currentTarget.dataset.systemname,
                isFilterName: isFilterName
            });
        }
        getAjs().dialog2("#addUpdateEvent-dialog").show();
    }

    handleAddEvent = (e:React.MouseEvent<HTMLElement>) => {
        getAjs().dialog2("#addUpdateEvent-dialog").show();
    }

    handleRadioButtonChange = (e:any) => {
        let isFilterName = JSON.parse(e.target.value);
        if(!isFilterName){
            EventAPI.getSystemNamesFromJira().then( data => {
                this.setState({
                    systemNames: data,
                    isFilterName: isFilterName
                });
            });
        }else{
            this.setState({
                isFilterName: isFilterName
            });
        }
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
            formFilterName: e.currentTarget.value,
            calendarModalFormErrors: []
        });
    }

    handleSystemNameChange = (e:any) => {
      this.setState({
          formSystemName: e.target.value,
          calendarModalFormErrors: []
      });
    }

    render(){

        let { 

              events,
              formEventId,
              formEventName,
              formFilterName,
              formSystemName,

              selectedIndex,
              issues,

              calendarModalFormErrors,
              successEvent,

              isModalOpen,
              isFilterName,

              systemNames

            } = this.state;

        return (
            <div>
                 
                <div className={isModalOpen ? "modalOpen" : "tCalendarsHcbBody"}>
                    <TCalendars onPopupOpen={this.onPopupOpen}
                                onPopupClose={this.onPopupClose} 
                                issues={issues}/>
                    <TEvents events={events} 
                            addEvent={this.handleAddEvent} 
                            updateEvent={this.handleUpdateEvent}
                            deleteEvent={this.handleDeleteEvent}
                            handleClickEventLi={this.handleClickEventLi}
                            selectedIndex={selectedIndex}/>
                </div>         

                <div className="modals">
                    <AddUpdateEventFormComponent id={formEventId}
                                                 eventName={formEventName}
                                                 filterName={formFilterName}
                                                 systemName={formSystemName}
                                                 systemNames={systemNames}
                                                 handleEventNameChange={this.handleEventNameChange}
                                                 handleFilterNameChange={this.handleFilterNameChange}
                                                 handleSystemNameChange={this.handleSystemNameChange}
                                                 AddUpdateEventFormCloseButton={this.AddUpdateEventFormCloseButton}
                                                 formSubmit={this.handleFormSubmit}
                                                 success={successEvent}
                                                 errors={calendarModalFormErrors}
                                                 isFilterName={isFilterName}
                                                 handleRadioButtonChange={this.handleRadioButtonChange}
                                                />
                </div>

            </div>
        );
    }
}

export default TCalendarsHcbConfluence;