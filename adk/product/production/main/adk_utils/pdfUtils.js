//NOT USED FOR THE MOMENT!!!
// define([
//     'jquery',
//     '_assets/libs/jspdf/jspdf.debug.js'
// ], function($, pdf) {

//     var pdfUtils = {};

//     pdfUtils.exportToPdf = function(key, elementId) {
//         var pdf = new jsPDF('p', 'pt', 'letter');

//         var source = $('#' + elementId)[0];

//         margins = {
//             top: 80,
//             bottom: 60,
//             left: 40,
//             width: 522
//         };

//         pdf.fromHTML(
//             source, margins.left, margins.top, {
//                 'width': margins.width
//             },
//             function(dispose) {
//                 pdf.save(key);
//             },
//             margins
//         );
//     };

//     return pdfUtils;
// });
