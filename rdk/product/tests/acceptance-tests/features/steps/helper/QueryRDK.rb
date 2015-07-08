path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'DefaultLogin.rb'

class BuildQuery
  def initialize
    @path = ''
    @number_parameters = 0
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def path
    #p URI.encode(@path)
    return URI.encode(@path)
  end
end

class PaginationQuery < BuildQuery
  def initialize
    super()
  end

  def add_start(start)
    add_parameter("start", start)
  end

  def add_limit(limit)
    add_parameter("limit", limit)
  end
end

class PatientSearchLast5 < PaginationQuery
  def initialize(last5)
    super()
    title = "patient-search-last5"
    domain_path = RDClass.resourcedirectory.get_url(title)
    p "domain path: #{domain_path}"
    @path.concat(domain_path)
    @number_parameters = 0
    add_parameter("last5", last5) 
  end
end

class PatientSearchFullName < PaginationQuery
  def initialize(full_name)
    super()
    title = "patient-search-full-name"
    domain_path = RDClass.resourcedirectory.get_url(title)
    p "domain path: #{domain_path}"
    @path.concat(domain_path)
    @number_parameters = 0
    add_parameter("name.full", full_name)
  end
end

class QueryRDKSync < BuildQuery
  def initialize(command, pid = nil)
    super()

    title = "synchronization-#{command}"
    domain_path = RDClass.resourcedirectory.get_url(title)
    @path.concat(domain_path)
    add_parameter("pid", pid) unless pid.nil?
  end
end

class RDClass
  @@resourcedirectory = nil
  def self.resourcedirectory
    if @@resourcedirectory.nil?
      p "FIRST TIME: DISCOVER PATHS"
      base_url = DefaultLogin.rdk_url
      path = "#{base_url}/resource/resourcedirectory"
      p base_url
      @response = HTTPartyWithBasicAuth.get_with_authorization(path)
      @@resourcedirectory= ResourceDirectory.new(JSON.parse(@response.body), base_url)
    end # if
    return @@resourcedirectory
  end #def self.resourcedirectory
end

class QuerySingleItem < BuildQuery
#http://10.4.4.105:9898/patientrecord/domain?pid=10108&uid=uid
  def initialize(pid, uid)
    super()
    title = "uid"
    domain_path = RDClass.resourcedirectory.get_url(title)
    p "domain path: #{domain_path}"
    @path.concat(domain_path)
    @number_parameters = 0
    add_parameter("pid", pid) 
    add_parameter("uid", uid) 
    p "path: #{path}"
  end
end

class QueryRDKDomain < BuildQuery
  # http://127.0.0.1:8888/patientrecord/domain/allergy?pid=1
  def initialize(datatype, pid = nil)
    super()
    title = "patient-record-#{datatype}"
    domain_path = RDClass.resourcedirectory.get_url(title)

    @path.concat(domain_path)
    @number_parameters = 0
    add_parameter("pid", pid) unless pid.nil?
  end
end

class QueryRDKAudit < BuildQuery
  def initialize(searchterm, searchvalue)
    super()
    domain_path = RDClass.resourcedirectory.get_url("audit-record-search")

    @path.concat(domain_path)
    add_parameter(searchterm, searchvalue)
  end
end

#https://10.3.3.5/fhir/patient/_search?name=EIGHT,PATIENT&_format=json&_skip=0&_count=20&_ack=true
class SearchRDK < BuildQuery
  def initialize(resultsRecordType = nil)
    super()

    domain_path = RDClass.resourcedirectory.get_url("patient-search-full-name")
    @path.concat(domain_path)
    @path.concat("/#{resultsRecordType}") unless resultsRecordType.nil?
    @number_parameters = 0
  end
end

class QueryRDKAPI < BuildQuery
  # http://10.4.4.105:8888/patientrecord/labsbyorder?pid=11016V630869&orderUid=urn:va:order:9E7A:227:16682
  def initialize(datatype, pid, auto_acknowledge = "true")
    super()
    @number_parameters = 0
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient/record/labs/by-order")
    add_parameter("pid", pid)
    add_parameter("uid", datatype)
    add_acknowledge(auto_acknowledge)
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end

  def path
    return @path
  end
end # class

class QueryRDKVisitAPI < BuildQuery
  # http://10.4.4.105:8888/visits/providers
  def initialize(command, pid = nil, fcode = nil)
    super()
    @number_parameters = 0
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/visits/#{command}")
    if pid != nil
      add_parameter("pid", pid)
    end
    if fcode != nil
      add_parameter("facility.code", fcode)
    end
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end

  def path
    return @path
  end
end # class

class QueryGenericRDK < BuildQuery
  # http://10.4.4.105:8888/visits/providers
  def initialize(command, pid = nil, action = nil)
    super()
    @number_parameters = 0
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/#{command}")

    if pid != nil
      @path.concat("/#{pid}")
    end
    if action != nil
      @path.concat("/#{action}")
    end
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end

  def path
    return @path
  end
end # class

#http://10.4.4.105:8888/patientrecord/search/suggest?pid=10110&query=med
class QueryRDKSearchSuggestion < BuildQuery
  p "inside class QueryRDKSearchSuggestion"
  def initialize(pid, text)
    super()
    domain_path = RDClass.resourcedirectory.get_url("patient-record-search-suggest")
    @path.concat(domain_path)
    add_parameter("pid", pid)
    add_parameter("query", text)
  end
end

#http://10.4.4.105:8888/patientrecord/search/text?query=document&pid=9E7A;100022
class QueryRDK < BuildQuery
  p "inside class QueryRDK"
  def initialize(pid, type)
    super()
    domain_path = RDClass.resourcedirectory.get_url("patient-record-search-text")
    @path.concat(domain_path)
    add_parameter("query", type)
    add_parameter("pid", pid)
    #add_parameter("query", text)
  end
end

#http://10.4.4.105:8888/fhir/patient/urn:va:patient:9E7A:100716:100716
class QueryRDKDemographics < BuildQuery
  def initialize(type, uid)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/fhir/" + type + "/" + uid)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end
end

#http://10.4.4.5:8888/fhir/***/?subject.identifier=C877;100033
class QueryRDKAll < BuildQuery
  def initialize(type)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/fhir/" + type)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end
end

#http://10.4.4.5:8888/resource/vler/9E7A;8/toc?encounterUid=urn:va:visit:9E7A:8:1218
class QueryRDKVler < BuildQuery
  def initialize(type)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/vler/" + type + "/toc")
  end

  def add_encount(encount)
    add_parameter("encounterUid", encount)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end
end

#http://10.4.4.105:8888/patient-search/last5?last5=B0008&start=5
class QueryRDKSearchLast5 < BuildQuery
  def initialize(last5, start_index = nil, limit = nil)
    super()
    domain_path = RDClass.resourcedirectory.get_url("patient-search-last5")
    @path.concat(domain_path)
    add_parameter("last5", last5)
    add_parameter("start", start_index) unless limit.nil?
    add_parameter("limit", limit) unless limit.nil?
  end
end

#http://10.4.4.105:8888/locations/wards?range=B0008&start=5
class QueryRDKSearchWord < BuildQuery
  def initialize(range, start_index = nil, limit = nil)
    super()
    domain_path = RDClass.resourcedirectory.get_url("locations-wards")
    @path.concat(domain_path)
    add_parameter("range", range)
    add_parameter("start", start_index) unless limit.nil?
    add_parameter("limit", limit) unless limit.nil?
  end
end

class PatientSearchWord < PaginationQuery
  def initialize(range)
    super()
    title = "locations-wards"
    domain_path = RDClass.resourcedirectory.get_url(title)
    p "---------"
    p "domain path: #{domain_path}"
    @path.concat(domain_path)
    @number_parameters = 0
    add_parameter("range", range) 
  end
end

class QueryRDKSearchClinics < BuildQuery
  def initialize(range, start_index = nil, limit = nil)
    super()
    domain_path = RDClass.resourcedirectory.get_url("locations-clinics")
    @path.concat(domain_path)
    add_parameter("range", range)
    add_parameter("start", start_index) unless limit.nil?
    add_parameter("limit", limit) unless limit.nil?
  end
end

class PatientSearchClinics < PaginationQuery
  def initialize(range)
    super()
    title = "locations-clinics"
    domain_path = RDClass.resourcedirectory.get_url(title)
    p "---------"
    p "domain path: #{domain_path}"
    @path.concat(domain_path)
    @number_parameters = 0
    add_parameter("range", range) 
  end
end
#http://10.4.4.105:8888/search/globalsearch?lname=EIGHT&fname=PATIENT
class GlobalPatientSearch < BuildQuery
  def initialize
    super()
    title = "search-global-search"
    domain_path = RDClass.resourcedirectory.get_url(title)
    p "domain path: #{domain_path}"
    @path.concat(domain_path)
  end
end

class PatientPhotoSearch < BuildQuery
  def initialize
    super()
    title = "patientphoto-getPatientPhoto"
    domain_path = RDClass.resourcedirectory.get_url(title)
    p "domain path: #{domain_path}"
    @path.concat(domain_path)
  end
end

#http://10.4.4.105:8888/search/my-cprs-list
class DefaultPatientSearch < BuildQuery
  def initialize
    super()
    title = "search-default-search"
    domain_path = RDClass.resourcedirectory.get_url(title)
    p "domain path: #{domain_path}"
    @path.concat(domain_path)
  end
end

#http://10.4.4.105:8888/resource/auth/authentication
class Authentication < BuildQuery
  def initialize
    super()
    title = "authentication-authentication"
    domain_path = RDClass.resourcedirectory.get_url(title)
    p "domain path: #{domain_path}"
    @path.concat(domain_path)
  end
end

if __FILE__ == $PROGRAM_NAME
  q= QueryRDKSync.new("one", "two")
  p q.path
  p QueryRDKAPI.new("uid", "3", "false").path
end

#http://10.4.4.105:8888/patientrecord/domain/document?pid=10108V420871&filter=eq(kind,"Progress Note")
class QueryRDKFilterBySummary < BuildQuery
  p "inside class QueryRDKFilterBySummary"
  def initialize(pid = nil, filter = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient-record/domain/document")
    add_parameter("pid", pid) unless pid.nil?
    add_parameter("filter", filter) unless filter.nil?
  end
end

class QueryRDKfilter < BuildQuery
  def initialize(command, pid = nil , filter = nil)
    super()
    title = "synchronization-#{command}"
    domain_path = RDClass.resourcedirectory.get_url(title)
    @path.concat(domain_path)
    add_parameter("pid", pid) unless pid.nil?
    add_parameter("filter", filter) unless filter.nil?
   # add_parameter("note", note)
  end
end
class QueryRDKfacilityCode < BuildQuery
  p "inside class QueryRDKWord"
  def initialize(name, facilityCode)
    super()
    domain_path = RDClass.resourcedirectory.get_url("locations-wards")
    @path.concat(domain_path)
    add_parameter("name", name)
    add_parameter("facility.code", facilityCode)
  end
end

class QueryRDKsiteCode < BuildQuery
  p "inside class QueryRDKWord"
  def initialize(siteCode)
    super()
    domain_path = RDClass.resourcedirectory.get_url("locations-wards")
    @path.concat(domain_path)
    add_parameter("site.code", siteCode)
  end
end

#http://10.4.4.105:8888/locations/clinics?siteCode=C877
class QueryfacilityCode < BuildQuery
  p "inside class QueryRDKWord"
  def initialize(name, facilityCode)
    super()
    domain_path = RDClass.resourcedirectory.get_url("locations-clinics")
    @path.concat(domain_path)
    add_parameter("name", name)
    add_parameter("facility.code", facilityCode)
  end
end

class QuerysiteCode < BuildQuery
  p "inside class QueryRDKWord"
  def initialize(siteCode)
    super()
    domain_path = RDClass.resourcedirectory.get_url("locations-clinics")
    @path.concat(domain_path)
    add_parameter("site.code", siteCode)
  end
end

#http://10.4.4.105:8888/locations/clinics/search?locationUid=urn:va:location:9E7A:23&filter=eq(familyName,"EIGHT")&startDate=20010725
class RDKclinicStartdate < BuildQuery
 # p "inside class RDKcliniCSearch "
  def initialize(locationUid = nil , filter = nil , startDate = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/locations/clinics/patients")
    add_parameter("uid", locationUid) unless locationUid.nil?
    add_parameter("filter", filter) unless filter.nil?
    add_parameter("date.start", startDate) unless startDate.nil?
  end
end

class RDKclinicStopdate < BuildQuery
  def initialize(locationUid = nil , filter = nil , startDate = nil , stopDate = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/locations/clinics/patients")
    add_parameter("uid", locationUid) unless locationUid.nil?
    add_parameter("filter", filter) unless filter.nil?
    add_parameter("date.start", startDate) unless startDate.nil?
    add_parameter("date.end", stopDate) unless stopDate.nil?
  end
end

class RDKclinicSearch < BuildQuery
  p "inside class RDKcliniCSearch "
  def initialize(locationUid = nil , filter = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/locations/clinics/search")
    add_parameter("locationUid", locationUid) unless locationUid.nil?
    add_parameter("filter", filter) unless filter.nil?
   # add_parameter("startDate", startDate) unless startDate.nil?
  end
end
#http://10.4.4.105:8888/locations/wards/search?refId=38&locationUid=urn:va:location:9E7A:158&filter=eq(familyName,%22EIGHT%22)
class RDKWordSearch < BuildQuery
  p "inside class RDKcliniCSearch "
  def initialize(refId = nil, locationUid = nil , filter = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/locations/wards/patients")
    add_parameter("ref.id", refId) unless refId.nil?
    add_parameter("uid", locationUid) unless locationUid.nil?
    add_parameter("filter", filter) unless filter.nil?
  end
end

#http://10.4.4.105:8888/resource/user/filter?id=TEST2&filter=filter1&instanceId=1234
class RDKUdaf < BuildQuery
  p "inside class RDKudaf verification "
  def initialize(id = nil, filter = nil , instanceId = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/user/filter")
    add_parameter("id", id) unless id.nil?
    add_parameter("filter", filter) unless filter.nil?
    add_parameter("instanceId", instanceId) unless instanceId.nil?
  end
end

#http://10.4.4.105:8888/resource/user/filter/all?id=TEST1&instanceId=1234
class RDKRemoveUdafs < BuildQuery
  p "inside class RDKRemoveudafs verification "
  def initialize(id = nil, instanceId = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/user/filter/all")
    add_parameter("id", id) unless id.nil?
    add_parameter("instanceId", instanceId) unless instanceId.nil?
  end
end

#http://10.4.4.105:8888/resource/operational-data/type/vital?limit=5&accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
class RDKVitalsPicklist < BuildQuery
  p "inside class RDKVitalsPicklist verification "
  def initialize(limit = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/operational-data/type/vital")
    add_parameter("limit", limit) unless limit.nil?
  end
end

#http://10.4.4.105:8888/resource/operational-data/type/laboratory?limit=5&accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
class RDKLabsPicklist < BuildQuery
  p "inside class RDKLabsPicklist verification "
  def initialize(limit = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/operational-data/type/laboratory")
    add_parameter("limit", limit) unless limit.nil?
  end
end

#http://10.4.4.105:8888/resource/operational-data/type/medication?limit=5&accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
class RDKMedsPicklist < BuildQuery
  p "inside class RDKMedsPicklist verification "
  def initialize(limit = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/operational-data/type/medication")
    add_parameter("limit", limit) unless limit.nil?
  end
end

#http://10.4.4.105:8888/resource/user/filter?id=TEST2&filter=filter1&instanceId=1234
class RDKTileSort< BuildQuery
  def initialize(id = nil, filter = nil , instanceId = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/user/sort")
    add_parameter("id", id) unless id.nil?
    add_parameter("instanceId", instanceId) unless instanceId.nil?
  end
end

#http://10.4.4.105:8888/resource/user/set/this?pid=10108V420871&accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
class RDKDelWorkspaceContent< BuildQuery
  def initialize(pid = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/user/screens")
    add_parameter("pid", pid) unless pid.nil?
  end
end

#http://10.4.4.105:8888/resource/user/filter?id=user-defined-workspace-1&instanceId=applet-1&filter=CHOCOLATE&accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
class RDKAddFilter< BuildQuery
  def initialize(id = nil, instanceId = nil, filter = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/user/filter")
    add_parameter("id", id) unless id.nil?
    add_parameter("instanceId", instanceId) unless instanceId.nil?
    add_parameter("filter", filter) unless filter.nil?
  end
end

#http://10.4.4.105:8888/resource/user/stack?id=user-defined-workspace-1&instanceId=applet-1&graphType=vitals&typeName=temperature&accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
class RDKAddDelGraph< BuildQuery
  def initialize(id = nil, instanceId = nil, graphType = nil, typeName = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/user/stack")
    add_parameter("id", id) unless id.nil?
    add_parameter("instanceId", instanceId) unless instanceId.nil?
    add_parameter("graphType", graphType) unless graphType.nil?
    add_parameter("typeName", typeName) unless typeName.nil?
  end
end

#http://10.4.4.105:8888/resource/user/stack/all?id=user-defined-workspace-1&instanceId=applet-1&accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
class RDKDelStackedGraphApplet< BuildQuery
  def initialize(id = nil, instanceId = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/user/stack/all")
    add_parameter("id", id) unless id.nil?
    add_parameter("instanceId", instanceId) unless instanceId.nil?
  end
end

class Writeback < BuildQuery
  def initialize(param = nil , pid = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/writeback/opmed/formulary")
    add_parameter("param", param) unless param.nil?
    add_parameter("pid", pid) unless pid.nil?
  end
end
#http://10.4.4.105:8888/writeback/med/dayssupply?param={"patientIEN":"149", "drugIEN":"1713", "medIEN":"3500"}&pid=10108V420871&_=1418830020877
class DaysSupply < BuildQuery
  def initialize(param = nil , pid = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/writeback/med/dayssupply")
    add_parameter("param", param) unless param.nil?
    add_parameter("pid", pid) unless pid.nil?
  end
end

#http://10.4.4.105:8888/writeback/med/dayssupply?param={"patientIEN":"149", "drugIEN":"1713", "medIEN":"3500"}&pid=10108V420871&_=1418830020877
# http://10.4.4.105:8888/writeback/med/daytoquantity?param={"supply":"30", "dose":"1", "schedule":"QPM", "duration":"~", "patientIEN": "149", "drugIEN":"1715"}&pid=1018V420871&_=1418830020877
class MedQuantity < BuildQuery
  def initialize(param = nil , pid = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/writeback/med/daytoquantity")
    add_parameter("param", param) unless param.nil?
    add_parameter("pid", pid) unless pid.nil?
  end
end

#http://10.4.4.105:8888/patientrecord/domain/document?pid=10108V420871&filter=eq(summary,%22Progress%20Note%22)&order=referenceDateTime desc
class Queryorder < BuildQuery
  def initialize(pid = nil , filter = nil , order = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient/record/domain/document")
    add_parameter("pid", pid) unless pid.nil?
    add_parameter("filter", filter) unless filter.nil?
    add_parameter("order", order)  unless order.nil?
   # add_parameter("note", note)
  end
end

#http://10.4.4.105:8888/patientrecord/cwad?pid=C877%3B100022&filter=ilike(kind,"%25Allergy%25")
class Querycwad < BuildQuery
  def initialize(pid = nil , filter = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient/record/cwad")
    add_parameter("pid", pid) unless pid.nil?
    add_parameter("filter", filter) unless filter.nil?
   # add_parameter("note", note)
  end
end

#http://10.4.4.105:8888/resource/patientrecord/timeline?pid=9E7A;164
class QueryTimeline < BuildQuery
  def initialize(pid = nil , filter = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient/record/timeline")
    add_parameter("pid", pid) unless pid.nil?
  end
end
#http://10.4.4.105:8888/resource/globaltimeline?pid=9E7A;100022
class QueryVisistHistory < BuildQuery
  def initialize(pid = nil , filter = nil)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient/global-timeline")
    add_parameter("pid", pid) unless pid.nil?
  end
end

class QueryGenericVISTA < BuildQuery
  # http://10.4.4.105:8888/visits/providers
  def initialize(command, pid = nil, action = nil)
    super()
    @number_parameters = 0
    @path = String.new(DefaultLogin.vista_url)
    @path.concat("/#{command}")
    # @path.concat(pid)
    if pid != nil
      @path.concat("/#{pid}")
    end
    if action != nil
      @path.concat("/#{action}")
    end
  end
end

class QueryRDKHS < BuildQuery
  # http://10.4.4.105:8888/resource/healthsummaries/getSitesInfoFromPatientData?pid=10108V420871
  def initialize(pid, auto_acknowledge = "true")
    super()
    #@number_parameters = 0
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient/health-summaries/sites")
    add_parameter("pid", pid)
    #add_parameter("orderUid", datatype)
    add_acknowledge(auto_acknowledge)
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end

  def path
    return @path
  end
end # class

class QueryRDKHSReport < BuildQuery
  # http://10.4.4.105:8888/resource/healthsummaries/getReportContentByReportID?pid=10108V420871&site=9E7A&reportid=5000009
  def initialize(pid, siteid, reportid, auto_acknowledge = "true")
    super()
    @number_parameters = 0
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient/health-summaries/reports")
    add_parameter("pid", pid)
    add_parameter("site.id", siteid)
    add_parameter("report.id", reportid)
    add_acknowledge(auto_acknowledge)
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end

  def path
    return @path
  end
end # class

class QueryRDKHSReportNoPID < BuildQuery
  # http://10.4.4.105:8888/resource/healthsummaries/getReportContentByReportID?pid=10108V420871&site=9E7A&reportid=5000009
  def initialize(siteid, reportid, auto_acknowledge = "true")
    super()
    @number_parameters = 0
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient/health-summaries/reports")
    #add_parameter("pid", pid)
    add_parameter("site.id", siteid)
    add_parameter("report.id", reportid)
    add_acknowledge(auto_acknowledge)
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end

  def path
    return @path
  end
end # class

class QueryRDKHSReportNoSiteID < BuildQuery
  # http://10.4.4.105:8888/resource/healthsummaries/getReportContentByReportID?pid=10108V420871&site=9E7A&reportid=5000009
  def initialize(pid, reportid, auto_acknowledge = "true")
    super()
    @number_parameters = 0
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient/health-summaries/reports")
    #add_parameter("pid", pid)
    add_parameter("pid", pid)
    add_parameter("report.id", reportid)
    add_acknowledge(auto_acknowledge)
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end

  def path
    return @path
  end
end # class

class QueryRDKHSReportNoReportID < BuildQuery
  # http://10.4.4.105:8888/resource/healthsummaries/getReportContentByReportID?pid=10108V420871&site=9E7A&reportid=5000009
  def initialize(pid, site, auto_acknowledge = "true")
    super()
    @number_parameters = 0
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient/health-summaries/reports")
    add_parameter("pid", pid)
    add_parameter("site.id", site)
    add_acknowledge(auto_acknowledge)
  end

  def add_parameter(param, value)
    if @number_parameters == 0
      @path.concat("?")
    else
      @path.concat("&")
    end
    @number_parameters = @number_parameters + 1
    @path.concat(param)
    @path.concat("=")
    @path.concat(value)
  end

  def add_acknowledge(ack)
    add_parameter("_ack", ack)
  end

  def path
    return @path
  end
end # class

#http://10.4.4.105:8888/resource/patient/record/domain/vital?filter=and(DATEFILTER)&pid=10107V395912
class QueryRDKCCB < BuildQuery
  def initialize(type)
    super()
    @path = String.new(DefaultLogin.rdk_url)
    @path.concat("/resource/patient/record/domain/vital?filter=and(ne(r350407%22%2C%2220150420235959%22))%2C%20ne(result%2CPass)&pid=" + type)
  end
end
