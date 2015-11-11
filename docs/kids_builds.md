Kids Builds Installation
========================

Prerequisites
-------------
 * Vagrant v1.72 - [Link](https://www.vagrantup.com/downloads.html)

 * VirtualBox 4.32 - [Link](http://download.virtualbox.org/virtualbox/4.3.2/)


Installation 
------------

1) Start by downloading the OSEHRA VistA git repository and installing VistA:
```
https://github.com/OSEHRA/VistA/blob/master/Documentation/Install/Vagrant.rst
```

2) Download EHMP git repo and move the kids files to the server once finished installing.  Use the shared folder for the VistA Ubuntu box.  Copy the open EHMP directory

.. parsed-literal::

    ~/Development$ git clone https://github.com/KRMAssociatesInc/eHMP.git
    ~/Development$ mkdir VistA/Scripts/Install/Ubuntu/VistA
    ~/Development$ cp eHMP/dependencies/VISTA/* VistA/Scripts/Install/Ubuntu/VistA


3) Next SSH into the system and copy the files to root
```
cd VistA/Scripts/Install/Ubuntu
vagrant ssh
cp /vagrant/Ubuntu/VistA/*.KID /home/osehra
sudo chown osehra:osehra /home/osehra/*.KID
```
4) Next the files must be converted to run in a unix environment, this can be done with the following steps below.  Do it for all of the files.
```
sudo su - osehra
dos2unix *.KID
```

5) Get a Mumps prompt
Type:
```
mumps -dir
```

6) Once logged in you should now see the prompted has changed to OSEHRA>, this means that you’re logged into the GT.m system.

7) We’ll navigate to the EVE menu, start by entering: 

Note: These commands are case-sensitive. Enter them in upper-case
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

Note: Steps 11-14 must be repeated for each KID file. 
These are the files that must be installed, in this order: 
* HMPEJK_US5647_1.KID
* TIU_TEMP_1.KID
* USR_TEMP_1.KID
* HMPM_2-0.KID
* HMP_2-0.KID

11) Select 1 Load A Distribution, this option will ask you to provide the path to the KIDS file, if directions were followed above, it’ll be /home/osehra/<kids file name>.KID

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

15) Repeat steps 11 to 14 until all files are uploaded.

16) Press enter until you reach the OSEHRA> prompt then type H to quit back to the linux prompt
