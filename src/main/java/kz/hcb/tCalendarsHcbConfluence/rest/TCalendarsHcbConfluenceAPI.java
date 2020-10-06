package kz.hcb.tCalendarsHcbConfluence.rest;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import kz.hcb.tCalendarsHcbConfluence.dao.interfaces.EventDao;
import kz.hcb.tCalendarsHcbConfluence.entities.Event;
import kz.hcb.tCalendarsHcbConfluence.rest.models.Error;
import kz.hcb.tCalendarsHcbConfluence.rest.models.Success;
import org.springframework.security.access.method.P;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("/")
public class TCalendarsHcbConfluenceAPI {

    private EventDao eventDao;

    @Inject
    public TCalendarsHcbConfluenceAPI(EventDao eventDao){
        this.eventDao = eventDao;
    }

    @GET
    @Path("/example")
    @Produces(MediaType.APPLICATION_JSON)
    public String example(){

        DeleteAllEntitiesData();

        return eventDao.getEvents().length+"";
    }

    @POST
    @Path("/createEvent")
    @Produces(MediaType.APPLICATION_JSON)
    public Response createEvent(String request){

        try{
            JsonParser parser = new JsonParser();
            JsonObject json = (JsonObject) parser.parse(request);
            Event event = eventDao.createEvent(json.get("eventName").getAsString(),
                                               json.get("filterName") != null ? json.get("filterName").getAsString() : null,
                                                json.get("systemName") != null ? json.get("systemName").getAsString() : null);
            return Response.ok(getSuccess(getResponnseEvent(event))).build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity(getError(e)).build();
        }

    }

    @GET
    @Path("/getEventById/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEventById(@PathParam("id") int id){

        try {
            Success<Error> success = new Success<>();
            Event event = eventDao.getEventById(id);
            return Response.ok(getSuccess(getResponnseEvent(event))).build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity(getError(e)).build();
        }
    }

    @GET
    @Path("/getEvents")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEvents(){

        try {
            List<kz.hcb.tCalendarsHcbConfluence.rest.models.Event> eventList = new ArrayList<>();
            Event[] events = eventDao.getEvents();

            for(Event event : events){
               eventList.add(getResponnseEvent(event));
            }
            Success<List<kz.hcb.tCalendarsHcbConfluence.rest.models.Event>> success = new Success<>();
            success.setCode("00");
            success.setMessage("Успешно");
            success.setResponseObject(eventList);
            return Response.ok(success).build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity(getError(e)).build();
        }

    }

    @DELETE
    @Path("/deleteEvent/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteEvent(@PathParam("id") int id){

        try {
            Event event = eventDao.getEventById(id);
            eventDao.deleteEvent(event);
            return Response.ok(getSuccess(null)).build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity(getError(e)).build();
        }

    }

    @PUT
    @Path("/updateEvent")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateEvent(String request){
        try {
            JsonParser parser = new JsonParser();
            JsonObject json = (JsonObject) parser.parse(request);
            Event event = eventDao.updateEvent(json.get("id").getAsInt(),
                    json.get("eventName").getAsString(),
                    json.get("filterName") != null ? json.get("filterName").getAsString() : null,
                    json.get("systemName") != null ? json.get("systemName").getAsString() : null);
            return Response.ok(getSuccess(getResponnseEvent(event))).build();
        }catch (Exception e){
            e.printStackTrace();
            return Response.serverError().entity(getError(e)).build();
        }

    }


    private Success getSuccess(kz.hcb.tCalendarsHcbConfluence.rest.models.Event event){
        Success<kz.hcb.tCalendarsHcbConfluence.rest.models.Event> success = new Success<>();
        success.setCode("00");
        success.setMessage("Успешно");
        success.setResponseObject(event);
        return success;
    }

    private Error getError(Exception e){
        Error error = new Error();
        error.setCode("01");
        error.setMessage(e.getMessage());
        return error;
    }

    private kz.hcb.tCalendarsHcbConfluence.rest.models.Event getResponnseEvent(Event event){
        kz.hcb.tCalendarsHcbConfluence.rest.models.Event evnt = new kz.hcb.tCalendarsHcbConfluence.rest.models.Event();
        evnt.setId(event.getID());
        evnt.setEventName(event.getEventName());
        evnt.setFilterName(event.getFilterName());
        evnt.setSystemName(event.getSystemName());
        return evnt;
    }

    private void DeleteAllEntitiesData(){
        Event[] events = eventDao.getEvents();

        for(int i=0; i<events.length ; i++){
            eventDao.deleteEvent(events[i]);
        }
    }

}
