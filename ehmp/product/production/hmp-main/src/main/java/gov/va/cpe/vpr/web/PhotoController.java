package gov.va.cpe.vpr.web;

import com.fasterxml.jackson.databind.JsonNode;
import gov.va.cpe.vpr.PatientPhoto;
import gov.va.cpe.vpr.PersonPhoto;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import gov.va.cpe.vpr.sync.vista.IVistaVprPatientObjectDao;
import gov.va.hmp.Bootstrap;
import gov.va.hmp.jsonc.JsonCResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.contentNegotiatingModelAndView;
import static gov.va.hmp.web.servlet.view.ModelAndViewFactory.resourceModelAndView;

@Controller
public class PhotoController {
    @Autowired
    ApplicationContext applicationContext;

    @Autowired
    IVistaVprObjectDao vprObjectDao;

    @Autowired
    IVistaVprPatientObjectDao vprPatientObjectDao;

    @Autowired
    IGenericPOMObjectDAO jdsDao;

    @RequestMapping(value = "/person/{apiVersion}/{uid}/photo", method = RequestMethod.GET)
    public ModelAndView getPersonPhoto(@PathVariable String apiVersion, @PathVariable String uid, HttpServletRequest request) throws IOException {
        // TODO: check VPR OBJECT file for this bad bwoy first
        File photo = getUserPhotoFile(uid);
        if (photo.exists()) {
            return resourceModelAndView(new FileSystemResource(photo));
        } else {
            PersonPhoto photoObj = jdsDao.findOneByIndexAndRange(PersonPhoto.class, "personphoto", uid);
            if (photoObj != null) {
                FileCopyUtils.copy(photoObj.getImageBytes(), photo);
                return resourceModelAndView(new FileSystemResource(photo));
            } else {
                return new ModelAndView("redirect:/images/icons/pt-no-picture.png");
            }
        }
    }

    @RequestMapping(value = "/person/{apiVersion}/{uid}/photo", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ModelAndView setPersonPhoto(@PathVariable String apiVersion, @PathVariable String uid, @RequestBody JsonNode requestJson, HttpServletRequest request) throws IOException {
        validatePhotoUpload(requestJson);
        JsonCResponse jsonc = null;
        try {
            String contentType = requestJson.get("content-type").textValue();
            String base64ImageData = requestJson.get("data").textValue();

            PersonPhoto photo = new PersonPhoto(uid, contentType, base64ImageData);
            photo = vprObjectDao.save(photo);

            File photoFile = getUserPhotoFile(uid);
            FileCopyUtils.copy(photo.getImageBytes(), photoFile);

            jsonc = createJsonCResponse(request);
        } catch (IOException e) {
            jsonc = JsonCResponse.createError(request, "500", e);
        }
        return contentNegotiatingModelAndView(jsonc);
    }

    @RequestMapping(value = "/vpr/{apiVersion}/{pid}/photo", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ModelAndView setPatientPhoto(@PathVariable String apiVersion, @PathVariable String pid, @RequestBody JsonNode requestJson, HttpServletRequest request) {
        validatePhotoUpload(requestJson);
        JsonCResponse jsonc = null;
        try {
            String contentType = requestJson.get("content-type").textValue();
            String base64ImageData = requestJson.get("data").textValue();

            PatientPhoto photo = new PatientPhoto(pid, contentType, base64ImageData);
//            photo = vprPatientObjectDao.save(photo); // NOTE: only saving in file system cache for now

            File photoFile = getPatientPhotoFile(pid);
            FileCopyUtils.copy(photo.getImageBytes(), photoFile);

            jsonc = createJsonCResponse(request);
        } catch (IOException e) {
            jsonc = JsonCResponse.createError(request, "500", e);
        }
        return contentNegotiatingModelAndView(jsonc);
    }

    private JsonCResponse createJsonCResponse(HttpServletRequest request) {
        JsonCResponse jsonc;
        jsonc = JsonCResponse.create(request);
        jsonc.params.remove("file");
        jsonc.data = new HashMap();
        return jsonc;
    }

    @RequestMapping(value = "/vpr/{apiVersion}/{pid}/photo", method = RequestMethod.GET)
    public ModelAndView getPatientPhoto(@PathVariable String apiVersion, @PathVariable String pid, HttpServletRequest request) throws IOException {
        // TODO: check VPR PATIENT OBJECT file for this bad bwoy first
        File photo = getPatientPhotoFile(pid);
        if (photo.exists()) {
            return resourceModelAndView(new FileSystemResource(photo));
        } else {
            return new ModelAndView("redirect:/images/icons/pt-no-picture.png");
        }
    }

    private void validatePhotoUpload(JsonNode requestJson) {
        Assert.notNull(requestJson.get("data"), "photo upload JSON must have a 'data' element");
        Assert.hasText(requestJson.get("data").textValue(), "photo upload JSON must have a 'data' element with a String value");
    }


    private File getPatientPhotoFile(String pid) throws IOException {
        if (checkFilePath(pid)) {
        	return new File(getPatientPhotosDir(), pid + ".png");
        }
        return null;
    }

    private boolean checkFilePath(String pid) {
    	// prevent file path manipulation
        if (pid == null || pid.contains("..") || pid.contains("\\") || pid.contains("/")) {
        	return false;
        }
        return true;
    }

    private File getPatientPhotosDir() throws IOException {
        File patientPhotosDir = new File(getPhotoUploadDir(), "patients");
        if (!patientPhotosDir.exists()) {
            patientPhotosDir.mkdir();
        }
        return patientPhotosDir;
    }

    private File getUserPhotoFile(String uid) throws IOException {
        validatePersonUid(uid);

        // TODO: user UIDs are likely to change, this is a bit fragile
        String[] pieces = uid.split(":");
        String filename = pieces[3] + "_" + pieces[4] + ".png";
        if (checkFilePath(filename)) {
        	return new File(getUserPhotosDir(), filename);
        }
        return null;
    }

    private void validatePersonUid(String uid) {
        if (!uid.matches("urn:va:user:.*:.*"))
            throw new IllegalArgumentException(uid + " is an invalid person uid"); // TODO: user UIDs are likely to change, this is a bit fragile
    }

    private File getUserPhotosDir() throws IOException {
        File userPhotosDir = new File(getPhotoUploadDir(), "users");
        if (!userPhotosDir.exists()) {
            userPhotosDir.mkdir();
        }
        return userPhotosDir;
    }

    private File getPhotoUploadDir() throws IOException {
        File photoUploadDir = new File(Bootstrap.getHmpHomeDirectory(applicationContext).getFile(), "photos");
        if (!photoUploadDir.exists()) {
            photoUploadDir.mkdir();
        }
        return photoUploadDir;
    }
}
