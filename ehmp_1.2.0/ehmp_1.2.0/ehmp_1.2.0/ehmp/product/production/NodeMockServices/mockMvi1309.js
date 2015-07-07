/*jslint node: true */
'use strict';

/**
 * Based on the patientId, we will determine which of the responses (1310) to return for the soap message submitted (1309).
 * This will return a String that is used to load the corresponding file.
 *
 * @param patientId The identifier of the patient for which you want the detailed 1310 response returned.
 * @returns {string}
 */
function fetchMvi1309FileName(patientId) {
    if (patientId === "")  //Passed in PatientID is required
        return "0 Results";
    else if (patientId === "10108V420871^NI^200M^USVHA")
        return "ICN 10108V420871";
    else if (patientId === "5000000116V912836^NI^200M^USVHA")
        return "ICN 5000000116V912836";
    else if (patientId === "5000000217V519385^NI^200M^USVHA")
        return "ICN 5000000217V519385";
    else if (patientId === "5000000317V387446^NI^200M^USVHA")
        return "ICN 5000000317V387446";
    else if (patientId === "10118V572553^NI^200M^USVHA")
        return "ICN 10118V572553";
    else if (patientId === "5000000126V406128^NI^200M^USVHA")
        return "ICN 5000000126V406128";
    else if (patientId === "5000000227V477236^NI^200M^USVHA")
        return "ICN 5000000227V477236";
    else if (patientId === "5000000327V828570^NI^200M^USVHA")
        return "ICN 5000000327V828570";
    else if (patientId === "10180V273016^NI^200M^USVHA")
        return "ICN 10180V273016";
    else if (patientId === "5000000187V951630^NI^200M^USVHA")
        return "ICN 5000000187V951630";
    else if (patientId === "315^PI^C877^USVHA")
        return "DFN C877;315";
    else if (patientId === "100031V310296^NI^200M^USVHA")
        return "ICN 100031V310296";
    else if (patientId === "4325678^NI^200DOD^USDOD")
        return "EDIPI 4325678";
    else if (patientId === "4325678V4325678^NI^200M^USVHA")
        return "ICN 4325678V4325678";
    else if (patientId === "4325679V4325679^NI^200M^USVHA")
        return "ICN 4325679V4325679";
    else if (patientId === "35^PI^C877^USVHA")
        return "DFN C877;35";
    else if (patientId === "5000000123V015819^NI^200M^USVHA")
        return "ICN 5000000123V015819";
    else
        return "0 Results";
}

module.exports.fetchMvi1309FileName = fetchMvi1309FileName;