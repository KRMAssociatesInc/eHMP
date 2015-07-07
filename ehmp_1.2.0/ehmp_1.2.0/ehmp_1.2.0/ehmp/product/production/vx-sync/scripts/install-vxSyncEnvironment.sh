#!/bin/sh

#LibreOffice install script
set -e
set installDir = $HOME/Downloads/

if [ -e /Applications/LibreOffice.app ]; then
	echo "LibreOffice already installed"
else
	echo "Downloading LibreOffice"
	curl -o $installDir/LibreOffice.dmg http://mirror.clarkson.edu/tdf/libreoffice/stable/4.4.0/mac/x86_64/LibreOffice_4.4.0_MacOS_x86-64.dmg
	echo "Installing LibreOffice"
	hdiutil attach -nobrowse -noautoopen $installDir/LibreOffice.dmg
	cp -R -v /Volumes/LibreOffice/LibreOffice.app /Applications/LibreOffice.app
	echo "Cleaning up install files"
	hdiutil detach /Volumes/LibreOffice/
	rm $installDir/LibreOffice.dmg
	echo "LibreOffice installation complete"
fi


#Node install script

nodeInstalled=$(brew list | grep 'node')
if [ -z "$nodeInstalled" ]; then
	echo "installing node via brew"
	brew install node
	echo "node installation complete"
else
	echo "node already installed"
fi



#Beanstalk install script

beanstalkInstalled=$(brew list | grep 'beanstalk')
if [ -z "$beanstalkInstalled" ]; then
	echo "installing beanstalk via brew"
	brew install beanstalk
	echo "beanstalk installation complete"
else
	echo "beanstalk already installed"
fi

echo "installations complete"