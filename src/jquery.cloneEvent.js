/*
 *  jQuery cloneEvent - v0.0.1
 *  https://github.com/instaclick
 *
 *  Under MIT License
 */

;(function ($) {

    var pluginName = "cloneEvent",
        defaults = {
            filter: false
        };

    var Plugin = function (element, options) {
            this.element  = element;
            this.config   = $.extend({}, defaults, options);
            this.source   = (typeof this.config.source === 'string')
                            ? $(this.config.source)
                            : this.config.source;
            this.eventList = $._data(this.source[0], 'events') || {};

            this.initialize();
        };

    Plugin.prototype = {
        initialize: function () {
            var events = this.eventList;

            for (var type in events) {
                if (events.hasOwnProperty(type)) {
                    for (var i = 0, l = events[ type ].length; i < l; i++ ) {
                        $.event.add(this.element, type, events[type][i]);
                    }
                }
            }
        }
    };

    $.fn[ pluginName ] = function (options) {

        return this.each(function() {
            // avoid multiple plugin instances
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }

        });
    };

})(jQuery);