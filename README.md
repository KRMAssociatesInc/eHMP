# eHMP

### Configuration
1. Install VISTA and KIDS Builds. 
   1. Directions are in: `docs/KIDS_builds.md`
   2. In the Vista Vagrantfile comment out all the forwarded ports and create a private network by adding this line                 `config.vm.network :private_network, ip: "192.168.33.10"`

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
   10. To verify JDS is running, open the following URL: `http://192.168.33.10:9080/ping` If JDS is okay, you should see this        JSON response `{"status":"running"}`

3. Configuring VxSync & Running Operational Sync
   1. In the EHMP Vagrantfile setup a private IP by adding the following line 
      `config.vm.network :private_network, ip: "192.168.33.12"`
   2. Run `Vagrant Up`
   3. Modify lines 2 and 28 in `ehmp/product/production/vx-sync/worker-config.json` to reflect the VM's IP's
      Lines 15-28 tell VxSync where Vista is and what credentials are needed. Lines 589-594 tell VxSync where JDS is. Ensure        these lines all have the correct values. 
   4. In the vx-sync directory start VxSync with `scripts/startVxSync-parallel.sh`
   5. Using Postman, run a get query on: `http://192.168.33.12:8088/data/doLoad?sites=34C5` The IP should be the IP of the          ehmp VM. If all went well you should see a 201 response. 
   6. To check if the operational data sync completed, run this in postman: `http://192.168.33.10:9080/statusod/34C5'
      If the sync completed successfully you should see a long JSON response multiple `"syncCompleted": true` 
   7. VxSync is now connected to JDS and VistA. 

4. Configuring RDK
   1. Navigate to "rdk/product/production"
   2. Run `sudo npm install`
   3. Modify config/config.js 
   4. There are two VistA sites listed; remove the second one and modify the first to match the one you setup. 
   5. Note: The divsion can be set to '1' 
   6. Find the `hmpServer: ` block and update it to point to the VistA instance. 
   7. Find the `vxSyncServer: ` block and update it to point to the VM VxSync is running on. 
   8. Find the `generalPurposeJdsServer:` and `jdsServer:` block to update to point to the Vista/JDS VM
   9. After saving the config, to start RDK run `./run.sh --config config/config.js`
   10. There will be a lot of output, the key is the health metrics. All of them should come as success except for MVI and          Solr. 


5. Configuring ADK and UI 
   1. Modify line 6 of ADK's app.json - This value should point towards the IP address where RDK is running.
   2. UI also has a app.json file that needs modified to point at RDK. 
   3. Install Bower: `sudo npm install -g bower`
   4. Install Bower-Installer `sudo npm install -g bower-installer`
   5. Navigate to adk/product/ and run `gradle clean test grunt_deploy` 
      This will build adk to `adk/product/production/build/adk.tgz`
   6. Navigate to ehmp-ui/product/ and run `gradle clean test zipEhmpuiApp`
      This will build adk to `ehmp-ui/product/build/ehmp-ui-x.x.x.zip`
   7. You will now need to setup a web server of your choice. We went for Nginx. 
   8. In whichever folder will be web accessible, extract the contents of "adk.tgz"
   9. In the same directory create an "app" folder and extract the contents of "ehmp-ui-x.x.x.zip" there. 
   10. If your webserver is running, as well as the rest of the infrastructure (RDK, VxSync, JDS, VistA), you may open EHMP in       your browser and login. 
   11. The user login must have ehmp-ui context access in VistA. {Add further docs regarding this} 

### Troubleshooting 
The following endpoints can be helpful in troubleshooting the connection of VxSync, JDS, and VistA. 
* Detailed stats of jobs in Beanstalk queue: [http://192.168.33.12:9999/beanstalk/stats-tube/]
* To view the Job's que inside VistA to see if any are running or have run: 
  1. In the Vista prompt type `s DUZ=1 D ^XUP`
  2. `hmpmgr`
  3. `mon`
  4. `hmp`
  5. Press enter to refresh. 

* If either JDS or VistA are restarted you will not be able to perform an operation sync. To fix this navigate to Vx-Sync and run `node tools/rpc/rpc-unsubscribe-all --host 192.168.33.10 --port 9430` 



