require 'httparty'

Given(/^an undefined active users list$/) do
  options = {
    body: {
      _id: 'osyncusers',
      dummy: 'dummy'
    }
  }
  path = DefaultLogin.jds_url + '/user/set/this'
  p path
  HTTParty.post(path, options)
end
