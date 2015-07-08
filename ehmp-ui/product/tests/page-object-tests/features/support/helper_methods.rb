class HelperMethods

  # This method will select an object from lists and will perform click action
  def click_an_object_from_list(objects, text)
    objects.each do |item|
      if item.text.upcase.include? text.upcase
        item.click
      end
    end
  end
end

World do
  HelperMethods.new
end