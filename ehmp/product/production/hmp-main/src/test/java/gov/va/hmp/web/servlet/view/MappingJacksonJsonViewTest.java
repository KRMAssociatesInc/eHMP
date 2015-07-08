package gov.va.hmp.web.servlet.view;

import gov.va.hmp.web.servlet.view.MappingJacksonJsonView;
import groovy.lang.GroovyShell;
import org.junit.Assert;
import org.junit.Test;

import java.util.Map;

public class MappingJacksonJsonViewTest {
    @Test
    public void testIsFilterNeeded() throws Exception {
        MappingJacksonJsonView view = new MappingJacksonJsonView();
        view.setModelKey("response");
        Assert.assertTrue(view.isFilterNeeded(groovyMap("[response:[data:['foo','bar']]]")));
        Assert.assertTrue(view.isFilterNeeded(groovyMap("[response:[data:['foo','bar']], boo:['baa']]")));
        Assert.assertFalse(view.isFilterNeeded(groovyMap("[request:[data:['foo','bar']], boo:['baa']]")));
        Assert.assertFalse(view.isFilterNeeded(groovyMap("[data:[response:['foo','bar']]]")));
    }

    @Test
    public void testFilterData() throws Exception {

        MappingJacksonJsonView view = new MappingJacksonJsonView();
        view.setModelKey("response");
        view.setExtractValueFromSingleKeyModel(true);

        Map map = groovyMap("[response:[data:['foo','bar']]]");
        Assert.assertEquals(view.filterModel(map), groovyMap("[data:['foo','bar']]"));

        map = groovyMap("[data:[response:['foo','bar']]]");
        Object expected = view.filterModel(map);
        Assert.assertEquals(expected, groovyMap("[data:[response:['foo','bar']]]"));
    }

    private Map groovyMap(String groovyMapInitializer) {
        return (Map) groovy.evaluate(groovyMapInitializer);
    }

    private GroovyShell groovy = new GroovyShell();
}
