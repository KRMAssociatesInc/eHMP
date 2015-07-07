package gov.va.cpe.vpr.dao.jms;

import gov.va.cpe.param.ParamService;
import gov.va.cpe.vpr.frameeng.FrameRegistry;
import gov.va.cpe.vpr.frameeng.FrameRegistry.ViewDefDefFrameLoader;
import gov.va.cpe.vpr.pom.IGenericPOMObjectDAO;
import gov.va.cpe.vpr.pom.jds.JdsDaoSupport;
import gov.va.cpe.vpr.queryeng.dynamic.IViewDefDefDAO;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;
import gov.va.cpe.vpr.sync.vista.IVistaVprObjectDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import java.util.List;
import java.util.TreeSet;

public class ViewDefDefJdsDAO extends JdsDaoSupport implements IViewDefDefDAO {

    @Autowired
    ParamService paramService;
    
    @Autowired
    IVistaVprObjectDao vprObjectDao;
    
    @Autowired
    IGenericPOMObjectDAO genericDao;
    
    @Autowired
    ApplicationContext ctx;

	TreeSet<ViewDefDef> myDefs = new TreeSet<ViewDefDef>();
	
	@Override
	public void save(ViewDefDef obj) {
		obj.prepareForBjw();
		myDefs.add(obj);
		vprObjectDao.save(obj);
		genericDao.save(obj);
		FrameRegistry.ViewDefDefFrameLoader fload = (ViewDefDefFrameLoader) ctx.getBean("vddLoader");
		fload.update(obj);
//		FrameRegistry.reloader(ViewDefDefFrameLoader.class);
	}

	@Override
	public ViewDefDef findByUid(String uid) {
		ViewDefDef rslt = null;
		for(ViewDefDef vdd: myDefs) {
			if(vdd.getUid().equals(uid)) {
				rslt = vdd;
			}
		}
		if(rslt==null) {
			rslt = genericDao.findByUID(ViewDefDef.class, uid);
			rslt.restoreFromBjw();
		}
		return rslt;
	}

	@Override
	public List<ViewDefDef> findAll() {
		List<ViewDefDef> rslt = genericDao.findAll(ViewDefDef.class);
		for(ViewDefDef vdd: rslt) {
			vdd.restoreFromBjw();
		}
		return rslt;
	}

	@Override
	public void delete(ViewDefDef obj) {
		myDefs.remove(obj);
		genericDao.deleteByUID(ViewDefDef.class, obj.getUid());
		vprObjectDao.deleteByUID(ViewDefDef.class, obj.getUid());
		FrameRegistry.ViewDefDefFrameLoader fload = (ViewDefDefFrameLoader) ctx.getBean("vddLoader");
		fload.remove(obj);
//		FrameRegistry.reloader(ViewDefDefFrameLoader.class);
	}

}
