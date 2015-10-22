define([
    'typeahead'
], function(TwitterTypeahead){

    var siteCode = ADK.UserService.getUserSession().get('site');
    var problemSearchURL = ADK.ResourceService.buildUrl('problems-getProblems', {
            "site.code": siteCode,
            limit: 10
        });
    return new Bloodhound({
              datumTokenizer: function (datum) {
                    return Bloodhound.tokenizers.whitespace(datum.value);
              },
              queryTokenizer: Bloodhound.tokenizers.whitespace,
              remote:{
                    url:  problemSearchURL,
                    replace: function (url, query) {
                        if($('#uncodedNew').prop('checked')){
                            url += '&uncoded=1';
                        }
                        url+= '&query=' + query;

                        return url;
                    },
                    filter: function (data) {
                        if(data && data.data.items !== 'No data'){
                            return $.map(data.data.items, function (problemItem) {
                                return {
                                    value: problemItem.problem,
                                    problemNumber: problemItem.problemNumber,
                                    icd: problemItem.icd,
                                    lexiconCode: problemItem.lexiconCode,
                                    snomed: problemItem.snomed,
                                    problemText: problemItem.problemText
                                };
                            });
                        } else {
                            return {};
                        }
                    },
                    ajax: {
                        beforeSend: function(){ 
                            $('#problemSearchSpinner').show();
                        },
                        complete: function(){ 
                            $('#problemSearchSpinner').hide();
                        }
                    }
                }
            });
});
