package us.vistacore.vxsync.term.hmp;

import java.util.*;

import us.vistacore.vxsync.term.load.hmp.UMLSRRFDataSource;

public class UMLSBuildPolicy {
	private static Map<String,UMLSBuildPolicy> POLICIES = new HashMap<>();
	private static UMLSBuildPolicy DEFAULT = new UMLSBuildPolicy();
	
	static {
		// register the individual handlers
		addPolicy("msh", new MESHBuildPolicy());
		addPolicy("ndfrt", new NDFRTBuildPolicy());
		addPolicy("vandf", new VANDFBuildPolicy());
		addPolicy("lnc", new LOINCBuildPolicy());
		addPolicy("rxnorm", new RxNORMBuildPolicy());
		addPolicy("snomedct", new SNOMEDBuildPolicy());
		addPolicy("icd9cm", new ICDBuildPolicy());
		addPolicy("icd10cm", new ICDBuildPolicy());
		addPolicy("icd10pcs", new ICDBuildPolicy());
	}
	
	protected RowMatcher relsMatcher = RowMatcher.MATCH_ALL;
	protected RowMatcher parentMatcher = new PrefixMatcher("RELSTR", "PAR|");
	protected RowMatcher synMatcher = new PrefixMatcher("RELSTR", "SY|");
	protected RowMatcher indexMatcher = RowMatcher.MATCH_ALL;
	
	// Default MRREL.RRF matching: only un-suppressed, resolvable URN's, excluding the NOCODE problem.
	protected RowMatcher relParseMatcher = new RowMatcher() {
		/* by default, only parse rows that are resolved into URNs and are not marked suppressed */
		@Override
		public boolean matches(Map<String, String> row) {
			String urn1 = row.get("URN1");
			String urn2 = row.get("URN2");
			
			// if URN's can't be resolved, exclude them (non-interesting terminologies)
			if (urn1 == null || urn2 == null) return false;
			
			// these NOCODE's cause >10K synonyms if matched
			if (urn1.equals("urn:mthspl:NOCODE") || urn2.equals("urn:mthspl:NOCODE")) return false;

			// apply filters
			if (row.get("SUPPRESS").startsWith("Y")) return false; // skip suppressed rels
			
			return true;
		}
	};

	// static instance management methods -------------------------------------
	public static UMLSBuildPolicy getPolicy(String sab) {
		UMLSBuildPolicy ret = POLICIES.get(sab);
		if (ret == null) {
			ret = DEFAULT;
		}
		return ret;
	}
	
	public static void addPolicy(String sab, UMLSBuildPolicy policy) {
		POLICIES.put(sab.toUpperCase(), policy);
		POLICIES.put(sab.toLowerCase(), policy);
	}
	
	// default implementation/policy ------------------------------------------
	
	public RowMatcher getParentMatcher() {
		return parentMatcher;
	}
	
	public RowMatcher getSynonymMatcher() {
		return synMatcher;
	}
	
	public Map<String,Set<String>> buildRelsMap(UMLSRRFDataSource src, String urn) {
		return src.fetchRelationMap(urn, relsMatcher);
	}
	
	/** returns true if this relationship (from MRREL.RRF) should be considered */
	public boolean parseRel(Map<String,String> rec) {
		return this.relParseMatcher.matches(rec);
	}
	
	public boolean indexTerm(Map<String,String> rec) {
		return this.indexMatcher.matches(rec);
	}
	
	// source specific policies -----------------------------------------------
	public static class ICDBuildPolicy extends UMLSBuildPolicy {
		public ICDBuildPolicy() {
			// exclude the root concept from all the ancestor computations
			this.parentMatcher = new AndMatcher(this.parentMatcher,
					new ExcludeMatcher("URN2", "urn:src:V-ICD9CM","urn:icd10cm:ICD-10-CM","urn:src:V-ICD10PCS"));
		}
	}
	
	public static class LOINCBuildPolicy extends UMLSBuildPolicy {
		public LOINCBuildPolicy() {
			
			/*
			 * MRREL.RRF:
			 * - there are 44 relationships (22 bi-directional)
			 * - need to exclude the RO|has_* + SY|has_ otherwise we can get nearly 70k rels
			 * - exclude the generic LOINCCLASSTYPES, LOINCPART and LOINCROOT concepts from parent/ancestor sets
			 * - Exclude other child relationships: RO|analyzes, RO|measures
			 */
			this.relParseMatcher = new AndMatcher(this.relParseMatcher,
				new PrefixExcluder("RELSTR", "CHD|", "RO|has_", "SY|has_", "RO|analyzes", "RO|measures") 
			);

			
			this.parentMatcher = new AndMatcher(this.parentMatcher,
					new ExcludeMatcher("URN2", "urn:lnc:MTHU000998", // LOINCCLASSTYPES 
							"urn:lnc:MTHU000999", // LOINCPART
							"urn:src:V-LNC")); // LOINC ROOT
		}
	}
	
	public static class SNOMEDBuildPolicy extends UMLSBuildPolicy {
		public SNOMEDBuildPolicy() {
			/*
			 * MRREL.RRF Policy:
			 * - Remove the root snomed node from all ancestors
			 * - remove the child relationships (40+), most are RO|has_*
			 * - additional large cardinality child relations: RO|moved_to, RO|interprets, RN|part_of
			 */
			this.relParseMatcher = new AndMatcher(this.relParseMatcher,
					new PrefixExcluder("RELSTR", "CHD|isa", "RO|has_","RO|moved_to", "RO|interprets","RN|part_of","RN|was_a","RO|uses_device"));
			
			this.parentMatcher = new AndMatcher(this.parentMatcher,
					new ExcludeMatcher("URN2", "urn:sct:138875005")); // ROOT SNOMED
		}
	}

	
	public static class RxNORMBuildPolicy extends UMLSBuildPolicy {
		public RxNORMBuildPolicy() {
			
			/* MRREL.RRF Policy:
			 * - removing high-cardinality RN relationships
			 * - child relationships
			 */
			this.relParseMatcher = new AndMatcher(this.relParseMatcher,
					new ExcludeMatcher("RELSTR", "RO|has_dose_form", "RN|isa",
							"RO|has_doseformgroup", "RO|has_part",
							"RN|has_precise_ingredient",
							"RO|has_precise_ingredient", "RO|has_ingredient",
							"RN|tradename_of"));
		}
	}
	
	public static class MESHBuildPolicy extends UMLSBuildPolicy {
		public MESHBuildPolicy() {
			/* MRREL.RRF Policy:
			 * - exclude root ancestors (V-MSH and urn:msh:U000017)
			 * - two parent relationships (PAR| and RB|inverse_isa)
			 * - Exclude high cardinality child relations: QB| CHD| RN|isa RO|has_mapping_qualifer, RN|mapped_to
			 * - TODO: All the synonymns seem to be self-referential, probably could exclude SY|*
			 */
			this.parentMatcher = new AndMatcher(
					new PrefixMatcher("RELSTR", "PAR|","RB|inverse_isa"),
					new ExcludeMatcher("URN2", "urn:src:V-MSH",
							"urn:msh:U000017,")); // MeSH Descriptors
			
			// only index these TTY's
			this.indexMatcher = new ExactFieldMatcher("tty", "MH", "EP", "EN");
			
			this.relParseMatcher = new AndMatcher(this.relParseMatcher,
					new ExcludeMatcher("RELSTR", "QB|", "CHD|", "RN|isa",
							"RO|has_mapping_qualifier", "RN|mapped_to")
			);
		}
	}
	
	public static class NDFRTBuildPolicy extends UMLSBuildPolicy {
		public NDFRTBuildPolicy() {
			/*
			 * MRREL.RRF Policy:
			 * - Exclude the child disease contraindications
			 * - recursivley resolve may_treat relationships
			 * - Exclude generic "P [Preperations]" and NOCODE root concepts
			 */
			this.relParseMatcher = new AndMatcher(this.relParseMatcher,
					new PrefixMatcher("RELSTR", "PAR|", "RO|may_be_treated_by",
							"RO|has_contraindicating_class",
							"RO|has_contraindicated_drug",
							"RO|disease_with_contraindication"));
			
			this.parentMatcher = new AndMatcher(this.parentMatcher,
					new ExcludeMatcher("URN2", "urn:ndfrt:N0000010598", // P [Preperations]
							"urn:ndfrt:NOCODE")); 
		}
		
//		@Override
//		public Map<String, Set<String>> buildRelsMap(UMLSRRFDataSource src, String urn) {
//			Map<String,Set<String>> ret = super.buildRelsMap(src, urn);
//			Map<String,Set<String>> addl = new HashMap<>();
//			
//			// add recursive may_treat relationships
//			for (String key : ret.keySet()) {
//				if (ret.get(key).contains("RO|may_be_treated_by")) {
//					for (String key2 : src.fetchRelationMap(key, getParentMatcher(), new HashSet<String>()).keySet()) {
//						addl.put(key2, new HashSet<String>(Arrays.asList("RO|may_be_treated_by")));
//					}
//				}
//			}
//			ret.putAll(addl);
//			return ret;
//		}
	}
	
	public static class VANDFBuildPolicy extends UMLSBuildPolicy {
		public VANDFBuildPolicy() {
			// 2 ways to represent parents in VANDF
			this.parentMatcher = new PrefixMatcher("RELSTR", "PAR|", "RB|inverse_isa");
			
			/*
			 * MRREL.RRF Policy:
			 * 
			 * in addition to the main parser, exclude high cardinality rows:
			 * RN|ISA (child relationships), RO|has_ingredient
			 * 
			 * also only include VANDF and RXNORM asserted relationships
			 */
			this.relParseMatcher = new AndMatcher(this.relParseMatcher,
					new ExcludeMatcher("RELSTR", "RO|has_ingredient","RN|isa"), 
					new ExactFieldMatcher("SAB", "VANDF", "RXNORM"));
		}
	}
	
	// Matcher implementations ------------------------------------------------
	
	public interface RowMatcher {
		public static final RowMatcher MATCH_ALL = new RowMatcher() {
			@Override
			public boolean matches(Map<String, String> row) {
				return true;
			}
		};
		
		public static final RowMatcher MATCH_NONE = new RowMatcher() {
			@Override
			public boolean matches(Map<String, String> row) {
				return false;
			}
		};


		public boolean matches(Map<String, String> row);
	}
	
	public static class ExactFieldMatcher implements RowMatcher {
		private Set<String> strs;
		private String field;

		public ExactFieldMatcher(String field, String... strs) {
			this.field = field;
			this.strs = new HashSet<>(Arrays.asList(strs));
		}
		
		@Override
		public boolean matches(Map<String, String> row) {
			return this.strs.contains(row.get(this.field));
		}
	}
	
	public static class PrefixMatcher implements RowMatcher {
		private String[] rels;
		private String field;

		public PrefixMatcher(String field, String... rels) {
			this.rels = rels;
			this.field = field;
		}

		public boolean matches(String relstr) {
			if (this.rels == null) return false;
			if (this.rels.length == 0 || relstr == null) return true;
			for (String s : this.rels) {
				if (relstr.startsWith(s)) return true;
			}
			return false;
		}

		@Override
		public boolean matches(Map<String, String> row) {
			return matches(row.get(this.field));
		}
	}
	
	public static class PrefixExcluder extends PrefixMatcher {
		public PrefixExcluder(String field, String... rels) {
			super(field, rels);
		}
		
		@Override
		public boolean matches(Map<String, String> row) {
			return !super.matches(row);
		}
	}
	
	public static class ExcludeMatcher implements RowMatcher {
		private List<String> urns;
		private String field;
		
		public ExcludeMatcher(String field, String... urns) {
			this.urns = Arrays.asList(urns);
			this.field = field;
		}
		
		@Override
		public boolean matches(Map<String, String> row) {
			return !urns.contains(row.get(this.field));
		}
	}
	
	public static class AndMatcher implements RowMatcher {
		
		private List<RowMatcher> matchers;
		
		public AndMatcher(RowMatcher... matchers) {
			this.matchers = Arrays.asList(matchers);
		}
		
		@Override
		public boolean matches(Map<String, String> row) {
			for (RowMatcher m : matchers) {
				if (!m.matches(row)) return false;
			}
			return true;
		}
	}
	
}