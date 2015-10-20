package us.vistacore.vxsync.term;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import us.vistacore.vxsync.config.H2Configuration;
import us.vistacore.vxsync.term.hmp.H2TermDataSource;
import us.vistacore.vxsync.term.hmp.LuceneSearchDataSource;
import us.vistacore.vxsync.term.hmp.TermLoadException;
import us.vistacore.vxsync.term.jlv.JLVHddDao;
import us.vistacore.vxsync.term.jlv.JLVHddDao.MappingType;
import us.vistacore.vxsync.term.jlv.JLVMappedCode;

import com.codahale.metrics.annotation.Timed;

@Path("/term")
public class TerminologyService {

	private static final Logger LOG = LoggerFactory.getLogger(TerminologyService.class);
	private static JLVHddDao dao;
	private static LuceneSearchDataSource lncdb;
	private static LuceneSearchDataSource drugdb;
	
	public TerminologyService() {
	}
	
	public TerminologyService(String template, String defaultName) {
		// TODO Auto-generated constructor stub
	}

	@Path("/jlv")
	@GET
	@Produces("application/json")
	@Timed
	public JLVMappedCode jlvTranslate(@QueryParam("type") MappingType type,
									  @QueryParam("code") String code) {
		LOG.info("Translating JLV type " + type.toString() + " and code " + code);
		try {
			if(dao != null) {
				JLVMappedCode mapped = dao.getMappedCode(type, code);
				return mapped;
			} else {
				LOG.warn("Could not translate jlv code because the database is not configured");
			}
		} catch (TermLoadException e) {
			LOG.error("Could not translate JLV " + type.toString() + " and code " + code, e);
		}
		return null;
	}


	@Path("/jlvList")
	@GET
	@Produces("application/json")
	@Timed
	public List<JLVMappedCode> jlvTranslateList(@QueryParam("type") MappingType type,
									  @QueryParam("code") String code) {
		LOG.info("Translating JLV list type " + type.toString() + " and code " + code);
		try {
			if(dao != null) {
				List<JLVMappedCode> mapped = dao.getMappedCodeList(type, code);
				return mapped;
			} else {
				LOG.warn("Could not translate jlv code because the database is not configured");
			}
		} catch (TermLoadException e) {
			LOG.error("Could not translate JLV " + type.toString() + " and code " + code, e);
		}
		return null;
	}
	
	
	@Path("lnc")
	@GET
	@Produces("application/json")
	@Timed
	public Object lncTranslate(@QueryParam("concept") String conceptId) {
		LOG.info("Translating lnc concept "+ conceptId);
		if(lncdb != null) {
			return lncdb.getConceptData(conceptId);
		} else {
			LOG.warn("Could not translate lnc because the database is not configured");
			return null;
		}
	}
	
	@Path("drug")
	@GET
	@Produces("application/json")
	@Timed
	public Object drugTranslate(@QueryParam("concept") String conceptId) {
		LOG.info("Translating drug concept "+ conceptId);
		if(drugdb != null) {
			return drugdb.getConceptData(conceptId);
		} else {
			LOG.warn("Could not translate drug because the database is not configured");
			return null;
		}
	}

	public static void setConfiguration(H2Configuration h2Config) {
		try {
			
			if(h2Config.getJlvJdbc() == null) {
				LOG.error("JLV Terminology DB is not configured");
			} else {
				dao = JLVHddDao.createInstance(h2Config.getJlvJdbc());
			}
			
			if(h2Config.getDrugJdbc() == null) {
				LOG.error("Drug Terminology DB is not configured");
			} else {
				H2TermDataSource drugTerm = new H2TermDataSource(h2Config.getDrugJdbc());
				if(h2Config.getDrugLucene() == null) {
					LOG.error("LNC Lucene DB is not configured");
				} else {
					drugdb = new LuceneSearchDataSource(drugTerm, h2Config.getDrugLucene(), false);
				}
			}
			
			if(h2Config.getLncJdbc() == null) {
				LOG.error("LNC Terminology DB is not configured");
			} else {
				H2TermDataSource lncTerm = new H2TermDataSource(h2Config.getLncJdbc());
				if(h2Config.getLncLucene() == null) {
					LOG.error("LNC Lucene DB is not configured");
				} else {
					lncdb = new LuceneSearchDataSource(lncTerm, h2Config.getLncLucene(), false);
				}
			}
			
//			TermEng te = new TermEng(new ITermDataSource[] {lncdb, drugdb});
		} catch (TermLoadException | ClassNotFoundException | SQLException | IOException e) {
			e.printStackTrace();
		}
	}

}
