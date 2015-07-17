define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.marionette',
    'backbone.epoxy',
    '../views/baseViewMixin',
    '../views/TreeView',
    '../models/TreeNode'
], function($, _, Backbone, Marionette, Epoxy, baseViewMixin, TreeView, TreeNode) {
    'use strict';

    var AbstractBrowserView = Backbone.Marionette.LayoutView.extend(baseViewMixin).extend({

        viewOptions: ['urlForChildren', 'urlForRoot'],

        enableValidation: false,

        onInitialize: function(options, Model) {
            this.mergeOptions(options, this.viewOptions);
            this.browserCollection = new TreeNode.Collection();
            this.selectedModels = new TreeNode.Collection();
            this.setSelectedModels(options.ids || []);
            this.model = new Model({
                selectedModelsCount: this.selectedModels.size()
            });
            this.listenTo(this.selectedModels, "add remove reset", this.onSelectionChange);
        },

        onSelectionChange: function() {
            //console.log('Selected models: ' + this.selectedModels.size());
            this.model.set("selectedModelsCount", this.selectedModels.size());
        },

        resetSelection: function() {
            var that = this, ids = [];
            this.selectedModels.each(function(model) {
                ids.push(model.id);
            });
            _.each(ids, function(id) {
                that.selectedModels.get(id).set("isSelected", false); //will cause removal of the model from selectedModels collection
            });
            this.selectedModels.reset();
        },

        setSelectedModels: function(ids) {
            var that = this;
            _.each(ids, function(id) {
                that.selectedModels.add({ id: id });
            });
        },

        getSelectedIds: function() {
            var ids = [];
            this.selectedModels.each(function(model) {
                ids.push(model.id);
            });
            return ids;
        },

        resetBrowser: function() {
            console.log(this.options.config);
            if (this.browserCollection.size()) {
                this.browserCollection.reset();
                this.selectedModels.reset();
            }

            var TreeNodeModel = TreeNode.Model.extend({
                computeds: _.extend({
                    hasChildren: function() { return !!this.get("numberOfChildren"); }
                }, TreeNode.Model.prototype.computeds)
            });

            this.browserCollection.model = TreeNodeModel;
            this.browserCollection.fetch({
                url: this.getOption('urlForRoot').call(this)
            });

            this.treeViewRegion.show(this.treeView = new TreeView({
                collection: this.browserCollection,
                selectedModels: this.selectedModels,
                TreeNodeModel: TreeNodeModel,
                urlForChildren: $.proxy(this.getOption('urlForChildren'), this)
            }));
        }

    });

    return AbstractBrowserView;

});