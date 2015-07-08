package gov.va.cpe.vpr;

public class DocumentLink {
	private Long id;
	private String reference; // href?
	private Document document;

	public Long getId() {
		return id;
	}

	public String getReference() {
		return reference;
	}

	public Document getDocument() {
		return document;
	}

    void setDocument(Document document) {
        this.document = document;
    }
}
