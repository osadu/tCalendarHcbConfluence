import React from "react";
import './tcalendars.css';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
import { L10n,  setCulture } from '@syncfusion/ej2-base';
import * as localeTexts from '../../commons/l10n/russian.json';

const TCalendar = (props: any) => {

    let data: object [] = [{
        Id: 1,
        Subject: 'Meeting - 1',
        StartTime: new Date(2018, 1, 15, 10, 0),
        EndTime: new Date(2018, 1, 16, 12, 30),
        IsAllDay: false,
        Status: "Done"
     }];
     L10n.load(localeTexts);

    return (
        <ScheduleComponent height='550px' 
                           width='82%' 
                           //selectedDate= {new Date(2018, 1, 15)} 
                           selectedDate={new Date()}
                           eventSettings={ { dataSource: data } } 
                           currentView="Month" 
                           readonly={true}
                           locale={"en"}
                           firstDayOfWeek={1}
                           >
            <Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>
        </ScheduleComponent>
    );
}

export default TCalendar;