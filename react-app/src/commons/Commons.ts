export type EventType = {
    id?:number
    eventName:string
    filterName?:string
    systemName?:string
}

export type IssueType = {
    Id: number,
    Subject: string,
    StartTime: Date,
    EndTime: Date,
    Description: string,
    Status: string,
    Creator: string,
    Assignee: string,
    Reference: string,
    IsAllDay: boolean
}

export type SystemNameType = {
    label: string,
    value: string
}