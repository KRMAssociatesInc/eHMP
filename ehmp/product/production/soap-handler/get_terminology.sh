pushd ~/Projects/vistacore/ehmp/product/production/
	mkdir -p -- "terminology/src"
	curl -o terminology/lncdb.zip "https://dl.vistacore.us/nexus/service/local/artifact/maven/content?r=filerepo&g=gov.va.hmp&a=termdb&c=lncdb&v=LATEST&e=zip"
	curl -o terminology/drug.zip "https://dl.vistacore.us/nexus/service/local/artifact/maven/content?r=filerepo&g=gov.va.hmp&a=termdb&c=drugdb&v=LATEST&e=zip"
	curl -o terminology/jlv.zip "https://dl.vistacore.us/nexus/service/local/artifact/maven/content?r=filerepo&g=gov.va.hmp&a=termdb&c=jlvdb&v=LATEST&e=zip"
	unzip terminology/lncdb.zip -d terminology/src
	unzip terminology/drug.zip -d terminology/src
	unzip terminology/jlv.zip -d terminology/src
	mv terminology/src/termdb-*-lncdb/ terminology/src/lncdb
	mv terminology/src/termdb-*-drugdb/ terminology/src/drug
	mv terminology/src/termdb-*-jlvdb/ terminology/src/jlv
popd
