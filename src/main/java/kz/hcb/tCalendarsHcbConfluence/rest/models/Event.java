package kz.hcb.tCalendarsHcbConfluence.rest.models;

import org.codehaus.jackson.annotate.JsonAutoDetect;

@JsonAutoDetect
public class Event {
    private Integer id;
    private String eventName;
    private String filterName;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getFilterName() {
        return filterName;
    }

    public void setFilterName(String filterName) {
        this.filterName = filterName;
    }
}
