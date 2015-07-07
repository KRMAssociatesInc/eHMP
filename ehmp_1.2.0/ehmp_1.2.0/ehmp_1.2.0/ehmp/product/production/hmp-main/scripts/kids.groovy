import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.va.hmp.vista.rpc.RpcTemplate;
import gov.va.hmp.vista.rpc.broker.conn.BrokerConnectionFactory;

RpcTemplate rpcTemplate = new RpcTemplate(new BrokerConnectionFactory());
String     host = project.properties['kids.host'];
String     port = project.properties['kids.port'];
String   access = project.properties['kids.accessCode'];
String   verify = project.properties['kids.verifyCode'];

String  version = project.version;
String sVersion = version.substring(version.indexOf('S'));

List  filenames = [];
filenames << project.properties['kids.file.prefix'] + sVersion + project.properties['kids.file.suffix']
filenames = filenames.collect { filename ->
    filename.replace(' ' as char, '_' as char).replace('-' as char, '_' as char);
}

project.properties['kids.finalNames'] = filenames.join(','); // all filenames in comma-separated list so wagon-maven-plugin can copy them via SSH

// individual files and paths so maven-build-helper can attach the individual files to the build and upload them to nexus
project.properties['kids.file.finalName'] = filenames[0];
project.properties['kids.file.finalPath'] = project.properties['kids.path'] + filenames[0];

List buildNames = project.properties['kids.buildNames'].split(',');
List buildList = [];
	buildNames.eachWithIndex{ name, i ->
		Map map =[:];
		map.put('buildName', name);
		map.put('defaultFileName', filenames.get(i));
		buildList.add(map);
	}

Map params = ['build': buildList,
    'defaultPath': project.properties['kids.path'],
    'hmpVersion': version
];

ObjectMapper mapper = new ObjectMapper();
log.info("Build Parameters: " + mapper.writerWithDefaultPrettyPrinter().writeValueAsString(params));
String url = "vrpcb://${access};${verify}@${host}:${port}/VPRZ TOOL MAKE BUILD/VPRZ TOOL MAKE BUILD"
log.info("Build URL: " + url);
try {
    String line = "=================================================================";
    String jsonString = rpcTemplate.executeForString(url, params);
    JsonNode json = mapper.readTree(jsonString);

    if (json.get("success").asBoolean()) {
        log.info(line);
        log.info("KIDS build successfully created:\n" + mapper.writerWithDefaultPrettyPrinter().writeValueAsString(json.get("buildInfo")));
        log.info(line);
    } else {
        StringBuilder sb = new StringBuilder(5000);
        JsonNode error = json.get("error");
        sb.append(line);
        sb.append("\nError Type: " + error.get("type").asText() + "\n");
        sb.append("Build Name: " + error.get("build").asText() + "\n");
        for (JsonNode node : error.get("report")) {
            sb.append(node.asText() + "\n");
        }
        sb.append(line);
        fail(sb.toString());
    }

} catch (Throwable t) {
    fail("\nUnable to create KIDS build", t);
} finally {
    try {
        rpcTemplate.destroy();
    } catch (Exception e) {
        fail("Exception destroying RpcTemplate", e);
    }
}