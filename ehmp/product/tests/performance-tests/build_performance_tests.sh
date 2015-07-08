# Build the performance test client nodes, and/or run the performance tests.
# Optional argument specifies the name of the environment. The choices are shown
# below in the if statement.



# Select the environment. The default is the unmanaged aws environment.
if [ -z $1 ]; then  # set defauls
    #export ENVIRONMENT="aws-managed-perf"   # managed configuration.
    export ENVIRONMENT="aws-perf"           # non-managed configuration.
else
    export ENVIRONMENT=$1
fi



export VAGRANT_LOG=debug



# Set all environment variables that are required.
init_env() {
    export PATH=/opt/chef/embedded/bin:$PATH
    export VISTACORE_HOME=/var/lib/jenkins/Projects/vistacore
    export BERKSHELF_PATH=$VISTACORE_HOME/.berkshelf
    export VAGRANT_HOME=$VISTACORE_HOME/.vagrant.d
    export GEM_HOME=$VISTACORE_HOME/.gems
    export GEM_PATH=$GEM_HOME:$GEM_PATH
    export PATH=$GEM_HOME/bin:$PATH
    export FQDN=ehmp-performance-test.vistacore.us
    export CHEF_LOG=debug
    
    case $ENVIRONMENT in
        "aws-perf")
            export PROJECT_ROOT=$WORKSPACE
            ;;
        "aws-managed-perf")
            export PROJECT_ROOT=$WORKSPACE
            ;;
        "local")
            export PROJECT_ROOT=$WORKSPACE/ehmp
            ;;
        "local-managed")
            export PROJECT_ROOT=$WORKSPACE/ehmp
            echo "WORKSPACE=$WORKSPACE"
            echo "MAVEN_OPTS=$MAVEN_OPTS"
            echo "Set PROJECT_ROOT to $PROJECT_ROOT"
            ;;
        "ede-managed-perf")
            echo "EDE not implemented yet"
            ;;
        *)
            echo "Unexpected environment: $ENVIRONMENT"
            ;;
    esac
}



# Create the test client nodes that will be used by the performance tests in a
# managed configuration in aws.
build_managed_test_clients() {
    if [ $ENVIRONMENT == "aws-managed-perf" ]; then  # only applicable to managed config.
        echo "Building test clients for managed configuration"
        /usr/bin/vagrant up --provider aws --provision
    fi
}



# Destroy the nodes that were created via build_managed_test_clients. This should
# be called before calling build_managed_test_clients in the nodes exist, so that
# the old nodes are destroyed before new ones are created.
destroy_managed_test_clients() {
    if [ $ENVIRONMENT == "aws-managed-perf" ]; then  # only applicable to managed config.
        echo "Destroying managed client nodes, if they exist"
        cd $PROJECT_ROOT/infrastructure/vagrant/managed/create_perf_test_clients
        /usr/bin/vagrant destroy -f
    fi
}



# Print the IP addresses of nodes that were created via build_managed_test_clients.
get_managed_node_ips() {
    if [ $ENVIRONMENT == "aws-managed-perf" ]; then  # only applicable to managed config.
        echo "Getting IP addresses of the test client nodes"
        cd $PROJECT_ROOT/product/tests/performance-tests/managed_test_case
        rake get_managed_node_ips
    fi
}



# See if we can do a vagrant up on the managed nodes - i.e., connect to them.
# To call this, you must first have called build_managed_test_clients.
do_managed_sanity_check() {
    if [ $ENVIRONMENT == "aws-managed-perf" ]; then  # only applicable to managed config.
        echo "Sanity check: See if we can connect to the managed nodes"
        cd $PROJECT_ROOT/infrastructure/vagrant/managed/managed-vista-exchange
        #/usr/bin/vagrant destroy -f test_client_1
        echo "Connecting to test_client_1......"
        ls -la Vagrantfile
        /usr/bin/vagrant up test_client_1 --provider managed
        ls -la Vagrantfile

        echo "Connecting to test_client_2......"
        /usr/bin/vagrant up test_client_2 --provider managed
    fi
}



# Refresh berkshelf's cookbooks.
update_cookbooks() {
    echo "Running update.cookbooks.sh"
    cd $PROJECT_ROOT/product/
    ./update.cookbooks.sh
}



# Populate the JDS/eVPR cache with the patients that will be used in the performnace
# tests, for the purpose of performing "synced" patient SLA tests. This must
# be called prior to performing those tests.
sync_patients() {
    #cd $PROJECT_ROOT/product/tests/performance-tests/client-tests
    #bundle exec rake selectedTests["-t @perf.sync","features/perf.FHIRhttparty.feature"
    #cd $PROJECT_ROOT/product/tests/acceptance-tests
    #bundle exec rake selectedTests["-t @patientdemographicsearch","features/F119_PatientNameSearch.feature"]
    cd $PROJECT_ROOT/product/tests/performance-tests/client-tests
    bundle exec rake selectedTests["-t @perf.sync","features/perf.FHIRhttparty.feature"]
}



# Execute a performance test run, in AWS, using either the managed or unmanaged
# configuration.
run_performance_tests() {
    echo "Running performance tests in $PROJECT_ROOT"
    cd $PROJECT_ROOT/product/tests/performance-tests
    ls -la Gemfile
    
    # Go to the directory for the appropriate tests.
    case $ENVIRONMENT in
        "aws-perf")
            echo "Running bundle install"
            bundle install
            cd master_scripts
            ;;
        "aws-managed-perf")
            echo "Running bundle install"
            bundle install
            cd managed_test_case
            ;;
        "local")
            echo "Running bundle install"
            sudo bundle install
            cd master_scripts
            ;;
        "local-managed")
            echo "Running bundle install"
            sudo bundle install
            cd managed_test_case
            ;;
        "ede-managed-perf")
            echo "EDE not implemented yet"
            ;;
        *)
            echo "Unexpected environment: $ENVIRONMENT"
            ;;
    esac
    
    echo "Running rake"
    bundle exec rake      
}



run_test_runner_on_1() {
    #cd $PROJECT_ROOT/product/tests/performance-tests/results/REST_Load_Test_managed/scripts/REST_Load_Test_managed/test_client_1
    #ssh -F sshconfig_test_client_1 ec2-user@test_client_1 pwd
    #ssh -F sshconfig_test_client_1 ec2-user@test_client_1 /var/scripts/testrunner.sh
    
    #cd $PROJECT_ROOT/infrastructure/vagrant/managed/managed-vista-exchange
    cd /var/lib/jenkins/workspace/ehmp-performance-test-build-managed-next/infrastructure/vagrant/managed/managed-vista-exchange
    /usr/bin/vagrant ssh test_client_1 -c pwd
}



run_one_acc_test_in_aws() {
    if [ $ENVIRONMENT != "aws-perf" ]; then
        echo "Unexpected environment: $ENVIRONMENT"
        exit 1
    fi
    
    cd $PROJECT_ROOT/product/tests/performance-tests/client-tests
    echo "Running one client test..."
    bundle exec rake selectedTests
}



# Below, we invoke the functions that we want for each env. Edit this according to current needs.



case $ENVIRONMENT in
    "aws-perf")
        source /etc/profile.d/rvm.sh
        rvm use 1.9.3
        init_env
        #sync_patients
        #run_one_acc_test_in_aws
        run_performance_tests
        ;;
    "aws-managed-perf")
        source /etc/profile.d/rvm.sh
        rvm use 1.9.3
        init_env
        #destroy_managed_test_clients
        #build_managed_test_clients
        #get_managed_node_ips
        #update_cookbooks
        #do_managed_sanity_check
        #run_test_runner_on_1
        run_performance_tests
        ;;
    "local")
        init_env
        run_performance_tests
        ;;
    "local-managed")
        init_env
        run_performance_tests
        ;;
    "ede-managed-perf")
        echo "EDE not implemented yet"
        ;;
    *)
        echo "Unexpected environment: $ENVIRONMENT"
        ;;
esac

