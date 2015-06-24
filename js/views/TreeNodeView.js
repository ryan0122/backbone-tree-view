define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.marionette',
    'backbone.epoxy',
    'text!tpl/TreeNodeView.html',
    'views/baseViewMixin',
    'models/TreeNode'
], function($, _, Backbone, Marionette, Epoxy, template, baseViewMixin, TreeNode) {
    'use strict';

    var TreeNodeView = Backbone.Marionette.ItemView.extend(baseViewMixin).extend({

        template: _.template(template),
        tagName: 'li',
        className: 'tree-node',
        enableValidation: false,

        events: {
            "click .tree-node-icon-expand": "expand"
        },

        onInitialize: function() {
            this.listenTo(this.model, "change:isSelected", this.onSelectionChange);
        },

        onRender: function() {
            //events binding should be done at this time;
            //if included in events hash, events from children are also triggered
            this.$(".tree-node-icon-collapse").click($.proxy(this.hideChildren, this));
            if (this.model.get("hasChildren") || this.model.get("isSelectable")) {
                this.$(".tree-node-label").click($.proxy(this.toggle, this));
            }
        },

        toggle: function() {
            if (this.model.get("hasChildren")) {
                if (this.model.get("isExpanded")) {
                    this.hideChildren();
                } else {
                    this.expand();
                }
            }
            if (this.model.get("isSelectable")) {
                this.model.set("isSelected", !this.model.get("isSelected"));
            }
        },

        expand: function() {
            if (this.collection) {
                this.showChildren();
            } else {
                this.collection = new TreeNode.Collection();
                this.collection.model = this.options.TreeNodeModel || TreeNode.Model;
                this.collection.fetch({
                    url: this.options.urlForChildren(this.model.get("id")),
                    success: $.proxy(this.onChildrenFetched, this)
                });
                this.model.set("isLoading", true);
            }
        },

        onSelectionChange: function() {
            if (this.model.get("isSelected")) {
                this.options.selectedModels.add(this.model);
            } else {
                this.options.selectedModels.remove(this.model);
            }
        },

        onChildrenFetched: function(c) {
            var that = this;
            this.model.set("isLoading", false);
            if (!this.collection.size()) {
                this.showChildren();
                this.model.set('isEmpty', true);
            } else {
                require(["app/views/TreeNodesCollectionView"], function(TreeNodesCollectionView) {
                    that.childrenView = new TreeNodesCollectionView({ collection: that.collection,
                        selectedModels: that.options.selectedModels,
                        urlForChildren: that.options.urlForChildren });
                    that.childrenView.render();
                    that.$el.append(that.childrenView.$el);
                    that.showChildren();
                });
            }
        },

        showChildren: function() {
            this.model.set("isExpanded", true);
            this.childrenView && this.childrenView.$el.show();
        },

        hideChildren: function(e) {
            this.model.set("isExpanded", false);
            this.childrenView && this.childrenView.$el.hide();
        }

    });

    return TreeNodeView;

});