require 'extlib'
require_relative './vista_exception'
require_relative './vista_utils'
require_relative './rpc_parameter'
require_relative './vista_rpc'

class VistaSelect

  attr_accessor :file, :number, :from, :part, :index, :screen, :identifier
  attr_reader :iens, :fields, :flags, :rpc, :param_list, :response, :records

  def initialize
    @fields = '@'
    @flags = 'IP'
    @index = '#'
  end

  def find cxn
    prepare
    @response = cxn.exec @rpc
    load @response
  end

  def prepare
    prepare_param_list
    params = RpcParameter.new(RpcParameter::LIST, @param_list)
    @rpc = VistaRpc.prepare('DDR LISTER', [params])
  end
  private :prepare

  def iens=(iens)
    iens = ',' + iens unless iens[0] == ','
    iens += ',' unless iens[iens.length-1] == ','
    parts = iens[1..iens.length-2].split(',', -1)
    parts.each do |part|
      raise VistaException.new 'Invalid IENS' unless VistaUtils.is_integer?(part)
    end
    @iens = iens
  end

  def fields=(fieldstr)
    fieldstr = '@;' + fieldstr unless fieldstr[0] == '@'
    fieldstr.chop! if fieldstr[fieldstr.length-1] == ';'
    @fields = fieldstr
  end

  def flags=(flags)
    if flags.nil? || flags.empty?
      flags = 'IP'
    elsif flags.index('P').nil?
      raise VistaException.new 'Current version does packed queries only'
    end
    @flags = flags
  end

  def prepare_param_list
    raise VistaException.new 'DDR call must specify a file' if @file.nil?

    @param_list = Hash.new()
    @param_list['"FILE"'] = @file.to_s
    @param_list['"IENS"'] = @iens unless @iens.nil?
    @param_list['"FIELDS"'] = @fields
    @param_list['"FLAGS"'] = @flags
    @param_list['"MAX"'] = @number.to_s unless @number.nil?
    @param_list['"FROM"'] = VistaUtils.adjust_for_search(@from) unless @from.nil?
    @param_list['"PART"'] = @part unless @part.nil?
    @param_list['"XREF"'] =  @index.nil? ? '#' : @index
    @param_list['"SCREEN"'] = @screen unless @screen.nil?
    @param_list['"ID"'] = @identifier unless @identifier.nil?
  end
  private :prepare_param_list

  def load(response)
    lines = response.split("\r\n")
    numlines = lines.length

    # Find starting line...
    linenum = 0
    while linenum < numlines && lines[linenum] != '[BEGIN_diDATA]'
      linenum += 1
    end
    raise VistaException.new 'Empty response' if linenum == numlines
    linenum += 1

    @records = Array.new
    while linenum < numlines && lines[linenum] != '[END_diDATA]'
      @records.push lines[linenum].split('^')
      linenum += 1
    end
    @records
  end
  private :load

end