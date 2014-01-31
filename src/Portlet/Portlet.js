define(
    [
        'jquery',
        'EventTarget',
        'jquery.cloneEvent'
    ],
    function ($, EventTarget) {
        'use strict';

        var ajaxList = {};

        var Portlet = function (selector) {
                EventTarget.call(this);

                var $element = (typeof selector === 'string')
                        ? $(selector)
                        : selector;

                this.initialize($element);
            };

        $.extend(Portlet.prototype, EventTarget.prototype, {
            getElement: function () {
                return this.$element;
            },
            setConfig: function (item, value) {
                if ($.isPlainObject(item)) {
                    this.config = value
                        ? item
                        : $.extend(this.config, item);

                    return;
                }

                this.config[item] = value;

                return this;
            },
            getConfig: function (item) {
                if (item === undefined) {
                    return this.config;
                }

                return this.hasConfig(item)
                    ? this.config[item]
                    : undefined;
            },
            hasConfig: function (item) {
                return (typeof this.config[item] !== 'undefined');
            },
            initialize: function ($element) {
                this.$element = $element;
                this.config   = $.extend({}, this.$element.data());
            },
            abort: function () {
                var name = this.getConfig('name');

                if (ajaxList[name]) {
                    ajaxList[name].abort();

                    ajaxList[name] = null;

                    delete ajaxList[name];

                    this.dispatchEvent('load.abort');
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
                this.dispatchEvent('replace');
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

                        this.dispatchEvent('load.start');
                    },
                    success: function (html) {
                        var $html = $(html);

                        if (this.$element) {
                            this.replaceWith($html);

                            return;
                        }

                        this.initialize($html);
                        this.dispatchEvent('load.success');
                    },
                    error: function (xhr, status) {
                        this.dispatchEvent('load.error');
                    },
                    complete: function (xhr, status) {
                        // Deal with Animation
                        animation && animation.end(this);

                        ajaxList[name] = null;

                        this.dispatchEvent('load.end');

                        delete ajaxList[name];
                    }
                });
            }
        });

        return Portlet;
    }
);
