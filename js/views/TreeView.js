define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.marionette',
    'backbone.epoxy',
    'views/baseViewMixin',
    'iews/TreeNodesCollectionView',
    'models/TreeNode'
], function($, _, Backbone, Marionette, Epoxy, baseViewMixin, TreeNodesCollectionView, TreeNode) {
    'use strict';

    var TreeView = Backbone.Marionette.ItemView.extend(baseViewMixin).extend({

        template: false,
        tagName: 'div',
        className: 'eagle-tree-view',
        enableValidation: false,

        onInitialize: function(options) {
            this.treeNodesCollectionView = new TreeNodesCollectionView({ collection: options.collection,
                selectedModels: options.selectedModels,
                urlForChildren: options.urlForChildren,
                TreeNodeModel: options.TreeNodeModel || TreeNode.Model });
        },

        onRender: function() {
            this.treeNodesCollectionView.render();
            this.$el.append(this.treeNodesCollectionView.$el);
        }

    });

    return TreeView;

});