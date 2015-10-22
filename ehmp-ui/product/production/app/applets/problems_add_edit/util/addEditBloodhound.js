define([
    'typeahead'
], function(TwitterTypeahead){
    
    var AddEditSearch = {};
    var siteCode = ADK.UserService.getUserSession().get('site');
    var locationClinicURL = ADK.ResourceService.buildUrl('locations-clinics', {
            "site.code": siteCode,
            limit: 10
        });
    var visitProviderURL = ADK.ResourceService.buildUrl('visits-providers', {
            "facility.code": siteCode,
            limit: 10
        });
    
    AddEditSearch.VisitProviderBloodhound = new Bloodhound({
              datumTokenizer: function (datum) {
                    return Bloodhound.tokenizers.whitespace(datum.value);
              },
              queryTokenizer: Bloodhound.tokenizers.whitespace,
              remote:{
                    url:  visitProviderURL + '&pname=%QUERY',
                    filter: function (data) {
                        return $.map(data.data.items, function (visitProvider) {
                            return {
                                value: visitProvider.name,
                                localId: visitProvider.localId  
                            };
                        });
                    },
                    ajax: {
                        beforeSend: function(){},
                        complete: function(){}
                    }
                }
            });
    
    AddEditSearch.LocationSearchBloodhound = new Bloodhound({
              datumTokenizer: function (datum) {
                    return Bloodhound.tokenizers.whitespace(datum.value);
              },
              queryTokenizer: Bloodhound.tokenizers.whitespace,
              remote:{
                    url:  locationClinicURL + '&name=%QUERY',
                    filter: function (data) {
                        return $.map(data.data.items, function (locationItem) {
                            return {
                                value: locationItem.name,
                                localId: locationItem.localId  
                            };
                        });
                    }
                }
            });
    
    return AddEditSearch; 
});
