import React, {useEffect,useState} from "react";
import "./tevents.css";
import {getAjsContextPath, getAjs} from "../../utils/jira.util";
import {EventType} from "../../commons/Commons";

type TEventsPropsType = {
    events: Array<EventType>,
    selectedIndex: number
    addEvent: (e:React.MouseEvent<HTMLElement>) => void
    updateEvent: (e:React.MouseEvent<HTMLElement>) => void
    deleteEvent: (e:React.MouseEvent<HTMLElement>) => void
    handleClickEventLi: (e:React.MouseEvent<HTMLElement>) => void
}

const TEvents = (props: TEventsPropsType) => {

    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        
        let AJS = getAjs();
   
        if(!mounted){
            AJS.$(document).ready(function() {
                AJS.$("#tCalendarDropDown").dropDown("Standard");
                props.events.map((event,index) => {
                    AJS.$("#tCalendarDropDown"+(index+1)).dropDown("Standard");
                    return null;
                });
                setMounted(true);
            });
        }else{
            AJS.$("#tCalendarDropDown"+props.events.length).dropDown("Standard");
        }

    }, [props.events]);

    return (
        <div className="tCalendarEvents">
            <div className="tCalendarEventsTitle">
                <h4><b>Deployment Plan</b></h4>
                <ul id="tCalendarDropDown" className="styled-parent">
                    <li  className="aui-dd-parent">
                        <button  className="aui-button aui-dd-trigger" id="dropdown-trigger">
                            <img src={getAjsContextPath()+"/download/resources/kz.hcb.tCalendarsHcbConfluence.tCalendarsHcbConfluence:tCalendarsHcbConluence-resources/images/tCalendarEventsMore.png"} alt=""/>
                        </button>
                        <ul className="aui-dropdown">
                            <li className="dropdown-item" onClick={props.addEvent}>Добавить событие</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <ul className="tCalendarEventsList">

                {props.events.map((event,index) => {

                    return (
                        <li key={event.id} data-index={index} onClick={props.handleClickEventLi} className={props.selectedIndex === index ? "active" : ""}>
                            <p><img className="jiraIssueImg" src={getAjsContextPath()+"/download/resources/kz.hcb.tCalendarsHcbConfluence.tCalendarsHcbConfluence:tCalendarsHcbConluence-resources/images/tCalendarJiraIssue.png"} alt=""/>{event.eventName}</p>
                            <ul id={"tCalendarDropDown"+(index+1)} className="styled-parent">
                                <li  className="aui-dd-parent">
                                    <button  className="aui-button aui-dd-trigger" id="dropdown-trigger">
                                        <img src={getAjsContextPath()+"/download/resources/kz.hcb.tCalendarsHcbConfluence.tCalendarsHcbConfluence:tCalendarsHcbConluence-resources/images/tCalendarEventsMore.png"} alt=""/>
                                    </button>
                                    <ul className="aui-dropdown">
                                        <li className="dropdown-item" data-id={event.id} 
                                                                      data-eventname={event.eventName} 
                                                                      data-filtername={event.filterName}
                                                                      onClick={props.updateEvent}>Редактировать</li>
                                        <li className="dropdown-item" data-id={event.id} data-index={index} onClick={props.deleteEvent}>Удалить</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    );

                })}
                
            </ul>
        </div>
    );
}

export default TEvents;