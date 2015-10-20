# Demonstration cucumber script for performing a set of performance tests using
# the performance testing framework.



require "agilex-loadgen"


Given /^that eVPR has ramped up to a load of "([^"]*)" requests per second after "([^"]*)" minutes and continues for "([^"]*)" minutes$/ do |typReqRate, typRampTime, typDuration|
  
    @LocalProjectRoot = ENV["WORKSPACE"]
    #@LocalProjectRoot = "~/Projects/vistacore/ehmp"
    @TargetEnvName = @LocalProjectRoot + "/infrastructure/vagrant/aws/vista-exchange"
    
    @TargetHostName = 've-api'

    # The gem server where agilex-loadgen is hosted.
    @ProjectGemServerURL = "https://gem.vistacore.us"
    
    
    @typReqRate = typReqRate
    @typRampTime = typRampTime
    @typDuration = typDuration
    
    
    @rt1 = LoadGenerator.requestType :TypicalRequest
        @rt1.tag "@perf.FHIRhttparty"
        #@rt1.tag "@perf.spikedelta" 

        @rt1.color= "darkblue"  # See http://www.december.com/html/spec/colorsvg.html
    
    
    @d1 = LoadGenerator.distribution :TypicalDistribution, :ramp
    
        @d1.level @typReqRate, @typRampTime  # ramp up to the request rate.
        @d1.level @typReqRate, @typDuration  # keep the base load going until the end of the test.
        
    
    @p1 = LoadGenerator.profile :TypicalProfile

        @p1.requestType= :TypicalRequest
        @p1.distribution= :TypicalDistribution
        
end
        
        
When /^the load is increased by "([^"]*)" requests per second after "([^"]*)" minutes for "([^"]*)" minutes$/ do |spikeReqRate, spikeDelay, spikeDuration|

    @spikeReqRate = spikeReqRate
    @spikeDelay = spikeDelay
    @spikeDuration = spikeDuration
    
    @rt2 = LoadGenerator.requestType :SpikeRequest
        @rt2.tag "@perf.FHIRhttparty"
        #@rt2.tag "@perf.spikedelta"        
        #@rt2.color= "goldenrod"
        @rt2.color= "forestgreen"
    
    
    @d2 = LoadGenerator.distribution :SpikeDistribution, :ramp
    
        @d2.level 0.0, spikeDelay
        @d2.level spikeReqRate, 0.01
        @d2.level spikeReqRate, spikeDuration
        @d2.level 0.0, 0.01
        
        
    @p2 = LoadGenerator.profile :SpikeProfile
    
        @p2.requestType= :SpikeRequest
        @p2.distribution= :SpikeDistribution
    
    
    #LoadGenerator.ipPool "10.3.3.30", "10.3.3.31"  # needed by VirtualBox.
    
    puts "@LocalProjectRoot=#{@LocalProjectRoot}"
    LoadGenerator.resultsDirectory= @LocalProjectRoot + "/product/tests/performance-tests/results"
    
    @provider = LoadGenerator.dynamicProvider :awsconf  # for AWS
    #@provider = LoadGenerator.providerConfig :vbconf  # for VirtualBox
        @provider.providerName= :aws
        @provider.providerBoxName= "aws-dummy"
        @provider.providerBoxURL= "https://github.com/mitchellh/vagrant-aws/raw/master/dummy.box"
        #@provider.providerName= :virtualbox
        #@provider.providerBoxName= "opscode-centos-6.3"
        #@provider.providerBoxURL= "https://dl.vistacore.us/repositories/filerepo/com/vagrantup/basebox/opscode-centos/6.3/opscode-centos-6.3.box"


    @tr = LoadGenerator.testRun :NormalTestRun
    
        @tr.providerConfig= "awsconf"
        #@tr.providerConfig= "vbconf"  # for virtualbox
        
        require File.expand_path(@TargetEnvName + "/../VagrantfileUtil.rb")
        @tr.defineEnvVariable "EHMP_IP", VagrantfileUtil::AWS.get_private_ip("vista-exchange", "ehmp")
        @tr.defineEnvVariable "VE_API_IP", VagrantfileUtil::AWS.get_private_ip("vista-exchange", "ve-api")
        @tr.defineEnvVariable "JDS_IP", VagrantfileUtil::AWS.get_private_ip("vista-exchange", "jds")
        
        @tr.projectGemServerURL= @ProjectGemServerURL
        @tr.localProjectRoot= @LocalProjectRoot
        @tr.projectName= "vistacore"
        @tr.projectRepoName= "ehmp"
        @tr.projectRepoURL= "https://git.vistacore.us/git/ehmp.git"
        @tr.projectRepoFQDN= "git.vistacore.us"
        @tr.gitUserid= ENV['GIT_USER']
        @tr.gitPassword= ENV['GIT_PASSWORD']

        
        # The features directory is relative to the local project root.
        @tr.featuresDirectory= "product/tests/performance-tests/client-tests/features"
        
        @tr.feature "perf.FHIRhttparty.feature"
        #@tr.feature "perf.spikedelta.feature"  # commented out because this feature does not match any step.
        
        # If features are NOT specified, then the whole directory will be run.
        # If features ARE specified, then only those will be run.
        #tr.feature "features/authentication/authenticate_user.feature"
        #tr.feature "features/get_vitals.feature"

        # Draw graphs for these events.
        @tr.graphEvent "vpr_allergy"
        @tr.graphEvent "vpr_vital"
        @tr.graphEvent "vpr_patient"
        
        @tr.nodes= 2
        
        @tr.useProfile :TypicalProfile
        
        @tr.useProfile :SpikeProfile
        
        #@tr.reuseNodes  # re-provision existing nodes if present.
        @tr.keepNodes  # do not destroy nodes at the end.
        
        @tr.start
        
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
