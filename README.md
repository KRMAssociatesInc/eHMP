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
   9. Type `FULLRSET^VPRJ`. JDS should now be running
   10. To verify JDS is running, open the following URL: `http://192.168.33.10:9080/ping` If JDS is okay, you should see this JSON response `{"status":"running"}`
3. Running an Operational Data Sync to verify JDS & Vista are talking to VxSync
   1. If you are using different private IP's you will have to modify lines 2 and 28 in `ehmp/product/production/vx-sync/worker-config.json`
   Lines 15-28 tell VxSync where Vista is and what credentials are needed. Lines 589-594 tell VxSync where JDS is. Ensure these lines all have the correct values. 
   2. Next enter this command into VistA: `W $$SYS^HMPUTILS`
   3. Using Postman, run a get query on: `http://192.168.33.12:8088/data/doLoad?sites=34C5` The IP shoudld be the IP on the ehmp VM. 
   If all went well you should see a 201 response. 
   4. To check if the operational data sync completed, run this in postman: `http://192.168.33.10:9080/statusod/34C5'
   If the sync completed successfully you should see a long JSON response multiple `"syncCompleted": true` 
   5. VxSync is now connected to JDS and VistA. 

### Troubleshooting 
The following endpoints can be helpful in troubleshooting the connection of VxSync, JDS, and VistA. 
* Detailed stats of jobs in Beanstalk que: [http://192.168.33.12:9999/beanstalk/stats-tube/]
* To view the Job's que inside VistA to see if any are running or have run: 
  1. In the Vista prompt type `s DUZ=1 D ^XUP`
  2. `hmpmgr`
  3. `mon`
  4. `hmp`
  5. Press enter to refresh. 




