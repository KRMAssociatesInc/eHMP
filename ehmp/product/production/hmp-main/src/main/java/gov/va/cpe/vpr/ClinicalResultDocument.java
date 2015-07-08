package gov.va.cpe.vpr;

public class ClinicalResultDocument {
	private Long id;
	private Long version;
	private String contentId;
	private String content;
	private ProcedureResult procedureResult;
	private Result result;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public String getContentId() {
		return contentId;
	}

	public void setContentId(String contentId) {
		this.contentId = contentId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public ProcedureResult getProcedureResult() {
		return procedureResult;
	}

	public void setProcedureResult(ProcedureResult procedureResult) {
		this.procedureResult = procedureResult;
	}

	public Result getResult() {
		return result;
	}

	public void setResult(Result result) {
		this.result = result;
	}

}
