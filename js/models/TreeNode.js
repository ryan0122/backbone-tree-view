define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.epoxy',
    'backbone.validation'
], function($, _, Backbone, Epoxy, Validation) {


    var Model = Epoxy.Model.extend({

        initialize: function() {
        },

        defaults: {
            isExpanded: false,
            isLoading: false,
            isSelected: false,
            isEmpty: false,
            description: ''
        },

        computeds: {
            isExpandable: function() {
                var isExpanded = this.get('isExpanded');
                var hasChildren = this.get('hasChildren');
                var isLoading = this.get('isLoading');
                return hasChildren && !isLoading && !isExpanded;
            },
            isCollapsible: function() {
                var isExpanded = this.get('isExpanded');
                var hasChildren = this.get('hasChildren');
                var isLoading = this.get('isLoading');
                return hasChildren && !isLoading && isExpanded;
            },
            isSelectable: function() {
                return !this.get('hasChildren');
            }
        }

    });

    var Collection = Backbone.Collection.extend({

        model: Model

    });

    return { Model: Model, Collection: Collection };

});
