define(
    [
        'jquery',
        'Portlet/Portlet'
    ],
    function ($, Portlet) {
        'use strict';

        var PortletFactory = {
            fromURI: function (handler) {



                return this.fromHTML(html);
            },
            fromHTML: function (html) {
                this.fromElement($(html));
            },
            fromElement: function ($element) {
                return new Portlet($element);
            }
        };

        return PortletFactory;
    }
);
