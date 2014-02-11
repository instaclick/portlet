define(
    [
        'jquery',
        'Portlet/Portlet'
    ],
    function ($, Portlet) {
        'use strict';

        var PortletForm = function ($element) {
            Portlet.call(this, $element);

            this.addEventListener('load.start', this.disableButton);
        };

        $.extend(PortletForm.prototype, Portlet.prototype, {
            getButtonList: function () {
                var fieldSelector = [
                    ':submit',
                    ':reset',
                    'button'
                ].join(',');

                return this.getElement().find(fieldSelector);
            },
            disableButton: function () {
                this.getButtonList().attr('disabled', 'disabled');
            },
            enableButton: function () {
                var $this = null;

                this.getButtonList().each(function () {
                    $this = $(this);

                    if ($this.attr('disabled')) {
                        $this.attr('disabled', null).removeAttr('disabled');
                    }
                });
            },
            submit: function () {
                var $form  = this.getElement().find('form'),
                    method = $form.attr('method') || 'POST';

                this.setConfig('data', $form.serialize())
                    .setConfig('method', method);

                this.addEventListener('load.start', function (event) {
                    this.dispatchEvent('submit.start', event);
                });

                this.load();
            },
            update: function ($targetElement) {
                var requestData = {
                    action: 'updateField'
                };

                requestData[$targetElement.attr('name')] = $targetElement.val();

                this.setConfig('data', $.param(requestData));

                this.addEventListener('load.start', function (event) {
                    this.dispatchEvent('update.start', event);
                });

                this.load();

            }
        });

        return PortletForm;
    }
);
