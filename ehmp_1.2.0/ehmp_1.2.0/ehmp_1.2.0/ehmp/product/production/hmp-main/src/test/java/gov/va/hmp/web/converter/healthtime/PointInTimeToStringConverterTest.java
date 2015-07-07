package gov.va.hmp.web.converter.healthtime;

import gov.va.hmp.healthtime.PointInTime;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class PointInTimeToStringConverterTest
{

    @Test
    public void testHoursAndSeconds( )
    {
      PointInTimeToStringConverter pointInTimeToStringConverter = new PointInTimeToStringConverter();
      
      PointInTime t = new PointInTime(1975, 7, 23, 3, 52);
      assertEquals("1975-07-23 03:52", pointInTimeToStringConverter.convert(t));
      
    }

    @Test
    public void testDay( )
    {
      PointInTimeToStringConverter pointInTimeToStringConverter = new PointInTimeToStringConverter();
      
      PointInTime t = new PointInTime(2012, 9, 9);
      assertEquals("2012-09-09", pointInTimeToStringConverter.convert(t));
      
    }

    @Test
    public void testYear( )
    {
      PointInTimeToStringConverter pointInTimeToStringConverter = new PointInTimeToStringConverter();
      
      PointInTime t = new PointInTime(2011);
      assertEquals("2011", pointInTimeToStringConverter.convert(t));
      
    }

 }
