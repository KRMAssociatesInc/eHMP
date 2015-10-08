# eHMP

### Configuration
1. Install VISTA and KIDS Builds. 
   1. Directions are in: `docs/KIDS_builds.md`
   2. In the Vista Vagrantfile comment out all the forwarded ports and create a private network by adding this line `config.vm.network :private_network, ip: "192.168.33.10"`
2. Install and Configure JDS on same VM as VISTA
   1. Copy the JDS Instance script `JDS/createJDSinstance.sh` into the mounted vagrant folder of the VISTA VM. 
   2. Clone JDS into the mounted vagrant folder for VISTA. JDS is here [https://github.com/KRMAssociatesInc/JDS-GTM]
   3. Vagrant ssh into the VISTA VM `vagrant ssh`
   4. Run the createJDSinstance.sh script that is in the mounted Vagrant folder. You must supply an instance name. `./createJDSinstance.sh -i jds` We named ours jds. 
   5. Copy the contents of JDS repository "JDS-GTM" into `/home/jds/r`    
   6. Run `sudo su - jds` 
   7. Run `source etc/env`
   8. Run `mumps -dir` This will open a prompt
   9. Type `FULLRSET^VPRJ` JDS should now be running



