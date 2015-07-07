package gov.va.cpe.vpr.service;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: anthonypuleo
 * Date: 7/18/13
 * Time: 1:10 PM
 * To change this template use File | Settings | File Templates.
 */
public interface IChecksumService {
    public JsonNode getVistaChecksum(String pid, String vistaId, String server);

    public JsonNode getJdsChecksum(String pid, String vistaId);

    public void checkPatientData(String pid, String VistaId, String server, String requestId);

    public Map<String, Object> fuPatientData(String request);
}
