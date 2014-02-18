define(
    [
        'jquery',
        'EventTarget',
        'HttpRequest',
        'jquery.cloneEvent'
    ],
    function ($, EventTarget, HttpRequest) {
        'use strict';

        var ajaxList = {};

        var Portlet = function (selector) {
                EventTarget.call(this);

                if (typeof selector === 'string') {
                    this.setConfig({
                        uri: selector
                    });
                    this.load();

                    return;
                }

                this.initialize(selector);
            };

        $.extend(Portlet.prototype, EventTarget.prototype, {
            httpRequest: null,
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
                    config = {
                        requestType: 'html',
                        method:      method,
                        uri:         this.getConfig('uri'),
                        data:        false,
                        animation:   animation,
                        prefix:      'load'
                    };

                this.asyncCall(config);
            },
            asyncCall: function (config) {
                if (!this.dispatchEvent(config.prefix)) {
                    return;
                }

                if (this.httpRequest) {
                    this.httpRequest.abort();
                }

                this.httpRequest = new HttpRequest(config.method, config.uri);

                this.httpRequest.setRequestType(config.requestType);
                this.httpRequest.setResponseType('html');
                this.httpRequest.setData(config.data);

                this.httpRequest.addEventListener('load.start', function (e) {
                    config.animation && config.animation.dispatchEvent('start');

                    e.type = config.prefix + '.start';

                    this.dispatchEvent(e);
                }, this);

                this.httpRequest.addEventListener('load.end', function (e) {
                    config.animation && config.animation.dispatchEvent('end');

                    e.type = config.prefix + '.end';

                    this.dispatchEvent(e);
                }, this);

                this.httpRequest.addEventListener('success', function (e) {
                    var $html  = $(e.userData.response),
                        action = (this.$element) ? 'replaceWith' : 'initialize';

                    e.type = config.prefix + '.success';

                    this[action]($html);
                    this.dispatchEvent(e);
                }, this);

                this.httpRequest.addEventListener('error', function (e) {
                    e.type = config.prefix + '.error';

                    this.dispatchEvent(e);
                }, this);

                this.httpRequest.addEventListener('complete', function (e) {
                    this.httpRequest = null;

                    e.type = config.prefix + '.complete';

                    this.dispatchEvent(e);
                }, this);

                this.httpRequest.send();
            }
        });

        return Portlet;
    }
);
