class FetchResourceDirectory
  @@urls = {}
  def initialize(json, base_url)
    links = json['data']['link']
    links.each do |paths|
      @@urls[paths['title']] = base_url + paths['href']
    end # links
  end #initialize

  def get_url(title)
    return @@urls[title]
  end #get_url
end # FetchResourceDirectory

if __FILE__ == $PROGRAM_NAME

  my_hash = {}
  my_hash1 = { :title => "1", :href => "red" }
  my_hash2 = { :title => "2", :href => "blue" }

  myarray = [my_hash1, my_hash2]
  full_has = { :link => myarray }
  json = JSON.generate(full_has)
  rd = FetchResourceDirectory.new(JSON.parse(json), 'localhost')
  p rd.get_url("1")
  p rd.get_url("5")
end # if
