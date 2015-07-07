package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import org.apache.commons.codec.binary.Base64;

public class PatientPhoto extends AbstractPatientObject {

    public static final String DEFAULT_CONTENT_TYPE = "image/png;base64";

    private String contentType;
    private String imageData;

    public PatientPhoto(String pid, String contentType, String base64ImageData) {
        super(null);
        setData("pid", pid);
        setData("contentType", contentType);
        setData("imageData", base64ImageData);
    }

    public PatientPhoto(String pid, String contentType, byte[] binaryImageData) {
        this(pid, contentType, Base64.encodeBase64String(binaryImageData));
    }

    public PatientPhoto(String pid, String base64ImageData) {
        this(pid, DEFAULT_CONTENT_TYPE, base64ImageData);
    }

    public PatientPhoto(String pid, byte[] binaryImageData) {
        this(pid, DEFAULT_CONTENT_TYPE, Base64.encodeBase64String(binaryImageData));
    }


    public String getContentType() {
        return contentType;
    }

    public String getImageData() {
        return imageData;
    }

    @JsonIgnore
    public byte[] getImageBytes() {
        return Base64.decodeBase64(imageData);
    }
}
