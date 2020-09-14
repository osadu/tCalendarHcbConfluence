package kz.hcb.tCalendarsHcbConfluence.rest.models;

import org.codehaus.jackson.annotate.JsonAutoDetect;

@JsonAutoDetect
public class Success<T> {
    private String code;
    private String message;
    private T responseObject;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getResponseObject() {
        return responseObject;
    }

    public void setResponseObject(T responseObject) {
        this.responseObject = responseObject;
    }
}
