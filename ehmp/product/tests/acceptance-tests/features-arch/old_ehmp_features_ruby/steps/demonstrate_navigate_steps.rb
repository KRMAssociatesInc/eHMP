When(/^user selects and pauses$/) do |table|
  nav = PatientDetailsHTMLElements.instance
  result = true
  table.rows.each do | button |
    begin
      nav.perform_action(button[0])
    rescue Exception => e
      p "error on #{button[0]} #{e}"
      result = false
    end
    sleep 1
  end
  expect(result).to be_true

end
