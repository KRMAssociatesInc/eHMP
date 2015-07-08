# require 'yaml'
require 'page-object'
# basic page for page object, can add basic methods for page object
class RubySelenium
  # return link element by text
  # page.get_link_by_text('User Guide')  #how it is called
  # self.get_link_by_text(template_name).click
  # how it called   (get the link element and click)
  # def get_link_by_text(label)
  #   div_element('class' => 'list-group').link_element('index' => 0).click
  #   # self.link_
  #   # self.div_element(:text => /#{label}/).element.click
  #   # puts self.div_element(:class => 'list-group')
  #   # self.div_element(:class => 'list-group')
  #   # self.div_elemt(:)
  #   # self.div_element(:class => 'patient_search_results').
  #   # div_element(:class => 'list-group').link_element(:tabindex => 0).click
  # end

  # def waitForLoadingToClear
  #   # allowTimeoutError { self.loading_text_element.when_visible}
  #   # make sure it is showing
  #   allowTimeoutError {
  #     loading_text_element.when_visible(3)
  #   } # make sure it is showing
  #   loading_text_element.when_not_visible #and wait for it to disappear
  # end
  #
  # def allowTimeoutError(&blk)
  #   yield
  # rescue Selenium::WebDriver::Error::TimeOutError
  #   false
  # end

  # T his needs to return a invalid value or throw error if not found.
  # currently will return -1 if not found
  def get_index_by_text(list, name)
    # @index = page.get_index_by_text(@list, 'EIGHT,PATIENT')
    # should be called like this
    # check for a specific patient in the list and set index
    table_row_count = -1
    # element_found = false
    while list[table_row_count].name?
      table_row_count += 1
      if list[table_row_count].name_element.text == name
        # element_found = true
        break
      end
    end
    table_row_count
  end

  def get_span_by_text(text)
    span_element('text' => text).element
  end
end
