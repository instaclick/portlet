/*global define */
define(
    [
        'jquery',
        'EventTarget'
    ],
    function ($, EventTarget)
    {
        "use strict";

        /**
         * Create and initialize a new HttpRequest instance
         *
         * @param method    Request method
         * @param url       Request URL
         *
         * @return Request
         */
        var HttpRequest = function (method, url) {
            EventTarget.call(this);

            this.method       = method;
            this.url          = url;
            this.contentType  = false;
            this.dataType     = false;
            this.processData  = true;
            this.jqXHR        = null;
            this.async        = true;
            this.headerList   = {};
        };

        $.extend(HttpRequest.prototype, EventTarget.prototype, {
            /**
             * Retrieve the HttpRequest method.
             *
             * @return string
             */
            getMethod: function () {
                return this.method;
            },

            /**
             * Retrieve the HttpRequest URL.
             *
             * @return string
             */
            getUrl: function () {
                return this.url;
            },

            /**
             * Define the HttpRequest request type.
             *
             * @param type    HttpRequest request type string or FALSE to use default
             */
            setRequestType: function (type) {
                if (type === false) {
                    this.contentType = false;

                    return;
                }

                type = String(type).toLowerCase();

                switch (type) {
                case 'xml':
                    this.contentType = 'application/xml; charset=utf-8';
                    break;

                case 'html':
                    this.contentType = 'text/html; charset=utf-8';
                    break;

                case 'json':
                    this.contentType = 'application/json; charset=utf-8';
                    break;

                case 'formdata':
                    this.contentType = false;
                    this.processData = false; // Don't do any pre processing on FormData objects
                    break;

                default:
                    throw new Error('Unsupported request type: ' + type);
                }
            },

            /**
             * Define the HttpRequest Header.
             *
             * @param header  string header
             * @param content string content
             */
            addHeader: function (header, content) {
                this.headerList[header] = content;
            },

            /**
             * Get the HttpRequest Header.
             *
             * @return PlainObject headers
             */
            getHeaderList: function () {
                return this.headerList;
            },

            /**
             * Define the HttpRequest response type.
             *
             * @param type    HttpRequest response type string
             */
            setResponseType: function (type) {
                type = String(type).toLowerCase();

                switch (type) {
                case 'xml':
                case 'html':
                case 'json':
                    this.dataType = type;
                    break;

                default:
                    throw new Error('Unsupported response type: ' + type);
                }
            },

            /**
             * Define the async request status
             *
             * @param async    boolean to enable or disable async requests
             */
            setAsync: function (async)
            {
                this.async = async;
            },

            /**
             * Retrieve the HttpRequest response type.
             *
             * @return string
             */
            getResponseType: function () {
                return this.dataType;
            },

            /**
             * Retrieve the HttpRequest data.
             *
             * @param data HttpRequest data
             */
            setData: function (data) {
                this.data = data;
            },

            /**
             * Retrieve the HttpRequest data.
             *
             * @return mixed
             */
            getData: function () {
                return this.data;
            },

            /**
             * Send the HttpRequest.
             *
             * @param prefix HttpRequest prefix used for Events
             *
             * @return jqXHR
             */
            send: function () {
                var config = this.compile();

                if (this.dispatchEvent('load.start', null)) {
                    this.abort();

                    this.jqXHR = $.ajax(config);

                    return this.jqXHR;
                }

                return null;
            },

            /**
             * Compile HttpRequest information.
             *
             * @param prefix HttpRequest prefix used for Events
             *
             * @return object
             *
             * @internal
             */
            compile: function () {
                var config = {},
                    self   = this;

                config.type        = this.method;
                config.url         = this.url;
                config.contentType = this.contentType;
                config.dataType    = this.dataType;
                config.data        = this.data;
                config.processData = this.processData;
                config.headers     = this.headerList;
                config.async       = this.async;

                config.success = function (response, textStatus, jqXHR) {
                    var eventName = jqXHR.status < 300 ? 'success' : 'redirect',
                        body;

                    body = {
                        response:     response,
                        textStatus:   textStatus,
                        jqXHR:        jqXHR,
                        originalData: config.data
                    };

                    self.dispatchEvent('load.end', null);
                    self.dispatchEvent(eventName, body);
                };

                config.error = function (jqXHR, textStatus, errorThrown) {
                    var response   = jqXHR.responseText,
                        status     = jqXHR.status,
                        statusList = [403, 404],
                        body;

                    // Only try to decode on 404 responses
                    if (statusList.indexOf(status) === -1 && jqXHR.getResponseHeader('Content-Type') === 'application/json') {
                        response = $.parseJSON(jqXHR.responseText);
                    }

                    body = {
                        response:     response,
                        textStatus:   textStatus,
                        jqXHR:        jqXHR,
                        originalData: config.data,
                        errorThrown:  errorThrown
                    };

                    self.dispatchEvent('load.end', null);
                    self.dispatchEvent('error', body);
                };

                config.complete = function (jqXHR, textStatus) {
                    var body = {
                        textStatus: textStatus,
                        jqXHR:      jqXHR,
                    };

                    self.dispatchEvent('complete', body);
                };

                config.xhr = function () {
                    var customXhr = $.ajaxSettings.xhr(); // original jQuery XHR

                    if (customXhr.upload === undefined) {
                        return customXhr;
                    }

                    customXhr.upload.addEventListener('progress', $.proxy(function (event) {
                        self.dispatchEvent('progress', event);
                    }, self), false);

                    customXhr.upload.addEventListener('abort', $.proxy(function (event) {
                        self.dispatchEvent('abort', event);
                    }, self), false);

                    return customXhr;
                };

                return config;
            },

            /**
             * Abort the current request.
             */
            abort: function () {
                if (!this.jqXHR) {
                    return;
                }

                if (!this.dispatchEvent('load.abort', null)) {
                    return;
                }

                this.jqXHR.abort();
            }
        });

        return HttpRequest;
    }
);
