package gov.va.cpe.vpr.sync.vista;

public interface DaoUpdateListener {
	
	public boolean isInterested(String domain, String pid);
	public void objectUpdated(String domain, String pid);

}
