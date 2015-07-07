class AllergyGridFull < SitePrism::Page

  set_url '/#allergy-grid-full'
  set_url_matcher /\/#allergy-grid-full$/

  # *****************  All_Form_Elements  ******************* #


  # *****************  All_Logo_Elements  ******************* #


  # *****************  All_Field_Elements  ******************* #
  element :fld_allergen_name, "th[id='allergy_grid-summary'] a"

  # *****************  All_Button_Elements  ******************* #


  # *****************  All_Drop_down_Elements  ******************* #


  # *****************  All_Table_Elements  ******************* #
  element :tbl_allergy_grid, "table[id='data-grid-allergy_grid']"

end