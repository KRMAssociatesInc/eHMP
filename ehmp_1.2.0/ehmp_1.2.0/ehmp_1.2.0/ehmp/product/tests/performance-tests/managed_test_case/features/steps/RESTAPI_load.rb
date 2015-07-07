require "agilex-loadgen"


Given /^that eVPR has ramped up to a load of "([^"]*)" requests per second after "([^"]*)" minutes and continues for "([^"]*)" minutes$/ do |typReqRate, typRampTime, typDuration|
  
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
    
    
    require @LocalProjectRoot + "/infrastructure/vagrant/managed/ManagedServers.rb"
    
    
    LoadGenerator.setResultsDirectory (@LocalProjectRoot + "/product/tests/performance-tests/results")

    
    LoadGenerator.requestType :TypicalRequest do
        tag "@perf.FHIRhttparty"

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
        
        
When /^for test "([^"]*)" the load is increased by "([^"]*)" requests per second after "([^"]*)" minutes for "([^"]*)" minutes$/ do |testRunName, spikeReqRate, spikeDelay, spikeDuration|

    @spikeDuration = spikeDuration
    

    LoadGenerator.requestType :SpikeRequest do
        tag "@perf.FHIRhttparty"
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
        setProviderBoxName ProviderBoxName
        setProviderBoxURL ProviderBoxURL
    end
    

    SSHUserid = @SSHUserid
    LoadGenerator.staticProvider :vbmconf do
        envinfo = get_managed_server_info_for_environment("aws-managed-perf")
        setProviderName :managed
        setUserid SSHUserid
        #setProviderBoxName ProviderBoxName
        #setProviderBoxURL ProviderBoxURL
        setVagrantfileDir VagrantfileDir
        node 'test_client_1', envinfo.get_ip("test_client_1")
        node 'test_client_2', envinfo.get_ip("test_client_2")
    end


    ProviderBoxName = @ProviderBoxName
    ProviderBoxURL = @ProviderBoxURL
    SSHUserid = @SSHUserid
    VagrantfileDir = @VagrantfileDir
    
    LoadGenerator.staticProvider :awsmconf do
        envinfo = get_managed_server_info_for_environment("aws-managed-perf")
        setProviderName :managed
        setUserid SSHUserid
        #setProviderBoxName ProviderBoxName
        #setProviderBoxURL ProviderBoxURL
        
        $stderr.puts "\t\t\t**Setting VagrantfileDir=#{VagrantfileDir}"
        
        
        setVagrantfileDir VagrantfileDir
        node 'test_client_1', envinfo.get_ip("test_client_1")
        node 'test_client_2', envinfo.get_ip("test_client_2")
        #node 'aws-managed-perf-test_client_1-20140707-151400', envinfo.get_ip("aws-managed-perf-test_client_1-20140707-151400")
        #node 'aws-managed-perf-test_client_1-20140707-151403', envinfo.get_ip("aws-managed-perf-test_client_1-20140707-151403")
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
        puts "Using provider #{Provider}."
        setProviderConfig Provider
        if getProvider.isDynamic? then
            puts "Provider #{getProvider.getConfigurationName} is dynamic"
        else
            puts "Provider #{getProvider.getConfigurationName} is static"
        end
        
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
        feature "perf.FHIRhttparty.feature"
        
        # Select load profiles.
        useProfile :TypicalProfile
        useProfile :SpikeProfile
        
        # Draw graphs for these events.
        graphEvent "vpr_allergy"
        graphEvent "vpr_vital"
        graphEvent "vpr_patient"
        
        # Select how many test client nodes to use.
        if getProvider.isDynamic? then
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
    puts "\tvpr_allergy: #{@tr.getStats("vpr_allergy", "TypicalRequest", "SpikeRequest")}"
    puts "\tvpr_vital: #{@tr.getStats("vpr_vital", "TypicalRequest", "SpikeRequest")}"
    puts "\tvpr_patient: #{@tr.getStats("vpr_patient", "TypicalRequest", "SpikeRequest")}"
    puts
    
    actualAvg_vpr_allergy = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_allergy", "TypicalRequest")
    actualAvg_vpr_vital = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_vital", "TypicalRequest")
    actualAvg_vpr_patient = @tr.avgResponseTimeAfter(@typDuration + @spikeDuration + delay, "vpr_patient", "TypicalRequest")
    
    raise "Failed: actual average (#{actualAvg_vpr_allergy}) > SLA (#{avgRespTime.to_f})" unless actualAvg_vpr_allergy <= avgRespTime.to_f
    raise "Failed: actual average (#{actualAvg_vpr_vital}) > SLA (#{avgRespTime.to_f})" unless actualAvg_vpr_vital <= avgRespTime.to_f
    raise "Failed: actual average (#{actualAvg_vpr_patient}) > SLA (#{avgRespTime.to_f})" unless actualAvg_vpr_patient <= avgRespTime.to_f
    
end

