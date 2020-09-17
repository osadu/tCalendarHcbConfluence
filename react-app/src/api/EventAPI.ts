import axios from "axios";
import {getAjsContextPath} from "../utils/jira.util";

const BASE_URL = getAjsContextPath()+"/rest/tCalendarsHcbConfluence/1/";
const JIRA_BASE_URL = "http://localhost:2990/jira/rest/api/2/";
const JIRA_CUSTOM_URL = "http://localhost:2990/jira/rest/tCalendarsHcbJira/1/"; 


export const EventAPI = {

    createEvent: (eventName:string | undefined, filterName:string | undefined) => {
        return axios.post(BASE_URL+"createEvent",{ eventName, filterName }).then( response => response.data);
    },

    getEvents: () => {
        return axios.get(BASE_URL+"getEvents").then( response => response.data );
    },

    getEventById: (id:number) => {
        return axios.get(BASE_URL+"getEventById/"+id).then( response => response.data );
    },

    deleteEvent: (id:string | undefined) => {
        return axios.delete(BASE_URL+"deleteEvent/"+id).then( response => response.data);
    },

    updateEvent: (id:string, eventName:string, filterName:string) => {
        return axios.put(BASE_URL+"updateEvent", { id, eventName, filterName}).then( response => response.data );
    },

    getJqlByFilterName: (filterName:string) => {
      return axios.get(JIRA_CUSTOM_URL+"getFilterJqlByNameAnonym?filterName="+filterName).then( response => response.data.jql );
    },

    getJiraIssuesByJql: (jql:string) => {
        return axios.get(JIRA_BASE_URL+"search?jql="+jql+"&maxResults=500").then( response => response.data.issues );
    }

}