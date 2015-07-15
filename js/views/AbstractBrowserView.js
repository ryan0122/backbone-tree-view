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

        enableValidation: false,

        onInitialize: function(options, Model) {
            this.browserCollection = new TreeNode.Collection();
            this.selectedModels = new TreeNode.Collection();
            this.setSelectedModels(options.ids || []);
            this.model = new Model({
                selectedModelsCount: this.selectedModels.size()
            });
            this.listenTo(this.selectedModels, "add remove reset", this.onSelectionChange);
        },

        onShow: function(view) {

            //DropDown logic from options
            if(view.options.config.dropdowns) {
                this.handleDropdowns(view.options.config.dropdowns);
            }

            //Tree Root URL logic
            if(view.options.config.treeRootUrl) {
                this.setTreeRootUrl(view.options.config.treeRootUrl);
            }

            //URL for children logic
            if(view.options.config.urlForChildren) {
                this.setUrlForChildren(view.options.config.urlForChildren);
            }

            this.resetBrowser(view);
        },


        handleDropdowns: function(dropdowns) {
            var that = this;
            console.log('We have DROPDOWNS config');

            //_.each.(dropdowns, function(dropdown){
            //
            //});
        },

        setTreeRootUrl: function(url){
            console.log('We have TREEROOT config');
            if(typeof url === "function") {

            } else {
                this.treeRootUrl = url;
            }

        },

        setUrlForChildren: function(url){
            console.log('We have SETURLFORCHILDREN config');
            if(typeof url === "function") {

            } else {
                this.urlForChildren = url;
            }

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
            //must be overridden by browser that is abstracting this view.
        }

    });

    return AbstractBrowserView;

});