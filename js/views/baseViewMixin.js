define(["underscore",
        "backbone",
        "backbone.marionette",
        "backbone.epoxy"
    ],
    function(_, Backbone, Marionette, Epoxy) {
        'use strict';

        // Base set of functions that can be mixed into standard views such as ItemViews, CompositeViews, etc.
        return {

            modelEvents: {
                "change": "modelChanged",
                "sync": "modelSync"
            },

            epoxyBindingEnabled: true,

            initialize: function(options) {
                if (this.epoxyBindingEnabled) {
                    this.epoxify();
                }
                this.initialized = true;
                this.triggerMethod("initialize", options);
            },

            onRender: function() {
                if (!this.initialized) {
                    throw Error("View not initialized. Likely caused by initialize() function overriden in child");
                }
                this.modelChangedAfterViewRendered = false;
            },

            epoxify: function() {
                Epoxy.View.mixin(this);
                this.listenTo(this, "ui:bind", this.applyBindings);
                this.listenTo(this, "before:close", this.removeBindings);
            },

            // Override Marionette's impl so we can trigger our own event
            bindUIElements: function() {
                this.trigger("ui:bind");
                Marionette.View.prototype.bindUIElements.apply(this, arguments);
            },

            modelChanged: function() {
                var field;
                for (field in this.model.changed) {
                    var bothFalsey = !this.model.get(field) && !this.model.previousAttributes()[field];
                    var equal = this.model.get(field) === this.model.previousAttributes()[field];
                    if (!bothFalsey && !equal) {
                        this.modelHasChanged = true;
                        this.modelChangedAfterViewRendered = true;
                        break;
                    }
                }
            },

            modelSync: function() {
                this.modelHasChanged = false;
                this.modelChangedAfterViewRendered = false;
            },

            back: function() {
                app.back();
            },
            hideErrors: function() {
                this.$(".view-errors").hide();
            }

        };

    });
