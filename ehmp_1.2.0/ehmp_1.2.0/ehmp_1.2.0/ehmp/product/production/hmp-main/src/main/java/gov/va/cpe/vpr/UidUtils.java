package gov.va.cpe.vpr;

import gov.va.cpe.clio.ClioTerminology;
import gov.va.cpe.lab.LabGroup;
import gov.va.cpe.lab.LabPanel;
import gov.va.cpe.odc.Location;
import gov.va.cpe.odc.Person;
import gov.va.cpe.order.*;
import gov.va.cpe.roster.Roster;
import gov.va.cpe.tabs.ChartTab;
import gov.va.cpe.tabs.UserTabPrefs;
import gov.va.cpe.team.Category;
import gov.va.cpe.team.Team;
import gov.va.cpe.team.TeamPosition;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.DefaultNamingStrategy;
import gov.va.cpe.vpr.pom.INamingStrategy;
import gov.va.cpe.vpr.pom.IPOMObject;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;
import gov.va.cpe.vpr.queryeng.dynamic.columns.ViewDefDefColDefConfigTemplate;
import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.hmp.access.asu.AsuRuleDef;
import gov.va.hmp.access.asu.UserClass;
import gov.va.hmp.app.Page;
import gov.va.hmp.ptselect.PatientSelect;
import gov.va.hmp.vista.util.VistaStringUtils;
import groovy.text.GStringTemplateEngine;
import groovy.text.Template;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.io.StringWriter;
import java.util.*;
import java.util.regex.Pattern;

public class UidUtils {

    private static final Map<String, String> DOMAIN_TO_UID_TEMPLATES = new LinkedHashMap<>();
    private static final Map<Pattern, Class<? extends IPOMObject>> UID_PATTERN_TO_DOMAIN_CLASS = new LinkedHashMap<>();
    private static final Map<String, Class<? extends IPOMObject>> DOMAIN_NAME_TO_DOMAIN_CLASS = new LinkedHashMap<>();
    private static final INamingStrategy NAMING_STRATEGY = new DefaultNamingStrategy();

    static {
        // patient data
        DOMAIN_TO_UID_TEMPLATES.put("allergy", "urn:va:allergy:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("appointment", "urn:va:appointment:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("consult", "urn:va:consult:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("cpt", "urn:va:cpt:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("document", "urn:va:document:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("vlerdocument", "urn:va:vlerdocument:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("exam", "urn:va:exam:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("education", "urn:va:education:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("factor", "urn:va:factor:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("immunization", "urn:va:immunization:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("lab", "urn:va:lab:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("med", "urn:va:med:${vistaSystemId}:${localPatientId}:${medOrderId}");
        DOMAIN_TO_UID_TEMPLATES.put("mh", "urn:va:mh:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("obs", "urn:va:obs:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("order", "urn:va:order:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("problem", "urn:va:problem:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("procedure", "urn:va:procedure:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("patient", "urn:va:patient:${vistaSystemId}:${localId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("pov", "urn:va:pov:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("ptf", "urn:va:ptf:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("image", "urn:va:image:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("skin", "urn:va:skin:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("surgery", "urn:va:surgery:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("task", "urn:va:task:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("visit", "urn:va:visit:${vistaSystemId}:${localPatientId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("vital", "urn:va:vital:${vistaSystemId}:${localPatientId}:${localId}");
        //DOMAIN_TO_UID_TEMPLATES.put("encounter", "urn:va:encounter:${vistaSystemId}:${localPatientId}:${localId}");

        // operational data
        DOMAIN_TO_UID_TEMPLATES.put("user", "urn:va:user:${vistaSystemId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("pt-select", "urn:va:pt-select:${vistaSystemId}:${localId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("asu-class", "urn:va:asu-class:${vistaSystemId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("asu-rule", "urn:va:asu-rule:${vistaSystemId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("doc-def", "urn:va:doc-def:${vistaSystemId}:${localId}");
        DOMAIN_TO_UID_TEMPLATES.put("clioterminology","urn:va:clioterminology:${vistaSystemId}");

        // patient data
//        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:alert:.*:.*:.*"), PatientAlert.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:allergy:.*:.*:.*"), Allergy.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:appointment:.*:.*:.*"), Encounter.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:consult:.*:.*:.*"), Procedure.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:cpt:.*:.*:.*"), VisitCPTCode.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:document:.*:.*:.*"), Document.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:vlerdocument:.*:.*:.*"), VLERDocument.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:education:.*:.*:.*"), EducationTopic.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:exam:.*:.*:.*"), Exam.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:visit:.*:.*:.*"), Encounter.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:diagnosis:.*:.*:.*"), Diagnosis.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:factor:.*:.*:.*"), HealthFactor.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:immunization:.*:.*:.*"), Immunization.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:med:.*:.*:.*"), Medication.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:mh:.*:.*:.*"), MentalHealth.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:obs:.*:.*:.*"), Observation.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:order:.*:.*:.*"), Order.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:auxiliary:.*:.*:.*"), Auxiliary.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:problem:.*:.*:.*"), Problem.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:patient:.*:.*(:.*)?"), PatientDemographics.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:procedure:.*:.*:.*"), Procedure.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:pov:.*:.*:.*"), PurposeOfVisit.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:ptf:.*:.*:.*"), VisitTreatment.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:skin:.*:.*:.*"), SkinTest.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:surgery:.*:.*:.*"), Procedure.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:treatment:.*:.*:.*"), Treatment.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:roadtrip:.*:.*:.*"), RoadTrip.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:image:.*:.*:.*"), Procedure.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:lab:.*:.*:.*"), Result.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:task:.*:.*:.*"), Task.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:vital:.*:.*:.*"), VitalSign.class);
        //UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:encounter:.*:.*:.*"), Encounter.class);

        // operational data
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:user:.*:.*"), Person.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:location:.*:.*"), Location.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:viewdefdefcoldefconfigtemplate:.*:.*"), ViewDefDefColDefConfigTemplate.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:category:.*:.*"), Category.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:teamposition:.*:.*"), TeamPosition.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:team:.*:.*"), Team.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:pointofcare:.*:.*"), PointOfCare.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:personphoto:.*:.*"), PersonPhoto.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:orderable:.*:.*"), Orderable.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:route:.*:.*"), Route.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:schedule:.*:.*"), Schedule.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:qo:.*:.*"), QuickOrder.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:viewdefdef:.*:.*"), ViewDefDef.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:page:.*:.*"), Page.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:pt-select:.*:.*(:.*)?"), PatientSelect.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:displayGroup:.*:.*"), OrderDisplayGroup.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:charttab:.*:.*"), ChartTab.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:usertabprefs:.*:.*"), UserTabPrefs.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:roster:.*:.*"), Roster.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:clioterminology:.*"), ClioTerminology.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:labgroup:.*"), LabGroup.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:labpanel:.*"), LabPanel.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:asu-class:.*"), UserClass.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:asu-rule:.*"), AsuRuleDef.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:doc-def:.*"), DocumentDefinition.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:syncstatus:.*"), SyncStatus.class);

        //Operational data with lists
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:vitaltypes-list:.*"), VitalTypesList.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:signssymptoms-list:.*"), SignsSymptomsList.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:allergy-list:.*"), AllergyList.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:problem-list:.*"), ProblemList.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:immunization-list:.*"), ImmunizationList.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:vitalqualifier-list:.*"), VitalQualifierList.class);
        UID_PATTERN_TO_DOMAIN_CLASS.put(compileCaseInsensitive("urn:va:vitalcategory-list:.*"), VitalCategoryList.class);
        
        
        
        
        
        
        initializeDomainNameToDomainClassMap();
    }

    private static void initializeDomainNameToDomainClassMap() {
        for (Map.Entry<Pattern, Class<? extends IPOMObject>> entry : UID_PATTERN_TO_DOMAIN_CLASS.entrySet()) {
            String domainInPattern = entry.getKey().pattern().split(":")[2];
            DOMAIN_NAME_TO_DOMAIN_CLASS.put(domainInPattern.toLowerCase(), entry.getValue());
        }
    }

    static HashMap<String, Template> classToTemplate = new HashMap<>();
    static GStringTemplateEngine geng = new GStringTemplateEngine(UidUtils.class.getClassLoader());

    private static Pattern compileCaseInsensitive(String regex) {
        return Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
    }

    private static Template getTemplateForDomain(String domain) throws IOException, ClassNotFoundException {
        Template rslt = classToTemplate.get(domain);
        if(rslt==null) {
            rslt = geng.createTemplate(DOMAIN_TO_UID_TEMPLATES.get(domain));
            classToTemplate.put(domain, rslt);
        }
        return rslt;
    }

    private static String getUid(String domain, Map params) {
        assert DOMAIN_TO_UID_TEMPLATES.containsKey(domain);
        try {
            Template t = getTemplateForDomain(domain);
            StringWriter sw = new StringWriter();
            t.make(params).writeTo(sw);
            return sw.toString();
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static String getDefaultDomainUid(String domain, String vistaSystemId, String localPatientId, String localId) {
        Assert.hasText(domain, "[Assertion failed] - the 'domain' argument must have text; it must not be null, empty, or blank");
        Assert.hasText(vistaSystemId, "[Assertion failed] - the 'vistaSystemId' argument must have text; it must not be null, empty, or blank");
        Assert.hasText(localPatientId, "[Assertion failed] - the 'localPatientId' argument must have text; it must not be null, empty, or blank");
        Assert.hasText(localId, "[Assertion failed] - the 'localId' argument must have text; it must not be null, empty, or blank");

        LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(3);
        map.put("vistaSystemId", vistaSystemId);
        map.put("localPatientId", localPatientId);
        map.put("localId", localId);
        return getUid(domain, map);
    }

    public static String getAllergyUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("allergy", vistaSystemId, localPatientId, localId);
    }

    public static String getAppointmentUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("appointment", vistaSystemId, localPatientId, localId);
    }

    public static String getConsultUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("consult", vistaSystemId, localPatientId, localId);
    }

    public static String getDocumentUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("document", vistaSystemId, localPatientId, localId);
    }

    public static String getEducationTopicUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("education", vistaSystemId, localPatientId, localId);
    }

    public static String getExamUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("exam", vistaSystemId, localPatientId, localId);
    }

    public static String getHealthFactorUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("factor", vistaSystemId, localPatientId, localId);
    }

    public static String getImmunizationUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("immunization", vistaSystemId, localPatientId, localId);
    }

    public static String getMedicationUid(String vistaSystemId, String localPatientId, String medOrderId) {
        Assert.hasText(vistaSystemId, "[Assertion failed] - the 'vistaSystemId' argument must have text; it must not be null, empty, or blank");
        Assert.hasText(localPatientId, "[Assertion failed] - the 'localPatientId' argument must have text; it must not be null, empty, or blank");
        Assert.hasText(medOrderId, "[Assertion failed] - the 'medOrderId' argument must have text; it must not be null, empty, or blank");

        LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(3);
        map.put("vistaSystemId", vistaSystemId);
        map.put("localPatientId", localPatientId);
        map.put("medOrderId", medOrderId);
        return getUid("med", map);
    }

    public static String getMentalHealthUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("mh", vistaSystemId, localPatientId, localId);
    }

    public static String getOrderUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("order", vistaSystemId, localPatientId, localId);
    }

    public static String getObservationUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("obs", vistaSystemId, localPatientId, localId);
    }

    public static String getPatientUid(String vistaSystemId, String localId) {
        LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(2);
        map.put("vistaSystemId", vistaSystemId);
        map.put("localId", localId);
        return getUid("patient", map);
    }

    public static String getPatientSelectUid(String vistaSystemId, String localId) {
        LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(2);
        map.put("vistaSystemId", vistaSystemId);
        map.put("localId", localId);
        return getUid("pt-select", map);
    }

    public static String getProblemUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("problem", vistaSystemId, localPatientId, localId);
    }

    public static String getProcedureUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("procedure", vistaSystemId, localPatientId, localId);
    }

    public static String getPurposeOfVisitUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("pov", vistaSystemId, localPatientId, localId);
    }

    public static String getSkinTestUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("skin", vistaSystemId, localPatientId, localId);
    }

    public static String getSurgeryUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("surgery", vistaSystemId, localPatientId, localId);
    }

    public static String getResultUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("lab", vistaSystemId, localPatientId, localId);
    }

    public static String getResultOrganizerUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("lab", vistaSystemId, localPatientId, localId);
    }

    public static String getRadiologyUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("image", vistaSystemId, localPatientId, localId);
    }

    public static String getUserUid(String vistaSystemId, String localId) {
        LinkedHashMap<String, String> map = new LinkedHashMap<String, String>(2);
        map.put("vistaSystemId", vistaSystemId);
        map.put("localId", localId);
        return getUid("user", map);
    }

    public static String getVisitUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("visit", vistaSystemId, localPatientId, localId);
    }

    public static String getVisitCPTCodeUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("cpt", vistaSystemId, localPatientId, localId);
    }

    public static String getVitalSignUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("vital", vistaSystemId, localPatientId, localId);
    }
    
    public static String getVLERDocumentUid(String vistaSystemId, String localPatientId, String localId) {
        return getDefaultDomainUid("vlerdocument", vistaSystemId, localPatientId, localId);
    }

    public static Class<? extends IPOMObject> getDomainClass(String domain) {
        return DOMAIN_NAME_TO_DOMAIN_CLASS.get(domain.toLowerCase());
    }

    public static String getDomainName(Class<? extends IPOMObject> clazz) {
        // note that this only works for domain classes that are mapped to only one domain name; also it is pretty inefficient
        Set<String> domainNames = new HashSet<>();
        for (Map.Entry<String,Class<? extends IPOMObject>> entry: DOMAIN_NAME_TO_DOMAIN_CLASS.entrySet()) {
            if (clazz.equals(entry.getValue())) {
                domainNames.add(entry.getKey());
            }
        }
        if (domainNames.isEmpty()) {
            return NAMING_STRATEGY.collectionName(clazz);
        }
        if (domainNames.size() > 1) throw new IllegalArgumentException("Domain class '" + clazz.getName() + "' is mapped to more than one domain name: " + StringUtils.collectionToCommaDelimitedString(domainNames));
        return domainNames.iterator().next();
    }

    public static Class<? extends IPOMObject> getDomainClassByUid(final String uid) {
    	if (uid == null) return null;
        for (Map.Entry<Pattern, Class<? extends IPOMObject>> entry : UID_PATTERN_TO_DOMAIN_CLASS.entrySet()) {
            if (entry.getKey().matcher(uid).matches()) {
                return entry.getValue();
            }
        }
        return null;
    }

    public static String getDomainNameByUid(final String uid) {
        if (uid == null) return null;
        for (Map.Entry<Pattern, Class<? extends IPOMObject>> entry : UID_PATTERN_TO_DOMAIN_CLASS.entrySet()) {
            if (entry.getKey().matcher(uid).matches()) {
                String fullyQualifiedDomainName = entry.getValue().getName();
                return fullyQualifiedDomainName.substring(fullyQualifiedDomainName.lastIndexOf(".")+1);
            }
        }
        return null;
    }

    public static String getCollectionNameFromUid(String uid) {
        if (!StringUtils.hasText(uid)) return null;
        return VistaStringUtils.piece(uid, ":", 3);
    }

    public static String getSystemIdFromPatientUid(String patientUid) {
        Pattern patientUidPattern = getUidPatternForDomainClass(PatientDemographics.class);
        assert patientUidPattern.matcher(patientUid).matches();
        return VistaStringUtils.piece(patientUid, ":", 4);
    }

    public static String getLocalPatientIdFromPatientUid(String patientUid) {
        Pattern patientUidPattern = getUidPatternForDomainClass(PatientDemographics.class);
        assert patientUidPattern.matcher(patientUid).matches();
        return VistaStringUtils.piece(patientUid, ":", 5);
    }

    public static Set<String> getAllDomains() {
        return DOMAIN_NAME_TO_DOMAIN_CLASS.keySet();
    }

    public static Set<String> getAllPatientDataDomains() {
        Set<String> patDoms = new HashSet<String>();
        for(String s: DOMAIN_NAME_TO_DOMAIN_CLASS.keySet()) {
            if(AbstractPatientObject.class.isAssignableFrom(DOMAIN_NAME_TO_DOMAIN_CLASS.get(s)) && !s.equalsIgnoreCase("patient")) {
                patDoms.add(s);
            }
        }
        return patDoms;
    }

    public static Set<String> getAllPatientDataDomainClasses() {
        Set<String> patDoms = new TreeSet<String>();
        for(String s: DOMAIN_NAME_TO_DOMAIN_CLASS.keySet()) {
            if(AbstractPatientObject.class.isAssignableFrom(DOMAIN_NAME_TO_DOMAIN_CLASS.get(s)) && !s.equalsIgnoreCase("patient")) {
                patDoms.add(DOMAIN_NAME_TO_DOMAIN_CLASS.get(s).getSimpleName());
            }
        }
        return patDoms;
    }

    private static Pattern getUidPatternForDomainClass(Class<? extends IPOMObject> domainClass) {
        for (Map.Entry<Pattern, Class<? extends IPOMObject>> entry : UID_PATTERN_TO_DOMAIN_CLASS.entrySet()) {
            if (entry.getValue().equals(domainClass)) return entry.getKey();
        }

        return null;
    }

	public static String getLocalPatientIdFromDomainUid(String domainUid) {
		return VistaStringUtils.piece(domainUid,":",5);
	}
}
