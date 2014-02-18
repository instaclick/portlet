define(
    [
        'jquery',
        'Portlet/Portlet'
    ],
    function ($, Portlet) {
        'use strict';

        var MyPortletClass = function ($element) {
            this.initialize.call(this, $element);
        };

        $.extend(MyPortletClass.prototype, Portlet.prototype, {
            myMethod: function () {
                return this;
            }
        });

        return MyPortletClass;
    }
);
