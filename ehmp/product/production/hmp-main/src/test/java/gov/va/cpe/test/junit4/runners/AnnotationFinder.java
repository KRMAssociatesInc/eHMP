package gov.va.cpe.test.junit4.runners;

import java.lang.annotation.Annotation;

/**
 * Helper used to scan classes for annotations.
 *
 * @author vojtech.szocs
 */
public class AnnotationFinder {

    private final Class<?> targetClass;

    /**
     * Creates new helper for the given class.
     *
     * @param targetClass Class to scan for annotations.
     */
    public AnnotationFinder(Class<?> targetClass) {
        this.targetClass = targetClass;
    }

    /**
     * Attempts to find an annotation of type <tt>annotationClass</tt> on the
     * given target class.
     * <p/>
     * This method works by scanning target class annotations and their "child"
     * annotations recursively. The Java core annotation package is excluded
     * from scanning to avoid infinite recursion.
     *
     * @param annotationClass Requested annotation type.
     * @return Annotation of the given type or <tt>null</tt> if not found.
     */
    public <A extends Annotation> A find(Class<A> annotationClass) {
        A found = null;

        for (Annotation annotation : targetClass.getAnnotations()) {
            if (annotation.annotationType().equals(annotationClass))
                return annotationClass.cast(annotation);

            found = find(annotationClass, annotation);

            if (found != null)
                break;
        }

        return found;
    }

    /**
     * Attempts to find an annotation of type <tt>annotationClass</tt> on the
     * given target annotation.
     *
     * @param annotationClass  Requested annotation type.
     * @param targetAnnotation Annotation to scan.
     * @return Annotation of the given type or <tt>null</tt> if not found.
     */
    protected <A extends Annotation> A find(Class<A> annotationClass, Annotation targetAnnotation) {
        A found = null;

        for (Annotation annotation : targetAnnotation.annotationType().getAnnotations()) {
            // skip annotations from Java core annotation package to avoid
            // infinite recursion
            if (annotation.annotationType().getPackage().equals(Annotation.class.getPackage()))
                continue;

            if (annotation.annotationType().equals(annotationClass))
                return annotationClass.cast(annotation);

            found = find(annotationClass, annotation);

            if (found != null)
                break;
        }

        return found;
    }

}
