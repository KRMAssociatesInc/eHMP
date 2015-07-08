package gov.va.jmeadows.util.document.convert;

/**
 * Document Type Enumeration
 */
public enum DocumentType {

    HTML("html", "html"),
    TEXT("txt:Text", "txt"),
    PDF("pdf", "pdf");

    private String conversionParam;
    private String fileExtension;

    DocumentType(String conversionParam, String fileExtension) {
        this.conversionParam = conversionParam;
        this.fileExtension = fileExtension;
    }

    public String getConversionParam() {
        return conversionParam;
    }

    public String getFileExtension() {
        return fileExtension;
    }
}
