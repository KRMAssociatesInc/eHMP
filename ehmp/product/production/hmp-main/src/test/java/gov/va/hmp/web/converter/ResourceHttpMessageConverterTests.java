package gov.va.hmp.web.converter;

import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Calendar;
import java.util.GregorianCalendar;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ResourceHttpMessageConverterTests {

    private ResourceHttpMessageConverter converter;
    private Resource mockResource;
    private long lastModified;

    @Before
    public void setUp() throws Exception {
        converter = new ResourceHttpMessageConverter();
        converter.afterPropertiesSet();

        lastModified = new GregorianCalendar(2012, Calendar.NOVEMBER, 20, 3, 47, 0).getTimeInMillis();
        mockResource = mock(Resource.class);
        when(mockResource.getFilename()).thenReturn("foo.png");
        when(mockResource.getInputStream()).thenReturn(new ByteArrayInputStream("foo bar baz".getBytes()));
        when(mockResource.lastModified()).thenReturn(lastModified);
    }

    @Test
    public void testGetDefaultContentTypeForPng() throws Exception {
        MediaType type = converter.getDefaultContentType(mockResource);
        assertThat(type, is(MediaType.IMAGE_PNG));
    }

    @Test
    public void testWriteLastModifiedHeader() throws IOException {
        ByteArrayOutputStream body = new ByteArrayOutputStream();
        HttpHeaders headers = new HttpHeaders();

        HttpOutputMessage httpMsg = mock(HttpOutputMessage.class);
        when(httpMsg.getHeaders()).thenReturn(headers);
        when(httpMsg.getBody()).thenReturn(body);

        converter.write(mockResource, null, httpMsg);

        assertThat(headers.getLastModified(), is(lastModified));
    }
}
