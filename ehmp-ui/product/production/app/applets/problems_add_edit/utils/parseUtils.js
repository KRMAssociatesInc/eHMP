define([
    'jquery'
], function($) {
    return {
        getProblemTermPickList: function(response){
            var pickList = [];

            if(response.data){
                _.each(response.data, function(item){
                    if(item.prefText){
                        var problem = {
                            label : item.prefText,
                            value : item.prefText,
                            codeSys : item.codeSys,
                            conceptId : item.conceptId,
                            desigId : item.desigId,
                            icdCodes : item.icdCodes,
                            icdIen : item.icdIen,
                            icdVer : item.icdVer,
                            lexIen : item.lexIen,
                            prefText : item.prefText
                        };

                        pickList.push(problem);
                    }
                });
            }
            return pickList;
        },
        getClinic: function(response){
            var pickList = [];

            if(response.data.items){
                _.each(response.data.items, function(item){
                    // todo: instead of localId may want to use uid.split(':').pop();
                    if (item.name && item.localId) {
                        var clinic = {
                            label: item.name,
                            value: item.localId
                        };

                        pickList.push(clinic);
                    }
                });
            }

            return pickList;
        },
        getResProvider: function(response){
            var pickList = [];

            if(response.data.items){
                _.each(response.data.items, function(item){
                    // todo: instead of localId may want to use uid.split(':').pop();
                    if (item.name && item.localId) {
                        var resProvider = {
                            label: item.name,
                            value: item.localId
                        };

                        pickList.push(resProvider);
                    }
                });
            }

            return pickList;
        }
    };
});