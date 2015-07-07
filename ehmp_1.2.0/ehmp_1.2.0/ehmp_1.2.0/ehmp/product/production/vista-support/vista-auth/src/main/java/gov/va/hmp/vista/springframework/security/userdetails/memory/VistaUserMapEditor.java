package gov.va.hmp.vista.springframework.security.userdetails.memory;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUser;
import gov.va.hmp.vista.springframework.security.userdetails.VistaUserDetails;
import org.springframework.beans.propertyeditors.PropertiesEditor;
import org.springframework.security.core.userdetails.memory.UserAttribute;
import org.springframework.security.core.userdetails.memory.UserAttributeEditor;
import org.springframework.util.StringUtils;

import java.beans.PropertyEditorSupport;
import java.util.Iterator;
import java.util.Properties;
import java.util.Random;

/**
 * Property editor to assist with the setup of a {@link VistaUserMap}.<p>The format of entries should be:</p>
 * <p><code> duz@stationNumber=access;verify,grantedAuthority[,grantedAuthority][,enabled|disabled] </code></p>
 * At least one granted authority must be listed.</p>
 * <p>The <code>duz@stationNumber</code> represents the key and duplicates are handled the same was as duplicates would be
 * in Java <code>Properties</code> files.</p>
 * <p>If the above requirements are not met, the invalid entry will be silently ignored.</p>
 * <p>This editor always assumes each entry has a non-expired account and non-expired credentials. However, it
 * does honour the user enabled/disabled flag as described above.</p>
 */
public class VistaUserMapEditor extends PropertyEditorSupport {
    public void setAsText(String s) throws IllegalArgumentException {
        VistaUserMap userMap = new VistaUserMap();

        if ((s != null) && !"".equals(s)) {
            // Use properties editor to tokenize the string
            PropertiesEditor propertiesEditor = new PropertiesEditor();
            propertiesEditor.setAsText(s);

            Properties props = (Properties) propertiesEditor.getValue();
            addUsersFromProperties(userMap, props);
        }

        setValue(userMap);
    }

    public static VistaUserMap addUsersFromProperties(VistaUserMap userMap, Properties props) {
        // Now we have properties, process each one individually
        UserAttributeEditor configAttribEd = new UserAttributeEditor();

        for (Iterator iter = props.keySet().iterator(); iter.hasNext(); ) {
            String key = (String) iter.next();
            String value = props.getProperty(key);

            // Convert value to a password, enabled setting, and list of granted authorities
            configAttribEd.setAsText(value);

            UserAttribute attr = (UserAttribute) configAttribEd.getValue();

            // Make a user object, assuming the properties were properly provided
            if (attr != null) {
                String duz = StringUtils.split(key, "@")[0];
                String stationNumber = StringUtils.split(key, "@")[1];
                String access = StringUtils.split(attr.getPassword(), ";")[0];
                String verify = StringUtils.split(attr.getPassword(), ";")[1];
                VistaUserDetails user = new VistaUser(new RpcHost("localhost"), new Random().toString(), stationNumber, stationNumber, duz, verify, "foobar", attr.isEnabled(), true, true, true, attr.getAuthorities());
                userMap.addUser(user);
            }
        }

        return userMap;
    }
}
