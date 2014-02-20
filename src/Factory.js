define(
    [
        'jquery',
        'Portlet/Portlet'
    ],
    function ($, Portlet) {
        'use strict';

        var PortletFactory = {

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
