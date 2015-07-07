Then(/^user navigates to Outpatient Meds$/) do |table|
  nav = PatientDetailsHTMLElements.instance
  table.rows.each do | button |
    nav.wait_until_action_element_visible(button[0], 20)
    nav.perform_action(button[0])
  end
end

Then(/^Outpatient Meds are displayed in the table$/) do |table|
  outpatient_meds = OutpatientMeds.instance
  sleep 3
  found = true
  table.rows.each do | medication |
    found_single = outpatient_meds.find_in_list(medication[0])
    p "cannot find #{medication[0]}" unless found_single
    found = found && found_single

  end
  expect(found).to be_true
end
