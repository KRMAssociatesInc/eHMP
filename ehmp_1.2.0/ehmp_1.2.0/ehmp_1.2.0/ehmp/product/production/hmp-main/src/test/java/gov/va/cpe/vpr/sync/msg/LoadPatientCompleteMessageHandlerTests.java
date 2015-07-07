package gov.va.cpe.vpr.sync.msg;

public class LoadPatientCompleteMessageHandlerTests {

//    private LoadPatientCompleteMessageHandler handler;
//    private IPatientDAO mockPatientDao;
//    private PointInTime mockNow;
//    private MetricRegistry mockMetrics;
//    Message mockMessage;
//    Session mockSession;
//    SimpleMessageConverter converter;
//    private IVprSyncErrorDao mockErrorDao;
//
//    @Before
//    public void setUp() throws Exception {
//        mockNow = PointInTime.now();
//        PointInTime.setNowStrategy(new NowStrategy() {
//            @Override
//            public PointInTime now() {
//                return mockNow;
//            }
//        });
//
//        mockPatientDao = mock(IPatientDAO.class);
//        mockMetrics = new MetricRegistry();
//        mockErrorDao = mock(IVprSyncErrorDao.class);
//
//        handler = new LoadPatientCompleteMessageHandler();
//        handler.setPatientDao(mockPatientDao);
//        handler.setMetricRegistry(mockMetrics);
//        handler.setErrorDao(mockErrorDao);
//        converter = mock(SimpleMessageConverter.class);
//        mockMessage = Mockito.mock(Message.class);
//        mockSession = Mockito.mock(Session.class);
//        handler.converter = converter;
//    }
//
//    @After
//    public void tearDown() throws Exception {
//        PointInTime.setDefaultNowStrategy();
//    }
//
//    @Test
//    public void testOnMessage() throws Exception {
//        PatientDemographics pt = MockPatientUtils.create("12345");
//
//        Map msg = new HashMap();
//        msg.put(SyncMessageConstants.PATIENT_ID, "12345");
//        msg.put(SyncMessageConstants.TIMESTAMP, System.currentTimeMillis());
//
//        when(mockPatientDao.findDemographicsByVprPid("12345")).thenReturn(pt);
//
//        when(converter.fromMessage(mockMessage)).thenReturn(msg);
//        handler.onMessage(mockMessage, mockSession);
//
//        assertThat(pt.getLastUpdated(), is(mockNow));
//
//        verify(mockPatientDao).findDemographicsByVprPid("12345");
//        verify(mockPatientDao).save(pt);
//
//        Timer timer = mockMetrics.timer(LoadPatientCompleteMessageHandler.PATIENT_LOAD_TIMER_NAME);
//        assertThat(timer.getCount(), is(1L));
//    }
//
//    @Test
//    public void testOnMessageWithMissingPid() throws Exception {
//        Map msg = new HashMap();
//        when(converter.fromMessage(mockMessage)).thenReturn(msg);
//        handler.onMessage(mockMessage, mockSession);
//        verify(mockErrorDao).save(any(SyncError.class));
//    }
}
