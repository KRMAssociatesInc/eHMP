define(["moment"], function(Moment) {

    var Util = {
        getDateTime: function(date, time) {
            /*
            var dateTime = moment(date, 'MM/DD/YYYY').format('YYYYMMDD');

            if(time){
                var timeSplit = time.split(':');
                var tod = timeSplit[1].charAt(2);

                if(timeSplit[0] === '12' && tod === 'a'){
                    dateTime += '00';
                } else if(tod === 'p' && timeSplit[0] !== '12'){
                    dateTime += parseInt(timeSplit[0]) + 12;
                } else {
                    dateTime += timeSplit[0];
                }
                dateTime += timeSplit[1].substring(0, 2);
            }

            return dateTime;
            */
            if (time) {
                return new Moment(date + ' ' + time + 'm', ADK.utils.dateUtils.defaultOptions().placeholder+" HH:mma").format('YYYYMMDDHHmm');
            } else {
                return new Moment(date, ADK.utils.dateUtils.defaultOptions().placeholder).format('YYYYMMDD');
            }
        }
    };

    return Util;
});
