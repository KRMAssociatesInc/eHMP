# $ext_path: This should be the path of the Ext JS SDK relative to this file
$ext_path = "/lib/ext-4.2.2.1144"

cur_dir = File.dirname(__FILE__)
# sass_path: the directory your Sass files are in. THIS file should also be in the Sass folder
# Generally this will be in a resources/sass folder
# <root>/resources/sass
sass_path = cur_dir

# css_path: the directory you want your CSS files to be.
# Generally this is a folder in the parent directory of your Sass files
# <root>/resources/css
css_path = File.join(cur_dir, "..", "..", "..", "build", "css")

# output_style: The output style for your compiled CSS
# nested, expanded, compact, compressed
# More information can be found here http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#output_style
output_style = :compressed

# included so '/images' paths can be resolved
webapp_root_dir = File.join(File.dirname(__FILE__), '..', 'webapp')
add_import_path webapp_root_dir

# load base themes from here
themes_dir = File.join(File.dirname(__FILE__), '..', 'webapp', $ext_path, 'packages')
add_import_path themes_dir

require File.join(themes_dir, 'ext-theme-base', 'sass', 'utils.rb')
