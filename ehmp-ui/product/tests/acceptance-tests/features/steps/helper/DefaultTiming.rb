class DefaultTiming
  @@default_wait_time = 15
  @@default_table_row_load_time = 30

  def self.default_wait_time
    return @@default_wait_time
  end
  
  def self.default_table_row_load_time
    return @@default_table_row_load_time
  end
end
