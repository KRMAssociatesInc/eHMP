package gov.va.cpe.vpr.sync.msg;

public class LoadPatientMessageHandlerTests {

//    private LoadPatientMessageHandler loadHandler;
//    private Environment mockEnvironment;
//    private IVistaPatientDataService mockVistaPatientDataService;
//    private ISyncService mockSyncService;
//	private IPatientDAO mockPatientDao;
//    private ConversionService mockConversionService;
//    private Session mockSession;
//    private SimpleMessageConverter mockMessageConverter;
//    private IVprSyncErrorDao mockErrorDao;
//    private IVprSyncStatusDao mockStatusDao;
//
//    @Before
//    public void setUp() throws Exception {
//        mockEnvironment = mock(Environment.class);
//        mockVistaPatientDataService = mock(IVistaPatientDataService.class);
//        mockSyncService = mock(ISyncService.class);
//        mockPatientDao = mock(IPatientDAO.class);
//        mockConversionService = mock(ConversionService.class);
//        mockSession = mock(Session.class);
//        mockMessageConverter = Mockito.mock(SimpleMessageConverter.class);
//        mockErrorDao = mock(IVprSyncErrorDao.class);
//        mockStatusDao = mock(IVprSyncStatusDao.class);
//
//        loadHandler = new LoadPatientMessageHandler();
//        loadHandler.setEnvironment(mockEnvironment);
//        loadHandler.setVistaPatientDataService(mockVistaPatientDataService);
//        loadHandler.setSyncService(mockSyncService);
//        loadHandler.setPatientDao(mockPatientDao);
//        loadHandler.setConversionService(mockConversionService);
//        loadHandler.setMetrics(new MetricRegistry());
//        loadHandler.setMessageConverter(mockMessageConverter);
//        loadHandler.setErrorDao(mockErrorDao);
//        loadHandler.setSyncStatusDao(mockStatusDao);
//    }
//
//    @Test
//    public void testOnMessageWithDfn() throws Exception {
//        PatientDemographics mockPatient = new PatientDemographics();
//        mockPatient.setData("pid","23");
//        Map<String, String> fac = new HashMap<String, String>();
//        fac.put("systemId","ABCD");
//        fac.put("localPatientId", "229");
//        fac.put("code","bar");
//        ArrayList<Map<String, String>> facs = new ArrayList<Map<String, String>>();
//        facs.add(fac);
//        mockPatient.setData("facilities",facs);
//
//        ObjectMapper jsonMapper = new ObjectMapper();
//        VistaDataChunk mockPatientItem = MockVistaDataChunks.createFromJson(jsonMapper.readTree("{\"localId\": \"229\"}"), "ABCD", "229", "patient");
//        VistaDataChunk mockItem = MockVistaDataChunks.createFromJson(jsonMapper.readTree("{\"localId\": \"12345\"}"), "ABCD", "229", "foo");
//        ExtractResult mockRslt = new ExtractResult();
//        mockRslt.items = MockVistaDataChunks.createListFromJson("ABCD", mockPatient, "allergy", 10);
//
//        Map msg = new HashMap();
//        msg.put(VISTA_ID, "ABCD");
//        msg.put(PATIENT_DFN, "229");
//
//        when(mockVistaPatientDataService.fetchPatientDemographicsWithDfn("ABCD", "229")).thenReturn(mockPatientItem);
//        when(mockConversionService.convert(any(VistaDataChunk.class), eq(PatientDemographics.class))).thenReturn(mockPatient);
//        when(mockPatientDao.save((PatientDemographics) mockPatient)).thenReturn(mockPatient);
//        doThrow(new RuntimeException("Sync Error")).when(mockSyncService).errorDuringMsg(anyMap(), (Throwable) anyObject(), eq(ErrorLevel.ERROR));
//        when(mockVistaPatientDataService.fetchDomainChunks(eq("ABCD"), eq(mockPatient), anyString())).thenReturn(new ExtractResult());
//        when(mockVistaPatientDataService.fetchDomainChunks("ABCD", mockPatient, "allergy")).thenReturn(mockRslt);
//        when(mockEnvironment.getProperty(HmpProperties.SERVER_ID)).thenReturn("blazman123");
//
//        Message mockMessage = Mockito.mock(Message.class);
//        when(mockMessageConverter.fromMessage(mockMessage)).thenReturn(msg);
//
//        loadHandler.onMessage(mockMessage, mockSession);
//
//        verify(mockVistaPatientDataService).fetchPatientDemographicsWithDfn("ABCD", "229");
//        verify(mockConversionService).convert(mockPatientItem, PatientDemographics.class);
//
//        Map<String, Object> params = new HashMap<>();
//        params.put("localId","229");
//        params.put("command", "putPtSubscription");
////        verify(mockVistaPatientDataService).subscribePatient("ABCD", "229", "blazman123");
//        verify(mockVistaPatientDataService).putPtSubscription("229", null, "ABCD");
//
//        for (String extract : LoadPatientMessageHandler.PATIENT_DATA_DOMAINS) {
//            // verify fetch chunks for all domains listed in the loadConfig
//            verify(mockVistaPatientDataService).fetchDomainChunks("ABCD", mockPatient, extract);
//        }
//
//        // verify send import message for all items returned from all fetches
//        for (VistaDataChunk mockAllergyItem : mockRslt.items) {
//            verify(mockSyncService).sendImportVistaDataExtractItemMsg(mockAllergyItem);
//        }
//
//        verify(mockSyncService).sendLoadPatientCompleteMsg(mockPatient, msg);
//    }
//
//    @Test
//    public void testOnMessageFailsWithMissingVistaId() throws Exception {
//        Map msg = new HashMap();
//        msg.put(PATIENT_DFN, "229");
//
//        Message mockMessage = Mockito.mock(Message.class);
//        when(mockMessageConverter.fromMessage(mockMessage)).thenReturn(msg);
//
//        loadHandler.onMessage(mockMessage, mockSession);
//        verify(mockErrorDao).save(any(SyncError.class));
//    }
//
//    @Test
//    public void testOnMessageFailsWithMissingBothDfnAndOrIcn() throws Exception {
//        Map msg = new HashMap();
//
//        Message mockMessage = Mockito.mock(Message.class);
//        when(mockMessageConverter.fromMessage(mockMessage)).thenReturn(msg);
//
//        msg.put(VISTA_ID, "ABCD");
//        loadHandler.onMessage(mockMessage, mockSession);
//        verify(mockErrorDao).save(any(SyncError.class));
//    }
}
