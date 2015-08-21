Kids Builds Installation
========================

1) Start by downloading the OSEHRA VistA git repository and installing VistA:
```
https://github.com/OSEHRA/VistA/blob/master/Documentation/Install/Vagrant.rst
```

2) Move the kids files to the server once finished installing.  Use the shared folder for the VistA Ubuntu box.  Copy the open EHMP directory
```
..\ehmp\dependencies\VISTA to the shared folder.
```

3) Next SSH into the system and copy the files to root
```
vagrant ssh
sudo cp –R /vagrant/VISTA /home/kids
```
4) Next the files must be converted to run in a unix environment, this can be done with the following steps below.  Do it for all of the files.
```
Sudo mkdir /home/kids/converted
Sudo dos2unix -n /home/kids/kids build>.KID /home/kids/converted/kids build>.KID
```
Note: repeat this step until all files are converted

5) Once finished converting the files, type EXIT to leave the vagrant ssh

6) Through a terminal prompt, log into the osehra programmer
```
account: ssh -p 2222 osehraprog@localhost
Password: prog
```

7) Once logged in you should now see the prompted has changed to OSEHRA>, this means that you’re logged into the GT.m system.

8) We’ll navigate to the EVE menu, start by entering
```
S DUZ=1    (This sets the user as user 1 aka the system administrator)
D ^XUP
```
9) You’ll now be prompted to select an option menu, type
```
EVE
```
Select option 1

10. Type prog and press enter to take yourself to the Programmer Options Menu

11. Type KIDS To go to the KIDS Installation menu

12. Type INS to go to the installation menu

13. Once here you can type ?? and you should see a list of options going from 1 to 6.  The only 2

that will be used will be 1 Load A Distribution And 6 Install Packages

14. Select 1 Load A Distribution, this option will ask you to provide the path to the kids file, if

directions were followed above, it’ll be /home/kids/<kids file name>.KID

WARNING: Follow the order in which to install kids builds, it’s located in the base EHMP

directory, under a file called eHMP_build.pdf

15. Note: if you receive errors when attempting to load the kids file, it could be due them being

loaded in the incorrect format(Refer to step 4).  You can use dos2unix program to convert these

files.

16. Once loaded, go to 6 Install Packages, enter ??, this will show you the files that have been

loaded.  Type enough of the loaded file for VistA to recognize the file to be selected.

17. Take all defaults, simply press Enter/Return until you get a message saying it’s been installed.

18. Repeat steps 13 to 17 until all files are uploaded.
