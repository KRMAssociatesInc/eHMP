package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import gov.va.cpe.vpr.frameeng.FrameAction;
import gov.va.cpe.vpr.pom.AbstractPatientObject;
import gov.va.cpe.vpr.queryeng.ViewParam.DateRangeParam;
import gov.va.hmp.healthtime.HealthTimePrinterSet;
import gov.va.hmp.healthtime.PointInTime;
import org.apache.commons.lang.StringUtils;
import org.springframework.web.util.HtmlUtils;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * This class spans a series of Medication objects and represents a history of a patient with a drug in a setting.
 * 
 * Features:
 * - Basis for graphing
 * - Can compute a daily dose across multiple active-ish doses
 * - get get full dose or admin history
 * 
 * TODO: Working on saving this to JDS as the first "Derivative" object
 * 
 * @author brian
 */
public class DrugTherapy extends AbstractPatientObject implements FrameAction {
	public static final Comparator<DrugTherapy> AZ_SORTER = new ClassTherapySorter(false);
	public static final Comparator<DrugTherapy> CLASS_SORTER = new ClassTherapySorter(true);

	private static final long serialVersionUID = 1L;
    private static final int DAYS_OF_HIGH_IMPORTANCE_OUTPT = 60;
    private static final int DAYS_OF_MEDIUM_IMPORTANCE_OUTPT = 180;
    private static final int DAYS_OF_HIGH_IMPORTANCE_INPT = 1;
    private static final int DAYS_OF_MEDIUM_IMPORTANCE_INPT = 2;

    private String name;
	private SortedSet<Medication> meds = new TreeSet<Medication>(new MedicationSorter());
	private PointInTime therapyStart, therapyStop;
	private PointInTime lastFill, lastAdmin;
    private Map<MedStatus,AtomicInteger> statusCount = new HashMap<>();
	private MedType type;

	@JsonCreator
	public DrugTherapy(Map<String,Object> data) {
		super(data);
	}
	
	public DrugTherapy(Medication med) {
		super(null);
		this.name = med.getQualifiedName();
		this.type = MedType.typeOf(med);
		addMed(med);
	}
	
	public DrugTherapy(MedType type, String name) {
		super(null);
		this.name = name;
		this.type = type;
	}

	public String getName() {
		return name;
	}
	
	public MedType getType() {
		return this.type;
	}
	
	public String getGroupName() {
		return getType().getGroup();
	}

	/** return true if this represents a "current" medication as in CPRS */
	public boolean isRecent() {
		// CPRS default: active, pending, hold, suspend, recently expired, recently discontinued
		int activeCnt = getStatusCount(MedStatus.ACTIVE);
		int pendingCnt = getStatusCount(MedStatus.PENDING);
		int holdCnt = getStatusCount(MedStatus.HOLD);
		int suspendCnt = getStatusCount(MedStatus.SUSPEND);
		
		int recent = getPrimary().isInPatient() ? Medication.RECENT_DAYS_IN : Medication.RECENT_DAYS_OUT;
		
		if (activeCnt > 0 || pendingCnt > 0 || holdCnt > 0 || suspendCnt > 0) {
			return true;
		} else if (therapyStop.before(PointInTime.now()) && therapyStop.after(PointInTime.now().subtractDays(recent))) {
			return true;
		}
		
		return false;
	}
	
    public int getStatusCount(MedStatus status) {
    	if (statusCount.containsKey(status)) {
    		return statusCount.get(status).intValue();
    	}
    	return 0;
    }
    
    public PointInTime getTherapyStart() {
		return therapyStart;
	}
    
    public PointInTime getTherapyStop() {
		return therapyStop;
	}

	/**
	 * returns the most recent medication, unless there is an active med that is not the most recent
	 * @return
	 */
	protected Medication getPrimary() {
        return meds.first();
    }

    public boolean hasMeds() {
        return meds.size() > 0;
    }
    
    public SortedSet<Medication> getMeds() {
    	return meds;
    }

    public void addMed(Medication med) {
        meds.add(med);
        if (this.uid == null || this.pid == null) {
        	this.uid = getDrugTherapyUID(med);
        	this.pid = med.getPid();
        }

        MedStatus status = MedStatus.statusOf(med);
        if (!statusCount.containsKey(status)) {
        	statusCount.put(status, new AtomicInteger(0));
        }
        statusCount.get(status).incrementAndGet();

        // TODO: figure out what to do in this case.
        if (med.getOverallStart() == null || med.getOverallStop() == null) return;

        // keep track of therapy start/stop
        if (therapyStart == null || med.getOverallStart().before(therapyStart)) {
            therapyStart = med.getOverallStart();
        }
        if (therapyStop == null || med.getOverallStop().after(therapyStop)) {
            therapyStop = med.getOverallStop();
        }

        // keep track of most recent fill
        if (med.getLastFilled() != null && (lastFill == null || med.getLastFilled().after(lastFill))) {
            lastFill = med.getLastFilled();
        }

        if (med.getLastAdmin() != null && (lastAdmin == null || med.getLastAdmin().after(lastAdmin))) {
        	lastAdmin = med.getLastAdmin();
        }
    }

    // returns See Detail when dose (e.g 5 mg) not found or complex dose
    private String getDoseStr() {
    	int activeCnt = getStatusCount(MedStatus.ACTIVE);
    	int pendingCnt = getStatusCount(MedStatus.PENDING);
    	
		// if this therapy is active (x2), etc, show multiple doses
		if (activeCnt > 1 || pendingCnt > 1
			|| (activeCnt >= 1 && pendingCnt >= 1)) {
			return "Multiple Doses";
		}
		
		// otherwise return primary dose string
		Medication last = getPrimary();
		return last.getDoseString();
	}

    /* This is the 3rd line of the dose string, for inpatient only displays dose schedule or history */
    private String getDoseScheduleStr() {
    	Medication med = getPrimary();
    	if (!med.isInPatient()) return "";
    	
    	Object doseStr = null;
    	String label = null;
    	if (med.isPRN()) {
    		// PRNs should display sum of total admin dose (past 24h) from all orders in this therapy group
    		Float f = 0f;
    		label = "Past 24h";
    		
    		// sum up all the available daily admin values for each order in this group
    		PointInTime end = PointInTime.now();
    		PointInTime start = end.subtractDays(1);
    		for (Medication m : meds) {
    			Number n = m.calcDoseAdminBetween(start, end);
    			if (n != null) f += n.floatValue();
    		}

    		// if there were some admin values, convert to string w/ units 
    		if (f != 0f) doseStr = f.toString() + med.getUnits();
    	} else {
    		// non PRNs should display the dose schedule
    		label = "Scheduled Times";
    		List<MedicationDose> doses = med.getDosages();
    		if (!doses.isEmpty()) {
    			doseStr = doses.get(0).getAdminTimes();
    		}
    	}
    	if (doseStr == null) return ""; // if no dose str, quit
    	
    	return String.format("<div style='width: 300px; position: absolute;'><span class='text-muted'>%s</span> %s</div>", label, doseStr);
    }

    /** @return Returns the sum of all active meds daily doses */
    protected Number getDailyDose() {
        Medication last = getPrimary();
        Float dailySum = 0f;
        String units = last.getUnits();

        // sum the active meds in this therapy
        for (Medication m : meds) {
        	if (!m.isActive()) continue;
        	
        	// check that there is a daily dose for this med
            Number tmp = m.getDailyDose();
            if (tmp == null) return null;
            
            // check that its the same units (or same missing units)
            if (units != null && !units.equals(m.getUnits())) return null;
            
            // check that the scheduled frequency is more than 1x/day, unless there are multiple active/pending/etc
            Integer freq = m.getDosages().get(0).getScheduleFreq();
            int activeCnt = getStatusCount(MedStatus.ACTIVE);
            if (activeCnt == 1 && (freq == null || freq >= 1440)) return null;
            
            // valid daily dose, add it
            dailySum += tmp.floatValue();
        }
            
        // if the primary dose string is not the same as the total daily, return total daily as well
        if (dailySum != null && dailySum.floatValue() > 0) {
            // If its a round number, it still displays with a .0, so convert it to an integer first.
            if (dailySum.floatValue() % 1 == 0.0f) {
            	return dailySum.intValue();
            }
            return dailySum.floatValue();
        }
        
        return null;
    }

    /** @return Daily Dose calculation is typically "Total daily" unless one of the meds is PRN then its "Max daily" */
    protected String getDailyDosePrefix() {
    	for (Medication med : meds) {
    		if (med.isActive() && med.isPRN()) {
    			return "Max daily";
    		}
    	}
    	return "Total daily";
    }

	// returns [minDD,maxDD,minDose,maxDose]
	public Float[] calcDoseRange() {
		Float min = null, max = null, mindose = null, maxdose = null;
		for (Medication med : meds) {
			Number dose = med.getDoseVal();
			Number dd = med.getDailyDose();
			if (dd != null) {
				if (min == null || dd.floatValue() < min) min = dd.floatValue();
				if (max == null || dd.floatValue() > max) max = dd.floatValue();
			}
			if (dose != null) {
				if (mindose == null || dose.floatValue() < mindose) mindose = dose.floatValue();
				if (maxdose == null || dose.floatValue() > maxdose) maxdose = dose.floatValue();
			}

		}
		return new Float[] {min, max, mindose, maxdose};
	}
	
	public PointInTime getLastAdmin() {
		return this.lastAdmin;
	}
	
	public PointInTime getLastFill() {
		return this.lastFill;
	}
    
	/** Returns all admins for all Medications and sorts them together in reverse. Only used by details */
	@JsonIgnore
    public List<MedicationAdministration> getAllAdmins() {
    	List<MedicationAdministration> ret = new ArrayList<>();
    	for (Medication med : meds) {
    		ret.addAll(med.getAdministrations());
    	}
    	
    	// sort and return
    	Collections.sort(ret);
    	return ret;
    }

	/** Returns all fills for all Medications and sorts them together in reverse.  Only used by details */
	@JsonIgnore
    public List<MedicationFill> getAllFills() {
    	List<MedicationFill> ret = new ArrayList<>();
    	for (Medication med : meds) {
    		ret.addAll(med.getFills());
    	}
    	
    	// sort and return
    	Collections.sort(ret);
    	return ret;
    }


    private String getStatus(HealthTimePrinterSet dateTimePrinters) {
		Medication med = getPrimary();
		MedType medType = MedType.typeOf(med);
        String desc =  medType.getDesc();
        String type = medType.getType();
        MedStatus medStatus = MedStatus.statusOf(med);
        String status = formatStatus(medStatus);
        boolean inpt = med.isInPatient();

		String cssClass = "label-well";
		String msg = "<b style='float: left'>%s</b><span style='float:right;' class='label label-default' title='%s'>%s</span><br /><div style='float:right;'><span class='text-muted'>%s</span> <span class='label %s'>%s<span></div>";

        if (medStatus == MedStatus.PENDING) {
            return String.format(msg, status, desc, type, "", cssClass, "");  // no date displayed for pending  .. nothing else?
        } else if (medStatus == MedStatus.ACTIVE) {
        	cssClass = applyStyleBySaliency(med.getOverallStop(), cssClass, inpt);
        	if (med.isNonVA()) return String.format(msg, status, desc, type, "", "", "");  // for NON-VA do not display anything (by James Hellewell 3/26/2014)...
            return String.format(msg, status, desc, type, "Expires", cssClass, dateTimePrinters.date().print(med.getOverallStop(), Locale.getDefault()));
        } else if (medStatus == MedStatus.SUSPEND) {
            return String.format(msg, status, desc, type, "Ordered ", cssClass, dateTimePrinters.date().print(med.getOrders().get(0).getOrdered(), Locale.getDefault()));
        } else if (medStatus == MedStatus.HOLD) {
            return String.format(msg, status, desc, type, "Ordered ", cssClass, dateTimePrinters.date().print(med.getOrders().get(0).getOrdered(), Locale.getDefault()));
        } else if (medStatus == MedStatus.EXPIRED) {
			return String.format(msg, status, desc, type, "Expired", cssClass, dateTimePrinters.date().print(med.getOverallStop(), Locale.getDefault()));
		} else if (medStatus == MedStatus.DISCONTINUED) {
			return String.format(msg, status, desc, type, "Discontinued", cssClass, dateTimePrinters.date().print(med.getOverallStop(), Locale.getDefault()));
		} else if (medStatus == MedStatus.DISCONTINUEDEDIT) {
            return String.format(msg, status, desc, type, "", cssClass, "");
        } else if (medStatus == MedStatus.CANCELED) {
            return String.format(msg, status, desc, type, "", cssClass, "");
        } else {
            return String.format(msg, med.getVaStatus(), desc, type, "", cssClass, "");
        }
    }

    private String formatStatus(MedStatus status) {
    	int activeCnt = getStatusCount(MedStatus.ACTIVE);
        String str = status.displayName();
        if (status == MedStatus.PENDING) {
        	int pendingCnt = getStatusCount(MedStatus.PENDING);
            if (pendingCnt > 1) str += " (<b>x" + pendingCnt + "</b>)";         // print PENDING
            if (activeCnt > 0) str += " + " + formatStatus(MedStatus.ACTIVE);   // print PENDING + ACTIVE  or PENDING + ACTIVE (x2)
        } else if (status == MedStatus.ACTIVE) {
            if (activeCnt > 1) str += " (<b>x" + activeCnt + "</b>)";           // print ACTIVE  or ACTIVE (x2)
        } else if (status == MedStatus.SUSPEND) {
        	int suspendCnt = getStatusCount(MedStatus.SUSPEND);
            if (suspendCnt > 1) str += " (<b>x" + suspendCnt + "</b>)";         // print SUSPEND or SUSPEND (x2)
        } else if (status == MedStatus.HOLD) {
        	int holdCnt = getStatusCount(MedStatus.HOLD);
            if (holdCnt > 1) str += " (<b>x" + holdCnt + "</b>)";               // print HOLD or HOLD (x2)
        }
        return str;
    }

    private String applyStyleBySaliency(PointInTime actionDt, String defaultStyle, boolean inpt) {
        String cssClass = defaultStyle;
        if (inpt && actionDt != null && actionDt.subtractDays(DAYS_OF_HIGH_IMPORTANCE_INPT).before(PointInTime.today())) {
            cssClass = "label-danger";
        } else if (inpt && actionDt != null && actionDt.subtractDays(DAYS_OF_MEDIUM_IMPORTANCE_INPT).before(PointInTime.today())) {
            cssClass = "label-warning";
        } else if (actionDt != null && actionDt.subtractDays(DAYS_OF_HIGH_IMPORTANCE_OUTPT).before(PointInTime.today())) {
            cssClass = "label-danger";
        } else if (actionDt != null && actionDt.subtractDays(DAYS_OF_MEDIUM_IMPORTANCE_OUTPT).before(PointInTime.today())) {
            cssClass = "label-warning";
        }
        return cssClass;
    }

    private String getTagline(HealthTimePrinterSet dateTimePrinters) {
        Medication med = getPrimary();
		MedicationOrder order = med.getOrders().get(0);
		String lastFillStr = (getLastFill() == null) ? "Never" : dateTimePrinters.date().print(getLastFill(), Locale.getDefault());
		String lastAdminStr = (getLastAdmin() == null) ? "Never" : dateTimePrinters.dateTime().print(getLastAdmin(), Locale.getDefault());
		Integer fillsRemain = order.getFillsRemaining();
		//Integer fillsAllowed = order.getFillsAllowed();
		Integer fillDays = order.getDaysSupply();
		//Integer daysRemaing = med.getDaysSupplyRemaining();
		String cssClass = "x-hide-display";

        if (med.isOutPatient()) {
        	// change the color of the fill info depending on renewby date
        	PointInTime renewDt = med.getRenewBy();
        	if (med.isActive() && fillsRemain != null && fillDays != null) cssClass = applyStyleBySaliency(renewDt, "label-well", false);
            return String.format("<span class='text-muted'>Last Filled</span> <span>%s</span> <span class='label %s'>%s refills (%s days each)</span>", lastFillStr, cssClass, fillsRemain, fillDays);
        } else if (med.isInPatient()) {
        	
        	/* TODO: Next admin time is not ready for prime-time
        	// calculate and display the next admin time (if it exists)
        	// if PRN, display PRN, otherwise display N/A
        	PointInTime nextAdmin = med.calcNextScheduledAdminFrom(PointInTime.now());
        	String nextAdminStr = "N/A";
        	if (nextAdmin != null) {
        		nextAdminStr = formatDateTime(nextAdmin);
        	} else if (med.isPRN()) {
        		nextAdminStr = "PRN";
        	}
        	String line3 = String.format("<span class='text-muted'>Next Admin</span> %s", nextAdminStr);
        	*/
        	String line3 = "";
            return String.format("<span class='text-muted'>Last Admin</span> %s<br/>%s", lastAdminStr, line3);
            
        }
		return null;
	}

    /**
     * TODO: Trying to retire this method in favor of letting jackson do all the serialization.
     */
    @Deprecated
	public Map<String, Object> buildRow(Map<String, Object> params, HealthTimePrinterSet dateTimePrinters) {
		Medication primary = getPrimary();
		int svgHeight = 40, svgWidth = 200, histYearsMax=2;
		if (!StringUtils.isEmpty((String) params.get("svg_histYearsMax"))) {
			histYearsMax = Integer.parseInt(params.get("svg_histYearsMax").toString());
		}
		if (!StringUtils.isEmpty((String) params.get("svg_width"))) {
			svgWidth = Integer.parseInt(params.get("svg_width").toString());
		}

		String selfLink = "/vpr/view/gov.va.cpe.vpr.queryeng.MedHistViewDef?mode=/patientDomain/medicationhistory";
		String selfLinkFilters = "&filter_current=false&pid=%s&filter_qname=%s&filter_type=%s&filter_category=%s"; 
		Map<String, Object> ret = new HashMap<String, Object>();
		ret.put("name", name);
		ret.put("tagline", getTagline(dateTimePrinters));
		ret.put("groupName", getType().getGroup());
		ret.put("uid", primary.getUid());
		ret.put("lastFill", getLastFill());
		ret.put("lastAdmin", getLastAdmin());
        ret.put("status", getStatus(dateTimePrinters));
        ret.put("vaStatus", MedStatus.statusOf(primary).displayName());
        
        String doseStr = getDoseStr();
        ret.put("doseStr", doseStr);
        String doseStrTitle = (doseStr != null && doseStr.equalsIgnoreCase("See Detail")) ? primary.getSummary() : getDoseStr();
        ret.put("doseStrTitle", doseStrTitle);
        
        // Jackson doesn't serialize this to a number very well, turns 0.162 into 0.162000000000001234
        Number dose = getDailyDose();
        if (dose != null) ret.put("dailyDose", "" + dose);  
		ret.put("dailyDoseUnits", primary.getUnits());
		ret.put("dailyDosePrefix", getDailyDosePrefix());
		ret.put("doseScheduleStr", getDoseScheduleStr());
		if (primary.isInPatient()) {
			// end date defaults to now + 4h, unless specified as a parameter
			PointInTime to = PointInTime.now().addHours(4);
			if (!StringUtils.isEmpty((String) params.get("to"))) {
				to = DateRangeParam.parseDateStr((String) params.get("to"), to);
			}
			
			// start date defaults to 7 days prior to end date, unless specified as parameter
			PointInTime from = to.subtractDays(7);
			if (!StringUtils.isEmpty((String) params.get("from"))) {
				from = DateRangeParam.parseDateStr((String) params.get("from"), from);
			}
			if (therapyStart.after(from)) {
				from = therapyStart; // start date should not be before the DrugTherapy window
			}
			ret.put("svg", new InPtMedSVGBuilder(from, to, 55, svgWidth).drawTherapy(this, dateTimePrinters).toString());
		} else {
			
			OutPtMedSVGBuilder svg = new OutPtMedSVGBuilder(therapyStart, therapyStop, (histYearsMax*365), svgHeight, svgWidth).drawTherapy(this, dateTimePrinters);
			if (svg != null) ret.put("svg", svg.toString());
			
//			ret.put("svg", buildSVG(svgHeight, svgWidth, histYearsMax));
		}
		String name = HtmlUtils.htmlEscape(primary.getQualifiedName().replaceAll("%", "%25").replaceAll("'", "%27"));
		ret.put("selfLink", selfLink + String.format(selfLinkFilters, primary.getPid(), name, primary.getVaType(), getType().name()));
		return ret;
	}
	
	public static String getDrugTherapyUID(Medication med) {
        // get the default type/category classification
        MedType type = DrugTherapy.MedType.typeOf(med);
        String dispName = med.getQualifiedName();
        String[] parts = med.getUid().split(":");
        return String.format("urn:va:drugtherapy:%s:%s:%s:%s", parts[3], parts[4], type.getGroup(), dispName);
	}
	
    // DrugTherapy maintains meds as SortedTree which is sorted basically by Overall Start date.
    // for some reason (maybe test data only) two medications for the same drug have the same start date which will
    // prevent the 2nd med from being inserted into the tree.  So ... use uid for the safety.
    public static class MedicationSorter implements Comparator<Medication> {
        @Override
        public int compare(Medication med1, Medication med2) {
            int startDtResult = med2.getOverallStart().compareTo(med1.getOverallStart());
            return startDtResult == 0 ? med2.getUid().compareTo(med1.getUid()) : startDtResult;
        }
    }

    public static class AZTherapySorter implements Comparator<DrugTherapy> {
		@Override
		public int compare(DrugTherapy o1, DrugTherapy o2) {
			return o1.getName().compareTo(o2.getName());
		}
    }

    public static class ClassTherapySorter implements Comparator<DrugTherapy> {
    	
    	private boolean byStatus;

		public ClassTherapySorter(boolean byStatus) {
    		this.byStatus = byStatus;
		}
    	
        @Override
        public int compare(DrugTherapy o1, DrugTherapy o2) {
            Medication m1 = o1.getPrimary();
            Medication m2 = o2.getPrimary();
            int ret = 0;
            
            // 1st level grouping by type
            Integer typeOrder1 = o1.getType().getOrder();
            Integer typeOrder2 = o2.getType().getOrder();
            ret = typeOrder1.compareTo(typeOrder2);
            
            
            // 2nd level grouping by status (optional)
            if (ret == 0 && this.byStatus) {
	            Integer statusOrder1 = MedStatus.statusOf(m1).getOrder();
	            Integer statusOrder2 = MedStatus.statusOf(m2).getOrder();
                ret = statusOrder1.compareTo(statusOrder2);
            }

            // and then alphabetically
            if (ret == 0) {
            	ret = o1.getName().compareTo(o2.getName());
            }
            
            return ret;
        }
    }

    public enum MedType {
        OTO("OTO / In Pt", "One time order", "I", "Inpatient Meds", 1),
        PRN("PRN / In Pt", "As needed", "I", "Inpatient Meds", 1),
        InPT("In Pt", "Inpatient Medication", "I", "Inpatient Meds", 1),
        IV("IV", "Infusion Medication", "V", "Inpatient Meds", 1),
        
        IMO("IMO", "Inpatient Meds for Outpatients", "I", "Clinic Orders", 4),
        Supply("Supply", "Supply", "O", "Supplies", 4),
        OutPRN("PRN / Out Pt", "As needed", "O", "Outpatient Meds", 2),
        OutPT("Out Pt", "Outpatient Medication", "O", "Outpatient Meds",2),
        NonVA("Non-VA", "Non-VA Medication", "N", "Non-VA Meds", 3),
        Other("Not Defined", "Not found ...", "NA", "NA", 100);

        private String type;
        private String desc;
        private String vaType;
        private String group;
        private Integer order;

        private MedType(String type, String desc, String vaType, String group, int order) {
            this.type = type;
            this.desc = desc;
            this.vaType = vaType;
            this.group = group;
            this.order = order;
        }

        public String getType() {
            return type;
        }

        public String getDesc() {
            return desc;
        }

        public String getVaType() {
            return vaType;
        }

        public String getGroup() {
            return group;
        }

        public Integer getOrder() {
            return order;
        }

        public static MedType typeOf(Medication med) { // this will handler DISCONTINUED/EDIT
            if (med.getVaType() == null) {
                return MedType.Other;
            }
            else if (med.getVaType().equals("I")) {
            	if (med.isIMO())  { return MedType.IMO; }
                if (med.isOTO())  { return MedType.OTO; }
                if (med.isPRN())  { return MedType.PRN; }
                else { return MedType.InPT;}
            }
            else if (med.getVaType().equals("O")) {
            	if (med.isPRN()) { return MedType.OutPRN; }
                if (med.isSupply()) { return MedType.Supply; }
                else { return MedType.OutPT; }
            }
            else if (med.getVaType().equals("V")) { return MedType.IV; }
            else if (med.getVaType().equals("N")) { return MedType.NonVA; }
            else { return MedType.Other; }
        }
    }

    public enum MedStatus {
        PENDING(1), ACTIVE(2), SUSPEND("Active / Suspend", 3), HOLD("Active / Hold", 4),
        EXPIRED(5), DISCONTINUED("D/C", 6),
        CANCELED(98){
            @Override
            public boolean memberOfInterest() {
                return false;
            }
        },
        DISCONTINUEDEDIT("DISCONTINUED/EDIT", "D/C / Edit", 99) {
            @Override
            public boolean memberOfInterest() {
                return false;
            }
        },
        OTHER("OTHER", 100) {
            @Override
            public boolean memberOfInterest() {
                return false;
            }
        };

        private Integer order;
        private String vaName;
        private String displayName;

        private MedStatus(int order) {
            this.order = order;
            this.vaName = name();
            this.displayName = name();
        }

        private MedStatus(String displayName, int order) {
            this.order = order;
            this.vaName = name();
            this.displayName = displayName;
        }

        private MedStatus(String vaName, String displayName, int order) {
            this.order = order;
            this.vaName = vaName;
            this.displayName = displayName;
        }	 

        public Integer getOrder() {
            return this.order;
        }

        public String displayName() {
            return displayName;
        }

        // defines any meds in interested status which will be displayed
        // in graph and detail list
        public boolean memberOfInterest() {
            return true;
        }

        public static MedStatus statusOf(Medication m) {
            String name = m.getVaStatus();
            for (MedStatus ms : MedStatus.values()) {
                if (ms.vaName.equalsIgnoreCase(name)) {
                    return ms;
                }
            }
            return MedStatus.OTHER;
        }
    }
}