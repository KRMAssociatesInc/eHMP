# eHMP

### Configuration
1. Install VISTA and KIDS Builds. 
   1. Directions are in: `docs/KIDS_builds.md`
   2. In the Vista Vagrantfile comment out all the forwarded ports and create a private network by adding this line `config.vm.network :private_network, ip: "192.168.33.10"`
2. Install and Configure JDS on same VM as VISTA
   a. Copy the JDS Instance script `JDS/createJDSinstance.sh` into the mounted vagrant folder of the VISTA VM. 
   b. Clone JDS into the mounted vagrant folder for VISTA. JDS is here [https://github.com/KRMAssociatesInc/JDS-GTM]
   c. Vagrant ssh into the VISTA VM `vagrant ssh`
   d. Run the createJDSinstance.sh script that is in the mounted Vagrant folder. You must supply an instance name. `./createJDSinstance.sh -i jds` We named ours jds. 
   e. Copy the contents of JDS repository "JDS-GTM" into `/home/jds/r`    
   f. Run `sudo su - jds` 
   g. Run `source etc/env`
   h. Run `mumps -dir` This will open a prompt
   i. Type `FULLRSET^VPRJ` JDS should now be running



