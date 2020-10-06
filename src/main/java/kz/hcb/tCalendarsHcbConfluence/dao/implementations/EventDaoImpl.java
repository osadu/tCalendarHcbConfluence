package kz.hcb.tCalendarsHcbConfluence.dao.implementations;

import com.atlassian.activeobjects.external.ActiveObjects;
import com.atlassian.plugin.spring.scanner.annotation.imports.ConfluenceImport;
import kz.hcb.tCalendarsHcbConfluence.dao.interfaces.EventDao;
import kz.hcb.tCalendarsHcbConfluence.entities.Event;

import javax.inject.Inject;
import javax.inject.Named;

@Named
public class EventDaoImpl implements EventDao {

    @ConfluenceImport
    private ActiveObjects ao;

    @Inject
    public EventDaoImpl(ActiveObjects ao){
        this.ao = ao;
    }

    @Override
    public Event createEvent(String eventName, String filterName, String systemName) {
        Event event = ao.create(Event.class);
        event.setEventName(eventName);
        event.setFilterName(filterName);
        event.setSystemName(systemName);
        event.save();
        return event;
    }

    @Override
    public Event getEventById(int id) {
        return ao.get(Event.class, id);
    }

    @Override
    public Event[] getEvents() {
        return ao.find(Event.class);
    }

    @Override
    public void deleteEvent(Event event) {
        ao.delete(event);
    }

    @Override
    public Event updateEvent(int id, String eventName, String filterName, String systemName) {
        Event event = ao.get(Event.class,id);
        event.setEventName(eventName);
        event.setFilterName(filterName);
        event.setSystemName(systemName);
        event.save();
        return event;
    }
}
