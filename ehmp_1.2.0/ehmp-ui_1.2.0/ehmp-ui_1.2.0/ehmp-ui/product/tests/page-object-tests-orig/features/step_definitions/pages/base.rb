require 'page-object'

class Base
  include PageObject
  #attr_reader :page_url

  def self.set_page_url(url)
    base = ENV['BASE'] || '10.1.1.150'

    raise ArgumentError, 'page_url only accepts strings' unless url.is_a? String
    page_url "#{base}/#{url}"
  end
end
