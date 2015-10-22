define([
    'backbone',
    'backgrid',
    "main/backgrid/extensions/groupBy/groupByHelper",
    "hbs!main/backgrid/extensions/groupBy/groupByCellTemplate"
], function(Backbone, Backgrid, GroupByHelper, GroupByCellTemplate) {

    var GroupedByRow = Backgrid.Row.extend({
        attributes: {
            "tabindex": "0"
        },
        events: {
            //the rows are already using the data-toggle/data-target attributes for the modal views.
            'click': 'toggleRows',
            'keydown': 'onEnter'
        },
        className: "groupByHeader",
        toggleRows: function (event) {
            event.preventDefault();
            this.$el.nextUntil('.groupByHeader').slideToggle(0);
        },
        onEnter: function (event) {
            if (event.which == 13 || event.which == 32) {
                event.preventDefault();
                $(event.target).find('td.groupByHeader').click();
            }
        }
    });

    var GroupedByCell = Backgrid.Cell.extend({
        events: {
            'click': 'toggleChevron'
        },
        className: "groupByHeader selectable fa fa-chevron-down",
        render: function () {
            this.$el.html(GroupByCellTemplate(this.model.toJSON()));
            this.el.setAttribute('colspan', this.model.get("spanSize"));
            return this;
        },
        toggleChevron: function () {
            this.$el.toggleClass('fa-chevron-right');
            this.$el.toggleClass('fa-chevron-down');
            this.$el.find('.groupByCountBadge').toggleClass('hidden');
        }
    });

    var GroupByBody = Backgrid.Body.extend({
        initialize: function (options) {
            //find the primaryColumn
            this.options = options;
            this.primaryColumn = _.find(this.options.columns.models, function(column) {
               return column.get("groupableOptions")  && column.get("groupableOptions").primary;
            });
            //set up the initial column to group by (the primary one)
            if(this.primaryColumn && this.primaryColumn.get('groupableOptions'))  {
                this.groupByFunction = this.primaryColumn.get('groupableOptions').groupByFunction;
                this.groupByRowFormatter = this.primaryColumn.get('groupableOptions').groupByRowFormatter;
            }

            //if the groupBy and formatter functions are null, use defaults
            if(!this.groupByFunction) {
                this.groupByFunction = function(item) {
                    return item.model.get(primaryColumn.name);
                };
            }
            if(!this.groupByRowFormatter) {
                this.groupByRowFormatter = function(group) {
                    return group;
                };
            }
            this._super = Backgrid.Body.prototype;
            this._super.initialize.apply(this, arguments);
            this.listenTo(this.collection, "backgrid:groupBy", this.sortForGroupBy);
        },
        render: function () {
            this.$el.empty();
            var fragment = document.createDocumentFragment();

            //should this be done here?
            if (this.collection !== undefined && !GroupByHelper.isEmptyCollection(this.collection)) {
                this.groupedRows = GroupByHelper.aggregateBy(this.rows, this.groupByFunction);
            } else {
                this.groupedRows = undefined;
            }

            if (this.groupedRows === undefined) {
                for (var i = 0; i < this.rows.length; i++) {
                    var row = this.rows[i];
                    fragment.appendChild(row.render().el);
                }

            }
            else { //have grouped rows
                _.each(this.groupedRows, function (item) {
                    var key = item[0];
                    var group = item[1];
                    //insert groupedBy row here
                    var title = this.groupByRowFormatter(key);
                    var groupedByRow = new GroupedByRow({
                        columns: {name: 'title', hidden: true, editable: false, cell: GroupedByCell},
                        model: new Backbone.Model({
                            id: key,
                            title: title,
                            count: group.length,
                            spanSize: this.columns.length,
                            cell: 'string'
                        })
                    });
                    fragment.appendChild(groupedByRow.render().el);
                    _.each(group, function (row) {
                        fragment.appendChild(row.render().el);
                    });

                }, this);
            }
            this.el.appendChild(fragment);
            this.delegateEvents();
            return this;
        },

        /**
         * Sort the collection in a way to prepare it for the grouping by functionality in the render method.
         *
         * @param column
         * @param direction
         */
        sortForGroupBy: function(col, direction) {
            var order = this.convertDirection(direction), comparator, column;

            if(order) {
                column = col;
            }
            else { //use the default Primary grouping and sort order, this is based off of the primary column
                column = this.primaryColumn;
                order = 1;
            }

            //need to sort first by the groupBy category and then by the innerSort
//            comparator = this.makeComparator(column.get("name"), column.get('groupableOptions').innerSort, order);
            comparator = this.makeComparator(column, order);
            this.groupByFunction = (column.get('groupableOptions') && column.get('groupableOptions').groupByFunction)  || function(item) {
                return item.model.get(column.get('name'));
            };
            this.groupByRowFormatter = column.get('groupableOptions') && column.get('groupableOptions').groupByRowFormatter || function(group) {
                return group;
            };

            if (Backbone.PageableCollection && this.collection instanceof Backbone.PageableCollection) {
                if (this.collection.fullCollection) {
                    //use the updated Comparator
                    this.collection.fullCollection.comparator = comparator;
                    this.collection.fullCollection.sort();

                }
                else {
                    //does a server side sort??? Not sure this is implemented in the RDK.
                    //not sure how to add the sorts in
                    this.collection.fetch({reset: true});
                }
            }
            else {
                this.collection.comparator = comparator;
                //calling the sort function here will automatically trigger a Body.refresh call, which will call the render method which does the grouping.
                this.collection.sort();
            }

            //reset the direction on the *col* not column (impacts case where direction/order is null. directional arrow on clicked on column (col) won't
            //get removed
            col.set("direction", direction);
            return this;

        },
        /** convert the direction parameter oto a -1 or 1 (ascending or descending)
         *
         */
        convertDirection: function(direction) {
            var order;
            if (direction === "ascending") order = -1;
            else if (direction === "descending") order = 1;
            else order = null;

            return order;
        },
        makeComparator: function(column, order) {
            var modelExtractor = this.modelExtractor;

            //the primary sort needs to be based off of the groupByColumn, it can't be based off of the column  name
            //For example, if we're grouping by year & month, with an inner sort, if we compare by the column, there won't
            //be any tie, which means the inner sort can't do its thing.
            var secondarySort = column.get('groupableOptions').innerSort;

            // custom innersort comparator
            var secondarySortValue = column.get('groupableOptions').innerSortValue || function(left,right) {
                if(left == right) return 0;
                else if(left > right) return -1;
                return 1;
            };

            //either the name of the column, or the group by function;
            return function (left, right) {
                // extract the values from the models
                var l, r, t;

                if(column.get('groupableOptions') && column.get('groupableOptions').groupByFunction) {
                    //the groupByFunction is expected to work on a an object which contains a model (Backgrid.Rows to be exacty)
                    // , not an model.
                    l = column.get('groupableOptions').groupByFunction({model: left});
                    r = column.get('groupableOptions').groupByFunction({model :right });
                }

                l = l || modelExtractor(left, column.get('name'));
                r = r || modelExtractor(right, column.get('name'));


                // if descending order, swap left and right
                if (order === 1) t = l, l = r, r = t;
                // compare as usual
                if (l === r) {
                    if(secondarySort) {
                        var innerL = modelExtractor(left, secondarySort), innerR = modelExtractor(right, secondarySort);
                        return secondarySortValue(innerL, innerR);
                    } else return 0;
                }
                else if (l < r) return -1;
                return 1;
            };


        },
        modelExtractor: function(model, key) {
            if (model.get(key)) {
                return model.get(key).toLowerCase();
            }
            else {
                return '';
            }
        }

    });
    return GroupByBody;

});
