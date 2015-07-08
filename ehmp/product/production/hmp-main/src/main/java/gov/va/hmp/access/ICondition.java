package gov.va.hmp.access;

/**
 * An expression of predicates.  A function that evaluates to "True", "False" or “Indeterminate”. Optionally included in
 * {@link Rule} definition and evaluation.
 */
public interface ICondition<S,A,R> {
    enum ConditionValue {
        TRUE,
        FALSE,
        INDETERMINATE;

        public ConditionValue or(ConditionValue value) {
            return or(this, value);
        }

        public ConditionValue and(ConditionValue value) {
            return and(this, value);
        }

        public static ConditionValue or(ConditionValue value1, ConditionValue value2) {
            if (value1 == INDETERMINATE || value2 == INDETERMINATE) return INDETERMINATE;
            if (value1 == TRUE || value2 == TRUE) {
                return TRUE;
            } else {
                return FALSE;
            }
        }

        public static ConditionValue and(ConditionValue value1, ConditionValue value2) {
            if (value1 == INDETERMINATE || value2 == INDETERMINATE) return INDETERMINATE;
            if (value1 == TRUE && value2 == TRUE) {
                return TRUE;
            } else {
                return FALSE;
            }
        }
    }

    ConditionValue evaluate(DecisionRequest<S,A,R> request) throws Exception;
}
