define(
    [
        'jquery',
        'Portlet/Factory'
    ],
    function ($, PortletFactory) {
        'use strict';

        var PortletManager = function () {
            this.portletList = {};
        };

        $.extend(PortletManager.prototype, {
            get: function (name) {
                if (!name) {
                    return this.portletList;
                }

                if (!this.portletList[name]) {
                    throw new Error('Portlet "' + name + '" not found!');
                }

                return this.portletList[name];
            },
            add: function (portlet) {
                var name = portlet.getConfig('name');

                if (this.portletList[name]) {
                    throw new Error('A Portlet called "' + name + '" already exists!');
                }

                this.portletList[name] = portlet;
            },
            initialize: function () {
                var $portletList = $('.portlet'),
                    self         = this;

                if ($portletList.length) {
                    $portletList.map(function (index) {
                        var $element = $portletList.eq(index);

                        self.add(PortletFactory.fromElement($element));
                    });
                }
            }
        });

        return PortletManager;
    }
);
