package us.vistacore.mocks.webapi;

import com.google.gson.Gson;

import javax.ws.rs.core.Response;

public class JsonResponseMessage {
    @SuppressWarnings("unused")
    private Response.Status status;
    @SuppressWarnings("unused")
    private String message;

    public JsonResponseMessage(Response.Status status, String message) {
        this.status = status;
        this.message = message;
    }

    public String toJson() {
        return (new Gson()).toJson(this, JsonResponseMessage.class);
    }

}
