package gov.va.hmp.gradle

import com.phloc.css.ECSSVersion
import com.phloc.css.decl.CSSImportRule
import com.phloc.css.decl.CSSStyleRule;
import com.phloc.css.decl.CascadingStyleSheet
import com.phloc.css.decl.ICSSTopLevelRule;
import com.phloc.css.reader.CSSReader
import com.phloc.css.writer.CSSWriter

import org.gradle.api.*
import org.gradle.api.tasks.TaskAction
import org.gradle.api.tasks.OutputDirectory
import org.gradle.api.tasks.SourceTask

import java.nio.charset.Charset

/**
 * Splits CSS file into multiple files to workaround IE9 4095 max selector limit.
 */
class SplitCssTask extends SourceTask {

    private static final int LIMIT = 4095;

    SplitCssTask() {
        description = 'Splits CSS file into multiple files to workaround IE9 4095 max selector limit.'
    }

    @OutputDirectory
    def dest

    String prefix

    File getDest() {
        project.file(dest)
    }

    @TaskAction
    void run() {
        assert prefix

        File originalCssFile = source.singleFile
        logger.info("Splitting CSS file: ${originalCssFile}")

        CascadingStyleSheet originalCss = CSSReader.readFromFile(originalCssFile, Charset.forName("utf-8"), ECSSVersion.CSS30);
        if (originalCss == null) {
            // Most probably a syntax error
            throw new GradleScriptException("Failed to read CSS at ${originalCssFile.name} - please see previous logging entries!");
        }

        int selectorCount = 0
        originalCss.allStyleRules.each { rule ->
            selectorCount += rule.selectorCount
        }

        if (selectorCount >= LIMIT) {
            logger.info "${originalCssFile.name} has ${selectorCount} CSS selectors: splitting file for ${LIMIT} IE9 selector limit"

            Map<String, CascadingStyleSheet> cascadingStyleSheets = [:]
            List<List<ICSSTopLevelRule>> partitionedRules = partitionRules(originalCss.allRules, LIMIT)
            partitionedRules.eachWithIndex { List<ICSSTopLevelRule> rules, int i ->
                CascadingStyleSheet css = new CascadingStyleSheet()
                rules.each { css.addRule(it) }
                String filename = (i == 0 ? "${prefix}.css" : "${prefix}-${i}.css")
                if (i > 0) {
                    cascadingStyleSheets["${prefix}.css".toString()].addImportRule(new CSSImportRule(filename))
                }
                cascadingStyleSheets[filename] = css
            }

            CSSWriter writer = new CSSWriter(ECSSVersion.CSS30, true)
            cascadingStyleSheets.entrySet().each {
                File cssFile = project.file("${getDest()}/${it.key}")

                if (cssFile.exists()) {
                    cssFile.delete()
                }
                writer.writeCSS(it.value, new FileWriter(cssFile))
                logger.info "Wrote split CSS to ${it.key}"
            }
        }
    }

    private List<List<ICSSTopLevelRule>> partitionRules(List<ICSSTopLevelRule> rules, int limit) {
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
}