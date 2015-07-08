
And(/^user will see the Gist view of "(.*?)"$/) do |name|
  @ehmp = OverView.new
  @ehmp.wait_for_fld_immunizations_applet
  expect(@ehmp.fld_immunizations_applet).to have_text name.upcase
end

And(/^the gist view has the following information$/) do |table|
  table.rows.each do |field, value|
    @ehmp.fld_immunizations_applet.text.upcase.include? "#{field.upcase}" "#{value.upcase}"
  end
end