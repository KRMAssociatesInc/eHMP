package gov.va.hmp.vista.util;

import junit.framework.TestCase;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;

import static gov.va.hmp.vista.util.VistaStringUtils.nameCase;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;

/**
 * TODO: Document ${CLASS_NAME}
 */
public class TestVistaStringUtils extends TestCase {
    @Test
    public void testPiece1() {
        TestCase.assertEquals("Piece1", VistaStringUtils.piece("Piece1^Piece2^Piece3", "^"));
    }

    @Test
    public void testPiece2() {
        assertEquals("Piece2", VistaStringUtils.piece("Piece1^Piece2^Piece3", "^", 2));
    }

    @Test
    public void testPiece3() {
        assertEquals("Piece3", VistaStringUtils.piece("Piece1^Piece2^Piece3", "^", 3));
    }

    @Test
    public void testPiece4() {
        assertEquals("", VistaStringUtils.piece("Piece1^Piece2^Piece3", "^", 4));
    }

    @Test
    public void testPiece5() {
        assertEquals("Piece1^Piece2", VistaStringUtils.piece("Piece1^Piece2^Piece3", "^", 1, 2));
    }

    @Test
    public void testPiece6() {
        assertEquals("Piece2^Piece3", VistaStringUtils.piece("Piece1^Piece2^Piece3", "^", 2, 3));
    }

    @Test
    public void testPiece7() {
        assertEquals("Piece2^Piece3", VistaStringUtils.piece("Piece1^Piece2^Piece3", "^", 2, 4));
    }

    @Test
    public void testPiece8() {
        assertEquals("Piece3", VistaStringUtils.piece("Piece1^Piece2^Piece3", "^", 3, 5));
    }

    @Test
    public void testPiece9() {
        assertEquals("", VistaStringUtils.piece("Piece1^Piece2^Piece3", "^", 4, 6));
    }

    @Test
    public void testTranslate1() {
        assertEquals("abcdefghabcde", VistaStringUtils.translate("ABCDEFGHABCDE", "ABCDEFGH", "abcdefgh"));
    }

    @Test
    public void testTranslate2() {
        assertEquals("abcdEFGHabcdE", VistaStringUtils.translate("ABCDEFGHABCDE", "ABCD", "abcde"));
    }

    @Test
    public void testTranslate3() {
        assertEquals("abcdeFGHabcde", VistaStringUtils.translate("ABCDEFGHABCDE", "ABCDEABC", "abcdefgh"));
    }

    @Test
    public void testTranslate4() {
        assertEquals("abcdeabcabcde", VistaStringUtils.translate("ABCDEFGHABCDE", "ABCDEFGH", "abcdeabc"));
    }

    @Test
    public void testCrc16() {
        assertEquals(12480, VistaStringUtils.crc16("A"));
        assertEquals(17697, VistaStringUtils.crc16("ABC"));
        assertEquals(40710, VistaStringUtils.crc16("serverserverserv1.DOMAIN.EXT"));
    }

    @Test
    public void testCrc16Hex() {
        assertEquals("30C0", VistaStringUtils.crc16Hex("A"));
        assertEquals("4521", VistaStringUtils.crc16Hex("ABC"));
        assertEquals("9F06", VistaStringUtils.crc16Hex("serverserverserv1.DOMAIN.EXT"));
    }

    @Test
    public void testSplitLargeStringIfNecessary() {
        assertThat((String) VistaStringUtils.splitLargeStringIfNecessary("foo"), is("foo"));

        char[] chars = new char[] {'a','b','c'};
        StringBuilder longString = new StringBuilder();
        for (char c : chars) {
            char[] bunchOChars = new char[245];
            Arrays.fill(bunchOChars, c);
            longString.append(bunchOChars);
        }
        longString.append("ddd");

        List<String> split = (List<String>) VistaStringUtils.splitLargeStringIfNecessary(longString.toString());
        assertThat(split.size(), is(4));
        assertThat(split.get(0).length(), is(245));
        assertThat(split.get(1).length(), is(245));
        assertThat(split.get(2).length(), is(245));
        assertThat(split.get(3).length(), is(3));
    }

    /**
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
     * @see "http://namecase.rubyforge.org/"
     * @see "http://www.gnu.org/licenses/"
     */
    @Test
    public void testNameCase() {
        String[] properNames = new String[] {
                "Keith",            "Leigh-Williams",       "McCarthy",
                "O'Callaghan",      "St. John",             "von Streit",
                "van Dyke",         "Van",                  "ap Llwyd Dafydd",
                "al Fahd",          "Al",
                "el Grecco",
                "ben Gurion",       "Ben",
                "da Vinci",
                "di Caprio",        "du Pont",              "de Legate",
                "del Crond",        "der Sind",             "van der Post",
                "von Trapp",        "la Poisson",           "le Figaro",
                "Mack Knife",       "Dougal MacDonald",
                // Mac exceptions
                "Machin",           "Machlin",              "Machar",
                "Mackle",           "Macklin",              "Mackie",
                "Macquarie",        "Machado",              "Macevicius",
                "Maciulis",         "Macias",               "MacMurdo",
                "Maciej",           "Maciek",
                // Roman numerals
                "Henry VIII",       "Louis III",            "Louis XIV",
                "Charles II",       "Fred XLIX",
                // Room numbers
                "3E North",         "3 North Surg",         "7B",
                "2-Intermed"
        };

        for(String name : properNames) {
            assertThat(nameCase(name), is(equalTo(name)));
        }
    }

    @Test
    public void testNameCaseMultibyte() {
        String properCased = "Iñtërnâtiônàlizætiøn";
        assertThat(nameCase(properCased), is(equalTo(properCased)));
    }

    @Test
    public void testNameCaseNullSafe() {
        assertThat(nameCase(null), nullValue());
    }
}
