package gov.va.cpe.vpr.sync.vista;

import gov.va.cpe.vpr.pom.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class Foo extends AbstractPatientObject implements IPatientObject {

    private String bar;
    private boolean baz;

    public Foo() {
        super(null);
    }

    public Foo(Map props) {
        super(props);
    }

    public Foo(String bar, boolean baz) {
        super(null);
        setData("bar", bar);
        setData("baz", baz);
    }

    public String getBar() {
        return bar;
    }

    public void setBar(String bar) {
        this.bar = bar;
    }

    public boolean isBaz() {
        return baz;
    }

    public void setBaz(boolean baz) {
        this.baz = baz;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Foo foo = (Foo) o;

        if (baz != foo.baz) return false;
        if (bar != null ? !bar.equals(foo.bar) : foo.bar != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = bar != null ? bar.hashCode() : 0;
        result = 31 * result + (baz ? 1 : 0);
        return result;
    }
}
