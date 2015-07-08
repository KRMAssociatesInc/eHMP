package com.vistacowboy.jVista;


/**
 * Created with IntelliJ IDEA.
 * User: Joe
 * Date: 11/25/12
 * Time: 2:29 PM
 */

@SuppressWarnings("serial")
public class VistaException extends Exception
{
    private String[][] response;

    public VistaException(String msg)
    {
        super(msg);
    }

    public VistaException(String msg, String[][] response)
    {
        super(msg);
        this.response = response;
    }

    @Override
    public String getMessage()
    {
        String superMessage = super.getMessage();
        if (response != null)
        {
            StringBuilder sb = new StringBuilder();
            for (String[] line : response)
            {
                sb.append('\n');
                for (String field : line)
                {
                    if (sb.length() > 1)
                        sb.append("^");
                    sb.append(field);
                }
            }
            return superMessage + sb.toString();
        }
        return superMessage;
    }
}
