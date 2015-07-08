package gov.va.cpe.vpr.queryeng;

import groovy.lang.GroovyShell;

import java.util.Arrays;
import java.util.Map;

public class ViewDefSamples {
    public static Query sq1 = new Query.StaticQuery("id", Arrays.asList(groovyMap("[[id:'1', alt: 4, a:'a1', b:'b1', c:'c1'],[id:'2', alt: 5, a:'a2', b:'b2', c:'c2'],[id:'3', alt: 6, a:'a3', b:'b3', c:'c3']]")));
    public static Query sq2 = new Query.StaticQuery("id", Arrays.asList(groovyMap("[" +
            "[id:'1', id2: 1, x:'x1', y:'y1', z:'z1'],"
            + "[id:'2', id2: 2, x:'x2', y:'y2', z:'z2'],"
            + "[id:'3', id2: 3, x:'x3', y:'y3', z:'z3']"
            + "]")));

    private static Map<String, Object> groovyMap(String groovyMapInitializer) {
        return (Map<String, Object>) new GroovyShell().evaluate(groovyMapInitializer);
    }
}
