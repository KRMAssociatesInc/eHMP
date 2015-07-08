def env = System.getenv()

if(env['RDK_MOCK_IP']) {
  def fileName = "app.json"
  def ip = env['RDK_MOCK_IP']

  def regex = /\d+.\d+.\d+.\d+/


  File fi = new File(fileName);
  if(!fi.exists()) {
    System.out.println("File doesn't exist");
  }
  else {
    def fileText = fi.getText('UTF-8');
	fi.setText(fileText.replaceAll(regex, ip));
  }
}
