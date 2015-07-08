define(function() {
    'use strict';

    var preprendSrOnlySpan = function(cell, baseText) {
        var srOnlyText = cell.column.attributes.label;
        if (srOnlyText === undefined || srOnlyText === '') {
            return baseText;
        }

        if (baseText === undefined) {
            baseText = '';
            srOnlyText = srOnlyText + ' is empty';
        }

        return '<span class="sr-only">' + srOnlyText + ' </span>' + baseText;
    };

    var applyTemplateWithScreenReaderText = function(cell) {
        var template = cell.column.get('template');
        var templateApplicationResult = template(cell.model.toJSON());
        return templateApplicationResult;
    };

    var getModelValueWithScreenReader = function(cell) {
        var columnName = cell.column.attributes.name;
        var cellValue = cell.model.get(columnName);
        return cellValue;
    };

    var setScreenReaderCell = function(cell, cellValue) {
        var cellValueWithScreenReader = preprendSrOnlySpan(cell, cellValue);
        cell.$el.html(cellValueWithScreenReader);
    };

    return {
        setTemplateWithScreenReaderText: function(cell) {
            var cellValue = applyTemplateWithScreenReaderText(cell);
            setScreenReaderCell(cell, cellValue);
        },
        setModelValueWithScreenReader: function(cell) {
            var cellValue = getModelValueWithScreenReader(cell);
            setScreenReaderCell(cell, cellValue);
        },
        setHtmlWithScreenReader: function(cell, html) {
            setScreenReaderCell(cell, html);
        }
    };
});