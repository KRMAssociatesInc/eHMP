package com.hawaiirg.v3;

import com.google.gson.Gson;
import com.hawaiirg.service.MockDoDAdaptorService;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.LinkedHashMap;
import java.util.Map;

@Path("query")
public class Query {

    private static final Logger LOGGER =
            Logger.getLogger(Query.class.getName());

    private static final MockDoDAdaptorService mockService = new MockDoDAdaptorService();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String query(@QueryParam("patientid") String patientId,
                        @QueryParam("loinc") String loinc) {

        Gson gson = new Gson();

        Map<String, Object> resp = new LinkedHashMap<>();

        if (StringUtils.isBlank(patientId)) {
            resp.put("error", "missing patientid");
            return gson.toJson(resp);
        } else if (StringUtils.isBlank(loinc)) {
            resp.put("error", "missing loinc");
            return gson.toJson(resp);
        }

        LOGGER.debug(String.format("patientid: %s, loinc: %s", patientId, loinc));

        resp.put("queryID", mockService.query(patientId, loinc));

        return gson.toJson(resp);
    }
}
