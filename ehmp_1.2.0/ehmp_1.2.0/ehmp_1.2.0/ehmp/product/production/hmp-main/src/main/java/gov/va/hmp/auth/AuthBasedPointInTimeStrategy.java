package gov.va.hmp.auth;

import gov.va.hmp.healthtime.NowStrategy;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.vista.springframework.security.authentication.VistaAuthenticationToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Jim
 * Date: 9/17/13
 * Time: 9:52 AM
 * To change this template use File | Settings | File Templates.
 */
public class AuthBasedPointInTimeStrategy implements NowStrategy {

    @Autowired
    IVistaAccountDao vistaAccountDao;

    @Override
    public PointInTime now() {
        long now = System.currentTimeMillis();
        Object uauth = SecurityContextHolder.getContext().getAuthentication();
        //WebApplicationContextUtils.getRequiredWebApplicationContext();
        long ctime = System.currentTimeMillis();
        if(uauth!=null) {
            if(uauth instanceof VistaAuthenticationToken) {
                String vid = ((VistaAuthenticationToken)uauth).getVistaId();
                List<VistaAccount> accounts = vistaAccountDao.findAllByVistaId(vid);
                if(accounts.size()>0) {
                    ctime = ctime + accounts.get(0).getCalculatedVistaTimeDiff();
                }
            }
        }
        return PointInTime.fromDateFields(new Date(ctime));
    }

    @PostConstruct
    public void setNowStrategy() {
        PointInTime.setNowStrategy(this);
    }
}
