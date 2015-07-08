package gov.va.cpe.vpr;

import org.apache.commons.codec.binary.Base64;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class PersonPhotoTests {

    @Test
    public void testConstruct() throws Exception {
        String personUid = UidUtils.getUserUid("ABCD", "42");
        PersonPhoto photo = new PersonPhoto(personUid, "EFGH");

        assertThat(photo.getPersonUid(), is(personUid));
        assertThat(photo.getContentType(), is(PersonPhoto.DEFAULT_CONTENT_TYPE));
        assertThat(photo.getImageBytes(), is(equalTo(Base64.decodeBase64("EFGH"))));
    }

}
