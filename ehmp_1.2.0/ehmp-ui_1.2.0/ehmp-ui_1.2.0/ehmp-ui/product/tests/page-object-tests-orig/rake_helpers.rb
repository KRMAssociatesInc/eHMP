# This file contains helpers for Rake
module RakeHelpers
  def select_browser
    ENV['BTYPE'] || 'phantomjs'
  end
end
