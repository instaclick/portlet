define(
    [
        'jquery',
        'Portlet/Portlet'
    ],
    function ($, Portlet) {
        'use strict';

        var PortletFactory = {
            fromURI: function (uri) {
                var portlet = new Portlet(uri);

                return portlet;
            },
            fromHTML: function (html) {
                return this.fromElement($(html));
            },
            fromElement: function ($element) {
                var portletClass = $element.data('portlet') || 'Portlet/Portlet',
                    Portlet      = require(portletClass);

                return new Portlet($element);
            }
        };

        return PortletFactory;
    }
);
