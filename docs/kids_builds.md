Kids Builds Installation
========================

1) Start by downloading the OSEHRA VistA git repository and installing VistA:
```
https://github.com/OSEHRA/VistA/blob/master/Documentation/Install/Vagrant.rst
```

2) Move the kids files to the server once finished installing.  Use the shared folder for the VistA Ubuntu box.  Copy the open EHMP directory
```
mkdir VistA/Scripts/Install/Ubuntu/VistA
cp ehmp/dependencies/VISTA/* VistA/Scripts/Install/Ubuntu
```

3) Next SSH into the system and copy the files to root
```
vagrant ssh
cp /vagrant/Ubuntu/VistA/*.KID /home/osehra
sudo chown osehra:osehra /home/osehra/*.KID
```
4) Next the files must be converted to run in a unix environment, this can be done with the following steps below.  Do it for all of the files.
```
sudo su - osehra
dos2unix *.KID
```
Note: repeat this step until all files are converted

5) Get a Mumps prompt
Type:
```
mumps -dir
```

6) Once logged in you should now see the prompted has changed to OSEHRA>, this means that you’re logged into the GT.m system.

7) We’ll navigate to the EVE menu, start by entering
```
S DUZ=1  
D ^XUP
```

8) You’ll now be prompted to select an option menu, type
```
XPD MAIN
```

9) Go to the KIDS Installation Menu
```
Install
```

10) There only 2 options on this menu that will be used:  1 Load A Distribution and 6 Install Packages

11) Select 1 Load A Distribution, this option will ask you to provide the path to the KIDS file, if directions were followed above, it’ll be /home/osehra/<kids file name>.KID
 WARNING: Follow the order in which to install kids builds, it’s located in the base EHMP directory, under a file called eHMP_build.pdf (you can skip all builds after HMP_2-0.KID as they are included with HMP_2-0.KID)
 ```
 1
/home/osehra/<kids file name>.KID
 ```

12) Note: if you receive errors when attempting to load the kids file, it could be due them being loaded in the incorrect format(Refer to step 4). You can use dos2unix program to convert these files.

13) Once loaded, go to 6 Install Packages, Type <space bar><Enter> This will recall the last entry for you or you can type part of the Install Name that is printed after loading the distribution in step 14.
```
6
<space bar><enter>
```

14) Take all defaults except when asked to rebuild menu entries and then type y or yes. Press Enter/Return until you get a message saying it’s been installed.

15) Repeat steps 14 to 17 until all files are uploaded.

16) Press enter until you reach the OSEHRA> prompt then type H to quit back to the linux prompt
