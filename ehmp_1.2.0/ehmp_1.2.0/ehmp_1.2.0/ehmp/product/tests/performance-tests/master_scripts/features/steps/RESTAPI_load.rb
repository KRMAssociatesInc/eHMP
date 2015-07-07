require "agilex-loadgen"


Given /^that eVPR has ramped up with tag "([^"]*)" to a load of "([^"]*)" requests per second after "([^"]*)" minutes and continues for "([^"]*)" minutes$/ do |tagStringBase, typReqRate, typRampTime, typDuration|
  
    #LoadGenerator.setTestMode
    
    @LocalProjectRoot = ENV["WORKSPACE"]
    @TargetEnvPath = @LocalProjectRoot + "/infrastructure/vagrant/aws/vista-exchange"

    @Provider = ENV['PROVIDER']
    @SSHUserid = ENV['SSH_USER_ID']
    @ProjectGemServerURL = ENV['GEM_SERVER_URL']
    @ProviderBoxName = ENV['PROVIDER_BOX_NAME']
    @ProviderBoxURL = ENV['PROVIDER_BOX_URL']
    @VagrantfileDir = ENV['VAGRANTFILE_DIR']
    @ProjectRepoURL = ENV['PROJECT_REPO_URL']
    @ProjectRepoFQDN = ENV['PROJECT_REPO_FQDN']
    @GitUserid = ENV['GIT_USERID']
    @GitPassword = ENV['GIT_PASSWORD']
    @EhmpIp = ENV['EHMP_IP']
    @VeApiIp = ENV['VE_API_IP']
    @JdsIp = ENV['JDS_IP']
    
    @TargetHostName = 've-api'
    @typReqRate = typReqRate
    @typRampTime = typRampTime
    @typDuration = typDuration
    
    
    LoadGenerator.setResultsDirectory (@LocalProjectRoot + "/product/tests/performance-tests/results")

    
    LoadGenerator.requestType :TypicalRequest do
        #tag "@perf.FHIRhttparty"
        tag tagStringBase
        setColor "darkblue"  # See http://www.december.com/html/spec/colorsvg.html
    end
    
    
    LoadGenerator.distribution :TypicalDistribution do
    
        level typReqRate, typRampTime  # ramp up to the request rate.
        level typReqRate, typDuration  # keep the base load going until the end of the test.
    end
        
    
    LoadGenerator.profile :TypicalProfile do

        setRequestType :TypicalRequest
        setDistribution :TypicalDistribution
    end
        
end
        
        
When /^for test "([^"]*)" with tag "([^"]*)" the load is increased by "([^"]*)" requests per second after "([^"]*)" minutes for "([^"]*)" minutes$/ do |testRunName, tagStringSpike, spikeReqRate, spikeDelay, spikeDuration|

    @spikeDuration = spikeDuration

    LoadGenerator.requestType :SpikeRequest do
        #tag "@perf.FHIRhttparty"
        tag tagStringSpike
        setColor "forestgreen"
    end
    
    
    LoadGenerator.distribution :SpikeDistribution do
    
        level 0.0, spikeDelay
        level spikeReqRate, 0.01
        level spikeReqRate, spikeDuration
        level 0.0, 0.01
    end
        
        
    LoadGenerator.profile :SpikeProfile do
    
        setRequestType :SpikeRequest
        setDistribution :SpikeDistribution
    end
    
    
    ProviderBoxName = @ProviderBoxName
    ProviderBoxURL = @ProviderBoxURL
    VagrantfileDir = @VagrantfileDir
    
    
    LoadGenerator.dynamicProvider :awsconf do
        setProviderName :aws
        #setProviderBoxName ProviderBoxName
        #setProviderBoxURL ProviderBoxURL
    end
    

    SSHUserid = @SSHUserid
    LoadGenerator.staticProvider :vbmconf do
        setProviderName :managed
        setUserid SSHUserid
        #setProviderBoxName ProviderBoxName
        #setProviderBoxURL ProviderBoxURL
        setVagrantfileDir VagrantfileDir
        node 'test_client_1', '10.12.1.201'
        node 'test_client_2', '10.12.1.202'
    end


    Provider = @Provider
    
    TargetEnvPath = @TargetEnvPath
    ProjectGemServerURL = @ProjectGemServerURL
    LocalProjectRoot = @LocalProjectRoot
    ProjectRepoURL = @ProjectRepoURL
    ProjectRepoFQDN = @ProjectRepoFQDN
    GitUserid = @GitUserid
    GitPassword = @GitPassword
    EhmpIp = @EhmpIp
    VeApiIp = @VeApiIp
    JdsIp = @JdsIp
    
    
    @tr = LoadGenerator.testRun testRunName do
    
        # Select the environment.
        setProviderConfig Provider
        
        # Set env variables needed by the tests.
        defineEnvVariable "EHMP_IP", EhmpIp
        defineEnvVariable "VE_API_IP", VeApiIp
        defineEnvVariable "JDS_IP", JdsIp
        
        # Set parameters for the project repo.
        setProjectGemServerURL ProjectGemServerURL
        setLocalProjectRoot LocalProjectRoot
        setProjectName "vistacore"
        setProjectRepoName "ehmp"
        setProjectRepoURL ProjectRepoURL
        setProjectRepoFQDN ProjectRepoFQDN
        setGitUserid GitUserid
        setGitPassword GitPassword
        
        # Specify which tests to run.
        # The features directory is relative to the local project root.
        # If features are NOT specified, then the whole directory will be run.
        # If features ARE specified, then only those will be run.
        setFeaturesDirectory "product/tests/performance-tests/client-tests/features"
        feature "perf.ehmp_REST.feature"
        
        # Select load profiles.
        useProfile :TypicalProfile
        useProfile :SpikeProfile
        
        # Draw graphs for these events.
        #graphAllEvents
        graphEvent "fhir_adversereaction"
        graphEvent "fhir_diagnosticReport"
        graphEvent "fhir_observation"
        graphEvent "fhir_patient"
        graphEvent "fhir_MedicationStatement"
        graphEvent "fhir_MedicationAdministration"
        graphEvent "fhir_MedicationDispense"
        graphEvent "fhir_rad"
        graphEvent "vpr_allergy"
        graphEvent "vpr_vital"
        graphEvent "vpr_patient"
        graphEvent "vpr_search"
        graphEvent "vpr_search_RecordTypesummary"
        graphEvent "vpr_search_Med"
        graphEvent "vpr_lab"
        graphEvent "vpr_med"
        graphEvent "vpr_document"
        graphEvent "vpr_rad"
        graphEvent "vpr_order"
        graphEvent "vpr_accession"
        graphEvent "vpr_immunization"
        graphEvent "vpr_consult"
        graphEvent "hdr_appointment"
        graphEvent "hdr_consult"
        graphEvent "hdr_cpt"
        graphEvent "hdr_document"
        graphEvent "hdr_education"
        graphEvent "hdr_exams"
        graphEvent "hdr_factor"
        graphEvent "hdr_image"
        graphEvent "hdr_immunization"
        graphEvent "hdr_mentalhealth"
        graphEvent "hdr_order"
        graphEvent "hdr_pointofvisits"
        graphEvent "hdr_problem"
        graphEvent "hdr_procedure"
        graphEvent "hdr_skin"
        graphEvent "hdr_surgery"
        graphEvent "hdr_visit"
        graphEvent "DoD_MedViewDef"
        graphEvent "DoD_NotesUnfilteredViewDef"
        graphEvent "DoD_ProblemViewDef"
        
        # Select how many test client nodes to use.
        if Provider != 'spconf' then
            setNoOfNodes 2
        end
        
        #reuseNodes  # re-provision existing nodes if present.
        keepNodes  # do not destroy nodes at the end.
    end
        
    $stderr.puts "About to start test run..."
    @tr.start
    $stderr.puts "Completed test run"
        
end


Then /^at "([^"]*)" minutes after the spike ends, the system response time still averages less than "([^"]*)" seconds for cached patients$/ do |delay, avgRespTime|

    puts "Statistics:"

    puts "\tfhir_adversereaction: #{@tr.getStats("fhir_adversereaction", "TypicalRequest", "SpikeRequest")}"
    puts "\tfhir_diagnosticReport: #{@tr.getStats("fhir_diagnosticReport", "TypicalRequest", "SpikeRequest")}"
    puts "\tfhir_observation: #{@tr.getStats("fhir_observation", "TypicalRequest", "SpikeRequest")}"
    puts "\tfhir_patient: #{@tr.getStats("fhir_patient", "TypicalRequest", "SpikeRequest")}"        
    puts "\tfhir_MedicationStatement: #{@tr.getStats("fhir_MedicationStatement", "TypicalRequest", "SpikeRequest")}"
    puts "\tfhir_MedicationAdministration: #{@tr.getStats("fhir_MedicationAdministration", "TypicalRequest", "SpikeRequest")}"
    puts "\tfhir_MedicationDispense: #{@tr.getStats("fhir_MedicationDispense", "TypicalRequest", "SpikeRequest")}"
    puts "\tfhir_rad: #{@tr.getStats("fhir_rad", "TypicalRequest", "SpikeRequest")}"
    puts "\tvpr_allergy: #{@tr.getStats("vpr_allergy", "TypicalRequest", "SpikeRequest")}"
    puts "\tvpr_vital: #{@tr.getStats("vpr_vital", "TypicalRequest", "SpikeRequest")}"
    puts "\tvpr_patient: #{@tr.getStats("vpr_patient", "TypicalRequest", "SpikeRequest")}"
    puts "\tvpr_search: #{@tr.getStats("vpr_search", "TypicalRequest", "SpikeRequest")}"    
    puts "\tvpr_search_RecordTypesummary: #{@tr.getStats("vpr_search_RecordTypesummary", "TypicalRequest", "SpikeRequest")}"
    puts "\tvpr_search_Med: #{@tr.getStats("vpr_search_Med", "TypicalRequest", "SpikeRequest")}"
    puts "\tvpr_lab: #{@tr.getStats("vpr_lab", "TypicalRequest", "SpikeRequest")}"
    puts "\tvpr_problem: #{@tr.getStats("vpr_problem", "TypicalRequest", "SpikeRequest")}"    
    puts "\tvpr_med: #{@tr.getStats("vpr_med", "TypicalRequest", "SpikeRequest")}"
    puts "\tvpr_document: #{@tr.getStats("vpr_document", "TypicalRequest", "SpikeRequest")}"  
    puts "\tvpr_rad: #{@tr.getStats("vpr_rad", "TypicalRequest", "SpikeRequest")}"
    puts "\tvpr_order: #{@tr.getStats("vpr_order", "TypicalRequest", "SpikeRequest")}"  
    puts "\tvpr_accession: #{@tr.getStats("vpr_accession", "TypicalRequest", "SpikeRequest")}"  
    puts "\tvpr_immunization: #{@tr.getStats("vpr_immunization", "TypicalRequest", "SpikeRequest")}"  
    puts "\tvpr_consult: #{@tr.getStats("vpr_consult", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_appointment: #{@tr.getStats("hdr_appointment", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_consult: #{@tr.getStats("hdr_consult", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_cpt: #{@tr.getStats("hdr_cpt", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_document: #{@tr.getStats("hdr_document", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_education: #{@tr.getStats("hdr_education", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_exams: #{@tr.getStats("hdr_exams", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_factor: #{@tr.getStats("hdr_factor", "TypicalRequest", "SpikeRequest")}"     
    puts "\thdr_image: #{@tr.getStats("hdr_image", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_immunization: #{@tr.getStats("hdr_immunization", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_mentalhealth: #{@tr.getStats("hdr_mentalhealth", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_order: #{@tr.getStats("hdr_order", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_pointofvisits: #{@tr.getStats("hdr_pointofvisits", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_problem: #{@tr.getStats("hdr_problem", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_procedure: #{@tr.getStats("hdr_procedure", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_skin: #{@tr.getStats("hdr_skin", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_surgery: #{@tr.getStats("hdr_surgery", "TypicalRequest", "SpikeRequest")}" 
    puts "\thdr_visit: #{@tr.getStats("hdr_visit", "TypicalRequest", "SpikeRequest")}" 
    puts "\tDoD_MedViewDef: #{@tr.getStats("DoD_MedViewDef", "TypicalRequest", "SpikeRequest")}"
    puts "\tDoD_NotesUnfilteredViewDef: #{@tr.getStats("DoD_NotesUnfilteredViewDef", "TypicalRequest", "SpikeRequest")}"  
    puts "\tDoD_ProblemViewDef: #{@tr.getStats("DoD_ProblemViewDef", "TypicalRequest", "SpikeRequest")}"

    puts
    
    actualAvg_fhir_adversereaction = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "fhir_adversereaction", "TypicalRequest")
    actualAvg_fhir_diagnosticReport = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "fhir_diagnosticReport", "TypicalRequest")
    actualAvg_fhir_observation = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "fhir_observation", "TypicalRequest")        
    actualAvg_fhir_patient = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "fhir_patient", "TypicalRequest")
    actualAvg_fhir_MedicationStatement = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "fhir_MedicationStatement", "TypicalRequest")
    actualAvg_fhir_MedicationAdministration = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "fhir_MedicationAdministration", "TypicalRequest")
    actualAvg_fhir_MedicationDispense = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "fhir_MedicationDispense", "TypicalRequest")
    actualAvg_fhir_rad = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "fhir_rad", "TypicalRequest")
    actualAvg_vpr_allergy = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_allergy", "TypicalRequest")
    actualAvg_vpr_vital = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_vital", "TypicalRequest")
    actualAvg_vpr_patient = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_patient", "TypicalRequest")
    actualAvg_vpr_search = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_search", "TypicalRequest")
    actualAvg_vpr_search_RecordTypesummary = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_search_RecordTypesummary", "TypicalRequest")
    actualAvg_vpr_search_Med = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_search_Med", "TypicalRequest")
    actualAvg_vpr_lab = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_lab", "TypicalRequest") 
    actualAvg_vpr_problem = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_problem", "TypicalRequest")
    actualAvg_vpr_med = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_med", "TypicalRequest")
    actualAvg_vpr_document = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_document", "TypicalRequest")
    actualAvg_vpr_rad = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_rad", "TypicalRequest")
    actualAvg_vpr_order = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_order", "TypicalRequest")
    actualAvg_vpr_accession = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_accession", "TypicalRequest")
    actualAvg_vpr_immunization = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_immunization", "TypicalRequest")
    actualAvg_vpr_consult = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_consult", "TypicalRequest") 
    actualAvg_hdr_appointment = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_appointment", "TypicalRequest") 
    actualAvg_hdr_consult = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_consult", "TypicalRequest") 
    actualAvg_hdr_cpt = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_cpt", "TypicalRequest") 
    actualAvg_hdr_document = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_document", "TypicalRequest") 
    actualAvg_hdr_education = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_education", "TypicalRequest") 
    actualAvg_hdr_exams = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_exams", "TypicalRequest") 
    actualAvg_hdr_factor = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_factor", "TypicalRequest") 
    actualAvg_hdr_image = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_image", "TypicalRequest") 
    actualAvg_hdr_immunization = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_immunization", "TypicalRequest") 
    actualAvg_hdr_mentalhealth = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_mentalhealth", "TypicalRequest") 
    actualAvg_hdr_order = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_order", "TypicalRequest") 
    actualAvg_hdr_pointofvisits = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_pointofvisits", "TypicalRequest") 
    actualAvg_hdr_problem = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_problem", "TypicalRequest") 
    actualAvg_hdr_procedure = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_procedure", "TypicalRequest") 
    actualAvg_hdr_skin = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_skin", "TypicalRequest") 
    actualAvg_hdr_surgery = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_surgery", "TypicalRequest") 
    actualAvg_hdr_visit = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "hdr_visit", "TypicalRequest")                      
    actualAvg_DoD_MedViewDef = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "DoD_MedViewDef", "TypicalRequest")
    actualAvg_DoD_NotesUnfilteredViewDef = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "DoD_NotesUnfilteredViewDef", "TypicalRequest")
    actualAvg_DoD_ProblemViewDef = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "DoD_ProblemViewDef", "TypicalRequest")

    module TestResult
      def TestResult.result(result)
        @@results ||= Array.new
        if result == "show"
          @@results.inspect
        else
          @@results << result
        end
      end
    end

    if actualAvg_fhir_adversereaction >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_fhir_diagnosticReport >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_fhir_observation >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_fhir_patient >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_fhir_MedicationStatement >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_fhir_MedicationAdministration >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_fhir_MedicationDispense >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_fhir_rad >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_allergy >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_vital >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_patient >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_search >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_search_RecordTypesummary >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_search_Med >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_lab >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_problem >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_med >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_document >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_rad >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_order >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_accession >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_immunization >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_vpr_consult >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_appointment >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_consult >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end        
    if actualAvg_hdr_cpt >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_document >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_education >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end        
    if actualAvg_hdr_exams >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_factor >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_image >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end        
    if actualAvg_hdr_immunization >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_mentalhealth >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_order >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end        
    if actualAvg_hdr_pointofvisits >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_problem >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_procedure >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end        
    if actualAvg_hdr_skin >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_surgery >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_hdr_visit >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end 
    if actualAvg_DoD_MedViewDef >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_DoD_NotesUnfilteredViewDef >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end
    if actualAvg_DoD_ProblemViewDef >= avgRespTime.to_f then TestResult.result "failed" else TestResult.result "passed" end

    #puts TestResult.result 'show' 
    scenarioResultList = TestResult.result 'show'

    if scenarioResultList.include? 'failed'  
        raise p "Test failed"
    else 
        p "Test passed"
    end
end    
