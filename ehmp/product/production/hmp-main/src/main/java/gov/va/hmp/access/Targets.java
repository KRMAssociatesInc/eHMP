package gov.va.hmp.access;

import java.lang.reflect.Array;
import java.util.List;
import java.util.Map;

/**
 * Static factory methods for common {@link ITarget} implementation.
 */
public class Targets {

    public static ITarget anyTarget() {
        return ANY;
    }

    public static ITarget noneTarget() {
        return NONE;
    }

    public static <S, A, R> ITarget<S, A, R> with(Matcher<List<? extends S>> subjectsMatcher, Matcher<? extends A> actionMatcher, Matcher<? extends R> resourceMatcher) {
        return new DefaultTarget(subjectsMatcher, actionMatcher, resourceMatcher);
    }

    public static <S> ITarget<S, ?, ?> withAnySubject() {
        return new DefaultTarget(anySubject(), null, null);
    }

    public static <A> ITarget<?, A, ?> withAnyAction() {
        return new DefaultTarget(null, anyAction(), null);
    }

    public static <R> ITarget<?, ?, R> withAnyResource() {
        return new DefaultTarget(null, null, anyResource());
    }

    private static final Matcher TRUE = new Matcher() {
        @Override
        public boolean matches(Object item) throws MissingAttributeException {
            return true;
        }

        @Override
        public String toString() {
            return "any()";
        }
    };

    public static Matcher anySubject() {
        return TRUE;
    }

    public static <T> Matcher<? extends T> anySubject(Class<T> type) {
        return any(type);
    }

    public static Matcher anySubjects() {
        return TRUE;
    }

    public static <T> Matcher<List<? extends T>> anySubjects(Class<T> type) {
        return (Matcher<List<? extends T>>) TRUE;
    }

    public static Matcher anyAction() {
        return TRUE;
    }

    public static <T> Matcher<? extends T> anyAction(Class<T> type) {
        return any(type);
    }

    public static Matcher anyResource() {
        return TRUE;
    }

    public static <T> Matcher<? extends T> anyResource(Class<T> type) {
        return any(type);
    }

    public static <T> Matcher<? extends T> any(Class<T> type) {
        return (Matcher<? extends T>) TRUE;
    }

    public static <T> Matcher<? extends T> equalTo(T operand) {
        return new IsEqual<T>(operand);
    }

    public static <K, V> Matcher<Map<? extends K, ? extends V>> hasEntry(K key, V value) {
        return new IsMapContaining<K, V>(equalTo(key), equalTo(value));
    }

    /**
     * Default implementation of {@link ITarget} that requires {@link Matcher}s for
     * each of subject(s), action and resource of the specified decision request to return true.
     */
    public static class DefaultTarget<S, A, R> implements ITarget<S, A, R> {

        private Matcher<List<? extends S>> subjectsMatcher;
        private Matcher<? extends A> actionMatcher;
        private Matcher<? extends R> resourceMatcher;

        public DefaultTarget(Matcher<List<? extends S>> subjectsMatcher, Matcher<? extends A> actionMatcher, Matcher<? extends R> resourceMatcher) {
            this.subjectsMatcher = subjectsMatcher;
            this.actionMatcher = actionMatcher;
            this.resourceMatcher = resourceMatcher;
        }

        @Override
        public MatchResult evaluate(DecisionRequest<S, A, R> request) {
            Boolean matchesSubjects = null;
            Boolean matchesAction = null;
            Boolean matchesResource = null;
            try {
                matchesSubjects = subjectsMatcher.matches(request.getSubjects());
            } catch (Exception e) {
                return MatchResult.valueOf(e);
            }
            try {
                matchesAction = actionMatcher.matches(request.getAction());
            } catch (Exception e) {
                return MatchResult.valueOf(e);
            }
            try {
                matchesResource = resourceMatcher.matches(request.getResource());
            } catch (MissingAttributeException e) {
                return MatchResult.valueOf(e);
            } catch (Exception e) {
                return MatchResult.valueOf(e);
            }
            try {
                return MatchResult.valueOf(
                        matchesSubjects &&
                                matchesAction &&
                                matchesResource
                );
            } catch (Exception e) {
                return MatchResult.valueOf(e);
            }
        }

        @Override
        public String toString() {
            String subject = subjectsMatcher != null ? subjectsMatcher.toString() : null;
            String action = actionMatcher != null ? actionMatcher.toString() : null;
            String resource = resourceMatcher != null ? resourceMatcher.toString() : null;
            return getClass().getSimpleName() +
                    "{subject=" + subject +
                    ",action=" + action +
                    ",resource=" + resource +
                    "}";
        }
    }

    public static class IsEqual<T> implements Matcher<T> {
        private final Object expectedValue;

        public IsEqual(T equalArg) {
            expectedValue = equalArg;
        }

        @Override
        public boolean matches(Object item) throws MissingAttributeException {
            return areEqual(item, expectedValue);
        }

        @Override
        public String toString() {
            return "isEqual(" + expectedValue.toString() + ")";
        }

        private static boolean areEqual(Object actual, Object expected) {
            if (actual == null) {
                return expected == null;
            }

            if (expected != null && isArray(actual)) {
                return isArray(expected) && areArraysEqual(actual, expected);
            }

            return actual.equals(expected);
        }

        private static boolean areArraysEqual(Object actualArray, Object expectedArray) {
            return areArrayLengthsEqual(actualArray, expectedArray) && areArrayElementsEqual(actualArray, expectedArray);
        }

        private static boolean areArrayLengthsEqual(Object actualArray, Object expectedArray) {
            return Array.getLength(actualArray) == Array.getLength(expectedArray);
        }

        private static boolean areArrayElementsEqual(Object actualArray, Object expectedArray) {
            for (int i = 0; i < Array.getLength(actualArray); i++) {
                if (!areEqual(Array.get(actualArray, i), Array.get(expectedArray, i))) {
                    return false;
                }
            }
            return true;
        }

        private static boolean isArray(Object o) {
            return o.getClass().isArray();
        }

    }

    public static class IsMapContaining<K, V> implements Matcher<Map<? extends K, ? extends V>> {
        private final Matcher<? extends K> keyMatcher;
        private final Matcher<? extends V> valueMatcher;

        public IsMapContaining(Matcher<? extends K> keyMatcher, Matcher<? extends V> valueMatcher) {
            this.keyMatcher = keyMatcher;
            this.valueMatcher = valueMatcher;
        }

        @Override
        public boolean matches(Object item) throws MissingAttributeException {
            Map<? extends K, ? extends V> map = (Map<? extends K, ? extends V>) item;
            for (Map.Entry<? extends K, ? extends V> entry : map.entrySet()) {
                if (keyMatcher.matches(entry.getKey()) && valueMatcher.matches(entry.getValue())) {
                    return true;
                }
            }
            return false;
        }
    }

    private static final ITarget ANY = new ITarget() {
        @Override
        public MatchResult evaluate(DecisionRequest request) {
            return MatchResult.valueOf(MatchResult.Value.MATCH);
        }

        @Override
        public String toString() {
            return "any()";
        }
    };

    private static final ITarget NONE = new ITarget() {
        @Override
        public MatchResult evaluate(DecisionRequest request) {
            return MatchResult.valueOf(MatchResult.Value.NO_MATCH);
        }

        @Override
        public String toString() {
            return "none()";
        }
    };

}
