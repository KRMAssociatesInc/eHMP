Ext.define('gov.va.cpe.multi.BoardColumn', {
	extend: 'Ext.data.Model',
	fields: [
	         {name: 'description', type: 'string'},
	         {name: 'type', type: 'string'},
	         {name: 'viewdefName', type: 'string'},
	         {name: 'viewdefCode', type: 'string'},
	         {name: 'restEndpoint'},
//	         {name: 'editOpt'},
	         {name: 'summaryType', type: 'string'},
	         {name: 'name', type: 'string'},
	         {name: 'fieldName', type: 'string'},
	         {name: 'fieldDataIndex', type: 'string'},
	         {name: 'appInfo'},
	         {name: 'configProperties'},
	         {name: 'viewdefFilters'},
	         {name: 'sequence'},
	         {name: 'id'},
	         
	],
    belongsTo: 'gov.va.cpe.multi.Board'
});