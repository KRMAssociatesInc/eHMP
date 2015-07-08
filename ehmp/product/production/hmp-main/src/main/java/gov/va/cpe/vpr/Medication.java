package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.*;

import gov.va.cpe.vpr.MedicationAdministration.MedicationAdministrationComment;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.IPatientObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.pom.POMIndex.MultiValueJDSIndex;
import gov.va.cpe.vpr.pom.POMIndex.RangeJDSIndex;
import gov.va.cpe.vpr.termeng.Concept;
import gov.va.cpe.vpr.termeng.TermEng;
import gov.va.cpe.vpr.termeng.TermLoadException;
import gov.va.cpe.vpr.termeng.jlv.JLVDrugsMap;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao;
import gov.va.cpe.vpr.termeng.jlv.JLVMappedCode;
import gov.va.cpe.vpr.termeng.jlv.JLVHddDao.MappingType;
import gov.va.hmp.healthtime.IntervalOfTime;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.util.NullChecker;
import org.apache.commons.lang.StringUtils;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

import org.joda.time.Period;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class Medication extends AbstractPatientObject implements IPatientObject, Comparable<Medication> {
    private static final long serialVersionUID = 1L;
    private static Logger log = LoggerFactory.getLogger(Medication.class);
    private static final String SYSTEM_DOD_NCID = "DOD_NCID";

    public static enum MedicationKind {
        I("Medication, Inpatient"),
        O("Medication, Outpatient"),
        N("Medication, Non-VA"),
        V("Medication, Infusion"),
        IMO("Medication, Clinic Order"),
        SUPPLY("Medication, Supply"),
        UNKNOWN("Medication");
        
        private String desc;
        private MedicationKind(String desc) {
            this.desc = desc;
        }
        
        @Override
        public String toString() {
            return this.desc;
        }
        
        public static MedicationKind kindOf(Medication med) {
            String vaType = med.getVaType();
            if (med.isSupply()) {
                return MedicationKind.SUPPLY;
            } else if (med.isIMO()) {
                return MedicationKind.IMO;
            } else if (vaType != null) {
                return MedicationKind.valueOf(vaType);
            }
            return MedicationKind.UNKNOWN;
        }
    }

    public static final String SEE_DETAIL = "See Detail";
    public static final String COMPLEX_DOSE = "Complex Dose";
    public static final int RECENT_DAYS_OUT = 120;
    public static final int RECENT_DAYS_IN = 30;
    
    /** if true, save DrugTherapy as a derivative object (experimental), defaults to false. */
    public static boolean ENABLE_SAVE_DERIVATIVES = false;

    // Source -------------------------

    /**
     * The ID of the facility where the medication was entered
     *
     * @see "HITSP/C154 16.17 Facility ID"
     */
    private String facilityCode;
    /**
     * The name of facility where the medication was entered
     *
     * @see "HITSP/C154 16.18 Facility Name"
     */
    private String facilityName;

    // Identifiers --------------------
    /**
     * For VistA -- localId is the identifier from the appropriate pharmacy
     * files R;O = Prescription file #52 P;O = Pending OP Orders file #52.41 N;O
     * = Non-VA meds subfile #55.04 P;I = Non-Verified Orders file #53.1 U;I =
     * Unit Dose orders subfile #55.06 V;I = IV orders subfile #55.01
     */
    private String localId;

    // Product and Instructions --------------
    /**
     * The NCI code for the physical form of the medication as presented to the
     * patient.
     *
     * @see "HITSP/C154 8.11 Product Form"
     *      <p/>
     *      For VistA the mapping to NCI doesn't exist, so this field is empty.
     *      Preferred would be the NCI code.
     */
    private String productFormCode;

    /**
     * Textual name for the product form
     *
     * @see "HITSP/C154 8.11 Product Form
     *      <p/>
     *      For VistA, this is the name field from file 50.606
     */
    private String productFormName;

    /**
     * The instructions for the medication order.
     *
     * @see "HITSP/C154 8.01 Free Text Sig"
     */
    private String sig;
    /**
     * Free Text instruction for the patient
     *
     * @see "HITSP/C154 8.22 Patient Instruction
     */
    private String patientInstruction;

    // Timing -------------------------
    /**
     * The initial order or start date/time of the medication
     */
    @RangeJDSIndex(endField="overallStop", name="med-time")
    private PointInTime overallStart;

    /**
     * The final stop date of the medication (whether dc'd or expired). This may
     * be a future date when the medications and all refills expire or when the
     * med should be stopped.
     *
     * @see "HITSP/C154 8.29 Order Expiration Date/Time"
     */
    private PointInTime overallStop;

    /**
     * The date the medication was stopped. Normally from a discontinue or from
     * a specific duration. Does not include expiration time.
     *
     * @see "HITSP/C154 8.02 Indicate Medication Stopped"
     */
    private PointInTime stopped;

    /**
     * The status of the medication.
     *
     * @see "HITSP/C154 8.20 Status of Medication"
     *      <p/>
     *      If the VistA status is active, suspended, non-verified, or refill:
     *      status is set to "Active" If the VistA status is hold or provider
     *      hold: status is set to "On Hold" All other values set the status to
     *      "No Longer Active"
     */
    private String medStatus;

    /**
     * The status name of the medication.
     *
     * @see "HITSP/C154 8.20 Status of Medication"
     *      <p/>
     *      If the VistA status is active, suspended, non-verified, or refill:
     *      status is set to "Active" If the VistA status is hold or provider
     *      hold: status is set to "On Hold" All other values set the status to
     *      "No Longer Active"
     */
    private String medStatusName;
    /**
     * The type of medication: OTC, Prescription, Clinic Dose, Clinic Infusion,
     * Unit Dose, Infusion.
     *
     * @see "HITSP/C154 8.19 Type of Medication"
     */
    private String medType;

    // VA Specific --------------------
    /**
     * The type of medication from VistA I:INPATIENT; O:OUTPATIENT; N:NON-VA;
     * V:IV FLUID
     */
    private String vaType;
    /**
     * The status of the medication from VistA
     */
    private String vaStatus;
    /**
     * VistA value to denote if an outpatient recieved an inpatient medication
     * while out an outpatient location
     */
    private Boolean imo;

    private Boolean supply;

    // Multi-valued -------------------
    /**
     * Medication product information -- the generic medication without specific
     * dose or strength information. For IV's, there may be multiple products.
     * For inpatient and outpatient, there is just one product.
     * <p/>
     * Also includes the specific product supplied -- this includes the
     * strength. For VistA, this references the dispensed drug.
     */
    @MultiValueJDSIndex(name="med-product", subfield="drugClassName")
    private List<MedicationProduct> products;

    /**
     * The dose(s) for a medication Using the List type preserves the sequence
     * of the doses (for complex orders).
     */
    private List<MedicationDose> dosages;

    /**
     * Orders that are fulfilled by this medication. In VistA normally a one to
     * one mapping. Set to a one to many mapping to handle orders coming from
     * multiple locations
     */
    private List<MedicationOrder> orders;

    /**
     * The indication for prescribing the medication Currently not used by VistA
     */
    private List<MedicationIndication> indications;

    /**
     * The date and other information for each fill of the medication
     */
    private List<MedicationFill> fills;
    private PointInTime lastFilled;

    /**
     * The qualified name contains just the active ingredient (generic name)
     * without strength information This allows searching for medications and
     * grouping them together without regard to dosage.
     */
    private String qualifiedName;

    private SortedSet<MedicationAdministration> administrations;

    protected Set<String> rxnCodes;
    private List<JdsCode> codes;

    @JsonIgnore
    private JLVHddDao oJLVHddDao = null;

    public Medication(){
		super(null);
	}

	@JsonCreator
	public Medication(Map<String, Object> vals) {
		super(vals);
	}

    public String getFacilityCode() {
        return facilityCode;
    }

    public String getFacilityName() {
        return facilityName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getLocalId() {
        return localId;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getProductFormCode() {
        return productFormCode;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getProductFormName() {
        return productFormName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getSig() {
        return sig;
    }

    /**
     * Solr alias for 'sig'.
     * @see #getSig()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getMedSig() {
        return getSig();
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getPatientInstruction() {
        return patientInstruction;
    }

    /**
     * Solr alias for 'patientInstruction'.
     * @see #getPatientInstruction()
     */
    @JsonView(JSONViews.SolrView.class)
    public String getMedPtInstruct() {
        return getPatientInstruction();
    }

    public PointInTime getOverallStart() {
    	if (overallStart == null) {
    		// TODO: this case should probably be moved into the extract
    		return getOrders().get(0).getOrdered();
    	}
        return overallStart;
    }

    public PointInTime getOverallStop() {
    	// TODO: this logic should probably be migrated into the extracts
    	if (overallStop == null && stopped != null) {
    		return stopped;
    	} else if (stopped != null && overallStop != null && stopped.before(overallStop)) {
    		// likley DC'ed before expiration date.
    		return stopped;
    	} else if (overallStop == null) {
    		// use order date as backup, likely a one time order with no dose start/stop
    		return getOrders().get(0).getOrdered();
    	}
        return overallStop;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public PointInTime getStopped() {
        return stopped;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getMedStatus() {
        return medStatus;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getMedStatusName() {
        return medStatusName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getMedType() {
        return medType;
    }

    public String getVaType() {
        return vaType;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public String getVaStatus() {
        return vaStatus;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    @JsonManagedReference("medication-product")
    public List<MedicationProduct> getProducts() {
    	if (products == null) products = new ArrayList<MedicationProduct>();
        return products;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getMedIngredientCode() {
        if (products == null || products.isEmpty()) return Collections.emptyList();
        List<String> items = new ArrayList<>(products.size());
        for (MedicationProduct product : products) {
            items.add(product.getIngredientCode());
        }
        return Collections.unmodifiableList(items);
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getMedIngredientCodeName() {
        if (products == null || products.isEmpty()) return Collections.emptyList();
        List<String> items = new ArrayList<>(products.size());
        for (MedicationProduct product : products) {
            items.add(product.getIngredientCodeName());
        }
        return Collections.unmodifiableList(items);
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getMedIngredientName() {
        if (products == null || products.isEmpty()) return Collections.emptyList();
        List<String> items = new ArrayList<>(products.size());
        for (MedicationProduct product : products) {
            items.add(product.getIngredientName());
        }
        return Collections.unmodifiableList(items);
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getMedIngredientRxnCode() {
        if (products == null || products.isEmpty()) return Collections.emptyList();
        List<String> items = new ArrayList<>(products.size());
        for (MedicationProduct product : products) {
            items.add(product.getIngredientRXNCode());
        }
        return Collections.unmodifiableList(items);
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getMedDrugClassCode() {
        if (products == null || products.isEmpty()) return Collections.emptyList();
        List<String> items = new ArrayList<>(products.size());
        for (MedicationProduct product : products) {
            items.add(product.getDrugClassCode());
        }
        return Collections.unmodifiableList(items);
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getMedDrugClassName() {
        if (products == null || products.isEmpty()) return Collections.emptyList();
        List<String> items = new ArrayList<>(products.size());
        for (MedicationProduct product : products) {
            items.add(product.getDrugClassName());
        }
        return Collections.unmodifiableList(items);
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getMedSuppliedCode() {
        if (products == null || products.isEmpty()) return Collections.emptyList();
        List<String> items = new ArrayList<>(products.size());
        for (MedicationProduct product : products) {
            items.add(product.getSuppliedCode());
        }
        return Collections.unmodifiableList(items);
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getMedSuppliedName() {
        if (products == null || products.isEmpty()) return Collections.emptyList();
        List<String> items = new ArrayList<>(products.size());
        for (MedicationProduct product : products) {
            items.add(product.getSuppliedName());
        }
        return Collections.unmodifiableList(items);
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    @JsonManagedReference("medication-dosage")
    public List<MedicationDose> getDosages() {
    	if (dosages == null) dosages = new ArrayList<MedicationDose>();
        return dosages;
    }

    @JsonManagedReference("medication-administration")
    public SortedSet<MedicationAdministration> getAdministrations() {
    	if (administrations == null) administrations = new TreeSet<MedicationAdministration>();
        return administrations;
    }

    public PointInTime getLastFilled() {
    	return lastFilled;
    }
    
    /** If inpatient med, then returns the last administration time (only given and infusing statuses count), null otherwise */
    public PointInTime getLastAdmin() {
		if (administrations != null && !administrations.isEmpty()) {
			for (MedicationAdministration admin : administrations) {
				if (admin.isGiven()) {
					return admin.getDateTime();
				}
			}
		}
		return null;
	}

	@JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    @JsonManagedReference("medication-order")
    public List<MedicationOrder> getOrders() {
        return orders;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getMedProvider() {
        if (orders == null || orders.isEmpty()) return Collections.emptyList();
        List<String> providerNames = new ArrayList<>(orders.size());
        for (MedicationOrder order : orders) {
            providerNames.add(order.getProviderName());
        }
        return Collections.unmodifiableList(providerNames);
    }

    /**
     * Flatting out the MedicationAdministration.MedicationAdministrationComment.text fields
     * for SOLR indexing.
     */
    @JsonView(JSONViews.SolrView.class)
    public List<String> getAdministrationComment() {
    	List<String> comments = new ArrayList<>();
    	for (MedicationAdministration admin : getAdministrations()) {
    		for (MedicationAdministrationComment comment : admin.getComments()) {
    			comments.add(comment.getText());
    		}
    	}
    	return Collections.unmodifiableList(comments);
    }

    /** Flattened list of MedicationAdministration.prnReason's for SOLR indexing */
    @JsonView(JSONViews.SolrView.class)
    public List<String> getPrnReason() {
    	List<String> reasons = new ArrayList<>();
    	for (MedicationAdministration admin : getAdministrations()) {
    		String prn = admin.getPrnReason();
    		if (prn != null) reasons.add(prn);
    	}
    	return reasons;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    @JsonManagedReference("medication-indication")
    public List<MedicationIndication> getIndications() {
        return indications;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getMedIndicationCode() {
        if (indications == null || indications.isEmpty()) return Collections.emptyList();
        List<String> codes = new ArrayList<>(indications.size());
        for (MedicationIndication indication : indications) {
            codes.add(indication.getCode());
        }
        return Collections.unmodifiableList(codes);
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getMedIndicationNarrative() {
        if (indications == null || indications.isEmpty()) return Collections.emptyList();
        List<String> narratives = new ArrayList<>(indications.size());
        for (MedicationIndication indication : indications) {
            narratives.add(indication.getNarrative());
        }
        return Collections.unmodifiableList(narratives);
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    public List<MedicationFill> getFills() {
    	if (fills == null) fills = new ArrayList<MedicationFill>();
        return fills;
    }

    public String getQualifiedName() {
        return qualifiedName;
    }

    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.EventView.class})
    @JsonProperty(value="IMO")
    public boolean isIMO() {
    	return (imo != null && imo);
    }

    public boolean isSupply() {
    	return (supply != null && supply == true);
    }

    @JsonIgnore
    public Set<String> getDrugClassCodes() {
    	Set<String> ret = new HashSet<String>();
    	for (MedicationProduct mp : getProducts()) {
    		String code = mp.getDrugClassCode();
    		if (code != null) {
    			ret.add(code);
    		}
    	}
    	return ret;
    }


    // domain logic methods ---------------------------------------------------


    /** @return Returns true if the start or stop date is inbetween the two dates */
    @JsonIgnore
    public boolean isBetween(PointInTime start, PointInTime end) {
    	if (start == null || end == null) return false;
    	PointInTime medStart = getOverallStart(), medStop = getOverallStop();
    	if (medStart == null || medStop == null) return false;

    	IntervalOfTime interval = new IntervalOfTime(start, end, true);
    	return interval.contains(medStart) || interval.contains(medStop);
    }

    /**
     * @return Returns a simple dose value, if a simple one can be computed (1 numerical dosage)
     */
    @JsonIgnore
    public Number getDoseVal() {
    	if (getDosages().size() == 1) {
    		return getDosages().get(0).getDoseVal();
    	}
    	return null;
    }


    /**
     * compute the total daily dose using schedule frequency (ie 20MG BID = 40MG/day)
     * throws null when complex dose, doseVal not found, and frequency not found
     */
    @JsonIgnore
    public Number getDailyDose() {
    	// can only calculate if there is exactly 1 dose
        if (getDosages().size() > 1) return null;
        if (getDosages().size() != 1 || getDosages().get(0) == null) return null;
        
        // get the dose
        MedicationDose dose = getDosages().get(0);
        Float dd = dose.calcDailyDose();
        if (dd == null || dd == 0d) {
            return null;  // unable to compute avg daily dose, return null
        }
        
        // return a rounded integer if possible
        if (Math.floor(dd) == Math.ceil(dd)) {
        	return new Integer(Math.round(dd));
        }

        return dd;
    }

    /**
     * @return The computed days supply remaining from today.  Returns NULL if not able to compute
     */
    @JsonView(JSONViews.WSView.class) // don't serialize to DB, but show in web-services
    public Integer getDaysSupplyRemaining() {
    	MedicationOrder order = getOrders().get(0);

    	// pre-requisite checks
    	if (!getVaType().equals("O") || !isActive() || getLastFilled() == null) return null;
    	if (order.getDaysSupply() == null || order.getFillsRemaining() == null) return null;

    	// compute days remaining
    	int daysSupply = order.getDaysSupply();
    	int fillsRemaining = order.getFillsRemaining();
        return  (daysSupply * fillsRemaining);
    }

    /** @return Calculates the total dose administered in between the specified times,
     * null for non-inpatient or complex doses.
     * Does not compute daily administrations for prior/previous orders. */
    @JsonIgnore
    public Number calcDoseAdminBetween(PointInTime start, PointInTime end) {
    	// cannot compute missing, complex or NULL doses
    	if (getDosages().isEmpty() || getDosages().size() > 1) return null;
    	Number doseVal = getDosages().get(0).getDoseVal();
    	if (doseVal == null) return null;

    	// sum up all the dose administrations after 24h ago
    	Float ret = 0f;
    	for (MedicationAdministration dose : getAdministrations()) {
    		if (!dose.getStatus().equals("GIVEN")) continue; // don't count doses not given
    		if (dose.getDateTime().before(start) || dose.getDateTime().after(end)) continue;
   			ret += doseVal.floatValue();
    	}

    	return (ret == 0f) ? null : ret; // return null if there was nothing to measure
    }

    /** tries to compute the next scheduled admin time, returns null if it can't figure it out
     * TODO: How to unit test this?
     **/
    @JsonIgnore
    public PointInTime calcNextScheduledAdminFrom(PointInTime now) {
    	if (getDosages().isEmpty() || getDosages().size() > 1) return null; // no complex doses

    	// fetch relevant data, return null if it doesnt all exist
    	MedicationDose dose = getDosages().get(0);
    	Object adminTimes = dose.getAdminTimes();
    	Integer schedFreq = dose.getScheduleFreq();
    	if (adminTimes == null) return null;

    	// TODO: ensure that the returned value is > lastDoseAdmin() + scheduleFreq (ex Q48H)
    	PointInTime pit = new PointInTime(now);
    	String hl7 = pit.toString().substring(0, 8);
    	String[] times = adminTimes.toString().split("\\-");
    	for (String time : times) {
    		if (time.length() == 2) time += "00"; // ensure hour is specified
    		if (time.equals("2400")) {
    			// goofy VA thing, 2400 not a valid time
    			time = "2359"; // TODO: need to discuss if this is the proper behavior
    		}
    		pit = new PointInTime(hl7 + time);
    		if (pit.after(now)) {
    			return pit;
    		}
    	}
    	return null;
    }


    /**
     * @return The computed date that the order must be renewed by w/o interrupting the supply.
     */
    @JsonView(JSONViews.WSView.class) // don't serialize to DB, but show in web-services
    public PointInTime getRenewBy() {
    	Integer daysRemaining = getDaysSupplyRemaining();
    	if (daysRemaining == null) return null;

    	// return renewby date
    	return PointInTime.today().addDays(daysRemaining);
    }

    /**
     * Returns the computed Medication Possession Ratio (MPR) for this order.
     *
     * TODO: Not implemented yet.
     */
    @JsonView(JSONViews.WSView.class) // don't serialize to DB, but show in web-services
    public Float getMPR() {
    	MedicationOrder order = getOrders().get(0);
    	if (isPRN() || !isActive()) return null; // skip PRN AND inactive meds
    	if (getFills() == null || getFills().isEmpty() || order.getDaysSupply() == null) return null; // skip if no fills/supply data

    	return null;
    }

    /**
     * @return Returns the computed Mean Gap (in days) between fills or NULL if unable to compute.
     */
    @JsonView(JSONViews.WSView.class) // don't serialize to DB, but show in web-services
    public Integer getMeanGap() {
    	MedicationOrder order = getOrders().get(0);
    	if (!isOutPatient() || isPRN()) return null; // va, outpt only, skip PRN
    	if (order.getDaysSupply() == null || getFills().isEmpty()) return null; // not enough data
    	if (getDosages().size() != 1) return null; // to complex for now

    	MedicationDose dose = getDosages().get(0);
    	PointInTime doseStart = dose.getStart();
    	PointInTime doseStop = dose.getStop();
    	if (doseStart == null) return null;
    	if (getStopped() != null && getStopped().before(doseStop)) {
    		doseStop = getStopped();
    	}

    	int gapDays = 0, gaps = 0;
    	PointInTime depletionDate = doseStart.addDays(order.getDaysSupply());
    	for (MedicationFill fill : getFills()) {
    		// skip fills that are not released
    		if (fill.getReleaseDate() == null || fill.getDaysSupplyDispensed() == null) continue;
    		gapDays += new Period(depletionDate.toLocalDate(), fill.getReleaseDate().toLocalDate()).getDays();
    		depletionDate = fill.getReleaseDate().addDays(fill.getDaysSupplyDispensed());
    		gaps++;
    	}

    	// check for a difference between last depletion date and today
    	if (depletionDate.before(PointInTime.today()) && getOverallStop().after(depletionDate)) {
    		gapDays += new Period(depletionDate.toLocalDate(), PointInTime.today().toLocalDate()).getDays();
    		gaps++;
    	}

    	return (gaps == 0) ? null : Math.abs(Math.round(gapDays/gaps));
    }

    /**
     * Private setter, mainly used by Jaxson to prevent it from trying to invoke getRXNCodes() when
     * setting this property.
     *
     * @param codes
     */
    @JsonSetter
    void setRXNCodes(Set<String> codes) {
    	this.rxnCodes = codes;
    }

    /**
     * Computes all of the relevant concepts for this medication derived from all of its products to
     * store/index in JDS.  This is generally only computed once when the medication is first created
     * since this property doesn't exist in the raw data and is therefor generated when serializing to
     * JDS.  Once serialized into JDS, the property should be loaded (via {@link #setRXNCodes()}) and that loaded
     * value will be used.
     *
     * {@link MedicationProduct} has a similar process.
     *
     * {@link JSONViews.EventView} Is specifically removed to avoid recomputing this for event purposes.
     *
     * TODO: We should normalize the URN's so I don't have to convert urn:vuid:xxx to urn:vandf:xxx
     * TODO: Ultimately, I think this should be external from the POM objects and be part of the interface.
     */
    @JsonView({JSONViews.JDBView.class, JSONViews.WSView.class, JSONViews.SolrView.class})
	public Set<String> getRXNCodes() {
        log.debug("Medication.getRXNCodes(): Entering method.");
        // if they were already computed/stored, return it
        if (this.rxnCodes != null) {
            log.debug("Medication.getRXNCodes(): RXNCodes were computed/stored previously - no work to do now.");
    		return this.rxnCodes;
    	}

    	// otherwise compute the values
        TermEng eng = getTermEngInstance();
        Set<String> ret = new LinkedHashSet<String>();
        for (MedicationProduct mp : getProducts()) {
            String vuid = mp.getIngredientCode();
            log.debug("Medication.getRXNCodes(): Finding RXNCodes for vuid: " + vuid);

    		if (vuid == null) {
    			continue;
    		}

    		// In this case, urn:vuid is the same as urn:vandf
    		String[] parts = vuid.split(":");
    		vuid = (parts.length >= 4) ? "urn:vandf:" + parts[3] : null;
    		if (vuid == null) {
    			continue;
    		}
    		Concept c = (eng != null) ? eng.getConcept(vuid) : null;
    		if (c != null) {
    			ret.add(c.toString());
                log.debug("Medication.getRXNCodes(): Finding mappings to concept for vuid: " + vuid);
                c = c.getMappingTo("ndfrt");
                if (c != null) {
                    ret.addAll(c.getAncestorSet());
                    for (String sAncestor : c.getAncestorSet()) {
                        log.debug("Medication.getRXNCodes(): Adding ancestor mapping for: " + sAncestor);
                    }
                    for (String same : c.getEquivalentSet()) {
                        if (same.startsWith("urn:ndfrt:") || same.startsWith("urn:rxnorm:")) {
                            log.debug("Medication.getRXNCodes(): Adding mapping for: " + same);
                            ret.add(same);
                        }
                    }
                }
    		}
    	}
    	this.rxnCodes = ret;
    	return ret;
    }
    
    /**
     * Returns a relevant dose string of all the relevant constituent parts that varies depending on type
     * and available data. 
     * 
     * If there is only >1 dose, then returns "Complex Dose", if not enough data is available, returns "See Detail"
     * 
     * @return
     */
    @JsonIgnore
    public String getDoseString() {
		if (getDosages().size() == 1) {
			// simple dose: return "10 MG PO BID"
			MedicationDose dose = getDosages().get(0);
			String doseStr = (dose.getDose() == null) ? dose.getIvRate() : dose.getDose();
			String unitStr = dose.getUnits();
			String routeStr = dose.getRouteName();
			String scheduleStr = dose.getScheduleName();
			
			// convert any null's to empty strings
			if (StringUtils.isEmpty(doseStr)) doseStr = dose.getInstructions();
			if (StringUtils.isEmpty(unitStr)) unitStr = "";
			if (StringUtils.isEmpty(routeStr)) routeStr = "";
			if (StringUtils.isEmpty(scheduleStr)) scheduleStr = "";
			
			// punt if we still dont have a dose (TODO: May need to look at duration and restriction values as well)
			if (StringUtils.isEmpty(doseStr)) return SEE_DETAIL; 
			
			return String.format("%s %s %s %s", doseStr, unitStr, routeStr, scheduleStr).trim();
		} else if (getDosages().size() == 0 && !getProducts().isEmpty()) {
			// Per Mel: 0 dosages are for old orders prior to outpt pharmacy
			// use the product strength
			return getProducts().get(0).getStrength();
		} else if (getDosages().size() > 1) {
			// complex orders return message
			return COMPLEX_DOSE;
		}

		// if IV med, merge the dose strings
		// TODO: is this still used?
		if (getVaType().equals("I")) {
			String solution = "";
			String additive = "";
			String addDose = "";
			String solDose = "";
	        for (MedicationProduct p : getProducts()) {
	        	String name = p.getIngredientCodeName();
	            if (p.getIngredientRole().equals("urn:sct:418804003")) {
	            	// ingredient is an Additive
                    if (additive.equals("")) additive = name;
                    else additive = additive + ',' + name;

                    if (p.getStrength() != null) {
                    	if (!addDose.equals("")) addDose += ", ";
                    	addDose += p.getStrength();
                    }
                } else {
                    if (solution.equals("")) solution = name;
                    else solution = solution + ',' + name;
                    if (p.getVolume() != null) {
                        if (!solDose.equals("")) solDose += ", ";
                        solDose += p.getVolume();
                    }
                }
	        }
			return addDose + " in " + solDose;
		}
		
		// Display "See Detail" for complex dose
        return SEE_DETAIL;
    }

	public String getUnits() {
		int size = getDosages().size();
		if (size == 0) {
			return null;
		} else if (size == 1) {
			return getDosages().get(0).getUnits();
		} else {
			// ensure all units are equivalent
			String ret = getDosages().get(0).getUnits();
			for (MedicationDose dose : getDosages()) {
				if (ret == null || !ret.equals(dose.getUnits())) {
					return null;
				}
			}
			return ret;
		}
	}

	@Override
    public String getSummary() {
        StringBuilder summary = new StringBuilder();
        summary.append(displayProducts());
        if (vaStatus != null) {
            summary.append(" (");
            summary.append(vaStatus);
            summary.append(")\n");
        } else {
            // summary.append(VprConstants.SCT_MED_STATUS_TO_TEXT.[medStatus]);
            if (medStatus != null) {
                summary.append("(");
                summary.append(CodeConstants.SCT_MED_STATUS_TO_TEXT.get(medStatus));
                summary.append(")\n");
            }
        }
        if (sig != null) {
        	if(summary.length()>0) {
                summary.append(" ");
        	}
            summary.append(sig);
        }
        if (CodeConstants.VA_MED_TYPE_INFUSION.equals(vaType) && dosages != null && !dosages.isEmpty()) {
            MedicationDose onlyDose = dosages.get(0);
            if (onlyDose.getIvRate() != null) {
                summary.append(onlyDose.getIvRate() + " ");
            }
            if (onlyDose.getDuration() != null) {
                summary.append(onlyDose.getDuration() + " ");
            }
            if (onlyDose.getScheduleName() != null) {
                summary.append(onlyDose.getScheduleName() + " ");
            }
            if (onlyDose.getRestriction() != null) {
                summary.append("for a total of " + onlyDose.getRestriction());
            }
        }
        return summary.toString();
    }

    @Override
    public String toString() {
    	return getSummary();
    }

    // Convenience --------------------

    @JsonIgnore
    public boolean isActive() {
    	String s = getVaStatus();
    	return (s != null && s.equals("ACTIVE"));
    }

    @JsonIgnore
    public boolean isPending() {
    	String s = getVaStatus();
    	return (s != null && s.equals("PENDING"));
    }

    @JsonIgnore
    public boolean isExpired() {
        String s = getVaStatus();
        return (s != null && s.equals("EXPIRED"));
    }

    /** Save way to check if status=DISCONTINUED. Includes DISCONTINUED/EDIT */
    @JsonIgnore
    public boolean isDiscontinued() {
        String s = getVaStatus();
        return (s != null && s.startsWith("DISCONTINUED"));
    }

    
    /**
     * Returns true if this is a PRN (as needed) order.
     * TODO: we should be able to improve the extracts to return this instead of inferring it.
     * @return
     */
    @JsonIgnore
    public boolean isPRN() {
    	// look for PRN in all dosages
    	for (MedicationDose dose : getDosages()) {
    		String sched = dose.getScheduleName();
    		String type = dose.getScheduleType();
    		if (type != null && type.equals("PRN")) {
    			return true;
    		} else if (sched != null && sched.contains("PRN")) {
    			return true; // TODO: old logic, maybe time to remove?
    		}
    	}

    	// as backup, look for AS NEEDED in the sig (TODO: old logic, is this still relevant?)
    	return (getSig() != null && getSig().toUpperCase().contains("AS NEEDED"));
    }

	/** return true if this represents a "current" medication as in CPRS */
    @JsonIgnore
	public boolean isRecent() {
		// CPRS default: active, pending, hold, suspend, recently expired, recently discontinued
		String status = getVaStatus();
		int recent = (isInPatient()) ? RECENT_DAYS_IN : RECENT_DAYS_OUT;
		if (status != null && (isActive() || isPending() || status.equals("HOLD") || status.equals("SUSPEND"))) {
			return true;
		} else if (status != null && (isExpired() || isDiscontinued()) &&
				(getOverallStop().before(PointInTime.now()) && getOverallStop().after(PointInTime.now().subtractDays(recent)))) {
			return true;
		}

		return false;
	}

    /**
     * @return true if this a one-time order
     */
    @JsonIgnore
    public boolean isOTO() {
    	// look for PRN in all dosages
    	for (MedicationDose dose : getDosages()) {
    		String type = dose.getScheduleType();
    		if (type != null && type.equals("ONE-TIME")) {
    			return true;
    		}
    	}
    	return false;
    }

    public MedicationProduct onlyProduct() {
        // return products?.first()
        if (products != null && products.size() > 0) {
            return products.get(0);
        }
        return null;
    }

    @JsonIgnore
    public boolean isOutPatient() {
    	return getVaType().equals("O");
    }

    @JsonIgnore
    public boolean isInPatient() {
    	return getVaType().equals("I") || getVaType().equals("V");
    }

    @JsonIgnore
    public boolean isNonVA() {
    	return getVaType().equals("N");
    }

    @JsonIgnore
    public boolean isInfusion() {
    	return getVaType().equals("V");
    }

    /** Drug kind (category), supply and IMO are special cases */
    public String getKind() {
    	return MedicationKind.kindOf(this).toString();
    }

    /**
     * Build a string of the supplied products or ingredients for display
     *
     * @return text of product(s)
     */
    public String displayProducts() {
        // ToDo: find a less VA-specific way to do this (need a less
        // idiosyncratic way to represent tapers, etc.)
        // TODO - fix this.
        StringBuilder x = new StringBuilder();
        if (medType != null && !medType.equals(CodeConstants.SCT_MED_TYPE_GENERAL)) {
            // products.collectAll { x += (x.length() ? ', ' : '') + it.suppliedName
            if (products != null) {
                for (MedicationProduct product : products) {
                    if (x.length() > 0) {
                        x.append(", ");
                    }
                    x.append(product.getSuppliedName());
                }
            }
        } else {
            // inpatient medications
            if (vaType != CodeConstants.VA_MED_TYPE_INFUSION) {
                // inpatient meds excluding infusions
                Set<String> names = new HashSet<String>();

                if (products != null) {
                    for (MedicationProduct product : products) {
                        names.add(product.getIngredientName());
                    }

                    for (String name : names) {
                        if (x.length() > 0) {
                            x.append(",");
                        }
                        x.append(name);
                    }
                }
//                if (x.length() > 0) {
//                    x.append(" ");
//                }
////                x.append(productFormName);
//	                products.each { names.add(it.ingredientName) }
//	                names.unique().each { x += (x.length() ? ', ' : '') + it}
//	                x += ' ' + productFormName
            } else {
                // infusions
                String a = "";
                String b = "";
                if (products != null) {
                    for (MedicationProduct product : products) {
                        if (product.getIngredientRole().equals(CodeConstants.SCT_MED_ROLE_BASE)) {
                            b += (b.length() > 0 ? ", " : "") + product.getSuppliedName();
                        } else {
                            a += (a.length() > 0 ? ", " : "") + product.getSuppliedName();
                        }
                    }
                    x.append(a);
                    x.append(" in ");
                    x.append(b);
                }
            }
        }
        //TODO - delete when checked
        // outpatient medications
        //products.collectAll { x += (x.length() ? ', ' : '') + it.suppliedName
        // }
        // } else {
        // // inpatient medications
        // if (vaType != VprConstants.VA_MED_TYPE_INFUSION) {
        // // inpatient meds excluding infusions
        // List names = []
        // products.each { names.add(it.ingredientName) }
        // names.unique().each { x += (x.length() ? ', ' : '') + it}
        // x += ' ' + productFormName
        // } else {
        // // infusions
        // String a = ''
        // String b = ''
        // products.each {
        // if (it.ingredientRole == VprConstants.SCT_MED_ROLE_BASE) {
        // b += (b.length() ? ', ' : '') + it.suppliedName
        // } else {
        // a += (a.length() ? ', ' : '') + it.suppliedName
        // }
        // }
        // x += a + ' in ' + b
        // }
        // }
        // return x
        if (x.length() == 0) x.append(getQualifiedName());
        return x.toString();
    }

	@Override
	public int compareTo(Medication m) {
		return this.getOverallStart().compareTo(m.getOverallStart());
	}

    @Override
    public void save(IGenericPOMObjectDAO dao) {
        if (!ENABLE_SAVE_DERIVATIVES) return; // quit if not enabled
        
        String uid = DrugTherapy.getDrugTherapyUID(this);
        DrugTherapy dt = dao.findByUID(DrugTherapy.class, uid);
        if (dt == null) {
            dt = new DrugTherapy(this);
        } else {
            dt.addMed(this);
        }
        
        dao.save(dt);
    }
	
    public void setCodes(List<JdsCode> codes) {
        this.codes = codes;
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getCodesCode() {
        return JdsCode.getCodesCodeList(getCodes());
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getCodesSystem() {
        return JdsCode.getCodesSystemList(getCodes());
    }

    @JsonView(JSONViews.SolrView.class)
    public List<String> getCodesDisplay() {
        return JdsCode.getCodesDisplayList(getCodes());
    }

    @JsonView(JSONViews.JDBView.class)
    public List<JdsCode> getCodes() {
    	log.debug("Medication.getCodes(): Entering method.");

    	// Check to see if this already contains the RxNorm code.  If it does not, then see if we use the
    	// terminology database to retrieve and add it.
    	//-----------------------------------------------------------------------------------------------------
    	if (!containsRxnormCode()) {
        	log.debug("Medication.getCodes(): Codes does not already contain an RxNORM Code - Trying to find one now.");
    		JdsCode oRxNormCode;

			try {
				oRxNormCode = retrieveRxNormCode();
	    		if (oRxNormCode != null) {
	    			if (this.codes == null) {
	    				this.codes = new ArrayList<JdsCode>();
	    			}
	    			this.codes.add(oRxNormCode);
	    		}
			}
			catch (TermLoadException e) {
				// We do not want this kind of an error to stop processing on the result...  Just log the message.
				//------------------------------------------------------------------------------------------------
				log.error("Medication.getCodes(): Failed to lookup RxNORM code for this result.  Error: " + e.getMessage(), e);
			}
    	}

    	log.debug("Medication.getCodes(): Leaving method.");

        return this.codes;
    }

	/**
     * This checks the codes attribute to see if it contains a RxNORM code.  If it does, then TRUE is returned.
     * Otherwise false is returned.
     *
     * @return TRUE if the codes property contains a RxNORM code.
     */
    private boolean containsRxnormCode() {
    	boolean bReturnResult = false;

    	if (NullChecker.isNotNullish(this.codes)) {
    		for (JdsCode oCode : this.codes) {
    			if ((NullChecker.isNotNullish(oCode.getSystem())) &&
    				(oCode.getSystem().equals(JLVDrugsMap.CODE_SYSTEM_RXNORM))) {
    				bReturnResult = true;
    				break;
    			}
    		}
    	}

		return bReturnResult;
	}

    /**
     * This method will retrieve the RxNorm code for this result.  If this is a VA result, it will do the translation
     * using the VUID Code.  If this is a DoD result, it will use the DoD NCID for the conversion.
     *
     * @return The RxNORM code for this result.
     * @throws TermLoadException
     */
    private JdsCode retrieveRxNormCode() throws TermLoadException {
    	JdsCode oRxNormCode = null;

    	// First check to see if we can find this in the VA Terminology Database
    	//-----------------------------------------------------------------------
    	oRxNormCode = getRxNormForProductSuppliedCodeFromVATerminologyDatabase();
    	if (oRxNormCode == null) {
        	log.debug("Medication.retrieveRxNormCode(): Searching JLV terminology tables for RxNorm Code: ");

	    	setupJLVHddDao();

	    	if (isVAResult()) {
	    		String sVuid = getMedicationVuidCode();
	        	log.debug("Medication.retrieveRxNormCode(): Retrieving RxNORM code information for vuid: " + sVuid);
	    		JLVMappedCode oMappedCode = oJLVHddDao.getMappedCode(MappingType.MedicationVuidToRxNorm, sVuid);
	    		oRxNormCode = convertMappedToJdsCode(oMappedCode);
	    		if ((oRxNormCode != null) &&
	    			(NullChecker.isNotNullish(oRxNormCode.getCode()))) {
	    			log.debug("Medication.retrieveRxNormCode(): Found RxNORM code information for vuid: " + sVuid);
	    		}
	    		else {
	    			log.debug("Medication.retrieveRxNormCode(): NO RxNORM code mapping found for vuid: " + sVuid);
	    		}
	    	}
	    	else if (isDoDResult()) {
	    		String sDodMedcinId = getMedicationDodNcid();
	        	log.debug("Medication.retrieveRxNormCode(): Retrieving RxNORM code for DOD NCID: " + sDodMedcinId);
	    		JLVMappedCode oMappedCode = oJLVHddDao.getMappedCode(MappingType.MedicationDodNcidToRxNorm, sDodMedcinId);
	    		oRxNormCode = convertMappedToJdsCode(oMappedCode);
	    		if ((oRxNormCode != null) &&
	    			(NullChecker.isNotNullish(oRxNormCode.getCode()))) {
	    			log.debug("Medication.retrieveRxNormCode(): Found RxNORM code for DOD NCID: " + sDodMedcinId + " - RxNORM code: " + oRxNormCode.getCode());
	    		}
	    		else {
	    			log.debug("Medication.retrieveRxNormCode(): NO RxNORM code mapping found for DOD NCID: " + sDodMedcinId);
	    		}
	    	}
    	}

		return oRxNormCode;
	}

    /**
     * This method checks to see if it can retrieve the RXNORM code from the VA terminology database.
     *
     * @return The RXNormCode from the VA Terminology database if it exists.  Null if it does not.
     */
	private JdsCode getRxNormForProductSuppliedCodeFromVATerminologyDatabase() {
		JdsCode oRxnormCodeInfo = null;

		String sVuid = "";
		for (MedicationProduct oProduct : getProducts()) {
			if ((oProduct != null) &&
				(NullChecker.isNotNullish(oProduct.getSuppliedCode()))) {
				sVuid = stripVuidFromUrn(oProduct.getSuppliedCode());
				break;
			}
		}

		if (sVuid != null) {
	    	TermEng oTermEng = getTermEngInstance();

	    	Concept oSuppliedCodeConcept = (oTermEng != null) ? oTermEng.getConcept("urn:vandf:" + sVuid) : null;
    		if (oSuppliedCodeConcept != null) {
            	log.debug("Medication.getRxNormForProductSuppliedCodeFromVATerminologyDatabase(): Finding RxNorm in VA H2 Termninology database for: " + "urn:vandf:" + sVuid);
            	String sRxnormCode = extractEquivalentRxnormCode(oSuppliedCodeConcept);

            	Concept oRxnormCodeConcept = (oTermEng != null) ? oTermEng.getConcept("urn:rxnorm:" + sRxnormCode) : null;
            	if (oRxnormCodeConcept != null) {
            		oRxnormCodeInfo = new JdsCode();
            		oRxnormCodeInfo.setCode(sRxnormCode);
            		oRxnormCodeInfo.setDisplay(oRxnormCodeConcept.getDescription());
					oRxnormCodeInfo.setSystem(JLVDrugsMap.CODE_SYSTEM_RXNORM);

					log.debug("Medication.getRxNormForProductSuppliedCodeFromVATerminologyDatabase(): Found RxNorm in VA H2 Termninology database for: " + "urn:vandf:" + sVuid +
              			  " RxNormCode: " + sRxnormCode + " RxNormText:'" + oRxnormCodeInfo.getDisplay() + "'");
            	}
    		}
		}

		return oRxnormCodeInfo;
	}

	/**
	 * This method extracts the Rxnorm code from the equivalent set of the given concept.
	 *
	 * @param oConcept The concept to be inspected.
	 * @return The Rxnorm code from the equivalent set if it exists.
	 */
	private String extractEquivalentRxnormCode(Concept oConcept) {
		String sRxnormCode = "";

		if ((oConcept != null) &&
			(NullChecker.isNotNullish(oConcept.getEquivalentSet()))) {
			for (String sEquivCode : oConcept.getEquivalentSet()) {
				if ((NullChecker.isNotNullish(sEquivCode)) &&
					sEquivCode.startsWith("urn:rxnorm:")) {
					sRxnormCode = sEquivCode.substring("urn:rxnorm:".length());
					break;
				}
			}
		}

		return sRxnormCode;
	}

	/**
	 * This method creates an instance of the TermEng object.
	 *
	 * @return The instance of the TermEng object.
	 */
	protected TermEng getTermEngInstance() {
		return TermEng.getInstance();
	}

	/**
     * This method retrieves a handle to the HDDDao object.
     *
     * @return The handle to the HDDDao object.
     * @throws TermLoadException Exception thrown if the handle could not be created.
     */
	private void setupJLVHddDao() throws TermLoadException {
		if (this.oJLVHddDao == null) {
			this.oJLVHddDao = JLVHddDao.createInstance();
		}
	}

	/**
	 * This method is put here so that we can pass in a mock HDD dao to be used.  If we try to do this
	 * using the normal Mockito override mechanism - it breaks because Jackson cannot deal with the class in that
	 * way.
	 *
	 * @param oJLVHddDao The handle to the JLVHddDao to be used.
	 */
	protected void setJLVHddDao(JLVHddDao oJLVHddDao) {
		this.oJLVHddDao = oJLVHddDao;
	}

	/**
     * This method returns true if this is a VA result.  Right now it is doing this by checking to see if
     * the UID contains the word DOD.  If it does not - then it is assumed to be VA.   This had to be done this
     * way because the UID currently for VA and DoD is being constructed with urn:va:...   Once that is fixed, then
     * this will need to be changed to look at the UID to see if it is urn:va or urn:dod...
     *
     * @return TRUE if this is a VA result.
     */
	private boolean isVAResult() {
		return (! isDoDResult());
	}

	/**
     * This method returns true if this is a DoD result.  Right now it is doing this by checking to see if
     * the UID contains the word DOD.  If it does - then it is assumed to be DOD.   This had to be done this
     * way because the UID currently for VA and DoD is being constructed with urn:va:...   Once that is fixed, then
     * this will need to be changed to look at the UID to see if it is urn:va or urn:dod...
     *
     * @return TRUE if this is a VA result.
     */
    private boolean isDoDResult() {
		boolean bReturnResult = false;

		if ((NullChecker.isNotNullish(this.uid)) &&
			(this.uid.contains(":DOD:"))) {
			bReturnResult = true;
		}

		return bReturnResult;
	}

	/**
	 * This returns the ICD9 Code for this result if it exists.  If it does not, then "" is returned.
	 *
	 * @return The ICD9 Code for the result if it exists.  If it does not, then "" is returned.
	 */
	private String getMedicationVuidCode() {
		String sVuid = "";

		if (NullChecker.isNotNullish(this.products)) {
			for (MedicationProduct oProduct : this.products) {
				if ((oProduct != null) &&
					(NullChecker.isNotNullish(oProduct.getSuppliedCode()))) {
					sVuid = stripVuidFromUrn(oProduct.getSuppliedCode());
					break;
				}
			}
		}

		return sVuid;
	}

	/**
	 * This routine strips off the prefix on the Vuid if it exists.
	 *
	 * @param sVuid The Vuid URN.
	 * @return The VUID without the URN prefix
	 */
	private String stripVuidFromUrn(String sVuid) {
		String sReturnValue = sVuid;

		if ((NullChecker.isNotNullish(sVuid)) &&
			(sVuid.startsWith("urn:va:vuid:"))) {
			sReturnValue = sVuid.substring("urn:va:vuid:".length());
		}

		return sReturnValue;
	}

	/**
     * This method takes the contents from the JLVMappedCode and places it in the JdsCode object.
     *
     * @param oMappedCode The JLVMappedCode object
     * @return The JdsCode object.
     */
    private JdsCode convertMappedToJdsCode(JLVMappedCode oMappedCode) {
    	JdsCode oJdsCode = null;

    	if (oMappedCode != null) {
    		oJdsCode = new JdsCode();
    		oJdsCode.setSystem(oMappedCode.getCodeSystem());
    		oJdsCode.setCode(oMappedCode.getCode());
    		oJdsCode.setDisplay(oMappedCode.getDisplayText());
    	}

    	return oJdsCode;
	}

	/**
     * If this is a DoD result, then this method returns the DOD MEDCIN ID for the result.  Otherwise it returns "".
     *
     * @return The DOD MEDCIN ID for the result
     */
    private String getMedicationDodNcid() {
    	String sDodNcid = "";
    	log.debug("Medication.getMedicationDodNcid(): Entering method.");

    	if (NullChecker.isNotNullish(this.codes)) {
    		for (JdsCode oCode : this.codes) {
    			if ((SYSTEM_DOD_NCID.equalsIgnoreCase(oCode.getSystem())) &&
    				(NullChecker.isNotNullish(oCode.getCode()))) {
    				sDodNcid = oCode.getCode();
    				break;
    			}
    		}
    	}

    	return sDodNcid;
	}
}
