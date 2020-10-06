package kz.hcb.tCalendarsHcbConfluence.entities;

import net.java.ao.Entity;

public interface Event extends Entity {

    String getEventName();
    void setEventName(String eventName);

    String getFilterName();
    void setFilterName(String filterName);

    String getSystemName();
    void setSystemName(String systemName);

}
