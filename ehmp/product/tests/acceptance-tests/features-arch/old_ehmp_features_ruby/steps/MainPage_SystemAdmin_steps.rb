Then(/^user request "(.*?)" form System Admin$/) do |arg1|
  HMPCommands.call_locator_with_arg('CPE (Staging)')
  HMPCommands.perform_action('Task option left drop list')

  HMPCommands.call_locator_with_arg('System Admin')
  HMPCommands.perform_action('Task option left drop list')

  HMPCommands.call_locator_with_arg(arg1)
  HMPCommands.perform_action('Task option left drop list')
end

Given(/^patients have been synced for FHIR test$/) do

  wait_time = 2

  test_patients_icn = []

  test_patients_icn.push({ pid: "5000000217", icn: "5000000217V519385" }) #Eight,Inpatient
  test_patients_icn.push({ pid: "10105", icn: "10105V001065" }) #Five,Patient
  test_patients_icn.push({ pid: "11016", icn: "11016V630869" }) #Onehundredsixteen,Patient
  test_patients_icn.push({ pid: "10108", icn: "10108V420871" }) #Eight,Patient

  test_patients_dfn = []
  test_patients_dfn.push({ pid: "9E7A;100022", dfn: "100022" }) #Bcma,Eight
  test_patients_dfn.push({ pid: "9E7A;167", dfn: "167" }) #Zzzretiredonefive,Patient
  test_patients_dfn.push({ pid: "9E7A;230", dfn: "230" }) ##ZZZRETSIXTWENTYEIGHT,PATIENT

  base_url = DefaultLogin.fhir_url
  test_patients_dfn.each do | pid_dfn |
    pid = pid_dfn[:pid]
    path = "#{base_url}/admin/sync/#{pid}"
    #p path
    @response = HTTPartyWithBasicAuth.put_with_authorization(path)
    expect(@response.code).to eq(201), "response code was #{@response.code}: response body #{@response.body}"
  end

  test_patients_icn.each do | pid_icn |
    pid = pid_icn[:pid]
    path = "#{base_url}/admin/sync/#{pid}"
    #p path
    @response = HTTPartyWithBasicAuth.put_with_authorization(path)
    expect(@response.code).to eq(201), "response code was #{@response.code}: response body #{@response.body}"
  end # test_patients.each

end
