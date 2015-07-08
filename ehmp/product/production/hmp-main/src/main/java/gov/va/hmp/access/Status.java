package gov.va.hmp.access;

/**
* Created by sblaz on 3/26/14.
*/
public class Status {

    public static final Status OK = new Status(Code.OK);

    public static enum Code {
        OK,
        MISSING_ATTRIBUTE,
        PROCESSING_ERROR,
        SYNTAX_ERROR
    }

    private final Code code;
    private final String message;
    private final String detail;

    private Status(Code code) {
        this.code = code;
        this.message = code.name();
        this.detail = null;
    }

    public Status(Code code, String message, String detail) {
        this.code = code;
        this.message = message;
        this.detail = detail;
    }

    public Code getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public String getDetail() {
        return detail;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Status status = (Status) o;

        if (code != status.code) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return code.hashCode();
    }
}
