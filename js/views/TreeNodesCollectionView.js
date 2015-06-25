define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.marionette',
    'backbone.epoxy',
    '../views/baseViewMixin',
    '../views/TreeNodeView'
], function($, _, Backbone, Marionette, Epoxy, baseViewMixin, TreeNodeView) {
    'use strict';


    var TreeNodesCollectionView = Backbone.Marionette.CollectionView.extend(baseViewMixin).extend({

        tagName: 'ul',
        className: 'tree-nodes',
        childView: TreeNodeView,

        childViewOptions: function() {
            return {
                selectedModels: this.options.selectedModels,
                urlForChildren: this.options.urlForChildren,
                TreeNodeModel: this.options.TreeNodeModel
            }
        },

        onInitialize: function() {
            if (this.collection.size()) {
                this.checkModels();
            }
            this.listenTo(this.collection, "sync", this.checkModels);
        },

        checkModels: function() {
            var that = this;
            this.collection.each(function(model) {
                if (that.options.selectedModels.get(model)) {
                    model.set("isSelected", true);
                    that.options.selectedModels.remove(model, { silent: true });
                    that.options.selectedModels.add(model, { silent: true }); //Replace with model with real attributes, not just id
                }
            });
        }

    });

    return TreeNodesCollectionView;

});