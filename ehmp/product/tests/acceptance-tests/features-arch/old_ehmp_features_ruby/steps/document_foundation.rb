Then(/^the results contain allergy terminology from "(.*?)"$/) do |arg1, table|

  @json_object = JSON.parse(@response.body)
  #p @json_object
  parser = AllergyResponseParse.new(@json_object)
  table.rows.each do | fieldpath, fieldvaluestring |
    parser.parse(fieldpath, fieldvaluestring)
    
    expect(parser.found).to be_true
    expect(parser.num_results_remaining).to_not eq(0)
  end # table.rows.each
end

Then(/^the results contain "(.*?)" terminology from "(.*?)"$/) do |domain, term, table|
  @json_object = JSON.parse(@response.body)
  #p @json_object
  parser = AllergyResponseParse.new(@json_object)
  table.rows.each do | fieldpath, fieldvaluestring |
    parser.parse(fieldpath, fieldvaluestring)
    
    expect(parser.found).to be_true
    expect(parser.num_results_remaining).to_not eq(0)
  end # table.rows.each
end
