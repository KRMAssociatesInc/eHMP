package gov.va.hmp.vista.rpc;

public class FooLineMapper implements LineMapper<Foo> {
    @Override
    public Foo mapLine(String line, int lineNum) {
        return new Foo(line);
    }
}
