package gov.va.vlerdas;

import gov.va.cpe.idn.PatientIds;
import gov.va.cpe.vpr.sync.vista.VistaDataChunk;
import gov.va.hmp.web.servlet.view.ModelAndViewFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Spring controller to expose the VLER DAS client
 * This is mainly for testing and demo purposes and should probably be removed later
 */
@Controller
public class VlerDasController_Temp {

    private VlerDasPatientService patientService;

    @Autowired
    public void setVlerDasPatientService(VlerDasPatientService patientService) {
        this.patientService = patientService;
    }

    @RequestMapping(value = "/vlerdas/{pid}", method = GET)
    public ModelAndView test(@PathVariable("pid") String pid) {
        PatientIds ids = new PatientIds(new PatientIds.Builder().icn(pid).pid(pid));
        List<VistaDataChunk> chunks = patientService.fetchVlerDasPatientData(ids);

        StringBuilder sb = new StringBuilder("{");
        int numChunks = chunks != null ? chunks.size() : 0;
        sb.append("\n\"numChunks\": " + numChunks + ",\n\"chunks\": [");

        if (chunks != null) {
            int i = 0;
            for (VistaDataChunk chunk : chunks) {
                sb.append(chunk.getJson());
                if (++i < chunks.size()) {
                    sb.append(',');
                }
                sb.append('\n');
            }
        }
        sb.append("]\n}");

        return ModelAndViewFactory.stringModelAndView(sb.toString());
    }
}
