class SetupEnv
  def initialize
    # @url = "https://hmpdemo.vainnovations.us/auth/login"
    # @accesscode = '10VEHU'
    # @verifycode = 'VEHU10'
    # @facility = 'HMP SANDBOX'
    @url = "https://10.3.3.4:8443/"
    @accesscode = 'pu1234'
    @verifycode = 'pu1234!!'
    @facility = 'CAMP MASTER'
  end

  attr_accessor :url
  attr_accessor :accesscode
  attr_accessor :verifycode
  attr_accessor :facility
end
