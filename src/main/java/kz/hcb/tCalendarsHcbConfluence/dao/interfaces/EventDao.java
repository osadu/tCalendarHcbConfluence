package kz.hcb.tCalendarsHcbConfluence.dao.interfaces;

import kz.hcb.tCalendarsHcbConfluence.entities.Event;

public interface EventDao {

    Event createEvent(String eventName, String filterName, String systemName);
    Event getEventById(int id);
    Event[] getEvents();
    void deleteEvent(Event event);
    Event updateEvent(int id, String eventName, String filterName, String systemName);

}
