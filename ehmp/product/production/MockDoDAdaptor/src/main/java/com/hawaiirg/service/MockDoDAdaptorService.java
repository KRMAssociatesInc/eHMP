package com.hawaiirg.service;


import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import com.hawaiirg.utils.Cache;
import com.hawaiirg.utils.ClinicalDomainLoincCode;

import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.*;

import static com.hawaiirg.utils.ClinicalDomainLoincCode.fetchLoinc;

public class MockDoDAdaptorService {

    public String query(String patientId, String loinc) {
        String queryId = UUID.randomUUID().toString();

        Map<String, Object> queryMap = new LinkedHashMap<>();
        queryMap.put("patientid", patientId);
        queryMap.put("loinc", loinc);
        queryMap.put("queryCnt", 0);
        queryMap.put("queryExpire", false);

        Cache.put(queryId, queryMap);

        return queryId;
    }

    public Map poller(String queryId, String queryVersion) {

        Gson gson = new Gson();

        Map<String, Object> resp = new LinkedHashMap<>();

        Map<String, Object> mapVal = Cache.get(queryId);

        boolean queryExpire = (boolean) mapVal.get("queryExpire");

        if (queryExpire)
        {
            resp.put("error", "Query has expired");

            return resp;
        }

        String patientId = (String) mapVal.get("patientid");
        String loinc = (String) mapVal.get("loinc");

        int queryCnt = (int) mapVal.get("queryCnt");

        ClinicalDomainLoincCode loincCode = fetchLoinc(loinc);
        String edipi = "";
        if(patientId.startsWith("EDIPI:")){
            edipi = patientId.substring("EDIPI:".length());

            //VA EDE environment mappings
            switch(edipi) {
                //GRAW,SANTOS ICN: 1012801143V972937
                case "1606970150":
                    edipi = "0000000001";
                    break;
                //STAGER,SON ICN: 1012801526V135627
                case "1606970168":
                    edipi = "0000000002";
                    break;
                //MEDBERY,DEXTER ICN: 1012806547V418736
                case "1606970184":
                    edipi = "0000000003";
                    break;
                //PIPPERT	COURTNEY	E	101010555	JAN 21,1962	MALE	1606970230	1012785923V530265
                case "1606970230":
                    edipi = "0000000004";
                    break;
                //SUPRENANT	ELDON	DUANE	101010313	NOV  3,1959	MALE	1606970222	1012791372V194604
                case "1606970222":
                    edipi = "0000000005";
                    break;
                //ODIL	WILL		100738581	SEP 24,1987	MALE	1606970214	1012815032V163182
                case "1606970214":
                    edipi = "0000000006";
                    break;
                //BOYL	VANCE	LEE	101010432	OCT 13,1948	MALE	1606970249	1012784354V767489
                case "1606970249":
                    edipi = "0000000007";
                    break;
                //BELLMY,DERICK ICN: 1012799878V195245
                case "1606970176":
                    edipi = "0000000008";
                    break;
                //HASENBERG	THURMAN	M	101010743	DEC 28,1957	MALE	1606970257	1012808405V085351
                case "1606970257":
                    edipi = "0000000009";
                    break;
                //DRENNAN,PAT ICN: 1012793678V145392
                case "1606970192":
                    edipi = "0000000010";
                    break;
                //MITMAN	JEFFRY	A	101010949	MAY 13,1926	MALE	1606970281	1012789438V484899				ric
                case "1606970281":
                    edipi = "0000000011";
                    break;
                //TIMM	EMMETT		101011053	APR  1,1966	MALE	1606970303	1012773827V417592
                case "1606970303":
                    edipi = "0000000012";
                    break;
                //BENTZINGER,CARMELLA ICN: 1012813834V583373
                case "1606970206":
                    edipi = "0000000013";
                    break;
                //STRISSEL	BRYANT		101010810	AUG 27,1941	MALE	1606970290	1012804326V647151
                case "1606970290":
                    edipi = "0000000014";
                    break;
                //GRUPP	RUFUS	ANTONIO	101011154	MAY 30,1946	MALE	1606970354	1012783932V187501
                case "1606970354":
                    edipi = "0000000015";
                    break;

            }

        } else {
            String unitNumber = patientId;
            switch (unitNumber) {
                case "921900":
                    edipi = "0000000001";
                    break;
                case "921819":
                    edipi = "0000000002";
                    break;
                case "922045":
                    edipi = "0000000003";
                    break;
                case "904237":
                    edipi = "0000000004";
                    break;
                case "894085":
                    edipi = "0000000011";
                    break;
                case "904005":
                    edipi = "0000000012";
                    break;
                case "795987":
                    edipi = "0000000013";
                    break;
                case "50002":
                    edipi = "default";
                    break;
            }
        }

        String path;

        //version 3
        if (queryVersion.equalsIgnoreCase("3")) {
            path = "data" + File.separatorChar + "v3"+File.separatorChar+"v3_"+edipi + "_" + loincCode.getLoincCode() + "_" + queryCnt + ".json";
        }
        //version 2
        else {
            path = "data" + File.separatorChar + edipi + "_" + loincCode.getLoincCode() + "_" + queryCnt + ".json";
        }

        InputStream dataIs = this.getClass().getClassLoader().getResourceAsStream(path);

        //if dataIs is null, just use default mock response
        if (dataIs == null)
        {
            //version 3
            if (queryVersion.equalsIgnoreCase("3")) {
                path = "data" + File.separatorChar + "v3"+File.separatorChar+"v3_default_" + loincCode.getLoincCode() + "_" + queryCnt + ".json";
            }
            //version 2
            else {
                path = "data" + File.separatorChar + "default_" + loincCode.getLoincCode() + "_" + queryCnt + ".json";
            }

            dataIs = this.getClass().getClassLoader().getResourceAsStream(path);
        }

        //if default mock response clinical domain is not available, just send empty data set
        if (dataIs == null)
        {
            ArrayList<Map> emptyLst = new ArrayList<>();
            resp.put("queryComplete", "true");
            resp.put("dataList", emptyLst);
        }
        //read in mock response file
        else
        {
            JsonReader reader = null;
            try {
                reader = new JsonReader(new InputStreamReader(dataIs, "UTF-8"));
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            resp = gson.fromJson(reader, HashMap.class);
        }

        queryCnt++;

        mapVal.put("queryCnt", queryCnt);

        boolean queryComplete = resp.get("queryComplete") != null &&
                ((String)resp.get("queryComplete")).equalsIgnoreCase("true");

        if(queryComplete)
        {
            mapVal.put("queryExpire", true);
        }

        return resp;
    }
}
