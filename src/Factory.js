define(
    [
        'jquery',
        'Portlet/Portlet'
    ],
    function ($) {
        'use strict';

        var PortletFactory = {
            fromURI: function (handler) {
                return this.fromHTML(html);
            },
            fromHTML: function (html) {
                this.fromElement($(html));
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
