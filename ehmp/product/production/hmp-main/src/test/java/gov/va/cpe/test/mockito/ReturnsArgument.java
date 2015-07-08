package gov.va.cpe.test.mockito;

import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import java.io.Serializable;

public class ReturnsArgument<T> implements Answer<T>, Serializable {

    private int argToReturn;

    public ReturnsArgument() {
        this(0);
    }

    public ReturnsArgument(int argToReturn) {
        this.argToReturn = argToReturn;
    }

    @Override
    public T answer(InvocationOnMock invocation) throws Throwable {
        Object[] args = invocation.getArguments();
        return (T) args[argToReturn];
    }
}
