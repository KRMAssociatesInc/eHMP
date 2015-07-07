package gov.va.cpe.vpr.pom;

import org.springframework.util.StringUtils;

/**
 * An improved naming strategy that prefers embedded
 * underscores to mixed case names
 * @see DefaultNamingStrategy the default strategy
 */
public class ImprovedNamingStrategy implements INamingStrategy {
    @Override
    public String collectionName(Class entityClass) {
        return addUnderscores(StringUtils.uncapitalize(entityClass.getSimpleName()));
    }

    @Override
    public String propertyName(String name) {
        return addUnderscores(StringUtils.uncapitalize(name));
    }

    /**
     * Convert mixed case to underscores
     */
    protected static String addUnderscores(String name) {
        return addChars(name, '_');
    }

    /**
     * Convert mixed case to hyphens
     */
    protected static String addHyphens(String name) {
        return addChars(name, '-');
    }

    private static String addChars(String name, char c) {
        StringBuilder buf = new StringBuilder(name.replace('.', c));
        for (int i = 1; i < buf.length() - 1; i++) {
            if (Character.isLowerCase(buf.charAt(i - 1)) &&
                    Character.isUpperCase(buf.charAt(i)) &&
                    Character.isLowerCase(buf.charAt(i + 1))
                    ) {
                buf.insert(i++, c);
            }
        }
        return buf.toString().toLowerCase();
    }
}
