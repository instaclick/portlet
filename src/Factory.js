define(
    [
        'jquery',
        'Portlet/Portlet'
    ],
    function ($, Portlet) {
        'use strict';

        var PortletFactory = {
            fromURI: function (uri) {
                var portlet = new Portlet(uri),
                    self    = this;

                portlet.addEventListener('load.complete', function (e) {
                    e.type = 'factory.complete';

                    self.fromElement(this.getElement());
                    this.dispatchEvent(e);
                });

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
