# eHMP

This guide is for the installation of eHMP on a Unix-based OS. It has not yet been tested on Windows.

### Summary of eHMP

The next evolution of VistA requires a world-class, open, modular, and extensible user experience. eHMP is a new web-based clinical application that migrates the current functionality in VistA’s existing user interface, Computerized Patient Record System (CPRS).

eHMP leverages and integrates the enhanced graphical user interface, standards-based data, and core clinical applications deployed during the User Experience project, Joint Legacy Viewer (JLV), and Health Informatics Initiative (Hi2).


A key objective of the VistA Evolution Program is to enhance cross-Agency (DoD/VA) interoperability by providing all clinically relevant data at the point of care for Veterans. eHMP is targeted to be the replacement for the CPRS application.
eHMP accomplishes this by integrating an enhanced graphical user interface, standards-based data, and integrating core clinical applications.


#### Original Code Source

This project's source code came from [OSEHRA](http://code.osehra.org/journal/journal/view/519)

#### Summary of major changes
* GT.M support
* Removed terminology
* Minimized needed VM's to two
* Added Vagrant installer

#### Screenshots and Documents
Screenshots of eHMP-UI, as well as additional documents can be found in the `docs` directory.


### Configuration
1. Install VISTA and KIDS Builds.
   1. Directions are in: `docs/KIDS_builds.md` Follow those steps before moving on to the following steps
   2. In the Vista Vagrantfile comment out all the forwarded ports and create a private network by adding this line:
      `config.vm.network :private_network, ip: "192.168.33.10"`
   3. Reload Vagrant and ssh in:
      ```
      vagrant reload
      vagrant ssh
      sudo su - osehra
      ```

   4. Delete and replace XUSRB1.m to contain the correct cipher hash. 
      ```
      cd /home/osehra/r
      sudo rm -f XUSRB1.m
      wget https://github.com/OSEHRA/VistA-M/raw/d0c8aac7ba36da048f69a2db8e453e06577480d5/Packages/Kernel/Routines/XUSRB1.m
      ```

   5. Configure Robert Alexander to have access to eHMP on the OSEHRA VistA VM:
      * `mumps -dir`  
      * `S DUZ=1 D Q^DI`
      * `ENTER` Note: This must be typed out
      * `NEW PERSON`
      * `SECONDARY MENU OPTIONS`
      * `<ENTER>`
      * `<ENTER>`
      * `alex`
      * `hmp ui context`
      * `Yes`
      * `<ENTER>`
      * `<ENTER>`
      * `<ENTER>`
      * `<ENTER>`
      * `H`

2. Install and Configure JDS on same VM as VISTA
   1. Copy the JDS Instance script `JDS/createJDSinstance.sh` into the mounted vagrant folder of the VISTA VM.
      ```
      cd ~/Development
      cp eHMP/JDS/createJDSinstance.sh /VistA/Scripts/Install
      ```

   2. Clone JDS into the mounted vagrant folder for VISTA.
      ```
      cd /VistA/Scripts/Install
      git clone https://github.com/KRMAssociatesInc/JDS-GTM.git
      ```

   3. Vagrant ssh into the VISTA VM
      ```
      cd Ubuntu
      vagrant ssh
      ```

   4. Run the createJDSinstance.sh script that is in the mounted Vagrant folder. You must supply an instance name. We named ours jds.
      `sudo ./createJDSinstance.sh -i jds`
   5. Type: `sudo cp /vagrant/JDS-GTM/*.m /home/jds/r`
   6. Type: `sudo chown jds:jds /home/jds/r/*.m`
   7. Type: `sudo chmod ugo-x /home/jds/r/*.m`
   8. Type: `sudo chmod g+w /home/jds/r/*.m`
   9. Run `sudo su - jds`
   10. Run `source etc/env`
   11. Run `mumps -dir` This will open a prompt
   12. Type `D FULLRSET^VPRJ`. JDS should now be  (you may see errors appear in the terminal - these can  be ignored since they are protected and only for CACHE)
   13. To verify JDS is running, run the following curl command. If JDS is okay, you should see this JSON response `{"status":"running"}`
      ```
      curl -X GET http://192.168.33.10:9080/ping
      ```
   14. Exit out of the VM, type `Exit`

3. Configuring Vx-Sync & Running Operational Data Sync
   1. Switch to the eHMP directory `cd ~/Development/eHMP`
   2. Install vagrant-berkshelf: `vagrant plugin install vagrant-berkshelf`
   3. Install vagrant-omnibus: `vagrant plugin install vagrant-omnibus`
   4. Install chef-dk: https://downloads.chef.io/chef-dk/
   5. Start vagrant and ssh to the vm
      ```
      vagrant up
      vagrant ssh
      ```

   6. (Optional if local changes were done to Vagrantfile) Modify line 2 in `ehmp/product/production/vx-sync/worker-config.json` to reflect the ehmp VM's IP
   Lines 15-28 tell VxSync where VistA is and what credentials are needed.
          Lines 589-594 tell VxSync where JDS is.
          Ensure these lines all have the correct values.
   7. Run `cd /vagrant/ehmp/product/production/vx-sync`
   8. Run `sudo npm install`
   9. Run `mkdir logs`
   10. Run `./scripts/startVxSync-parallel.sh`
   11. Run `ps aux |grep node |grep -v grep` to ensure VX-Sync processes are running - you should see    beanstalk and more than a couple of subscriberHost and
          a couple of endpoints
   12. Run `node tools/rpc/rpc-unsubscribe-all.js --host 192.168.33.10 --port 9430` to make sure all subscriptions are reset
   13. Run a get request with curl or another rest client against VX-Sync. The IP should be the IP of the eHMP VM. If all went well you should see a 201 response.
      ```
      curl -I http://192.168.33.12:8088/data/doLoad?sites=34C5
      ```
   14. To check if the operational data sync completed, check the Operational Data Sync status.
          GET http://192.168.33.10:9080/statusod/34C5
          If the Operational Data Sync completed successfully you should see a long JSON response multiple `"syncCompleted": true`
   15. VxSync is now connected to JDS and VistA.

4. Configuring RDK
   1. On the eHMP Vm switch to RDK directory, `cd /vagrant/rdk/product/production/rdk`
   2. Run `sudo npm install`
   3. (Optional) Modify config/config.js (if you use something outside of the configuration specified in this document)
   4. (Optional) There are two VistA sites listed; remove the second one and modify the first to match the one you setup.
   5. The OSEHRA VistA division can be set to '6100'
   6. (Optional) Find the `hmpServer: ` block and update it to point to the VistA instance.
   7. (Optional) Find the `vxSyncServer: ` block and update it to point to the VM VxSync is running on.
   8. (Optional) Find the `generalPurposeJdsServer:` and `jdsServer:` block to update to point to the Vista/JDS VM
   9. After saving the config, to start RDK run `./run.sh --config config/config.js`
   10. There will be a lot of output, the key is the health metrics. All of them should come as success except for MVI and Solr.

5. Configuring ADK and UI
   1. Go to ADK directory on the VM, `cd /vagrant/adk/product/production/`
   2. Modify ADK's app.json - The attribute resourceDirectoryPath should point to the ip address of RDK: 192.168.33.12:8888.
   3. Run the following commands to install necessary packages:
      ```
      sudo apt-get install ruby-full -y
      sudo add-apt-repository ppa:cwchien/gradle
      sudo apt-get update
      sudo apt-get install gradle-1.11
      sudo apt-get install git -y
      sudo gem install compass
      sudo gem install breakpoint -v 2.5
      sudo npm install -g bower
      sudo npm install -g bower-installer
      sudo npm install -g grunt
      sudo npm install
      grunt compass
      ```

   9. Fix npm permissions: `sudo chown -R vagrant:vagrant /home/vagrant/.npm`
   10. Move up a directory: `cd /vagrant/adk/product/`
   11. Run `gradle clean test grunt_deploy`
      This will build adk to `/vagrant/adk/product/production/build/adk.tgz`
   12. Change to ehmp-ui directory: `cd /vagrant/ehmp-ui/product/production`
   13. Modify eHMP-UI's app.json - The attribute resourceDirectoryPath should point to the ip address of RDK: 192.168.33.12:8888.
   14. Move up a directory `cd /vagrant/ehmp-ui/product/`
   15. Run `gradle clean test zipEhmpuiApp`
      This will build adk to `/vagrant/ehmp-ui/product/build/ehmp-ui-x.x.x.zip`
   16. Install NginX: `sudo apt-get install nginx -y`
   17. Type `cd /usr/share/nginx/www`
   18. Type `sudo rm *.html`
   18. Type `sudo tar xvzf /vagrant/adk/product/production/build/adk.tgz`
   19. Type `sudo mkdir app && cd app`
   20. Type `sudo unzip /vagrant/ehmp-ui/product/build/ehmp-ui-1.2.0.?.zip`
   21. Type `cd ..`
   22. Fix the permissions `sudo chown -R www-data:www-data .`
   23. Start nginx: `sudo service nginx start`
   24. If your webserver is running, as well as the rest of the infrastructure (RDK, VxSync, JDS, VistA), you may open EHMP in your browser and login.
   25. The user login must have ehmp-ui context access in VistA. access: fakedoc1 verify: 1Doc!@#$

### Troubleshooting
The following endpoints can be helpful in troubleshooting the connection of VxSync, JDS, and VistA.
* Detailed stats of jobs in Beanstalk queue: [http://192.168.33.12:9999/beanstalk/stats-tube/]
* To view the Job's queue inside VistA to see if any are running or have run:
  1. In the Vista prompt type `s DUZ=1 D ^XUP`
  2. `hmpmgr`
  3. `mon`
  4. `hmp`
  5. Press enter to refresh.

  * If either JDS or VistA are redeployed or cleared (by typing D FULLRSET^VPRJ in JDS) VistA remembers the subscriptions that were there previously, you will need to reset all subscriptions to sync operational data or patients. To reset all subscriptions on the eHMP VM type `cd /vagrant/ehmp/vx-sync` then run `node tools/rpc/rpc-unsubscribe-all --host 192.168.33.10 --port 9430`
