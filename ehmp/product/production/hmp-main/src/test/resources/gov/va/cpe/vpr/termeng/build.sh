# delete old files
rm -f tests/drugdb/*.RRF
mkdir tests/drugdb

# copy these 2 small files verbatim
cp MRFILES.RRF tests/drugdb 
cp MRRANK.RRF tests/drugdb

## Generate .RRF subsets

## MeSH/NDFRT Testing
#####################################################################

# main propranolol concept
grep C0033497 MRCONSO.RRF > tests/drugdb/MRCONSO.RRF
grep C0033497 MRSAT.RRF > tests/drugdb/MRSAT.RRF
grep C0033497 MRREL.RRF > tests/drugdb/MRREL.RRF

# append beta-blocker data
grep C0001645 MRCONSO.RRF >> tests/drugdb/MRCONSO.RRF
grep C0001645 MRREL.RRF >> tests/drugdb/MRREL.RRF

# append heart disease relationships
grep C0018799 MRREL.RRF >> tests/drugdb/MRREL.RRF

# append some terms (to fill aui2urn for unit tests)
grep "D011412\|D009281\|D050198\|D000319\|D000889\|D000959\|D014665\|D018674" MRCONSO.RRF >> tests/drugdb/MRCONSO.RRF
grep "N0000010598\|N0000001434\|N0000000689\|N0000001432" MRCONSO.RRF >> tests/drugdb/MRCONSO.RRF

## VANDF Testing
#####################################################################
	
# main sodium chloride concept (urn:vandf:4017444)
grep ^C0037494 MRCONSO.RRF >> tests/drugdb/MRCONSO.RRF
grep ^C0037494 MRSAT.RRF >> tests/drugdb/MRSAT.RRF
grep C0037494\| MRREL.RRF >> tests/drugdb/MRREL.RRF

# add a related sodumn-related concept: ELECTROLYTE SOLN,ORAL ADULT (urn:vandf:4024738)
grep ^C1814316 MRCONSO.RRF >> tests/drugdb/MRCONSO.RRF
grep ^C1814316 MRSAT.RRF >> tests/drugdb/MRSAT.RRF
grep C1814316\| MRREL.RRF >> tests/drugdb/MRREL.RRF

# add a few more MRCONSO rows to make aui2urn mappings work
grep \|A12098875\| MRCONSO.RRF >> tests/drugdb/MRCONSO.RRF

## LNC Testing
#####################################################################
rm -f tests/lncdb/*.RRF
mkdir tests/lncdb
cp MRFILES.RRF tests/lncdb 
cp MRRANK.RRF tests/lncdb

# Creatinine Concept
grep ^C0010294\| MRCONSO.RRF > tests/lncdbdb/MRCONSO.RRF
grep ^C0010294\| MRSAT.RRF > tests/lncdb/MRSAT.RRF
grep C0010294\| MRREL.RRF > tests/lncdb/MRREL.RRF

# Ancestor Concept: Renal Function 
grep A18207214 MRCONSO.RRF >> tests/lncdb/MRCONSO.RRF
grep A18207214 MRREL.RRF >> tests/lncdb/MRREL.RRF

# Ancestor Concept: Chemistry
grep A18321480 MRCONSO.RRF >> tests/lncdb/MRCONSO.RRF
grep A18321480 MRREL.RRF >> tests/lncdb/MRREL.RRF

# Ancestor Concept: LOINCPARTS
grep A13333582 MRCONSO.RRF >> tests/lncdb/MRCONSO.RRF
grep A13333582 MRREL.RRF >> tests/lncdb/MRREL.RRF

# Ancestor Concept: LOINC ROOT
grep A6321000 MRCONSO.RRF >> tests/lncdb/MRCONSO.RRF
grep A6321000 MRREL.RRF >> tests/lncdb/MRREL.RRF




	