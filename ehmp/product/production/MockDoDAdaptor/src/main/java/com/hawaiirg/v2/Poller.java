package com.hawaiirg.v2;

import com.google.gson.Gson;
import com.hawaiirg.service.MockDoDAdaptorService;
import org.apache.commons.lang.StringUtils;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.LinkedHashMap;
import java.util.Map;

@Path("poller")
public class Poller {

    private static final MockDoDAdaptorService mockService = new MockDoDAdaptorService();

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String poller(@QueryParam("queryid") String queryId) {

        Gson gson = new Gson();

        Map<String, Object> resp = new LinkedHashMap<>();

        if (StringUtils.isBlank(queryId))
        {
            resp.put("error", "Missing queryid parameter");

            return gson.toJson(resp);
        }

        return gson.toJson(mockService.poller(queryId, "2"));
    }
}
