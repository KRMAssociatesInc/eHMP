#~/bin/bash

USERID=""
ATIENTID=""
STARTDATE=""
ENDDATE=""
INPUTFILENAME=""
OUTPUTFILENAME=""

while getopts "U:P:S:E:I:O:" opt; do
    case $opt in
        U)
            USERID="$OPTARG"
        ;;
        P)
            PATIENTID="$OPTARG"
        ;;
        S)
            STARTDATE="$OPTARG"
        ;;
        E)
            ENDDATE="$OPTARG"
        ;;
        I)
            INPUTFILENAME="$OPTARG"
        ;;
        O)
            OUTPUTFILENAME="$OPTARG"
        ;;
    esac
done

# Check that the required parameters are available
if [ "$OUTPUTFILENAME" == "" ] || [ "$STARTDATE" == "" ] || [ "$ENDDATE" == "" ]
then
    echo -e '\nThe following arguments need to be supplied in order to search the logs:';
    echo -e "\n\r\n\r\t-U [optional]\t\tUser ID\n\r\t-P [optional]\t\tPatient ID\n\r\t-S\t\t\tStart Date [YYYY-mm-ddTHH:MM]\n\r\t-E\t\t\tEnd Date [YYYY-mm-ddTHH:MM]\n\r\t-I\t\t\tInput Filename\n\r\t-O\t\t\tOutput Filename\n\n\r";
    echo -e 'Example:  audit_search.sh -U sampleuserid -P samplepatientid -S 2014-10-28T19:28 -E 2014-10-29T02:31 -I audit.log -F outputfilename.txt\n';
    exit 1;
fi

# if the user ID param is set, search the INPUT file for all matching entries
# This uses a temporary file since egrep cannot read and write from the same file at once,
# as is the case if the user were searching by both USER ID and PATIENT ID
if [ "$USERID" != '' ]
then
    # Search the INPUT file and copy it to a tmp file
    egrep "\\\"authuser\\\":\\\"$USERID\\\"" $INPUTFILENAME > $OUTPUTFILENAME.tmp
    # Set the output filename as the new input file
    INPUTFILENAME=$OUTPUTFILENAME
    # Copy the temp file to the new output file
    mv $OUTPUTFILENAME.tmp $OUTPUTFILENAME

fi
# If the Patient ID param is set, search the INPUT file for all matching entries
if [ "$PATIENTID" != "" ]
then
    # Search the input file and copy to a tmp file
    egrep "\\\"patientId\\\":\\\"$PATIENTID\\\"" $INPUTFILENAME > $OUTPUTFILENAME.tmp
    # Set the output file to the input file name
    INPUTFILENAME=$OUTPUTFILENAME
    # Copy the temp file to the new output file
    mv $OUTPUTFILENAME.tmp $OUTPUTFILENAME
fi

# Search the output file for entries beginning at the start date through the end date and output in a temporary file
awk 'match($0, /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/) { date=substr($0, RSTART, RLENGTH); if(date >= start && date <= end) print $0 }' start="$STARTDATE" end="$ENDDATE" $INPUTFILENAME > $OUTPUTFILENAME.tmp
# Move the temporary file to the designated output file name
mv $OUTPUTFILENAME.tmp $OUTPUTFILENAME


exit;
