package us.vistacore.vxsync.dod;


public class JMeadowsConfig
{
	private String retry;
	private String path;

	private String url;
	private int timeoutMS;
	private String userName;
	private String userIen;
	private String userSiteCode;
	private String userSiteName;

	private String parallelismmin;
	private String dodDocServiceEnabled;

    public String getRetry() {
		return retry;
	}

	public void setRetry(String retry) {
		this.retry = retry;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getParallelismmin() {
		return parallelismmin;
	}

	public void setParallelismmin(String parallelismmin) {
		this.parallelismmin = parallelismmin;
	}

	public String getDodDocServiceEnabled() {
		return dodDocServiceEnabled;
	}

	public void setDodDocServiceEnabled(String dodDocServiceEnabled) {
		this.dodDocServiceEnabled = dodDocServiceEnabled;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public int getTimeoutMS() {
		return timeoutMS;
	}

	public void setTimeoutMS(int timeout) {
		timeoutMS = timeout;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserIen() {
		return userIen;
	}

	public void setUserIen(String userIen) {
		this.userIen = userIen;
	}

	public String getUserSiteCode() {
		return userSiteCode;
	}

	public void setUserSiteCode(String userSiteCode) {
		this.userSiteCode = userSiteCode;
	}

	public String getUserSiteName() {
		return userSiteName;
	}

	public void setUserSiteName(String userSiteName) {
		this.userSiteName = userSiteName;
	}

}
