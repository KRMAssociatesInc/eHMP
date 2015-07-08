/*jslint node: true */
'use strict';

/**
 * Based on the criteria, we will determine which of the responses (1306) to return for the soap message submitted (1305).
 * This will return a String that is used to load the corresponding file.
 *
 * @param lastName the last name of the patient directly pulled from the 1305 soap message.
 * @param firstName the first name of the patient directly pulled from the 1305 soap message.
 * @param dob the date of birth of the patient directly pulled from the 1305 soap message.
 * @param ssn the social security number of the patient directly pulled from the 1305 soap message.
 * @returns {string}
 */
function fetchMvi1305FileName(lastName, firstName, dob, ssn) {
    lastName = lastName.toUpperCase();
    firstName = firstName.toUpperCase();

    if (lastName === "")  //Last Name is always required. Return improper input data
        return "Improper Input Data 0 Results";
    else if (( firstName === "")  && (dob === "") && (ssn === "")) //Not able to match on just Last Name. Return 0 Results
        return "0 Results";
    else if (ssn === "666000008")
        return "Single Record Patient Eight";
    else if (ssn === "666000608")
        return "Single Record Outpatient Eight";
    else if (ssn === "666000808")
        return "Single Record Inpatient Eight";
    else if (ssn === "666001008")
        return "Single Record Imagepatient Eight";
    else if (ssn === "666000018")
        return "Single Record Patient Eighteen";
    else if (ssn === "666000618")
        return "Single Record Outpatient Eighteen";
    else if (ssn === "666000818")
        return "Single Record Inpatient Eighteen";
    else if (ssn === "666061018")
        return "Single Record Imagepatient Eighteen";
    else if (ssn === "666000080")
        return "Single Record Patient Eighty";
    else if (ssn === "666000680")
        return "Single Record Outpatient Eighty";
    else if (ssn === "666050565")
        return "Single Record Patient Zzzretfivefortythree";
    else if (ssn === "666330018")
        return "Single Record Eighteen-Patient Bcma";
    else if (ssn === "666000615")
        return "Single Record Outpatient Fifteen";
    else if (ssn === "432111234")
        return "Single Record Patient DoDOnly";
    else if (ssn === "432111235")
        return "Single Record Patient ICNOnly";
    else if ((lastName === "EIGHT") && (firstName === "PATIENT") && (dob === "19350407"))
        return "Single Record Patient Eight";
    else if ((lastName === "EIGHT") && (firstName === "OUTPATIENT") && (dob === "19450309"))
        return "Single Record Outpatient Eight";
    else if ((lastName === "EIGHT") && (firstName === "OUTPATIENT"))
        return "Single Record Outpatient Eight";
    else if ((lastName === "ALIAS") && (firstName === "OUTPATIENT"))
        return "Single Record Outpatient Eight";
    else if ((lastName === "EIGHT") && (firstName === "INPATIENT") && (dob === "19450309"))
        return "Single Record Inpatient Eight";
    else if ((lastName === "EIGHT") && (firstName === "IMAGEPATIENT") && (dob === "19530415"))
        return "Single Record Imagepatient Eight";
    else if ((lastName === "EIGHTEEN") && (firstName === "PATIENT") && (dob === "19350407"))
        return "Single Record Patient Eighteen";
    else if ((lastName === "EIGHTEEN") && (firstName === "OUTPATIENT") && (dob === "19450309"))
        return "Single Record Outpatient Eighteen";
    else if ((lastName === "EIGHTEEN") && (firstName === "INPATIENT") && (dob === "19450309"))
        return "Single Record Inpatient Eighteen";
    else if ((lastName === "EIGHTEEN") && (firstName === "IMAGEPATIENT") && (dob === "19530415"))
        return "Single Record Imagepatient Eighteen";
    else if ((lastName === "EIGHTY") && (firstName === "PATIENT") && (dob === "19350407"))
        return "Single Record Patient Eighty";
    else if ((lastName === "EIGHTY") && (firstName === "OUTPATIENT") && (dob === "19450309"))
        return "Single Record Outpatient Eighty";
    else if ((lastName === "EIGHT") && (firstName === "INPATIENT"))
        return "Multi Record 2 Results";
    else if ((lastName === "EIGHT") && (firstName === "PATIENT"))
        return "Multi Record 10 Results";
    else if ((lastName === "SMITH") && (firstName === "JOHN"))
        return "Over 10 Results";
    else if ((lastName === "ERROR") && (firstName === "SYSTEM"))
        return "MVI System Error";
    else if ((lastName === "ERROR") && (firstName === "APPLICATION"))
        return "MVI Application Error";
    else if ((lastName === "DODONLY") && (firstName === "PATIENT"))
        return "Single Record Patient DoDOnly";
    else if ((lastName === "DODONLY") && (dob === "19670909"))
        return "Single Record Patient DoDOnly";
    else if ((lastName === "ICNONLY") && (firstName === "PATIENT"))
        return "Single Record Patient ICNOnly";
    else if ((lastName === "ICNONLY") && (dob === "19671010"))
        return "Single Record Patient ICNOnly";
    else if ((lastName === "ZZZRETFIVEFORTYTHREE") && (firstName === "PATIENT"))
        return "Single Record Patient Zzzretfivefortythree";
    else if ((lastName === "ZZZRETFIVEFORTYTHREE") && (dob === "19350407"))
        return "Single Record Patient Zzzretfivefortythree";
    else if ((lastName === "BCMA") && (firstName === "EIGHTEEN-PATIENT"))
        return "Single Record Eighteen-Patient Bcma";
    else if ((lastName === "BCMA") && (dob === "19350407"))
        return "Single Record Eighteen-Patient Bcma";
    else if ((lastName === "EIGHT") && (dob === "19350407"))
        return "Eight 19350407";
    else if ((lastName === "EIGHT") && (dob === "19450309"))
        return "Eight 19450309";
    else if ((lastName === "EIGHT") && (dob === "19530415"))
        return "Eight 19530415";
    else if ((lastName === "ZZZRETFIVEFIFTY") && (firstName === "PATIENT"))
        return "Single Record Patient Zzzretfivefifty";
    else if ((lastName === "ZZZRETFIVEFIFTY") && (dob === "19350407"))
        return "Single Record Patient Zzzretfivefifty";
    else if ((lastName === "FIFTEEN") && (firstName === "OUTPATIENT"))
        return "Single Record Outpatient Fifteen";
    else if ((lastName === "FIFTEEN") && (dob === "19450309"))
        return "Single Record Outpatient Fifteen";
    else
        return "0 Results";
}

module.exports.fetchMvi1305FileName = fetchMvi1305FileName;