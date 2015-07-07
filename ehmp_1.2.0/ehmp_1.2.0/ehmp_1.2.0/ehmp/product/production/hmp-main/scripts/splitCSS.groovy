import com.phloc.css.ECSSVersion
import com.phloc.css.decl.CSSImportRule
import com.phloc.css.decl.CSSStyleRule;
import com.phloc.css.decl.CascadingStyleSheet
import com.phloc.css.decl.ICSSTopLevelRule;
import com.phloc.css.reader.CSSReader
import com.phloc.css.writer.CSSWriter

import java.nio.charset.Charset;

int limit = 4095;

File cssDir = new File(project.build.directory, 'css')
File originalCssFile = new File(cssDir, 'hmp-theme-all.css')

CascadingStyleSheet originalCss = CSSReader.readFromFile(originalCssFile, Charset.forName("utf-8"), ECSSVersion.CSS30);
if (originalCss == null) {
    // Most probably a syntax error
    fail("Failed to read CSS at ${originalCssFile.name} - please see previous logging entries!");
}

int selectorCount = 0
originalCss.allStyleRules.each { rule ->
    selectorCount += rule.selectorCount
}

if (selectorCount >= limit) {
    log.info ''
    log.info "${originalCssFile.name} has ${selectorCount} CSS selectors: splitting file for ${limit} IE9 selector limit"

//    originalCssFile.delete()

    Map<String, CascadingStyleSheet> cascadingStyleSheets = [:]
    List<List<ICSSTopLevelRule>> partitionedRules = partitionRules(originalCss.allRules, limit)
    partitionedRules.eachWithIndex{ List<ICSSTopLevelRule> rules, int i ->
        CascadingStyleSheet css = new CascadingStyleSheet()
        rules.each { css.addRule(it) }
        String filename = (i == 0 ? 'hmp-theme.css' : "hmp-theme-${i}.css")
        if (i > 0) {
            cascadingStyleSheets['hmp-theme.css'].addImportRule(new CSSImportRule(filename))
        }
        cascadingStyleSheets[filename] = css
    }

    CSSWriter writer = new CSSWriter(ECSSVersion.CSS30, true)
    cascadingStyleSheets.entrySet().each {
        File cssFile = new File(cssDir, it.key)
        if (cssFile.exists()) {
            cssFile.delete()
        }
        writer.writeCSS(it.value, new FileWriter(cssFile))
        log.info "wrote split CSS to ${it.key}"
    }
}

List<List<ICSSTopLevelRule>> partitionRules(List<ICSSTopLevelRule> rules, limit) {
    List<List<ICSSTopLevelRule>> partitions = [[]]
    int selectorCount = 0
    List<ICSSTopLevelRule> partition = partitions[0]
    rules.each { rule ->
        if (rule.hasProperty('selectorCount')) {
            if (selectorCount + rule.selectorCount > limit) {
               partition = []
               partitions << partition
               selectorCount = 0
            }
            selectorCount += rule.selectorCount
        }
        partition << rule
    }
    return partitions
}

