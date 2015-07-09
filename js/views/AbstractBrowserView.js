define([
    'jquery',
    'underscore',
    'backbone',
    'backbone.marionette',
    'backbone.epoxy',
    '../views/baseViewMixin',
    '../views/TreeView',
    '../models/TreeNode'
], function($, _, Backbone, Marionette, Epoxy, contentAreas, gradeLevels, baseViewMixin, TreeView, TreeNode) {
    'use strict';

    var AbstractBrowserView = Backbone.Marionette.LayoutView.extend(baseViewMixin).extend({

        enableValidation: false,

        onInitialize: function(options) {
            this.browserCollection = new TreeNode.Collection();
            this.selectedModels = new TreeNode.Collection();
            this.setSelectedModels(options.ids || []);
            this.model = new Model({
                selectedModelsCount: this.selectedModels.size()
            });
            this.listenTo(this.selectedModels, "add remove reset", this.onSelectionChange);
            //this.listenTo(this.model, "change:gradeLevel change:contentArea", this.resetBrowser);

            //DropDown logic from options
            if(options.config.dropdowns) {
                this.handleDropdowns(options.config.dropdowns);
            }

            //Tree Root URL logic
            if(options.config.treeRootUrl) {
                this.setTreeRootUrl(options.config.treeRootUrl);
            }

            //URL for children logic
            if(options.config.urlForChildren) {
                this.setUrlForChildren(options.config.urlForChildren);
            }
        },

        onShow: function() {
            //Now a good time to see if gradeLevel and contentArea have been passed and if the have, set model's values
            //this.options.gradeLevel && this.model.set('gradeLevel', this.options.gradeLevel);
            //this.options.contentArea && this.model.set('contentArea', this.options.contentArea);
//            this.resetBrowser();
        },


        handleDropdowns: function(dropdowns) {
            var that = this;

            //_.each.(dropdowns, function(dropdown){
            //
            //});
        },

        setTreeRootUrl: function(url){
            if(typeof url === "function") {

            } else {
                this.treeRootUrl = url;
            }

        },

        setUrlForChildren: function(url){
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

//        onRender: function() {
//        }

    });

    return AbstractBrowserView;

});