define(
    'Pages/Index',
    [
        'jquery',
        'Portlet/Manager'
    ],
    function ($, PortletManager) {
        'use strict';

        var PageIndex = function () {

            var Portlets = new PortletManager($('body'));

            Portlets.initialize();

            Portlets.get('SignInForm').on(
                'click',
                'input:submit',
                function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    this.load();
                    // this.replaceWith(Portlets.get('SuccessNotification'));
                }

            );
        };

        return PageIndex;
    }
);