/*jslint node: true */
'use strict';

/**
 * Returns the name of the xml file that contains a SOAP response with the patient photo that corresponds to the veteranCardId.
 * This function will return a String that is used to load the corresponding patient photo file.
 *
 * @param veteranCardId The identifier of the veteran's card for which you want the corresponding VHIC card photo returned.
 * @returns {string} The file name (without a file extension) of the corresponding SOAP response.
 */
function fetchVhicPhotoFileName(veteranCardId) {
    if (veteranCardId === "")
    	return "0 Results";
    else if (veteranCardId === "1111")
        return "Card ID 1111";
    else if (veteranCardId === "1114")
        return "Card On Hold";
    else if (veteranCardId === "down_for_maintenance")
        return "Down For Maintenance";
    else
        return "0 Results";
}

module.exports.fetchVhicPhotoFileName = fetchVhicPhotoFileName;