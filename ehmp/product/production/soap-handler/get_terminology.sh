pushd ~/Projects/vistacore/ehmp/product/production/
	mkdir -p -- "terminology/src"
	curl -o terminology/terminology.zip https://nexus.vistacore.us/repositories/filerepo/us/vistacore/ehmp/terminology/0.0.1/terminology-0.0.1.zip
	unzip terminology/terminology.zip -d terminology/src
popd