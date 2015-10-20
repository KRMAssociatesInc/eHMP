package us.vistacore.vxsync.config;

public class H2Configuration {
	private String jlvJdbc;
	private String lncJdbc;
	private String drugJdbc;
	private String lncLucene;
	private String drugLucene;

	public String getJlvJdbc() {
		return jlvJdbc;
	}

	public void setJlvJdbc(String jlvJdbc) {
		this.jlvJdbc = jlvJdbc;
	}

	public String getLncJdbc() {
		return lncJdbc;
	}

	public void setLncJdbc(String lncJdbc) {
		this.lncJdbc = lncJdbc;
	}

	public String getDrugJdbc() {
		return drugJdbc;
	}

	public void setDrugJdbc(String drugJdbc) {
		this.drugJdbc = drugJdbc;
	}

	public String getLncLucene() {
		return lncLucene;
	}

	public void setLncLucene(String lncLucene) {
		this.lncLucene = lncLucene;
	}

	public String getDrugLucene() {
		return drugLucene;
	}

	public void setDrugLucene(String drugLucene) {
		this.drugLucene = drugLucene;
	}
}
