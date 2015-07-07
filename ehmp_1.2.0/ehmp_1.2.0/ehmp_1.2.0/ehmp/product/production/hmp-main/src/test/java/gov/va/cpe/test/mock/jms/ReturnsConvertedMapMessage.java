package gov.va.cpe.test.mock.jms;

import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.springframework.core.convert.converter.Converter;

import javax.jms.MapMessage;

public class ReturnsConvertedMapMessage<T> implements Answer<T> {

    private Converter<MapMessage, T> converter;

    public ReturnsConvertedMapMessage(Converter<MapMessage, T> converter) {
        this.converter = converter;
    }

    @Override
    public T answer(InvocationOnMock invocation) throws Throwable {
        MapMessage msg = getMapMessage(invocation);
        return converter.convert(msg);
    }

    private MapMessage getMapMessage(InvocationOnMock invocation) {
        Object[] args = invocation.getArguments();
        for (Object arg : args) {
            if (arg instanceof MapMessage) {
                return (MapMessage) arg;
            }
        }
        throw new IllegalArgumentException("At least on argument to mock must be of type " + MapMessage.class.getName());
    }
}
