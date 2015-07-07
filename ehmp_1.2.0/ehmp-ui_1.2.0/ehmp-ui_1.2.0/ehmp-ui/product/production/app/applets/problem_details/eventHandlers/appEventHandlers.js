define([
  "backbone",
  "marionette"
], function(Backbone, Marionette) {
  
  var toggleAndRemoveSortClasses = function (target, viewElement, classToToggle) {
    var alreadyAscending = viewElement.hasClass(classToToggle),
        targetSortGlyphIcon,
        allSortGlyphIcon = viewElement.find("i.fa");

    if(target.nodeName.toUpperCase() === "I") {
      targetSortGlyphIcon = viewElement.find('th#' + target.parentElement.id).find("i");         
    } else {
      targetSortGlyphIcon = viewElement.find('th#' + target.id).find("i");   
    }
      


    viewElement.removeClass(function() {
      var classesToRemove = '',
        classes = this.className.split(' '),
        i;

      for (i = 0; i < classes.length; i++) {
        if (/sort-ascending-/.test(classes[i])) {
          classesToRemove += classes[i] + ' ';
        }
      }      
      return classesToRemove;
    });

    allSortGlyphIcon.removeClass("fa-sort-by-attributes fa-sort-by-attributes-alt");
    allSortGlyphIcon.addClass("fa-sort");

    targetSortGlyphIcon.removeClass("fa-sort");
    if (!alreadyAscending) {
      viewElement.addClass(classToToggle);
      targetSortGlyphIcon.addClass("fa-sort-by-attributes");
    } else {
      targetSortGlyphIcon.addClass("fa-sort-by-attributes-alt");
    }
    
  },
  
    EventHandlers = {
    sortCollection: function(event, viewElement, collection, field, sortType) {
      event.stopPropagation();
      var className = 'sort-ascending-' + field;
      if (viewElement.hasClass(className)) {
        ADK.utils.sortCollection(collection, field, sortType, false);
      } else {
        ADK.utils.sortCollection(collection, field, sortType, true);
      }
      toggleAndRemoveSortClasses(event.target, viewElement, className);
    }
  };
  
  return EventHandlers;
});
