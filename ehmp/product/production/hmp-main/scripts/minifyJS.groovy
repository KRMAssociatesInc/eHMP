import com.yahoo.platform.yui.compressor.JavaScriptCompressor
import org.mozilla.javascript.ErrorReporter

def p = ~/.*\.js/

Map<String, Collection<String>> requiresMap = new HashMap<String, Collection<String>>();
Collection<String> addedClasses = new ArrayList<String>();
TreeSet<String> badClasses = new ArrayList<String>();
Map<String, String> classToFileMap = new HashMap<String, String>();
Map<String, String> classToTextMap = new HashMap<String, String>();
Map<String, File> classToFSFileMap = new HashMap<String, File>();

System.out.println("Collecting JavaScript class files...")

new File(project.basedir, "src/main/js").eachFileRecurse {
    if(it.name.endsWith(".js") && !it.name.startsWith("hmp-all") && !it.name.startsWith("ext-theme-hmp")) {
        String fileName = it.getName();
        FileInputStream fis = new FileInputStream(it);
        BufferedReader br = new BufferedReader(new InputStreamReader(fis));
        String txt = it.text;
        List<String> reqList = new ArrayList<String>();
        String className = null;
        String etxt = txt.toString();
        while(etxt.contains("Ext.define(") && className==null) {
            String dtxt = etxt.substring(etxt.indexOf("Ext.define(")+11).trim();
            char strChar = dtxt.charAt(0);
            dtxt = dtxt.substring(1);
            dtxt = dtxt.substring(0, dtxt.indexOf(""+strChar));
            if(dtxt.toLowerCase().endsWith(fileName.substring(0, fileName.indexOf(".js")).toLowerCase())) {
                className = dtxt;
            } else {
                etxt = etxt.substring(etxt.indexOf("Ext.define(")+11);
            }
        }
        def depFields = ['extend','model','requires','mixins'];
        def termMap = ['[':']','{':'}',"'":"'",'"':'"'];
        depFields.each {
            if(txt.contains(it)) {
                int itl = it.length();
                String txtPart = txt.substring(txt.indexOf(it)+itl).trim();
                if(txtPart.startsWith(":")) {
                    txtPart = txtPart.substring(1).trim();
                    String termStr = txtPart.substring(0,1);
                    if(termStr.equals("'") || termStr.equals("\"")) {
                        txtPart = txtPart.substring(1);
                        txtPart = txtPart.substring(0, txtPart.indexOf(termMap[termStr]));
                        if(txtPart!=null && !txtPart.isEmpty() && !txtPart.equals(className) && !txtPart.startsWith("Ext")) {
                            reqList.add(txtPart);
                        }
                    } else if(termStr.equals("[") || termStr.equals("{")) {
                        txtPart = txtPart.substring(1);
                        txtPart = txtPart.substring(0, txtPart.indexOf(termMap[termStr]));
                        String[] bits = txtPart.split(",");
                        for(String bit: bits) {
                            String bitt = bit.trim();
                            if(bitt.indexOf(":")>-1) {
                                bitt = bitt.substring(bitt.indexOf(":")+1).trim();
                            }
                            if(bitt.length()>2) {
                                bitt = bitt.substring(1, bitt.length()-1);
                                if(!bitt.startsWith("Ext") && !txtPart.equals(className)) {
                                    reqList.add(bitt);
                                }
                            } else {
                                System.err.println("WARNING: Empty '"+it+"' dependency (extra comma or empty braces) found in file "+fileName);
                            }
                        }
                    }
                }
            }
        }


        requiresMap.put(className, reqList);
        classToFileMap.put(className, fileName);
        classToTextMap.put(className, it.text);
        classToFSFileMap.put(className, it);
    }
}

int lastCountAC = 0;
boolean logDependencies = false;
TreeSet<String> failedFiles = new TreeSet<String>();

int pass = 1;

for(;requiresMap.keySet().size()>addedClasses.size();) {
    int countAC = addedClasses.size();
    if(countAC!=0 && countAC == lastCountAC) {
        System.out.println("Unable to further resolve dependencies! Oh no!");
        logDependencies=true;
    }
    lastCountAC = countAC;
    StringBuffer counts = new StringBuffer();
    counts.append(countAC.toString());
    counts.append("/");
    counts.append(requiresMap.keySet().size());
    System.out.println("Pass #"+(pass++)+": Resolved count: "+counts.toString());
    for(String clz: requiresMap.keySet()) {
        if(!addedClasses.contains(clz)) {
            boolean found = false;
            ArrayList<String> required = requiresMap.get(clz);
            for(String s: required) {
                if(!addedClasses.contains(s)) {
                    if(!requiresMap.keySet().contains(s)) {
                        badClasses.add(s);
                    }
                    if(logDependencies) {
                        if(!requiresMap.keySet().contains(s)) {
                            failedFiles.add(s);
                        }
                    }
                    found = true;
                }
            }
            if(!found) {
                addedClasses.add(clz);
            }
        }
    }
    if(logDependencies) {
        break;
    }
}
if(!logDependencies) {

    // YUI method
//    System.out.println("Correct Ext classload dependency order:")
    StringBuffer sbuff = new StringBuffer();
    for(String s: addedClasses) {
//        System.out.println("\t"+classToFileMap.get(s));
        sbuff.append(classToTextMap.get(s));
        sbuff.append('\n')
    }
    StringReader sread = new StringReader(sbuff.toString());

    ErrorReporter errorReporter = new org.mozilla.javascript.DefaultErrorReporter();
    JavaScriptCompressor jcomp = new JavaScriptCompressor(sread, errorReporter);
    File outputDir;
    File outputMinifiedFile;
    File outputAllFile;
    try {
        outputDir = new File(project.build.directory+"/"+project.build.finalName+"/js/");
        if(!outputDir.exists()) {
            outputDir.mkdirs();
        }
        outputAllFile = new File(outputDir, "hmp-all.js");
        if(!outputAllFile.exists()) {
            outputAllFile.createNewFile();
        }
        outputMinifiedFile = new File(outputDir, "hmp-all.min.js");
        if(!outputMinifiedFile.exists()) {
            outputMinifiedFile.createNewFile();
        }
    } catch(Exception){
        File f = new File(project.basedir, "src/main/js/hmp-all.js");
        if(f.exists()) {
            f.delete();
        }
        f.createNewFile()

        f = new File(project.basedir, "src/main/js/hmp-all.min.js");
        if(f.exists()) {
            f.delete();
        }
        f.createNewFile();
    };

    System.out.println("Writing out to file: "+outputAllFile.canonicalPath);
    outputAllFile.write(sbuff.toString())

    System.out.println("Writing out to file: "+outputMinifiedFile.canonicalPath);
    FileWriter fileWriter = new FileWriter(outputMinifiedFile);
    jcomp.compress(fileWriter,80,false,false,true,true);
    fileWriter.flush();
    fileWriter.close();

} else {
    System.err.println("Couldn't add these files:")
    TreeSet<String> req = new TreeSet<String>();
    for(String s: requiresMap.keySet()) {
        if(s!=null) {req.add(s);}
    }
    for(String s: addedClasses) {
        if(s!=null) {req.remove(s);}
    }
    for(String s: req) {
        System.err.println(s+" = "+classToFileMap.get(s));
        for(String rs: requiresMap.keySet()) {
            if(requiresMap.get(rs).contains(s)) {
                System.err.println("\tRequired by: "+rs);
            }
        }
    }
    if(badClasses.size()>0) {
        System.err.println("Hey, what's the big idea! These classes can't be found:");
        for(String s: badClasses){
            System.err.println("\t"+s);
        }
    }
    throw new RuntimeException("Could not create minified JavaScript.");
}

