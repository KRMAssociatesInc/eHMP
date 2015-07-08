package gov.va.cpe.vpr.sync.vista;

import java.util.Date;

public class PrimarySiteMonitor 
{
	private int onExceptionRetryCount;
	private boolean dataStreamDisabled=false;
	private Date dataStreamDisabledTime;
	private long startupWaitTime;


	public int getOnExceptionRetryCount() {
		return onExceptionRetryCount;
	}
	public void setOnExceptionRetryCount(int retryCount) {
		onExceptionRetryCount = retryCount;
	}
	public boolean isDataStreamDisabled() {
		return dataStreamDisabled;
	}
	public void setDataStreamDisabled(boolean disabled) {
		this.dataStreamDisabled = disabled;
	}
	public Date getDataStreamDisabledTime() {
		return dataStreamDisabledTime;
	}
	public void setDataStreamDisabledTime(Date time) {
		this.dataStreamDisabledTime = time;
	}
	public long getStartupWaitTime() {
		return startupWaitTime;
	}
	public void setStartupWaitTime(long startupWaitTime) {
		this.startupWaitTime = startupWaitTime;
	}
}
