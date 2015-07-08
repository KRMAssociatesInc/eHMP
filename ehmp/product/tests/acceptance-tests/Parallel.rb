module Parallel
  module Cucumber
    module Rake
      class Task
        include Gherkin::Formatter::AnsiEscapes
        include ::Rake::DSL if defined?(::Rake::DSL)

        class InProcessCucumberRunner #:nodoc:
          include ::Rake::DSL if defined?(::Rake::DSL)

          attr_reader :args

          def initialize(libs, cucumber_opts, feature_files)
            fail "libs must be an Array when running in-process" unless Array == libs
            libs.reverse.each { |lib| $LOAD_PATH.unshift(lib) }
            @args = (
              cucumber_opts +
              feature_files
            ).flatten.compact
          end

          def run
            require "parallel_tests/cli"
            ParallelTests::CLI.new.run(["--type", "cucumber"] + args)
            fail "Cucumber failed" if failure
          end
        end

        class ForkedCucumberRunner #:nodoc:
          include ::Rake::DSL if defined?(::Rake::DSL)

          def initialize(libs, cucumber_bin, cucumber_opts, bundler, feature_files)
            @libs          = libs
            @cucumber_bin  = cucumber_bin
            @cucumber_opts = cucumber_opts
            @bundler       = bundler
            @feature_files = feature_files
          end

          def load_path(libs)
            sprintf('"%s"', @libs.join(File::PATH_SEPARATOR))
          end

          def quoted_binary(cucumber_bin)
            sprintf('"%s"', cucumber_bin)
          end

          def use_bundler
            @bundler.nil? ? File.exist?("./Gemfile") && bundler_gem_available? : @bundler
          end

          def bundler_gem_available?
            Gem::Specification.find_by_name('bundler')
          rescue Gem::LoadError
            false
          end

          def cmd
            ruby_binary   = File.join(RbConfig::CONFIG['bindir'], RbConfig::CONFIG['ruby_install_name'])
            if use_bundler
              [ruby_binary, '-S', 'bundle', 'exec', 'parallel_cucumber', @cucumber_opts,
               @feature_files].flatten
            else
              [ruby_binary, '-I', load_path(@libs), quoted_binary(@cucumber_bin),
               @cucumber_opts, @feature_files].flatten
            end
          end

          def run
            sh cmd.join(" ") do |ok, res|
              unless ok
                exit res.exitstatus
              end
            end
          end
        end

        # Directories to add to the Ruby $LOAD_PATH
        attr_accessor :libs

        # Name of the cucumber binary to use for running features. Defaults to Cucumber::BINARY
        attr_accessor :binary

        # Extra options to pass to the cucumber binary. Can be overridden by the CUCUMBER_OPTS environment variable.
        # It's recommended to pass an Array, but if it's a String it will be #split by ' '.
        attr_accessor :cucumber_opts
        def cucumber_opts=(opts) #:nodoc:
          @cucumber_opts = String == opts ? opts.split(' ') : opts
        end

        # Whether or not to fork a new ruby interpreter. Defaults to true. You may gain
        # some startup speed if you set it to false, but this may also cause issues with
        # your load path and gems.
        attr_accessor :fork

        # Define what profile to be used.  When used with cucumber_opts it is simply appended
        # to it. Will be ignored when CUCUMBER_OPTS is used.
        attr_accessor :profile

        # Whether or not to run with bundler (bundle exec). Setting this to false may speed
        # up the execution. The default value is true if Bundler is installed and you have
        # a Gemfile, false otherwise.
        #
        # Note that this attribute has no effect if you don't run in forked mode.
        attr_accessor :bundler

        # Define Cucumber Rake task
        def initialize(task_name = "cucumber", desc = "Run Cucumber features")
          @task_name, @desc = task_name, desc
          @fork = true
          @libs = ['lib']
          @rcov_opts = %w{--rails --exclude osx\/objc,gems\/}
          yield self if block_given?
          @binary = binary.nil? ? 'parallel_cucumber' : File.expand_path(binary)
          define_task
        end

        def define_task #:nodoc:
          desc @desc
          task @task_name do
            runner.run
          end
        end

        def runner(task_args = nil) #:nodoc:
          cucumber_opts = [(ENV['CUCUMBER_OPTS'] ? ENV['CUCUMBER_OPTS'].split(/\s+/) : nil) || cucumber_opts_with_profile]
          if @fork
            return ForkedCucumberRunner.new(libs, binary, cucumber_opts, bundler, feature_files)
          end
          InProcessCucumberRunner.new(libs, cucumber_opts, feature_files)
        end

        def cucumber_opts_with_profile #:nodoc:
          @profile ? [cucumber_opts, '--profile', @profile] : cucumber_opts
        end

        def feature_files #:nodoc:
          make_command_line_safe(FileList[ENV['FEATURE'] || []])
        end

        def make_command_line_safe(list)
          list.map { |string| string.gsub(' ', '\ ') }
        end
      end
    end
  end
end
