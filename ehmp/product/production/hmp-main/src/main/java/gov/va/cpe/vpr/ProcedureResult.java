package gov.va.cpe.vpr;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import gov.va.cpe.vpr.pom.AbstractPOMObject;
import gov.va.cpe.vpr.pom.IGenericPatientObjectDAO;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public class ProcedureResult extends AbstractPOMObject {
	@JsonCreator
	public ProcedureResult(Map<String, Object> vals) {
		super(vals);
	}
	
	public ProcedureResult()
	{
		super(null);
	}

	private Long id;
	private String interpretation;
	private String localTitle;
	private String nationalTitle;
	private String nationalTitleCode;
	private String subject;
	private String report; // TODO: how is this different from "document" field?
	private Document document;
	private Procedure procedure;

	public Long getId() {
		return id;
	}

    public String getInterpretation() {
		return interpretation;
	}

	public String getLocalTitle() {
		return localTitle;
	}

	public String getNationalTitle() {
		return nationalTitle;
	}

	public String getNationalTitleCode() {
		return nationalTitleCode;
	}

	public String getSubject() {
		return subject;
	}

	public String getReport() {
		return report;
	}

	/** Lazily loads the document if/when needed */
	@JsonIgnore
	public Document getDocument() {
		if (document != null) return document;
		
		if (getProcedure().getDAO() != null) {
			this.document = getProcedure().getDAO().findByUID(Document.class, uid);
		}
		
		return document;
	}

    @JsonBackReference("procedure-result")
	public Procedure getProcedure() {
		return procedure;
	}

    void setProcedure(Procedure procedure) {
        this.procedure = procedure;
    }
}
