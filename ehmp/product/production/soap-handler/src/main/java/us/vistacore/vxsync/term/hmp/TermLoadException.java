package us.vistacore.vxsync.term.hmp;

/**
 * This exception is thrown when an error occurs during terminology loading.
 * 
 * @author Les Westberg
 */
public class TermLoadException extends Exception
{
    private static final long serialVersionUID = -2763323716005332016L;
    
    /**
     * Default constructor.
     */
    public TermLoadException()
    {
        super();
    }
    
    /**
     * Constructor with an enveloping exception.
     * 
     * @param e  The exception that caused this one.
     */
    public TermLoadException(Exception e)
    {
        super(e);
    }

    /**
     * Constructor with the given exception and message.
     * 
     * @param sMessage The message to place in the exception.
     * @param e The exception that triggered this one.
     */
    public TermLoadException(String sMessage, Exception e)
    {
        super(sMessage, e);
    }

    /**
     * Constructor with a given message.
     * 
     * @param sMessage The message for the exception.
     */
    public TermLoadException(String sMessage)
    {
        super(sMessage);
    }
    
}
