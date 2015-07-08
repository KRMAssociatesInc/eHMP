package gov.va.cpe.vpr;

import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;
import gov.va.cpe.vpr.pom.IPatientDAO;
import gov.va.cpe.vpr.queryeng.query.QueryDef;
import gov.va.cpe.vpr.sync.vista.IVistaVprPatientDemographicsObjectDao;
import gov.va.cpe.vpr.sync.vista.IVistaVprPatientObjectDao;
import gov.va.cpe.vpr.web.PatientNotFoundException;
import gov.va.hmp.auth.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
public class PatientService {

    private static final String PHONE_TYPE_HOME = "H";
    private static final String PHONE_TYPE_MOBILE = "MC";
    private static final String PHONE_TYPE_WORK = "WP";
    
    private IPatientDAO patientDao;
    private IGenericPatientObjectDAO patientRelatedDao;
    private IGenericPOMObjectDAO genericDao;
    private IVistaVprPatientObjectDao vprPatientObjectDao;
    private IVistaVprPatientDemographicsObjectDao vistaVprDemographicsDao;
    private UserContext userContext;

    @Autowired
    public void setPatientDao(IPatientDAO patientDao) {
        this.patientDao = patientDao;
    }
    @Autowired
    public void setPatientRelatedDao(IGenericPatientObjectDAO patientRelatedDao) {
        this.patientRelatedDao = patientRelatedDao;
    }
    @Autowired
    public void setGenericDao(IGenericPOMObjectDAO genericDao) {
        this.genericDao = genericDao;
    }
    @Autowired
    public void setVprPatientObjectDao(IVistaVprPatientObjectDao vprPatientObjectDao) {
        this.vprPatientObjectDao = vprPatientObjectDao;
    }

    @Autowired
    public void setVistaVprDemographicsDao(IVistaVprPatientDemographicsObjectDao vistaVprDemographicsDao) {
        this.vistaVprDemographicsDao = vistaVprDemographicsDao;
    }

    @Autowired
    public void setUserContext(UserContext userContext) {
        this.userContext = userContext;
    }

    public PatientDemographics getPatient(String pid) {
        PatientDemographics pt = patientDao.findByPid(pid);
        if (pt==null) {
            throw new PatientNotFoundException(pid);
        }
        return pt;
    }

    public List<Map<String, Object>> getPatientFlags(String pid) {
        List<Map<String, Object>> rslt = new ArrayList<Map<String, Object>>();
        PatientDemographics pat = patientDao.findByPid(pid);
        if (pat != null) {
            QueryDef qd = new QueryDef("cwad");
            qd.fields().exclude("content").exclude("text");
            /*
             * I have to do this in two separate queries because of the mess that results from trying to query on one domain class when two different classes have been  pushed into the JDS.
             */
            Map<String, Object> parms = new HashMap<String, Object>();
            parms.put("pid", pid);
            List<PatientAlert> alerts = genericDao.findAllByQuery(PatientAlert.class, qd, parms);
            for (PatientAlert doc : alerts) {
                if (UidUtils.getDomainClassByUid(doc.getUid()) == PatientAlert.class) {
                	Map<String, Object> roe = new HashMap<String, Object>();
                	roe.put("uid", doc.getUid());
                	roe.put("code", "A");
                	roe.put("name",doc.getKind());
                	roe.put("content", doc.getSummary());
                	rslt.add(roe);
                }
            }

            List<Document> docs = genericDao.findAllByQuery(Document.class, qd, parms);
            for (Document doc : docs) {
                if (UidUtils.getDomainClassByUid(doc.getUid()) == Document.class) {
                    String content = (doc.getText()!=null && doc.getText().size()>0) ? doc.getText().get(0).getContent() : "";
                    Map<String, Object> roe = new HashMap<String, Object>();
                    roe.put("uid",doc.getUid());
                	roe.put("code",doc.getDocumentTypeCode());
                	roe.put("name",doc.getDocumentTypeName());
                	roe.put("content", content);
                	rslt.add(roe);
                }
            }

            List<Allergy> allergies = genericDao.findAllByQuery(Allergy.class, qd, parms);
            for (Allergy allergy : allergies) {
                if (UidUtils.getDomainClassByUid(allergy.getUid()) == Allergy.class) {
                    StringBuffer content = new StringBuffer();
                    content.append(allergy.getSummary());
                    List<AllergyReaction> reactions = allergy.getReactions();
                    if(reactions!=null && reactions.size()>0) {
                    	 content.append(" can cause ");
                    	 for(AllergyReaction reaction: allergy.getReactions()) {
                         	content.append((reaction==allergy.getReactions().get(0)?"":", "));
                         	content.append(reaction.getName());
                         }
                    }
                   
                    Map<String, Object> roe = new HashMap<String, Object>();
                    roe.put("uid",allergy.getUid());
                	roe.put("code","A");
                	roe.put("name","Allergy / Adverse Reaction");
                	
                	roe.put("content", content);
                	rslt.add(roe);
                }
            }

            if (pat.getPatientRecordFlag()!=null) {
            	for (PatientRecordFlag f : pat.getPatientRecordFlag()) {
            		Map<String, Object> roe = new HashMap<String, Object>();
            		roe.put("uid",null);
            		roe.put("code","F");
            		roe.put("name",f.getName());
            		roe.put("content",f.getText());
            		rslt.add(roe);
//            		rslt.add(['code': 'F', 'name': f.getName(), 'content': f.getText()]);
            	}
            }
        }
        return rslt;
    }

    public Auxiliary getOnePatientAuxiliaryObject(String pid) {
        Page<Auxiliary> rslt = patientRelatedDao.findAllByPID(Auxiliary.class, pid, null);
        if (rslt.getContent().size() > 0) {
            return rslt.getContent().get(0);
        } else {
            Auxiliary aux = new Auxiliary();
            Map<String, Object> defaultVals = new HashMap<String, Object>();
            if(defaultVals!=null) {
//            	if(userContext!=null) {
//		            defaultVals.put("ownerName",userContext.getCurrentUser().getDisplayName());
//		            defaultVals.put("ownerCode",userContext.getCurrentUser().getUid());
//		            defaultVals.put("facilityCode",userContext.getCurrentUser().getDivision());
//		            defaultVals.put("facilityName",userContext.getCurrentUser().getDivisionName());
//            	}
	            defaultVals.put("goals",new HashMap<String, Object>());
	            defaultVals.put("pid",pid);
            }
            aux.setData(defaultVals);
            return aux;
        }
    }

    public Encounter getCurrentVisit(String pid) {
        QueryDef qryDef = new QueryDef();
        qryDef.usingIndex("curvisit");
        Map<String, Object> parms = new HashMap<String, Object>();
        parms.put("pid", pid);
        List<Encounter> rslt = patientRelatedDao.findAllByQuery(Encounter.class, qryDef, parms);
        if (rslt.size() > 0) {
            return rslt.get(0);
        } else {
            return null;
        }
    }

    public boolean isInPatient(String pid) {
        boolean inPat = false;
        Encounter e = getCurrentVisit(pid);
        if ( e != null ) {
           if (e.getCategoryName() != null && e.getCategoryName().equalsIgnoreCase("admission") && e.getCurrent()) {
               inPat = true;
           }
        }
        return inPat;
    }

    public Map<String, Object> updateCurrentVisitField(String field, String val, Encounter enc, String pid) {
        Auxiliary aux = getOnePatientAuxiliaryObject(pid);
        Map<String, Map<String, Object>> domainAux = aux.getDomainAux();
        if (domainAux == null) {
            domainAux = new HashMap<String, Map<String, Object>>();
            aux.domainAux = domainAux;
        }
        if (domainAux.get(enc.getUid()) == null) {
            domainAux.put(enc.getUid(), new HashMap<String, Object>());
        }
        domainAux.get(enc.getUid()).put(field, val);
        vprPatientObjectDao.save(aux);
        return domainAux.get(enc.getUid());
    }

    public Map<String, Object> getPatientDemographics(String pid) {

        PatientDemographics dems = patientDao.findByPid(pid);
        if (dems == null) throw new PatientNotFoundException(pid);

        Map<String, Object> data = new HashMap();

        Set<Telecom> telecoms = dems.getTelecom();
        data.put("homePhone", findTelNbrByType(PHONE_TYPE_HOME, telecoms)) ;
        data.put("cellPhone", findTelNbrByType(PHONE_TYPE_MOBILE, telecoms)) ;
        data.put("workPhone", findTelNbrByType(PHONE_TYPE_WORK, telecoms)) ;

        StringBuilder address = new StringBuilder();
        Set<Address> addresses = dems.getAddress();
        if ( addresses != null && addresses.size() > 0 ) {
            for ( Address addr : addresses ) {
                if ( "H".equalsIgnoreCase(addr.getUse()) ) {
                    String line1 = replaceNull(addr.getLine1());
                    if ( !line1.equalsIgnoreCase("") ) {
                        line1 += "<br>";
                    }
                    String line2 = replaceNull(addr.getLine2());
                    if ( !line2.equalsIgnoreCase("") ) {
                        line2 += "<br>";
                    }
                    String line3 = replaceNull(addr.getLine3());
                    if ( !line3.equalsIgnoreCase("") ) {
                        line3 += "<br>";
                    }
                    address.append(line1)
                           .append(line2)
                           .append(line3)
                           .append(replaceNull(addr.getCity())).append(", ")
                           .append(replaceNull(addr.getState())).append(" ").append(replaceNull(addr.getZip()));
                    break;
                }
            }
        }
        data.put("homeAddress", address.toString());

        String maritalStatus = dems.getMaritalStatusName();
        if ( maritalStatus != null ) {
            data.put("maritalStatus", maritalStatus);
        }

        data.put("veteran", dems.getVeteran());

        // Service Connected string
        String svcConnStr = "No";
        boolean isSvcConn = dems.isServiceConnected();
        if (isSvcConn) {
            String svcConnPercentage = dems.getServiceConnectedPercent();
            svcConnStr = String.format("Yes (%s%%)", svcConnPercentage != null ? svcConnPercentage : "0");
        }
        data.put("serviceConnected", svcConnStr);

        // Service Connected - Conditions
        List<String> l = new ArrayList<>();
        Set<ServiceConnectedCondition> conditions = dems.getScCondition();
        if (conditions != null && conditions.size() > 0) {
            StringBuilder sb = new StringBuilder();
            Iterator<ServiceConnectedCondition> iter = conditions.iterator();
            while (iter.hasNext()) {
                ServiceConnectedCondition condi = iter.next();
                sb.append(condi.getName()).append(" (").append(condi.getScPercent()).append("%)");
                l.add(sb.toString());
                sb.delete(0, sb.length());
            }
        }

        // Service Connected - Rated Disabilities
        Set<PatientDisability> disabilities = dems.getDisability();
        if ( disabilities != null && disabilities.size() >0 ) {
            StringBuilder sb = new StringBuilder();
            Iterator<PatientDisability> iter = disabilities.iterator();
            while (iter.hasNext()) {
                PatientDisability dis = iter.next();
                sb.append(dis.getName()).append(" (").append(dis.getDisPercent()).append("%");
                String connected = "";
                if (dis.isServiceConnected()) {
                    connected = "-SC";
                }
                sb.append(connected).append(")");
                l.add(sb.toString());
                sb.delete(0, sb.length());
            }
        }
        if ( l.size() > 0) {
            data.put("serviceConnectedConditions", StringUtils.collectionToDelimitedString(l, "<br>"));
        }

        // Other insurance
        l = new ArrayList<>();
        Set<PatientInsurance> insurances = dems.getInsurance();
        if(insurances!=null) for(PatientInsurance insurance: insurances) {
            l.add(insurance.toString());
        }
        if ( l.size() > 0) {
            data.put("otherInsurance", StringUtils.collectionToDelimitedString(l, "<br>"));
        }

        data.put("copay",null);

        Set<PatientContact> contacts = dems.getContact();
        if ( contacts != null && contacts.size() >0 ) {
            // if there are multiple nok or ec, return the first.
            boolean nokFound = false;
            boolean ecFound = false;
            for (PatientContact ct : contacts) {
                if (ct.getTypeName().equalsIgnoreCase("Next of Kin") && !nokFound) {
                    data.put("nokContact", replaceNull(ct.getName()));
                    data.put("nokPhone", findTelNbrByPriority(ct));
                    nokFound = true;
                }
                else if (ct.getTypeName().equalsIgnoreCase("Emergency Contact") && !ecFound) {
                    data.put("emergencyContact", replaceNull(ct.getName()));
                    data.put("emergencyPhone", findTelNbrByPriority(ct));
                    ecFound = true;
                }
            }
        }

        data.put("dateOfDeath", dems.getDeceased());

        return data;
    }

    private String replaceNull(String s) {
        if (!StringUtils.hasText(s))  return "";
        else return s;
    }

    private String findTelNbrByType(String type, Set<Telecom> telecoms) {

        String tel = "";
        Telecom telecom = findTelecomByType(type, telecoms);
        if ( telecom != null ) {
            tel = telecom.getValue();
        }
        return tel;
    }

    private Telecom findTelecomByType(String type, Set<Telecom> telecoms) {

        Telecom tel = null;
        if ( telecoms != null && telecoms.size() > 0 ) {
            for ( Telecom telecom : telecoms ) {
                if ( type.equalsIgnoreCase(telecom.getUse()) ) {
                    tel = telecom;
                }
            }
        }
        return tel;
    }

    private String findTelNbrByPriority(PatientContact sprt) {

        String nbr = "";
        Telecom  telObj = findTelecomByPriorityFromObj(sprt);
        if ( telObj != null ) {
            nbr = telObj.getValue();
        }
        return nbr;
    }

    private Telecom findTelecomByPriorityFromObj(PatientContact sprt) {

        Telecom phone = null;
        Set<Telecom> telecoms = sprt.getTelecom();
        if ( telecoms != null &&  telecoms.size() > 0 ) {
            phone = findTelecomByType(PHONE_TYPE_HOME, telecoms);
            if ( phone == null )   {
                phone =  findTelecomByType(PHONE_TYPE_MOBILE, telecoms);
                if ( phone == null )   {
                    phone =  findTelecomByType(PHONE_TYPE_WORK, telecoms);
                }
            }
        }
        return phone;
    }

public String updatePatientPhoneNumbers(String pid, String home, String cell, String work,
                                        String emergencyContact, String emergency, String nokContact, String nok)  {

        PatientDemographics dems = patientDao.findByPid(pid);

        // edit phone numbers
        Set<Telecom> telecoms =  dems.getTelecom();
        Telecom homePhone = findTelecomByType(PHONE_TYPE_HOME, telecoms);
        if ( homePhone == null ) {
            if ( StringUtils.hasText(home) ) {
                homePhone = createTelecom(PHONE_TYPE_HOME, home);
                dems.addToTelecoms(homePhone);
            }
        }
        else {
            homePhone.setValue(home);
        }
        Telecom cellPhone = findTelecomByType(PHONE_TYPE_MOBILE, telecoms);
        if ( cellPhone == null ) {
            if ( StringUtils.hasText(cell) ) {
                cellPhone = createTelecom(PHONE_TYPE_MOBILE, cell);
                dems.addToTelecoms(cellPhone);
            }
        }
        else {
            cellPhone.setValue(cell);
        }
        Telecom workPhone = findTelecomByType(PHONE_TYPE_WORK, telecoms);
        if ( workPhone == null ) {
            if ( StringUtils.hasText(work) ) {
                workPhone = createTelecom(PHONE_TYPE_WORK, work);
                dems.addToTelecoms(workPhone);
            }
        }
        else {
            workPhone.setValue(work);
        }

        // edit phone number of next of kin & emergency
        Set<PatientContact> supports = dems.getContact();
        if ( supports != null && supports.size() > 0 ) {
            boolean nokFound = false;
            boolean ecFound = false;
            for (PatientContact sprt : supports) {
                String contactNm = sprt.getName();
                if ( sprt.getTypeName().equalsIgnoreCase("Next of Kin")
                        && (contactNm!=null && contactNm.equalsIgnoreCase(nokContact)) && !nokFound ) {
                    setSupporterTelecom(sprt, nok);
                    nokFound = true;
                }
                else if ( sprt.getTypeName().equalsIgnoreCase("Emergency Contact")
                        && (contactNm!=null && contactNm.equalsIgnoreCase(emergencyContact)) && !ecFound) {
                    setSupporterTelecom(sprt, emergency);
                    ecFound = true;
                }
            }
        }

        //update vista / jds
        vistaVprDemographicsDao.update(dems);

        return "success";
    }

    private void setSupporterTelecom(PatientContact sprt, String phone) {
        Telecom telObj = findTelecomByPriorityFromObj(sprt);
        if ( telObj != null ) {
            telObj.setValue(phone);
        }
        else {
            if ( StringUtils.hasText(phone) ) {
                Telecom homeTelObj = createTelecom(PHONE_TYPE_HOME, phone);
                sprt.addToTelecom(homeTelObj);
            }
        }
    }

    private Telecom createTelecom(String type, String telNbr) {

        Telecom telecom = new Telecom();
        telecom.setValue(telNbr);
        telecom.setUse(type);
        return telecom;
    }

    public Map<String, String> getPatientIdentifiers(String pid) {
        Map<String, String> data = new HashMap();
        String system = userContext.getCurrentUser().getVistaId();
        PatientDemographics pt = getPatient(pid);
        String dfn = pt.getLocalPatientIdForSystem(system);
        if (dfn.length() < 1) return data;
        data.put("dfn",dfn);
        PatientDemographics dems = patientDao.findByPid(pid);
        if (dems.getIcn().length()>0) data.put("icn",dems.getIcn());
        data.put("fullName",dems.getFullName());
        data.put("familyName", dems.getFamilyName());
        data.put("givenName", dems.getGivenNames());
        return data;
    }
}
