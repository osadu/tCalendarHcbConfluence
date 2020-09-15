import React from "react";
import './tcalendars.css';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
import { L10n, loadCldr } from '@syncfusion/ej2-base';

type TCalendarProps = {
    onPopupOpen: (args:any) => void
}

const TCalendar = (props: TCalendarProps) => {

    let data: object [] = [{
        Id: 1,
        Subject: 'Meeting - 1dasdasdasdasdasdasdadasdasdasdasdasfagfdgfh sfsdfsdf',
        StartTime: new Date(2018, 1, 15, 10, 0),
        IsAllDay: false,
        Description: "Это прмер описания даноого ивента",
        Status: "Done"
     }];
     
    loadCldr(
        require('cldr-data/supplemental/numberingSystems.json'),
        require('cldr-data/main/ru/ca-gregorian.json'),
        require('cldr-data/main/ru/numbers.json'),
        require('cldr-data/main/ru/timeZoneNames.json')
      );
    L10n.load(require('@syncfusion/ej2-locale/src/ru.json'));

    return (
        <ScheduleComponent height='550px' 
                           width='82%'
                           selectedDate={new Date()}
                           eventSettings={ { dataSource: data } } 
                           currentView="Month" 
                           readonly={true}
                           locale={"ru"}
                           firstDayOfWeek={1}
                           popupOpen={props.onPopupOpen}
                           >
            <Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>
        </ScheduleComponent>
    );
}

export default TCalendar;