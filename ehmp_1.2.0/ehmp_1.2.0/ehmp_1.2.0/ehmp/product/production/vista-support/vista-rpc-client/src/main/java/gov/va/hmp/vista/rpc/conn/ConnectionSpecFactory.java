package gov.va.hmp.vista.rpc.conn;

import org.springframework.util.StringUtils;

/**
 * Creates the appropriate {@link ConnectionSpec} from a credentials string.
 */
public class ConnectionSpecFactory {
    /**
     * Creates a ConnectionSpec from a string with one of the following formats:
     * <p/>
     * <blockquote><pre>
     * [{clientHostName}(clientAddress)][{division}:]{accessCode};{verifyCode}
     * </pre></blockquote>
     * <p/>
     * <blockquote><pre>
     * [{clientHostName}(clientAddress)][{division}:]{appHandle}
     * </pre></blockquote>
     * <p/>
     * <blockquote><pre>
     * ANONYMOUS
     * </pre></blockquote>
     *
     * @param credentials
     * @return
     * @throws IllegalArgumentException
     */
    public static ConnectionSpec create(String credentials) {
        if (!StringUtils.hasText(credentials) || AnonymousConnectionSpec.ANONYMOUS.equalsIgnoreCase(credentials)) {
           return new AnonymousConnectionSpec();
        }

        String clientAddress = null;
        String clientHostName = null;
        int openParen = credentials.indexOf('(');
        int closeParen = credentials.indexOf(')');
        if (openParen != -1 && closeParen != -1) {
            if (closeParen <= openParen) throw new IllegalArgumentException("expected ')' to be after '(' in credentials string");
            clientHostName = credentials.substring(0, openParen);
            clientAddress = credentials.substring(openParen + 1, closeParen);
        }

        String username = null;
        String password = null;
        int delim = credentials.indexOf(AccessVerifyConnectionSpec.DIVISION_CREDENTIALS_DELIMITER, closeParen != -1 ? closeParen : 0);
        if (delim != -1) {
            username = credentials.substring(closeParen != -1 ? closeParen +1 : 0, delim);
            password = credentials.substring(delim + 1);
        } else {
            password = closeParen != -1 ? credentials.substring(closeParen + 1) : credentials;
        }

        if (!password.contains(AccessVerifyConnectionSpec.ACCESS_VERIFY_CODE_DELIMITER)) {
            return new AppHandleConnectionSpec(password, username, clientAddress, clientHostName);
        } else {
            String accessCode = "";
            String verifyCode = "";
            String newVerifyCode = null;
            String confirmNewVerifyCode = null;
            String[] pieces = password.split(AccessVerifyConnectionSpec.ACCESS_VERIFY_CODE_DELIMITER);
            if (pieces.length != 2 && pieces.length != 4)
                throw new IllegalArgumentException("expected 1 or 3 '" + AccessVerifyConnectionSpec.ACCESS_VERIFY_CODE_DELIMITER + "' characters in credentials in order to create access/verify connection spec");
            accessCode = pieces[0];
            verifyCode = pieces[1];
            if (pieces.length == 4) {
                newVerifyCode = pieces[2];
                confirmNewVerifyCode = pieces[3];

                return new ChangeVerifyCodeConnectionSpec(username, accessCode, verifyCode, newVerifyCode, confirmNewVerifyCode, clientAddress, clientHostName);
            }

            return new AccessVerifyConnectionSpec(username, accessCode, verifyCode, clientAddress, clientHostName);
        }
    }
}
