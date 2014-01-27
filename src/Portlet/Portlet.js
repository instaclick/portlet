define(
    [
        'jquery',
        'jquery.cloneEvent'
    ],
    function ($) {
        'use strict';

        var ajaxList = {};

        var Portlet = function (selector) {
            var $element = (typeof selector === 'string')
                    ? $(selector)
                    : selector;

            this.initialize($element);
        };

        $.extend(Portlet.prototype, {
            getElement: function () {
                return this.$element;
            },
            getConfig: function (item) {
                return this.hasConfig(item)
                    ? this.config[item]
                    : this.config;
            },
            hasConfig: function (item) {
                return (typeof this.config[item] !== 'undefined');
            },
            initialize: function ($element) {
                this.$element = $element;
                this.config = $.extend({}, this.$element.data());
            },
            abort: function () {
                var name = this.getConfig('name');

                if (ajaxList[name]) {
                    ajaxList[name].abort();

                    ajaxList[name] = null;

                    delete ajaxList[name];
                }
            },
            replaceWith: function (portlet, cloneEventList) {
                var $target  = this.getElement(),
                    $element = (portlet.config)
                        ? portlet.getElement().clone()
                        : portlet;

                if (ajaxList[this.getConfig('name')]) {
                    this.abort();
                }

                if (portlet.config && (ajaxList[portlet.getConfig('name')])) {
                    portlet.abort();
                }

                if (cloneEventList !== false) {
                    $element.cloneEvent($target, cloneEventList || true);
                }

                $target.replaceWith($element);

                this.initialize($element);
            },
            load: function (animation) {
                var method = this.hasConfig('method') ? this.getConfig('method') : 'GET',
                    cache  = this.hasConfig('cache') ? this.getConfig('cache') : true,
                    name   = this.getConfig('name'),
                    uri    = this.getConfig('uri');

                this.abort();

                ajaxList[name] = $.ajax({
                    url:      uri,
                    type:     method,
                    dataType: 'html',
                    cache:    cache,
                    context:  this,
                    beforeSend: function (xhr, settings) {
                        // Deal with Animation
                        animation && animation.start(this);
                    },
                    success: function (html) {
                        var $html = $(html);

                        if (this.$element) {
                            this.replaceWith($html);

                            return;
                        }

                        this.initialize($html);
                    },
                    error: function (xhr, status) {
                        // Do nothing
                    },
                    complete: function (xhr, status) {
                        // Deal with Animation
                        animation && animation.end(this);

                        ajaxList[name] = null;

                        delete ajaxList[name];
                    }
                });
            },
            on: function (name, selector, handler) {
                this.$element.on(name, selector, $.proxy(handler, this));
            },
        });

        return Portlet;
    }
);
