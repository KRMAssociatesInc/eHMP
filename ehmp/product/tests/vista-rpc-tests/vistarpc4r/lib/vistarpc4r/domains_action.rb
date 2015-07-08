class DomainsView
  actions_list_need_dfn = {"meds" => "ORWPS COVER", "labs" => "ORWCV LAB", "vitals" => "ORQQVI VITALS", "demo" => "ORWPT PTINQ", 
   "visits" => "ORWCV VST", "detail" => "ORQQCN DETAIL", "notifications" => "ORQQXQA PATIENT", "info" => "ORWLRR INFO",
   "problem_list" => "ORQQPL LIST", "allergy" => "ORQQAL LIST", "admission_list" => "ORWCV VST", "appointments_list" => "ORWPT APPTLST", "all_patients1" => "ORWPT LIST ALL"}
   
  actions_list_not_need_dfn = {"patients_list" => "ORQPT WARDS","providers" => "ORQPT PROVIDERS", "specialties" => "ORQPT SPECIALTIES","all_patients" => "ORWPT LIST ALL"}
   
  actions_list = actions_list_need_dfn.merge(actions_list_not_need_dfn)

  actions_list.keys.each do |action|
    define_method("view_#{action}") do |patient_pid = nil|
      puts "Performing #{action.gsub('_', ' ')} on patient #{patient_pid}"
      if actions_list_need_dfn.include? action
        performing_action_w_dfn(actions_list[action], patient_pid)
      else
        performing_action_w_out_dfn(actions_list[action], patient_pid)
      end
      
    end
  end

  def performing_action_w_dfn(action_request, patient_pid)
    define_port_dfn(patient_pid)
    fail "*** dfn is required! ***" if @dfn == nil
    broker = broker_connection
    if action_request == "ORQQPL LIST"
      patientarray = broker.call_a("ORQQPL LIST", [@dfn, "A"])
    else
      patientarray = broker.call_a(action_request, [@dfn])
    end
    patientarray.each do |d|
      puts d
    end
  end
  private :performing_action_w_dfn
  
  def performing_action_w_out_dfn(action_request, patient_pid)
    define_port_dfn(patient_pid)
    broker = broker_connection
    if action_request == "ORQPT WARDS"
      patients_list(broker)
    else
      patientarray = broker.call_a(action_request)
      patientarray.each do |d|
        puts d
      end
    end
  end
  private :performing_action_w_out_dfn
  
  def define_port_dfn(patient_pid)
    fail "*** You should at least provide site name! ***" if patient_pid == nil
    if patient_pid.include? ";"
      patient_pids = patient_pid.split";" 
      @dfn = patient_pids[1]
      host = patient_pids[0]
    else
      @dfn = nil
      host = patient_pid
    end
    
    if host.upcase == "9E7A"
      @host = '10.2.2.101'
    elsif host.upcase == "C877"
      @host = '10.2.2.102'
    else
      fail "*** This host (#{host}) is not define! ***"
    end
  end
  private :define_port_dfn
  
  def broker_connection
    broker = VistaRPC4r::RPCBrokerConnection.new(@host, 9210, 'pu1234', 'pu1234!!')
    broker.connect
    p "The RPC Broker Connection status is #{broker.isConnected}"
    broker.setContext('OR CPRS GUI CHART')
    return broker
  end
  private :broker_connection
  
  def patients_list(broker)
  wardsarray = broker.call_a("ORQPT WARDS")
 
    wardsarray.each do |ward|
      a = ward.split("^")
      puts "Ward:" + a[1]
      wardarray = broker.call_a("ORQPT WARD PATIENTS", [a[0]])  # ward ien
        wardarray.each do |patient|
          b = patient.split("^")
          puts b[0] + ":" + b[1]
        end
    end
  end

end

