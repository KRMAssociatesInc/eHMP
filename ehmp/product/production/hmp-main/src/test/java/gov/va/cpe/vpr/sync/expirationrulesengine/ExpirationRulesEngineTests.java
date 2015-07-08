package gov.va.cpe.vpr.sync.expirationrulesengine;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import gov.va.cpe.vpr.sync.SyncStatus;
import gov.va.cpe.vpr.sync.SyncStatus.VistaAccountSyncStatus;
import gov.va.cpe.vpr.sync.msg.SyncDodMessageHandler;
import gov.va.hmp.HmpEncryption;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.SecondarySiteJson;
import gov.va.hmp.healthtime.PointInTime;
import gov.va.hmp.hub.VistaAccount;
import gov.va.hmp.hub.dao.IVistaAccountDao;
import gov.va.hmp.hub.dao.json.JsonVistaAccountDao;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

public class ExpirationRulesEngineTests {

    String MOCK_HMP_EXPIRE_RULES = "\n" + 
            "      {\n" +  
            "        \"type\": \"basic\",\n" + 
            "        \"siteId\": \"DOD\",\n" + 
            "        \"expirationHours\": 1\n" + 
            "      }";    

    ObjectMapper mapper = new ObjectMapper(); // create once, reuse
    private static final String[] SITES = { "DOD", "CDS", "DAS" };

    public static final String MOCK_VERSION = "2.3-foo-bar";
    private ApplicationContext mockApplicationContext;
    private Environment mockEnvironment;
    private SecondarySiteJson secondarySiteJson;
    private ExpirationRulesEngine expirationRulesEngine;
    private Resource mockHmpHomeDirectory;
    private HmpEncryption mockHmpEncryption;
    private ClassPathResource mockConfigFile;

    private IVistaAccountDao mockVistaAccountDao;
    private VistaAccount mockKodak;
    private VistaAccount mockPanorama;

    @Before
    public void setUp() throws Exception {
        mockApplicationContext = mock(ApplicationContext.class);
        mockEnvironment = mock(Environment.class);
        mockHmpHomeDirectory = mock(Resource.class);
        mockHmpEncryption = mock(HmpEncryption.class);

        when(mockApplicationContext.getEnvironment()).thenReturn(mockEnvironment);
        when(mockEnvironment.getProperty(HmpProperties.VERSION)).thenReturn(MOCK_VERSION);
        when(mockEnvironment.containsProperty(HmpProperties.HMP_HOME_SYSTEM_PROPERTY_NAME)).thenReturn(true);
        when(mockEnvironment.getProperty(HmpProperties.HMP_HOME_SYSTEM_PROPERTY_NAME)).thenReturn(File.separator+"path"+File.separator+"to"+File.separator+"mock"+File.separator+"hmp-home");
        when(mockApplicationContext.getResource("file:"+File.separator+"path"+File.separator+"to"+File.separator+"mock"+File.separator+"hmp-home"+File.separator)).thenReturn(mockHmpHomeDirectory);

        when(mockHmpEncryption.encrypt(anyString())).thenReturn("foocrypt");
        when(mockHmpEncryption.decrypt(anyString())).thenReturn("foocrypt");
        mockConfigFile = new ClassPathResource("mock-secondary-site.json", ExpirationRulesEngineTests.class);
        when(mockHmpHomeDirectory.createRelative(SecondarySiteJson.SECONDARY_SITE_CONFIG_FILENAME)).thenReturn(mockConfigFile);

        mockKodak = mock(VistaAccount.class);
        when(mockKodak.getVistaId()).thenReturn("C877");
        when(mockKodak.getIntegrationLevel(SyncDodMessageHandler.SITE_ID)).thenReturn(IntegrationLevelExpirationRule.DEEPLY_INTEGERATED);
        List<VistaAccount> kodakList = new ArrayList<VistaAccount>();
        kodakList.add(mockKodak);

        mockPanorama = mock(VistaAccount.class);
        when(mockPanorama.getVistaId()).thenReturn("9E7A");
        when(mockPanorama.getIntegrationLevel(SyncDodMessageHandler.SITE_ID)).thenReturn(IntegrationLevelExpirationRule.NOT_INTEGRATED);
        List<VistaAccount> panoramaList = new ArrayList<VistaAccount>();
        panoramaList.add(mockPanorama);

        List<VistaAccount> notNullList = new ArrayList<VistaAccount>();
        notNullList.addAll(kodakList);
        notNullList.addAll(panoramaList);

        mockVistaAccountDao = mock(IVistaAccountDao.class);
        when(mockVistaAccountDao.findAllByVistaId(anyString())).thenReturn(new ArrayList<VistaAccount>());
        when(mockVistaAccountDao.findAllByVistaId("C877")).thenReturn(kodakList);
        when(mockVistaAccountDao.findAllByVistaId("9E7A")).thenReturn(panoramaList);
        when(mockVistaAccountDao.findAllByVistaIdIsNotNull()).thenReturn(notNullList);

        secondarySiteJson = new SecondarySiteJson();
        secondarySiteJson.setApplicationContext(mockApplicationContext);
        secondarySiteJson.setVistaAccountDao(mockVistaAccountDao);
        expirationRulesEngine = new ExpirationRulesEngine();
    }

    @Test
    public void testSecondarySiteParse() throws Exception {
        Map<String, ExpirationRule> map = secondarySiteJson.getSecondarySiteRulesMap();
        assertThat(map,notNullValue());
        assertEquals(map.get("dod_basic_expiration").getSiteId(), "DOD");
        BasicExpirationRule value = (BasicExpirationRule) (map.get("dod_basic_expiration"));
        assertEquals(48, value.getExpirationHours());
        value = (BasicExpirationRule) (map.get("cds_basic_expiration"));
        assertEquals(8, value.getExpirationHours());
        value = (BasicExpirationRule) (map.get("vler_basic_expiration"));
        assertEquals(24, value.getExpirationHours());
    }       

    @Test    
    public void createBasicRule() throws Exception {
        BasicExpirationRule value = mapper.readValue(MOCK_HMP_EXPIRE_RULES, BasicExpirationRule.class);
        assertThat(value, notNullValue());
        assertThat(value.getSiteId(), is(equalTo("DOD")));
        assertThat(value.getExpirationHours(), is(equalTo(1)));
    }
    @Test
    public void testLoadExpireSiteProperties() throws Exception {
        Map<String, ExpirationRule> map = secondarySiteJson.getSecondarySiteRulesMap();
        expirationRulesEngine.setRules(map);         
        assertThat(expirationRulesEngine.getRules(), notNullValue());
        assertThat(expirationRulesEngine.getRules().size(), is(equalTo(3)));
        BasicExpirationRule value = (BasicExpirationRule) (expirationRulesEngine.getRules().get("dod_basic_expiration"));
        assertThat(expirationRulesEngine.getRules().get("dod_basic_expiration").getSiteId(), is(equalTo("DOD")));
        assertThat(value.getExpirationHours(), is(equalTo(48)));
        value = (BasicExpirationRule) (expirationRulesEngine.getRules().get("cds_basic_expiration"));
        assertThat(expirationRulesEngine.getRules().get("cds_basic_expiration").getSiteId(), is(equalTo("CDS")));
        assertThat( value.getExpirationHours(), is(equalTo(8)));
        value = (BasicExpirationRule) (expirationRulesEngine.getRules().get("vler_basic_expiration"));
        assertThat(expirationRulesEngine.getRules().get("vler_basic_expiration").getSiteId(), is(equalTo("DAS")));
        assertThat( value.getExpirationHours(), is(equalTo(24)));
    }
    @Test
    public void testBasicRuleExpiration() throws Exception {
        BasicExpirationRule value = mapper.readValue(MOCK_HMP_EXPIRE_RULES, BasicExpirationRule.class);
        VistaAccountSyncStatus vstat = new VistaAccountSyncStatus();
        vstat.setLastSyncTime(new PointInTime(2014, 9, 15, 16));

        SyncStatus syncStatus = mock(SyncStatus.class);
        when(syncStatus.getVistaAccountSyncStatusForSystemId("DOD")).thenReturn(vstat);

        PointInTime newExpireTime = value.evaluate(syncStatus);
        vstat.setExpiresOn(newExpireTime);
        assertThat(vstat.getExpiresOn().getYear(), is(equalTo(2014)));
        assertThat(vstat.getExpiresOn().getMonth(), is(equalTo(9)));
        assertThat(vstat.getExpiresOn().getDate(), is(equalTo(15)));
        assertThat(vstat.getExpiresOn().getHour(), is(equalTo(17)));        
        assertEquals(new PointInTime(2014, 9, 15, 17), vstat.getExpiresOn());
    }
    @Test
    public void testRulesExpirationEngine() throws Exception {
        Map<String, ExpirationRule> map = secondarySiteJson.getSecondarySiteRulesMap();
        expirationRulesEngine.setRules(map);
        SyncStatus responseSyncStatus = new SyncStatus();
        Map<String, VistaAccountSyncStatus> mapSiteSyncStatus = new HashMap<String, SyncStatus.VistaAccountSyncStatus>();
        for (int i = 0; i < SITES.length; i++) {
            VistaAccountSyncStatus siteSyncStatus = new VistaAccountSyncStatus();            
            siteSyncStatus.setLastSyncTime(new PointInTime(2014, 9, 15, 16));
            mapSiteSyncStatus.put(SITES[i], siteSyncStatus);
        }
        responseSyncStatus.setData("syncStatusByVistaSystemId", mapSiteSyncStatus);
        expirationRulesEngine.evaluate(responseSyncStatus);
        assertEquals(new PointInTime(2014, 9, 17, 16), responseSyncStatus.getSyncStatusByVistaSystemId().get("DOD").getExpiresOn());
        assertEquals(new PointInTime(2014, 9, 16, 0), responseSyncStatus.getSyncStatusByVistaSystemId().get("CDS").getExpiresOn());
        assertEquals(new PointInTime(2014, 9, 16, 16), responseSyncStatus.getSyncStatusByVistaSystemId().get("DAS").getExpiresOn());
    }

    @Test
    public void testMultipleBasicRules() throws Exception {
        mockConfigFile = new ClassPathResource("mock-secondary-site-multiple.json", ExpirationRulesEngineTests.class);
        when(mockHmpHomeDirectory.createRelative(SecondarySiteJson.SECONDARY_SITE_CONFIG_FILENAME)).thenReturn(mockConfigFile);

        Map<String, ExpirationRule> map = secondarySiteJson.getSecondarySiteRulesMap();
        for (Map.Entry<String, ExpirationRule> entry : map.entrySet()) {
            if (entry.getValue() instanceof IntegrationLevelExpirationRule) {
                IntegrationLevelExpirationRule value = (IntegrationLevelExpirationRule) entry.getValue();
                map.put(entry.getKey(), value);
            }
        }
        expirationRulesEngine.setRules(map);

        SyncStatus responseSyncStatus = new SyncStatus();
        Map<String, VistaAccountSyncStatus> mapSiteSyncStatus = new HashMap<String, SyncStatus.VistaAccountSyncStatus>();
        for (int i = 0; i < SITES.length; i++) {
            VistaAccountSyncStatus siteSyncStatus = new VistaAccountSyncStatus();            
            siteSyncStatus.setLastSyncTime(new PointInTime(2014, 9, 15, 16));
            mapSiteSyncStatus.put(SITES[i], siteSyncStatus);
        }
        responseSyncStatus.setData("syncStatusByVistaSystemId", mapSiteSyncStatus);
        expirationRulesEngine.evaluate(responseSyncStatus);
        assertEquals(new PointInTime(2014, 9, 16, 12), responseSyncStatus.getSyncStatusByVistaSystemId().get("DOD").getExpiresOn());
        assertEquals(new PointInTime(2014, 9, 16, 0), responseSyncStatus.getSyncStatusByVistaSystemId().get("CDS").getExpiresOn());
        assertEquals(new PointInTime(2014, 9, 15, 18), responseSyncStatus.getSyncStatusByVistaSystemId().get("DAS").getExpiresOn());
    }

    @Test
    public void testDodIntegrationLevelRules() throws Exception {
        mockConfigFile = new ClassPathResource("mock-secondary-site-dodintegration.json", ExpirationRulesEngineTests.class);
        when(mockHmpHomeDirectory.createRelative(SecondarySiteJson.SECONDARY_SITE_CONFIG_FILENAME)).thenReturn(mockConfigFile);

        ClassPathResource mockVistaAccountsFile = new ClassPathResource("mock-vista-accounts.json", ExpirationRulesEngineTests.class);
        when(mockHmpHomeDirectory.createRelative(JsonVistaAccountDao.VISTA_ACCOUNTS_CONFIG_FILENAME)).thenReturn(mockVistaAccountsFile);

        Map<String, ExpirationRule> map = secondarySiteJson.getSecondarySiteRulesMap();
        expirationRulesEngine.setRules(map);

        SyncStatus responseSyncStatus = new SyncStatus();
        Map<String, VistaAccountSyncStatus> mapSiteSyncStatus = new HashMap<String, SyncStatus.VistaAccountSyncStatus>();
        for (int i = 0; i < SITES.length; i++) {
            VistaAccountSyncStatus siteSyncStatus = new VistaAccountSyncStatus();
            siteSyncStatus.setLastSyncTime(new PointInTime(2014, 9, 15, 16));
            mapSiteSyncStatus.put(SITES[i], siteSyncStatus);
        }
        mapSiteSyncStatus.put("C877", new VistaAccountSyncStatus());
        mapSiteSyncStatus.put("9E7A", new VistaAccountSyncStatus());
        responseSyncStatus.setData("syncStatusByVistaSystemId", mapSiteSyncStatus);

        expirationRulesEngine.evaluate(responseSyncStatus);
        assertEquals(new PointInTime(2014, 9, 15, 17), responseSyncStatus.getSyncStatusByVistaSystemId().get("DOD").getExpiresOn());
        assertEquals(new PointInTime(2014, 9, 16, 0), responseSyncStatus.getSyncStatusByVistaSystemId().get("CDS").getExpiresOn());
        assertEquals(new PointInTime(2014, 9, 16, 16), responseSyncStatus.getSyncStatusByVistaSystemId().get("DAS").getExpiresOn());
    }

    @Test
    public void testEmptyRulesEngine() throws Exception {
        mockConfigFile = new ClassPathResource("mock-secondary-site-empty.json", ExpirationRulesEngineTests.class);
        when(mockHmpHomeDirectory.createRelative(SecondarySiteJson.SECONDARY_SITE_CONFIG_FILENAME)).thenReturn(mockConfigFile);
        Map<String, ExpirationRule> map = secondarySiteJson.getSecondarySiteRulesMap();
        expirationRulesEngine.setRules(map);
        SyncStatus responseSyncStatus = new SyncStatus();
        Map<String, VistaAccountSyncStatus> mapSiteSyncStatus = new HashMap<String, SyncStatus.VistaAccountSyncStatus>();
        for (int i = 0; i < SITES.length; i++) {
            VistaAccountSyncStatus siteSyncStatus = new VistaAccountSyncStatus();            
            siteSyncStatus.setLastSyncTime(new PointInTime(2014, 9, 15, 16));
            mapSiteSyncStatus.put(SITES[i], siteSyncStatus);
        }
        responseSyncStatus.setData("syncStatusByVistaSystemId", mapSiteSyncStatus);
        expirationRulesEngine.evaluate(responseSyncStatus);
        assertNull(responseSyncStatus.getSyncStatusByVistaSystemId().get("DOD").getExpiresOn());
        assertNull(responseSyncStatus.getSyncStatusByVistaSystemId().get("CDS").getExpiresOn());
        assertNull(responseSyncStatus.getSyncStatusByVistaSystemId().get("DAS").getExpiresOn());
    }

    @Test
    public void testPartialRulesEngine() throws Exception {
        mockConfigFile = new ClassPathResource("mock-secondary-site-partial.json", ExpirationRulesEngineTests.class);
        when(mockHmpHomeDirectory.createRelative(SecondarySiteJson.SECONDARY_SITE_CONFIG_FILENAME)).thenReturn(mockConfigFile);
        Map<String, ExpirationRule> map = secondarySiteJson.getSecondarySiteRulesMap();
        expirationRulesEngine.setRules(map);
        SyncStatus responseSyncStatus = new SyncStatus();
        Map<String, VistaAccountSyncStatus> mapSiteSyncStatus = new HashMap<String, SyncStatus.VistaAccountSyncStatus>();
        for (int i = 0; i < SITES.length; i++) {
            VistaAccountSyncStatus siteSyncStatus = new VistaAccountSyncStatus();            
            siteSyncStatus.setLastSyncTime(new PointInTime(2014, 9, 15, 16));
            mapSiteSyncStatus.put(SITES[i], siteSyncStatus);
        }
        responseSyncStatus.setData("syncStatusByVistaSystemId", mapSiteSyncStatus);
        expirationRulesEngine.evaluate(responseSyncStatus);
        assertNull(responseSyncStatus.getSyncStatusByVistaSystemId().get("DOD").getExpiresOn());
        assertEquals(new PointInTime(2014, 9, 16, 0), responseSyncStatus.getSyncStatusByVistaSystemId().get("CDS").getExpiresOn());
        assertEquals(new PointInTime(2014, 9, 16, 16), responseSyncStatus.getSyncStatusByVistaSystemId().get("DAS").getExpiresOn());
    }

    @Test
    public void testNoConfigFileRulesEngine() throws Exception {
        mockConfigFile = new ClassPathResource("no-file.json", ExpirationRulesEngineTests.class);
        when(mockHmpHomeDirectory.createRelative(SecondarySiteJson.SECONDARY_SITE_CONFIG_FILENAME)).thenReturn(mockConfigFile);
        Map<String, ExpirationRule> map = secondarySiteJson.getSecondarySiteRulesMap();
        expirationRulesEngine.setRules(map);
        SyncStatus responseSyncStatus = new SyncStatus();
        Map<String, VistaAccountSyncStatus> mapSiteSyncStatus = new HashMap<String, SyncStatus.VistaAccountSyncStatus>();
        for (int i = 0; i < SITES.length; i++) {
            VistaAccountSyncStatus siteSyncStatus = new VistaAccountSyncStatus();            
            siteSyncStatus.setLastSyncTime(new PointInTime(2014, 9, 15, 16));
            mapSiteSyncStatus.put(SITES[i], siteSyncStatus);
        }
        responseSyncStatus.setData("syncStatusByVistaSystemId", mapSiteSyncStatus);
        expirationRulesEngine.evaluate(responseSyncStatus);
    }

}
