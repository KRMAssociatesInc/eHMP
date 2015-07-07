package com.vistacowboy.jVista;

import org.apache.commons.lang3.StringUtils;

/**
 * Created with IntelliJ IDEA.
 * User: Joe
 * Date: 11/25/12
 * Time: 2:11 PM
 */

public class VistaUtils
{
    public static String strPack(String s, int width)
    {
        return StringUtils.leftPad(String.valueOf(s.length()), width, '0') + s;
    }

    public static String prependCount(String s)
    {
        return (char)s.length() + s;
    }

    private static String adjustForNumericSearch(String s)
    {
        return String.valueOf(Integer.parseInt(s) - 1);
    }

    private static String adjustForStringSearch(String s)
    {
        int lth = s.length();
        if (lth == 0)
            return "";

        String result = s.substring(0, lth - 1);
        char c = s.charAt(lth - 1);
        int asciiCode = (byte)c - 1;
        c = (char)asciiCode;
        result = result + c + '~';
        return result;
    }

    public static String adjustForSearch(String s)
    {
        if (isNumeric(s))
            return adjustForNumericSearch(s);

        return adjustForStringSearch(s);
    }

    public static boolean isNumeric(String s)
    {
        if (s.isEmpty()) return false;
        for (char c : s.toCharArray())
        {
            if (!Character.isDigit(c)) return false;
        }
        return true;
    }
}
