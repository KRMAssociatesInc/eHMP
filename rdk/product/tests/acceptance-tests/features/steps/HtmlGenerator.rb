class HtmlGenerator
  def method(field, value_map)
    method = value_map[field][:searchOn] if value_map.key? field
    fail "Couldnot find key '#{field}' in available map for ':searchOn'." if method.nil?
    return method
  end

  def locator(field, value_map)
    locator = value_map[field][:locator] if value_map.key? field
    fail "Couldnot find key '#{field}' in available map for ':locator'." if locator.nil?
    return locator
  end

  def function(field, value_map)
    function = value_map[field][:function] if value_map.key? field
    fail "Couldnot find key '#{field}' in available map for ':function'." if function.nil?
    return function
  end

  def self.add_action_and_verify(key, method, locator, action_func, verify_fun = '')
    if @action_map == nil
      @action_map = {}
    end
    if @verify_map == nil
      @verify_map = {}
    end

    @action_map[key] = { :searchOn=>method, :locator=>locator, :function=>action_func } if action_func != ''
    @verify_map[key] = { :searchOn=>method, :locator=>locator, :function=>verify_fun } if verify_fun != ''
    return @action_map, @verify_map
  end

  def self.add_action(key, method, locator, action_func)
    if @action_map == nil
      @action_map = {}
    end
    @action_map[key] = { :searchOn=>method, :locator=>locator, :function=>action_func } if action_func != ''
    return @action_map, @verify_map
  end

  def self.add_verify(key, method, locator, verify_fun)
    if @verify_map == nil
      @verify_map = {}
    end
    @verify_map[key] = { :searchOn=>method, :locator=>locator, :function=>verify_fun } if verify_fun != ''
    return @action_map, @verify_map
  end
end #class
