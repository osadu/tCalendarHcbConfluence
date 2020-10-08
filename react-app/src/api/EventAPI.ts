import axios from "axios";
import { EventType } from "../commons/Commons";
import {getAjsContextPath} from "../utils/jira.util";

const BASE_URL = getAjsContextPath()+"/rest/tCalendarsHcbConfluence/1/";
const JIRA_BASE_URL = "http://localhost:2990/jira/rest/api/2/";
const JIRA_CUSTOM_URL = "http://localhost:2990/jira/rest/tCalendarsHcbJira/1/"; 


export const EventAPI = {

    createEvent: (event:EventType) => {
        return axios.post(BASE_URL+"createEvent",event).then( response => response.data);
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

    updateEvent: (event:EventType) => {
        return axios.put(BASE_URL+"updateEvent", event).then( response => response.data );
    },

    getJqlByFilterName: (filterName:string) => {
      return axios.get(JIRA_CUSTOM_URL+"getFilterJqlByNameAnonym?filterName="+filterName).then( response => response.data.jql );
    },

    getJiraIssuesByFilterName: (filterName:string | undefined) => {
        return axios.get(JIRA_CUSTOM_URL+"getJiraIssuesByFilterNameAnonym?filterName="+filterName).then( response => response.data.issues );
    },

    getJiraIssuesBySystemName: (systemName:string | undefined) => {
        return axios.get(JIRA_CUSTOM_URL+"getJiraIssuesBySystemName?systemName="+systemName).then( response => response.data.issues );
    },

    getSystemNamesFromJira: () => {
        return axios.get(JIRA_CUSTOM_URL+"getSystemNames").then( response => response.data );
    }

}