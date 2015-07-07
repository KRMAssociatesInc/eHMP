package gov.va.hmp.hub.dao.json;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.hmp.Bootstrap;
import gov.va.hmp.HmpEncryption;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;

import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.h2.util.IOUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.comparator.ComparableComparator;
import org.springframework.util.comparator.NullSafeComparator;

/**
 * Implementation of {@link gov.va.hmp.hub.dao.IVistaAccountDao} that uses a JSON formatted config file to store VistA connection information.
 */
public class JsonVistaAccountDao implements IVistaAccountDao, ApplicationContextAware {

    public static final String VISTA_ACCOUNTS_CONFIG_FILENAME = "vista-accounts.json";

    private ApplicationContext applicationContext;
    private ObjectMapper jsonMapper;
    private HmpEncryption hmpEncryption;

    public JsonVistaAccountDao() {
        jsonMapper = new ObjectMapper();
        jsonMapper.configure(JsonParser.Feature.ALLOW_COMMENTS, true);
        jsonMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }

    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Autowired
    public void setHmpEncryption(HmpEncryption hmpEncryption) {
        this.hmpEncryption = hmpEncryption;
    }

    protected synchronized List<VistaAccount> getVistaAccounts() {
        InputStream is = null;
        try {
            Resource vistaAccountConfig = getVistaAccountConfig();
            is = vistaAccountConfig.getInputStream();
            JsonNode json = jsonMapper.readTree(is);
            JsonNode items = json.path("data").path("items");
            List<VistaAccount> accounts = jsonMapper.convertValue(items, jsonMapper.getTypeFactory().constructCollectionType(List.class, VistaAccount.class));
            // quick and dirty way to set VistaAccount.id to its index in the list. Might be a fancier way to do it with Jackson...
            for (int i = 0; i < accounts.size(); i++) {
                accounts.get(i).setId(i);
                accounts.get(i).decrypt(hmpEncryption);
            }
            return accounts;
        } catch (Exception e) {
            throw new DataAccessResourceFailureException("unable to load vista-account config", e);
        } finally {
            IOUtils.closeSilently(is);
        }
    }

    public String getPrimaryVistaSystemId() {
        InputStream is = null;
        try {
            Resource vistaAccountConfig = getVistaAccountConfig();
            is = vistaAccountConfig.getInputStream();
            JsonNode json = jsonMapper.readTree(is);
            JsonNode items = json.path("data").path("items");
            List<VistaAccount> accounts = jsonMapper.convertValue(items, jsonMapper.getTypeFactory().constructCollectionType(List.class, VistaAccount.class));
            // quick and dirty way to set VistaAccount.id to its index in the list. Might be a fancier way to do it with Jackson...
            if(accounts.size()>0) {
                return accounts.get(0).getVistaId();
            }
        } catch (Exception e) {
            throw new DataAccessResourceFailureException("unable to load vista-account config", e);
        } finally {
            IOUtils.closeSilently(is);
        }
        return "";
    }

    private Resource getVistaAccountConfig() throws IOException {
        Resource hmpHome = Bootstrap.getHmpHomeDirectory(this.applicationContext);
        Resource vistaAccountConfig = hmpHome.createRelative(VISTA_ACCOUNTS_CONFIG_FILENAME);
        if (!vistaAccountConfig.exists()) {
            // create an empty list and save it.
            Writer w = createWriter(vistaAccountConfig);
            try {
                jsonMapper.writerWithDefaultPrettyPrinter().writeValue(w, getConfigJsonFromAccounts(new ArrayList<VistaAccount>()));
            } finally {
                w.close();
            }
        }
        return vistaAccountConfig;
    }

    protected synchronized void save(List<VistaAccount> accounts) {
        try {
            Resource vistaAccountConfig = getVistaAccountConfig();
            for (VistaAccount acct : accounts) {
                acct.encrypt(hmpEncryption);
            }
            try (Writer w = createWriter(vistaAccountConfig)) {
                jsonMapper.writerWithView(JSONViews.JDBView.class).withDefaultPrettyPrinter().writeValue(w, getConfigJsonFromAccounts(accounts));
            }
            for (VistaAccount acct : accounts) {
                acct.decrypt(hmpEncryption);
            }
        } catch (Exception e) {
            throw new DataAccessResourceFailureException("unable to save vista-account config", e);
        }
    }

    private ObjectNode getConfigJsonFromAccounts(List<VistaAccount> accounts) {
        ObjectNode configJson = jsonMapper.createObjectNode();
        configJson.put("apiVersion", applicationContext.getEnvironment().getProperty(HmpProperties.VERSION));

        ObjectNode dataJson = configJson.putObject("data");
        dataJson.put("totalItems", accounts.size());
        ArrayNode itemsJson = dataJson.putArray("items");
        for (VistaAccount account : accounts) {
            itemsJson.add(jsonMapper.convertValue(account, JsonNode.class));
        }
        return configJson;
    }

    protected Writer createWriter(Resource vistaAccountConfig) throws IOException {
        return new FileWriter(vistaAccountConfig.getFile());
    }

    @Override
    public VistaAccount findByDivisionHostAndPort(String division, String host, int port) {
    	List<VistaAccount> allAccounts = getVistaAccounts();
    	try {
    		for (VistaAccount account : allAccounts) {
    			if (division!=null && division.equalsIgnoreCase(account.getDivision()) &&
    					host!=null && host.equalsIgnoreCase(account.getHost()) &&
    					port == account.getPort()) {
    				return account;
    			}
    		}
        } catch (Exception e) {
            throw new DataAccessResourceFailureException("unable to load vista-account config", e);
        }

        return null;
    }

    @Override
    public List<String> findAllVistaIds() {
        List<VistaAccount> allAccounts = getVistaAccounts();
        List<String> vistaIds = new ArrayList<String>();
        for (VistaAccount account : allAccounts) {
            if (account.getVistaId() != null) {
                vistaIds.add(account.getVistaId());
            }
        }
        return Collections.unmodifiableList(vistaIds);
    }

    @Override
    public List<VistaAccount> findAllByVistaId(String vistaId) {
        List<VistaAccount> allAccounts = getVistaAccounts();
        List<VistaAccount> accounts = new ArrayList<VistaAccount>();
        for (VistaAccount account : allAccounts) {
            if (vistaId.equalsIgnoreCase(account.getVistaId())) {
                accounts.add(account);
            }
        }
        return Collections.unmodifiableList(accounts);
    }

    @Override
    public List<VistaAccount> findAllByVistaIdIsNotNull() {
        List<VistaAccount> allAccounts = getVistaAccounts();
        List<VistaAccount> accounts = new ArrayList<VistaAccount>();
        for (VistaAccount account : allAccounts) {
            if (account.getVistaId() != null) {
                accounts.add(account);
            }
        }
        return Collections.unmodifiableList(accounts);
    }

    @Override
    public List<VistaAccount> findAllByHostAndPort(String host, int port) {
    	List<VistaAccount> allAccounts = getVistaAccounts();
    	List<VistaAccount> accounts = new ArrayList<VistaAccount>();
    	try {
    		for (VistaAccount account : allAccounts) {
    			if (host.equalsIgnoreCase(account.getHost()) && port == account.getPort()) {
    				accounts.add(account);
    			}
    		}
        } catch (Exception e) {
    		throw new DataAccessResourceFailureException("unable to load vista-account config", e);
    	}
    	return Collections.unmodifiableList(accounts);
    }

    @Override
    public VistaAccount save(VistaAccount entity) {
        List<VistaAccount> accounts = getVistaAccounts();
        if (entity.getId() != null) {
            accounts.set(entity.getId(), entity);
        } else {
            entity.setId(accounts.size());
            accounts.add(entity);
        }
        save(accounts);
        return entity;
    }

    @Override
    public VistaAccount findOne(Integer id) {
        if (id < 0) return null;
        List<VistaAccount> accounts = getVistaAccounts();
        if (id >= accounts.size()) return null;
        return accounts.get(id);
    }

    @Override
    public List<VistaAccount> findAll() {
        return Collections.unmodifiableList(getVistaAccounts());
    }

    @Override
    public long count() {
        return getVistaAccounts().size();
    }

    @Override
    public void delete(Integer id) {
        List<VistaAccount> accounts = getVistaAccounts();
        if (id < 0 || id >= accounts.size()) return;
        accounts.remove((int) id);
        save(accounts);
    }

    @Override
    public void delete(VistaAccount entity) {
        if (entity == null) return;
        delete(entity.getId());
    }

    @Override
    public void deleteAll() {
        save(new ArrayList<VistaAccount>()); // save an empty list
    }

    @Override
    public List<VistaAccount> findAll(final Sort sort) {
        List<VistaAccount> accounts = getVistaAccounts();
        if (sort == null) return Collections.unmodifiableList(accounts);

        Collections.sort(accounts, new Comparator<VistaAccount>() {

            private Comparator nullSafeComparableComparator = new NullSafeComparator(new ComparableComparator(), false);

            @Override
            public int compare(VistaAccount a1, VistaAccount a2) {
                BeanWrapper b1 = new BeanWrapperImpl(a1);
                BeanWrapper b2 = new BeanWrapperImpl(a2);

                for (Sort.Order order : sort) {
                    Object val1 = b1.getPropertyValue(order.getProperty());
                    Object val2 = b2.getPropertyValue(order.getProperty());

                    int val = nullSafeComparableComparator.compare(val1, val2);
                    if (val != 0) return val;
                }

                return 0;
            }
        });
        return Collections.unmodifiableList(accounts);
    }

    @Override
    public Page<VistaAccount> findAll(Pageable pageable) {
        List<VistaAccount> sortedAccounts = findAll(pageable.getSort());

        if (pageable.getOffset() >= sortedAccounts.size()) {
            throw new IllegalArgumentException("page request " + pageable.getOffset() + " exceeded size " + sortedAccounts.size());
        }

        int toIndex = Math.min(pageable.getOffset() + pageable.getPageSize(), sortedAccounts.size());
        List<VistaAccount> accounts = sortedAccounts.subList(pageable.getOffset(), toIndex);

        return new PageImpl<VistaAccount>(accounts, pageable, sortedAccounts.size());
    }
}
