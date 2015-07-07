/**
 * @deprecated
 */
Ext.define('gov.va.hmp.util.HL7DTMFormatter', {
    statics: {
        /**
         * @deprecated
         */
        UTC: function (value) {
            if (!value) {
                return "";
            }

            // Split dateTime string to date/time token, milliseconds and zone
            var parts = value.toString().split(/[.\+\-]/);

            // Extract all fields based on position
            var year = parts[0].slice(0, 4);
            var month = new Number(parts[0].slice(4, 6)) - 1; // UTC wants 0-based months instead of 1-based months.
            var day = parts[0].slice(6, 8);
            var hour = parts[0].slice(8, 10);
            var min = parts[0].slice(10, 12);
            var sec = parts[0].slice(12, 14);

            var mlsec = (value.search(/\./)) ? mlsec = parts[1] : "";
            var zone = (value.search(/[+\-]/)) ? mlsec = parts[2] : "";

            return Date.UTC(year, month, day, hour, min, sec);
        }
    }
});