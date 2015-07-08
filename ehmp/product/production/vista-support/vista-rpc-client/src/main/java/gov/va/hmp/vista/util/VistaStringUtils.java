package gov.va.hmp.vista.util;

import gov.va.hmp.vista.rpc.broker.protocol.AbstractRpcProtocol;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.MatchResult;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Functions that emulate MUMPS functions.
 */
public class VistaStringUtils {

    public static final String U = "^";

    public static String piece(String s) {
        return piece(s, U);
    }

    public static String piece(String s, int piece1) {
        return piece(s, U, piece1, 0);
    }

    public static String piece(String s, int piece1, int piece2) {
        return piece(s, U, piece1, piece2);
    }

    public static String piece(String s, String delimiter) {
        return piece(s, delimiter, 1, 0);
    }

    public static String piece(String s, String delimiter, int piece1) {
        return piece(s, delimiter, piece1, 0);
    }

    /**
     * Returns a field within a string using the specified delimiter.
     *
     * @param s
     * @param delimiter
     * @param piece1
     * @param piece2
     * @return
     */
    public static String piece(String s, String delimiter, int piece1, int piece2) {
        int delimiterIndex = 0;
        int pieceNumber = 1;
        String result = "";
        String scratch = s;
        if (piece2 == 0)
            piece2 = piece1;
        do {
            delimiterIndex = scratch.indexOf(delimiter);
            if (delimiterIndex > 0 || ((pieceNumber > piece1 - 1) && pieceNumber < piece2 + 1)) {
                if ((pieceNumber > piece1 - 1) && (pieceNumber < piece2 + 1)) {
                    if ((pieceNumber > piece1) && (!scratch.equals("")))
                        result = result + delimiter;
                    if (delimiterIndex > 0) {
                        result = result + scratch.substring(0, delimiterIndex);
                        scratch = scratch.substring(delimiterIndex + delimiter.length(), scratch.length());
                    } else {
                        result = result + scratch;
                        scratch = "";
                    }
                } else {
                    scratch = scratch.substring(delimiterIndex + delimiter.length(), scratch.length());
                }
            } else if (!scratch.equals("")) {
                scratch = "";
            }
            pieceNumber++;
        } while (pieceNumber <= piece2);

        return result;
    }

    /**
     * Performs a character-for-character replacement within a string.
     *
     * @param s
     * @param identifier
     * @param associator
     * @return
     */
    public static String translate(String s, String identifier, String associator) {
        String newString = "";

        for (int index = 0; index < s.length(); index++) {
            String substring = s.substring(index, index + 1);
            int position = identifier.indexOf(substring);

            if (position != -1)
                newString = newString + associator.substring(position, position + 1);
            else
                newString = newString + s.substring(index, index + 1);
        }
        return newString;
    }

    /**
     * Calculates the CRC-16 value of the given string using the same algorithm as VistA Kernel XLF function library.
     *
     * @param s The string for which to calculate the CRC-16.
     * @return the CRC-16 value
     * @see "VistA CRC16^XLFCRC"
     */
    public static long crc16(String s) {
        CRC16 crc = new CRC16();
        crc.update(s.getBytes(AbstractRpcProtocol.VISTA_CHARSET));
        return crc.getValue();
    }

    /**
     * Calculates the Hex representation of the CRC-16 value of the given string using the same algorithm as VistA Kernel XLF function library.
     *
     * @param s The string for which to calculate the CRC-16.
     * @return the CRC-16 value as Hex
     * @see #crc16(String)
     * @see "VistA CRC16^XLFCRC"
     */
    public static String crc16Hex(String s) {
        return Integer.toHexString((int) crc16(s)).toUpperCase();
    }

    /**
     * Utility for splitting strings into lists of strings to pass as arguments to VistA Remote Procedure Calls (RPCs) to
     * work around LITERAL parameter length limitations in the RPC Broker protocol.  This will work for a particular RPC
     * parameter if and only if the parameter is defined in VistA as being of <code>WORD PROCESSING</code> type.
     *
     * @param s The string to split (if necessary)
     * @see #splitLargeStringIfNecessary(String, int)
     * @see "VistA FileMan REMOTE PROCEDURE,PARAMETER TYPE(8994.02,.02)"
     */
    public static Object splitLargeStringIfNecessary(String s) {
        return splitLargeStringIfNecessary(s, 245);
    }

    /**
     * Splits strings greater than the specified length into lists of strings of the specified length.  Strings less than
     * than the desired length are returned unmodified.
     *
     * @param s      The string to split (if necessary).
     * @param length The desired length of each string in the
     * @return <code>s</code> if
     */
    public static Object splitLargeStringIfNecessary(String s, int length) {
        if (s == null) {
            return "";
        } else if (s.length() <= length) {
            return s;
        } else {
            List<String> ret = new ArrayList<String>();
            while (s.length() > length) {
                ret.add(s.substring(0, length));
                s = s.substring(length);
            }
            if (s.length() > 0) {
                ret.add(s);
            }
            return ret;
        }
    }

    /**
     * Function that attempts to fix capitalization of proper names.
     * <p/>
     * Example usage:
     * <pre>{@code
     *      VistaStringUtils.nameCase("RON BURGUNDY");  // => "Ron Burgundy"
     *      VistaStringUtils.nameCase("MCDONALDS");     // => "McDonalds"
     * }</pre>
     * <p/>
     * This is a port of the <pre>NameCase</pre> library, which is a Ruby implementation of Perl's
     * <pre>Lingua::EN::NameCase</pre> and owes most of its functionality to the Perl version by Mark Summerfield.
     * <p/>
     * Original Version:
     * Copyright (c) Mark Summerfield 1998-2002.  <summer@perlpress.com>  All Rights Reserved.
     * <p/>
     * Ruby Version:
     * Copyright (c) Aaron Patterson 2006
     * <p/>
     * <pre>NameCase</pre> is distributed under the GPL license.
     * <p/>
     * This program is free software: you can redistribute it and/or modify
     * it under the terms of the GNU General Public License as published by
     * the Free Software Foundation, either version 3 of the License, or
     * (at your option) any later version.
     * <p/>
     * This program is distributed in the hope that it will be useful,
     * but WITHOUT ANY WARRANTY; without even the implied warranty of
     * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     * GNU General Public License for more details.
     * <p/>
     * You should have received a copy of the GNU General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     *
     * @param s the String to properly namecase.
     * @return Returns a new String properly namecased.
     * @see "http://namecase.rubyforge.org/"
     * @see "http://www.gnu.org/licenses/"
     */
    public static String nameCase(String s) {
        if (s == null) return null;
        s = replaceAll(WORD_WITH_NON_NUMERIC_FIRST_LETTER, s, new Callback() {
            public String foundMatch(MatchResult match) {
                return match.group().toLowerCase();
            }
        });
        s = replaceAll(FIRST_LETTER, s, new Callback() {
            public String foundMatch(MatchResult match) {
                return match.group().toUpperCase();
            }
        });

        // lowercase 's
        s = replaceAll(APOSTROPHE, s, new Callback() {
            public String foundMatch(MatchResult match) {
                return match.group().toLowerCase();
            }
        });

        if (MAC.matcher(s).find() || MC.matcher(s).find()) {
            s = replaceAll(Pattern.compile("\\b(Ma?c)([A-Za-z]+)"), s, new Callback() {
                public String foundMatch(MatchResult match) {
                    return match.group(1) + StringUtils.capitalize(match.group(2));
                }
            });

            // Now fix "Mac" exceptions
            s = s.replaceAll("\\bMacEvicius", "Macevicius");
            s = s.replaceAll("\\bMacHado", "Machado");
            s = s.replaceAll("\\bMacHar", "Machar");
            s = s.replaceAll("\\bMacHin", "Machin");
            s = s.replaceAll("\\bMacHlin", "Machlin");
            s = s.replaceAll("\\bMacIas", "Macias");
            s = s.replaceAll("\\bMacIej", "Maciej");
            s = s.replaceAll("\\bMacIek", "Maciek");
            s = s.replaceAll("\\bMacIulis", "Maciulis");
            s = s.replaceAll("\\bMacKie", "Mackie");
            s = s.replaceAll("\\bMacKle", "Mackle");
            s = s.replaceAll("\\bMacKlin", "Macklin");
            s = s.replaceAll("\\bMacQuarie", "Macquarie");
        }
        s = s.replace("Macmurdo", "MacMurdo");

        // Fixes for "son (daughter) of" etc
        s = s.replaceAll("\\bAl(?=\\s+\\w)", "al"); // al Arabic or forename Al.
        s = s.replaceAll("\\bAp\\b", "ap"); // ap Welsh.
        s = s.replaceAll("\\bBen(?=\\s+\\w)", "ben"); // ben Hebrew or forename Ben.
        s = s.replaceAll("\\bDell([ae])\\b", "dell$1"); // della and delle Italian.
        s = s.replaceAll("\\bD([aeiou])\\b", "d$1"); // da, de, di Italian; du Frenchl do Brasil
        s = s.replaceAll("\\bD([ao]s)\\b", "d$1"); // das, dos Brasileiros
        s = s.replaceAll("\\bDe([lr])\\b", "de$1"); // del Italian; der Dutch/Flemish.
        s = s.replaceAll("\\bEl\\b", "el"); // el Greek or El Spanish.
        s = s.replaceAll("\\bLa\\b", "la"); // la French or La Spanish.
        s = s.replaceAll("\\bL([eo])\\b", "l$1"); // lo Italian; le French.
        s = s.replaceAll("\\bVan(?=\\s+\\w)", "van"); // van German or forename Van.
        s = s.replaceAll("\\bVon\\b", "von"); // von Dutch/Flemish

        // Fix roman numeral names
        s = replaceAll(ROMAN_NUMERAL, s, new Callback() {
            public String foundMatch(MatchResult match) {
                return match.group().toUpperCase();
            }
        });

        return s;
    }

    private static final Pattern WORD_WITH_NON_NUMERIC_FIRST_LETTER = Pattern.compile("\\b\\D\\w*\\b");
    private static final Pattern FIRST_LETTER = Pattern.compile("\\b\\w");
    private static final Pattern APOSTROPHE = Pattern.compile("\\'\\w\\b");
    private static final Pattern MAC = Pattern.compile("\\bMac[A-Za-z]{2,}[^aciozj]\\b");
    private static final Pattern MC = Pattern.compile("\\bMc");
    private static final Pattern ROMAN_NUMERAL = Pattern.compile("\\b((?:[Xx]{1,3}|[Xx][Ll]|[Ll][Xx]{0,3})?(?:[Ii]{1,3}|[Ii][VvXx]|[Vv][Ii]{0,3})?)\\b");

    private static String replaceAll(Pattern pattern, CharSequence charSequence, Callback callback) {
        Matcher matcher = pattern.matcher(charSequence);
        StringBuilder sb = new StringBuilder(charSequence);
        int offset = 0;
        while (matcher.find()) {
            MatchResult matchResult = matcher.toMatchResult();

            String replacement = callback.foundMatch(matchResult);

            int matchStart = offset + matchResult.start();
            int matchEnd = offset + matchResult.end();

            sb.replace(matchStart, matchEnd, replacement);

            int matchLength = matchResult.end() - matchResult.start();
            int lengthChange = replacement.length() - matchLength;

            offset += lengthChange;
        }
        return sb.toString();
    }

    private interface Callback {
        String foundMatch(MatchResult match);
    }
}
