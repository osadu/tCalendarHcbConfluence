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
    Description: string,
    Status: string,
    Creator: string
}