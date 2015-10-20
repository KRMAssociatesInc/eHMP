'use strict';

define(['handlebars'], function(Handlebars) {
    function formatNewLine(string) {
        var arrLine = (string) ? string.split("//") : [];
        if(arrLine.length > 1){
          return new Handlebars.SafeString(arrLine.join("</br>"));
        }
        else{
         return string;
        }
    }
    Handlebars.registerHelper('formatNewLine', formatNewLine);
    return formatNewLine;
});