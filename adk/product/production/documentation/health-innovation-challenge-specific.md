::: page-description
# Health Innovation Challenge 2015 - Specific Instructions #
Outlines Tasks and Conventions Specific to developers participating in the 2015 Health Innovation Challenge.
:::

## Setup Instructions ##

There instructions cover the installation, download and configuration of the eHMP UI Application for Apache.

### Setup for OS X ###

- Launch Terminal, located in `/Applications/Utilities/`

- Clone the ehmp-app repo to your user's Sites directory: 
    ```
    cd /Users/<USERNAME>/Sites
    git clone https://github.com/VHAINNOVATIONS/ehmp-app
    ```

    If git is not installed, use the 'Download ZIP' link on `https://github.com/VHAINNOVATIONS/ehmp-app` and extract to `/Users/<USERNAME>/Sites/ehmp-app`.

- Verify the resourceDirectoryPathFetch in `/Users/<USERNAME>/Sites/ehmp-app/app.json`

    Line 6 should look like :
     ```
     "resourceDirectoryPathFetch": "http://54.196.168.222:8888/resourcedirectory",
     ```

- Type the following command : `sudo vim /etc/apache2/httpd.conf`

- Search for the **"Listen:"** section and add the following line after `Listen 80`:

    ```
    Listen 8888
    ```

- Search for **“vhost”** and make sure both lines are uncommented. They will look similar to the following:
    ```
    LoadModule vhost_alias_module libexec/apache2/mod_vhost_alias.so

    Include /private/etc/apache2/extra/httpd-vhosts.conf
    ```

- Type the following command : `sudo vim /etc/apache2/extra/httpd-vhosts.conf`

- Add the following to the end of the file :
    ```
    NameVirtualHost *:8888

    <VirtualHost *:8888>
      DocumentRoot /Users/<USERNAME>/Sites/ehmp-app
      <Directory "/Users/<USERNAME>/Sites/ehmp-app">
          Options Indexes MultiViews
          AllowOverride None
          Order allow,deny
          Allow from all
      </Directory>

        <filesMatch "\.(html|htm|js|css)$">
          FileETag None
          <ifModule mod_headers.c>
             Header unset ETag
             Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
             Header set Pragma "no-cache"
             Header set Expires "Wed, 11 Jan 1984 05:00:00 GMT"
          </ifModule>
        </filesMatch>
      EnableSendfile Off
    </VirtualHost>
    ```

- Next, you will start the web server with the following command : `sudo apachectl start`

- Launch Safari, Chrome, or Firefox and navigate to **“http://127.0.0.1″** to verify the server is running, you will see an “**It Works!**” message
    + You can now visit **http://127.0.0.1:8888** to see the ehmp app.


### Setup for Windows ###

- Download and install apache webserver from

    `https://archive.apache.org/dist/httpd/binaries/win32/httpd-2.2.25-win32-x86-no_ssl.msi`

    Network Domain should be `localhost`. Server Name and Administrator's Email Address can be set to any value. Select the `typical` installation type.

- Clone the ehmp-app repo to your user's home directory:
    ```
    chdir C:\Users\<USERNAME>\
    git clone https://github.com/VHAINNOVATIONS/ehmp-app
    ```

    If git is not installed, use the 'Download ZIP' link on `https://github.com/VHAINNOVATIONS/ehmp-app` and extract to `C:\Users\<USERNAME>\ehmp-app`.

- Verify the resourceDirectoryPathFetch in `C:\Users\<USERNAME>\ehmp-app\app.json`

    Line 6 should look like :
     ```
     "resourceDirectoryPathFetch": "http://54.196.168.222:8888/resourcedirectory",
     ```

- Edit the following file : <br />
    `c:\Program Files (x86)\Apache Software Foundation\Apache2.2\conf\httpd.conf`

- Search for the **"Listen:"** section and add the following line after `Listen 80`:

    ```
    Listen 8888
    ```

- Search for **“vhost”** and make sure both lines are uncommented. They will look similar to the following : <br />
    ```
    LoadModule vhost_alias_module modules/mod_vhost_alias.so

    Include conf/extra/httpd-vhosts.conf
    ```

- Edit the following file : <br />
    `c:\Program Files (x86)\Apache Software Foundation\Apache2.2\conf\extra\httpd-vhosts.conf`

- Add the following to the end of the file :
    ```
    NameVirtualHost *:8888

    <VirtualHost *:8888>
      DocumentRoot c:/Users/<USERNAME>/ehmp-app
      <Directory "c:/Users/<USERNAME>/ehmp-app">
          Options Indexes MultiViews
          AllowOverride None
          Order allow,deny
          Allow from all
      </Directory>

        <filesMatch "\.(html|htm|js|css)$">
          FileETag None
          <ifModule mod_headers.c>
             Header unset ETag
             Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
             Header set Pragma "no-cache"
             Header set Expires "Wed, 11 Jan 1984 05:00:00 GMT"
          </ifModule>
        </filesMatch>
      EnableSendfile Off
    </VirtualHost>
    ```

- Next start or restart the Apache Service, either from the Apache Monitor application in the taskbar, or using the Windows Services panel.

- Launch Safari, Chrome, or Firefox and navigate to **“http://127.0.0.1″** to verify the server is running, you will see an “**It Works!**” message
    + You can now visit **http://127.0.0.1:8888** to see the ehmp app.


### Setup for Linux (Redhat/CentOS) ###

- Install apache webserver : `sudo yum install httpd.x86_64`

- Clone the ehmp-app repo to your httpd home directory: 
    ```
    cd /var/www/
    git clone https://github.com/VHAINNOVATIONS/ehmp-app
    ```

    If git is not installed, use the 'Download ZIP' link on `https://github.com/VHAINNOVATIONS/ehmp-app` and extract to `/var/www/ehmp-app`.

- Verify the resourceDirectoryPathFetch in `/var/www/ehmp-app/app.json`

    Line 6 should look like :
     ```
     "resourceDirectoryPathFetch": "http://54.196.168.222:8888/resourcedirectory",
     ```

- Type the following command : `sudo vim /etc/httpd/httpd.conf`

- Add the following lines to the end of the file :
    ```
    Listen 8888

    Include /etc/httpd/sites-enabled/
    ```

- Type the following command : `sudo vim /etc/httpd/sites-available/ehmp-app.conf`

- Enter the following for the contents of this new file :
    ```
    <VirtualHost *:8888>
      DocumentRoot /var/www/ehmp-app
      <Location />
        Order deny,allow
        Allow from all
      </Location>
        <filesMatch "\.(html|htm|js|css)$">
          FileETag None
          <ifModule mod_headers.c>
             Header unset ETag
             Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
             Header set Pragma "no-cache"
             Header set X-Frame-Options "DENY"
             Header set Expires "Wed, 11 Jan 1984 05:00:00 GMT"
          </ifModule>
        </filesMatch>
      EnableSendfile Off
    </VirtualHost>
    ```

- Type the following command : `sudo ln -s /etc/httpd/sites-available/ehmp-app.conf /etc/httpd/sites-enabled/ehmp-app.conf`

- Next, you will start the web server with the following command : `sudo service httpd start`

- Launch Safari, Chrome, or Firefox and navigate to **“http://127.0.0.1″** to verify the server is running, you will see an “**It Works!**” message
    + You can now visit http://127.0.0.1:8888 to see the ehmp app.



## Getting Started Building an Applet and Screen ##
### Creating a basic Applet ###
- Start by locating the following folder: <br /> `[path-to-project]/ehmp-app/app/applets`
- create a new folder within the _applets directory_ with the new applet name as it's title. <br />([please see naming conventions page for more details on applet naming](./#/adk/conventions#Naming-and-Folder-Structure))
- Within the new folder create a JavaScript file called `applet.js`
- Use the following code as starting point for your new applet:
    ```JavaScript
    define([
        'backbone'
    ], function(Backbone) {
      var HelloWorldAppletView = Backbone.Marionette.ItemView.extend({
          template: _.template('<h1>Hello World!</h1>'),
      });
      var applet = {
          id: "hello_world", //Note: "hello_world" is just a sample appletID
          viewTypes: [{
              type: 'main',
              view: HelloWorldAppletView, //Returns the Marionette View to show
              chromeEnabled: true //optional
          }, ...]
      };
      return applet;
    });
    ```
- Now locate and open the following file: <br />`[path-to-project]/ehmp-app/app/applets/appletsManifest.js`
- Add a new object to the **applets** variable array with the following attributes:
    ```JavaScript
    var applets = [
    ...
    {
        id: 'hello_world',
        title: 'Hello World Sample Applet',
        showInUDWSelection: true //true to show up in User Defined Workspace Carousel
    }
    ...
    ```
> **Congratulations**! You have created your first Applet!
>
> In order to view your new applet in the UI please follow the steps below on how to add your applet to a new screen.

### Creating a basic Screen ###
- Start by locating the following folder: <br /> `[path-to-project]/ehmp-app/app/screens`
- create a new JavaScript within the _screens directory_ with the new screen name as it's title. <br /> example: _HelloWorld.js_
- Use the following code as starting point for your new screen:
    ```JavaScript
    define([], function() {
      var screenConfig = {
          id: 'hello-world',
          contentRegionLayout: 'gridOne',
          applets: [{
              id: 'hello_world',
              title: 'Hello World Applet',
              region: 'center'
          }],
          requiresPatient: true
      };
      return screenConfig;
    });
    ```
- Now locate and open the following file: <br />`[path-to-project]/ehmp-app/app/screens/ScreensManifest.js`
- Add a new object to the **screens** variable array with the following attributes:
    ```JavaScript
    var screens = [];
    ...
    screens.push({
      routeName: 'hello-world', // the screens's id
      fileName: 'HelloWorld' // screen's file name with the file's extension omitted
    });
    ...
    ```
> **Congratulations**! You have created your first Screen!
>
> Now go view your new screen and applet: [http://127.0.0.1:8888/#hello-world](http://127.0.0.1:8888/#hello-world)

<br />

::: definition
### For more help on setting up your first **screen**/**applet**, please visit the ADK's [getting started documentation guide](./#/adk/getting-started#How-to-build-Applets) or one of the documentation links below  ###

:::
<div class="row code-a-thon-specific">
    <div class="col-sm-4">
        <a href="adk/index.md" class="btn numberCircle adk">
            <h4>
                <div class="height_fix"></div>
                <div class="content">ADK</div>
            </h4>
        </a>
        <p>Application Development Kit</p>
    </div>
    <div class="col-sm-4">
        <a href="rdk/index.md" class="btn numberCircle rdk">
            <h4>
                <div class="height_fix"></div>
                <div class="content">RDK</div>
            </h4>
        </a>
        <p>Resource Development Kit</p>
    </div>
    <div class="col-sm-4">
        <a href="vx-api/" class="btn numberCircle vxapi">
            <h4>
                <div class="height_fix"></div>
                <div class="content">VX-API</div>
            </h4>
        </a>
        <p>Vista Exchange API</p>
    </div>
</div>