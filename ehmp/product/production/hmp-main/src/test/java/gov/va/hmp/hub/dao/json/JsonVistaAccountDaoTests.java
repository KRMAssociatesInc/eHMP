package gov.va.hmp.hub.dao.json;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.va.hmp.HmpEncryption;
import gov.va.hmp.HmpProperties;
import gov.va.hmp.hub.VistaAccount;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;

import static gov.va.hmp.hub.dao.json.JsonAssert.assertJsonEquals;
import static gov.va.hmp.hub.dao.json.JsonAssert.assertJsonStructureEquals;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class JsonVistaAccountDaoTests {

    public static final String MOCK_VERSION = "2.3-foo-bar";

    private ApplicationContext mockApplicationContext;
    private Environment mockEnvironment;
    private JsonVistaAccountDao dao;
    private Resource mockHmpHomeDirectory;
    private HmpEncryption mockHmpEncryption;

    private ClassPathResource mockConfigFile;
    private StringWriter mockConfigOutput;

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
        mockConfigFile = new ClassPathResource("mock-vista-accounts.json", JsonVistaAccountDaoTests.class);
        when(mockHmpHomeDirectory.createRelative(JsonVistaAccountDao.VISTA_ACCOUNTS_CONFIG_FILENAME)).thenReturn(mockConfigFile);

        mockConfigOutput = new StringWriter();

        dao = new JsonVistaAccountDao() {
            @Override
            protected Writer createWriter(Resource vistaAccountConfig) throws IOException {
                // return a StringWriter instead of regular default FileWriter for purposes of unit test
                return mockConfigOutput;
            }
        };
        dao.setApplicationContext(mockApplicationContext);
        dao.setHmpEncryption(mockHmpEncryption);
    }

    @Test
    public void testFindAllLoadsFromConfigFile() throws Exception {
        List<VistaAccount> accounts = dao.findAll();

        verify(mockHmpHomeDirectory, times(1)).createRelative(JsonVistaAccountDao.VISTA_ACCOUNTS_CONFIG_FILENAME);

        assertThat(accounts.size(), is(3));
        assertThat(accounts.get(0).getId(), is(0));
        assertThat(accounts.get(0).getName(), is("MOCK ONE"));
        assertThat(accounts.get(0).getVistaId(), is("ABCD"));
        assertThat(accounts.get(0).getHost(), is("localhost"));
        assertThat(accounts.get(0).getPort(), is(9000));
        assertThat(accounts.get(0).isProduction(), is(false));
        assertThat(accounts.get(0).getVprUserCredentials(), is("abcdef"));

        assertThat(accounts.get(1).getId(), is(1));
        assertThat(accounts.get(1).getName(), is("MOCK TWO"));
        assertThat(accounts.get(1).getVistaId(), is("DCBA"));
        assertThat(accounts.get(1).getHost(), is("localhost"));
        assertThat(accounts.get(1).getPort(), is(9001));
        assertThat(accounts.get(1).isProduction(), is(false));
        assertThat(accounts.get(1).getVprUserCredentials(), nullValue());

        assertThat(accounts.get(2).getId(), is(2));
        assertThat(accounts.get(2).getName(), is("MOCK THREE"));
        assertThat(accounts.get(2).getVistaId(), is("BADC"));
        assertThat(accounts.get(2).getHost(), is("localhost"));
        assertThat(accounts.get(2).getPort(), is(9002));
        assertThat(accounts.get(2).isProduction(), is(false));
        assertThat(accounts.get(2).getVprUserCredentials(), nullValue());

        // second call should reload the file
        accounts = dao.findAll();
        verify(mockHmpHomeDirectory, times(2)).createRelative(JsonVistaAccountDao.VISTA_ACCOUNTS_CONFIG_FILENAME);
    }

    @Test
    public void testCount() throws Exception {
        long count = dao.count();

        assertThat(count, is(3L));
    }

    @Test
    public void testFindOne() throws InvalidKeyException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, InvalidAlgorithmParameterException, IOException {
        VistaAccount account = dao.findOne(2);

        assertThat(account.getId(), is(2));
        assertThat(account.getName(), is("MOCK THREE"));
        assertThat(account.getHost(), is("localhost"));

        account = dao.findOne(0);

        assertThat(account.getId(), is(0));
        assertThat(account.getName(), is("MOCK ONE"));
        assertThat(account.getHost(), is("localhost"));

        account = dao.findOne(-1);
        assertThat(account, nullValue());

        account = dao.findOne(3);
        assertThat(account, nullValue());
    }

    @Test
    public void testFindAllVistaIds() {
        List<String> vistaIds = dao.findAllVistaIds();
        assertThat(vistaIds.size(), is(3));
        assertThat(vistaIds, hasItem("ABCD"));
        assertThat(vistaIds, hasItem("DCBA"));
        assertThat(vistaIds, hasItem("BADC"));
    }

    @Test
    public void testFindAllByHostAndPort() {
        List<VistaAccount> accounts = dao.findAllByHostAndPort("localhost", 9000);
        assertThat(accounts.size(), is(1));
        assertThat(accounts.get(0).getName(), is("MOCK ONE"));
    }

    @Test
    public void testFindAllByVistaId() {
        List<VistaAccount> accounts = dao.findAllByVistaId("DCBA");
        assertThat(accounts.size(), is(1));
        assertThat(accounts.get(0).getName(), is("MOCK TWO"));
    }

    @Test
    public void testFindAllByVistaIdIsNotNull() {
        List<VistaAccount> accounts = dao.findAllByVistaIdIsNotNull();
        assertThat(accounts.size(), is(3));
        assertThat(accounts.get(0).getName(), is("MOCK ONE"));
        assertThat(accounts.get(1).getName(), is("MOCK TWO"));
        assertThat(accounts.get(2).getName(), is("MOCK THREE"));
    }

    @Test
    public void testFindByDivisionHostAndPort() {
        VistaAccount account = dao.findByDivisionHostAndPort("500", "localhost", 9000);
        assertThat(account.getName(), is("MOCK ONE"));

        account = dao.findByDivisionHostAndPort("500", "localhost", 9001);
        assertThat(account.getName(), is("MOCK TWO"));

        account = dao.findByDivisionHostAndPort("960", "localhost", 9001);
        assertThat(account, nullValue());
    }

    @Test
    public void testFindAllWithSort() {
        List<VistaAccount> accounts = dao.findAll(new Sort(Sort.Direction.ASC, "vistaId"));
        assertThat(accounts.size(), is(3));
        assertThat(accounts.get(0).getVistaId(), is("ABCD"));
        assertThat(accounts.get(1).getVistaId(), is("BADC"));
        assertThat(accounts.get(2).getVistaId(), is("DCBA"));

        accounts = dao.findAll(new Sort(Sort.Direction.DESC, "name"));
        assertThat(accounts.size(), is(3));
        assertThat(accounts.get(0).getName(), is("MOCK ONE"));
        assertThat(accounts.get(1).getName(), is("MOCK THREE"));
        assertThat(accounts.get(2).getName(), is("MOCK TWO"));
    }

    @Test
    public void testFindAllWithPageable() {
        Page<VistaAccount> page = dao.findAll(new PageRequest(0, 20));

        assertThat(page.getTotalElements(), is(3L));
        assertThat(page.getTotalPages(), is(1));
        assertThat(page.getNumberOfElements(), is(3));

        List<VistaAccount> accounts = page.getContent();
        assertThat(accounts.size(), is(3));
    }

    @Test
    public void testDeleteAll() throws IOException {
        dao.deleteAll();

        ObjectMapper jsonMapper = new ObjectMapper();
        ObjectNode jsonConfig = jsonMapper.createObjectNode();
        jsonConfig.put("apiVersion", MOCK_VERSION);

        ObjectNode dataNode = jsonConfig.putObject("data");
        dataNode.put("totalItems", 0);
        dataNode.putArray("items");

        assertJsonEquals(jsonConfig, jsonMapper.readTree(mockConfigOutput.toString()));
    }

//    @Test
//    public void testDeleteById() throws IOException {
//        dao.delete(1);
//
//        ObjectMapper jsonMapper = new ObjectMapper();
//        ObjectNode jsonConfig = (ObjectNode) jsonMapper.readTree(mockConfigFile.getInputStream());
//
//        ObjectNode data = (ObjectNode) jsonConfig.path("data");
//        data.put("totalItems", 2);
//        ArrayNode items = (ArrayNode) data.path("items");
//        items.remove(1);
//        
//        String s = jsonConfig.toString();
//        System.out.println(s);
//        VistaAccount acct = jsonMapper.convertValue(items.get(0), VistaAccount.class);
//
//        assertJsonEquals(jsonMapper.readTree(jsonMapper.writerWithDefaultPrettyPrinter().writeValueAsString(acct)), jsonMapper.readTree(mockConfigOutput.toString()));
//    }

//    @Test
//    public void testDelete() throws IOException {
//        List<VistaAccount> accounts = dao.getVistaAccounts();
//
//        dao.delete(accounts.get(0));
//
//        ObjectMapper jsonMapper = new ObjectMapper();
//        ObjectNode jsonConfig = (ObjectNode) jsonMapper.readTree(mockConfigFile.getInputStream());
//
//        ObjectNode data = (ObjectNode) jsonConfig.path("data");
//        data.put("totalItems", 2);
//        ArrayNode items = (ArrayNode) data.path("items");
//        items.remove(0);
//
//        assertJsonEquals(jsonConfig, jsonMapper.readTree(mockConfigOutput.toString()));
//    }

    @Test
    public void testSaveNewAccount() throws IOException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, InvalidAlgorithmParameterException {
        VistaAccount newAccount = new VistaAccount();
        newAccount.setHost("foo");
        newAccount.setName("Foo");
        newAccount.setVistaId("WXYZ");
        newAccount.setDivision("960");

        newAccount.encrypt(mockHmpEncryption);
        newAccount = dao.save(newAccount);

        assertThat(newAccount.getId(), is(3));
    }

    @Test
    public void testSaveUpdateToExistingAccount() throws IOException {
        List<VistaAccount> accounts = dao.findAll();

        accounts.get(1).setName("Bar");

        dao.save(accounts.get(1));

        ObjectMapper jsonMapper = new ObjectMapper();
        ObjectNode jsonConfig = (ObjectNode) jsonMapper.readTree(mockConfigFile.getInputStream());

        ArrayNode items = (ArrayNode) jsonConfig.path("data").path("items");
        ((ObjectNode) items.get(1)).put("name", "Bar");

        assertJsonStructureEquals(jsonConfig, jsonMapper.readTree(mockConfigOutput.toString()));
    }
}
