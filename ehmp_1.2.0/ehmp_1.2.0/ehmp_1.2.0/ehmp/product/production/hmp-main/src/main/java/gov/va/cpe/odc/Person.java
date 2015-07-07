package gov.va.cpe.odc;

import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.jds.JdsCollectionName;
import gov.va.hmp.vista.util.VistaStringUtils;

import java.util.Map;

import static gov.va.cpe.vpr.pom.JSONViews.JDBView;
import static gov.va.cpe.vpr.pom.JSONViews.WSView;

@JdsCollectionName("user")
public class Person extends AbstractPOMObject {

    private String localId;
    private String name;
    private String displayName;
    private String ssn;
    private String service;
    private String displayService;
    private String title;
    private String displayTitle;
    private String genderCode;
    private String genderName;
    private String digitalPager;
    private String officePhone;
    private String fax;
    private String voicePager;
    private String commercialPhone;

    public Person() {
        super(null);
    }

    public Person(Map<String, Object> vals) {
        super(vals);
    }

    @JsonView(JDBView.class)
    public String getLocalId() {
        return localId;
    }

    public String getName() {
        return name;
    }

    public String getDisplayName() {
        if (displayName == null) {
            displayName = VistaStringUtils.nameCase(getName());
        }
        return displayName;
    }

    public String getSsn() {
        return ssn;
    }

    public String getService() {
        return service;
    }

    public String getDisplayService() {
        if (displayService == null) {
            displayService = VistaStringUtils.nameCase(getService());
        }
        return displayService;
    }

    public String getDigitalPager() {
		return digitalPager;
	}

	public String getOfficePhone() {
		return officePhone;
	}

	public String getFax() {
		return fax;
	}

	public String getVoicePager() {
		return voicePager;
	}

	public String getCommercialPhone() {
		return commercialPhone;
	}

	public String getTitle() {
        return title;
    }

    public String getDisplayTitle() {
        if (displayTitle == null) {
            displayTitle = VistaStringUtils.nameCase(getTitle());
        }
        return displayTitle;
    }

    public String getGenderCode() {
        return genderCode;
    }

    public String getGenderName() {
        return genderName;
    }

    @Override
    public String getSummary() {
        return getDisplayName();
    }

    // it feels weird decorating domain objects with WS specific info - maybe implement in separate marshaller?
    @JsonView(WSView.class)
    public String getPhotoHRef() {
        return "/person/v1/" + getUid() + "/photo";
    }
}
