'use strict';

var _ = require('underscore');

module.exports = loincSearch;

function loincSearch(searchTerm) {
    var urn = [
        {lnc: 'LP14913-5', description: 'Porphyrins'},
        {lnc: 'LP15157-8', description: 'Iodine'},
        {lnc: 'LP15677-5', description: 'Iron'},
        {lnc: 'LP15705-4', description: 'Lipids'},
        {lnc: 'LP15711-2', description: 'Lipoprotein'},
        {lnc: 'LP15838-3', description: 'Protein'},
        {lnc: 'LP18033-8', description: 'Amino acids'},
        {lnc: 'LP19203-6', description: 'Prostaglandins'},
        {lnc: 'LP19403-2', description: 'Electrolytes'},
        {lnc: 'LP31391-3', description: 'Cytokines'},
        {lnc: 'LP31392-1', description: 'Enzymes'},
        {lnc: 'LP31395-4', description: 'Vitamins'},
        {lnc: 'LP31396-2', description: 'Endocrine'},
        {lnc: 'LP31397-0', description: 'Liver function'},
        {lnc: 'LP31398-8', description: 'Renal function'},
        {lnc: 'LP31399-6', description: 'Sugars/Sugar metabolism'},
        {lnc: 'LP31400-2', description: 'Gases and acid/Base'},
        {lnc: 'LP31403-6', description: 'Neuromuscular'},
        {lnc: 'LP31405-1', description: 'Nucleotides'},
        {lnc: 'LP31406-9', description: 'Inborn errors metabolism lysosomal'},
        {lnc: 'LP31409-3', description: 'Cardiovascular'},
        {lnc: 'LP31410-1', description: 'Physical properties'},
        {lnc: 'LP31412-7', description: 'Tumor markers'},
        {lnc: 'LP31413-5', description: 'Mineral and bone'},
        {lnc: 'LP31415-0', description: 'Small molecules'},
        {lnc: 'LP31418-4', description: 'General terms'},
        {lnc: 'LP31419-2', description: 'Gastrointestinal function'},
        {lnc: 'LP31771-6', description: 'Crystals & calculi'},
        {lnc: 'LP33025-5', description: 'Newborn screening panel'},
        {lnc: 'LP36815-6', description: 'Peptides'},
        {lnc: 'LP70625-6', description: 'Maternal screens'}
    ];

    var responseArray = [];

    _.each(urn, function (loincItem) {
        if (loincItem.description.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1) {
            responseArray = responseArray.concat(loincItem.description);
        }
    });
    return responseArray;
}
