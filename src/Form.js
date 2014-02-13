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
            update: function (animation) {
                var $form          = this.getElement().find('form'),
                    $passwordField = $form.find('input:password'),
                    passwordLen    = $passwordField.length,
                    fieldValueList = $form.serializeArray(),
                    uri            = $form.attr('action') || '',
                    config         = {
                        uri:       uri + (/\?+/i.test(uri) ? '&' : '?') + 'updateField=1',
                        animation: animation,
                        prefix:    'update'
                    };

                if (passwordLen) {
                    fieldValueList = fieldValueList.filter(function (index) {
                        for (var i = 0; i < passwordLen; i++) {
                            return ($passwordField[i].getAttribute('name') !== index.name);
                        }
                    });

                    config.data = $.param(fieldValueList);
                }

                this.asyncCall(config);
            },
            submit: function (animation) {
                var config = {
                    animation: animation,
                    prefix:    'submit'
                };

                this.asyncCall(config);
            },
            asyncCall: function (config) {
                var $form = this.getElement().find('form');

                config = $.extend({
                    requestType: $form.attr('enctype') || false,
                    method:      $form.attr('method') || 'POST',
                    uri:         $form.attr('action') || '#', // TODO: # will not work, fix me!
                    data:        $form.serialize()
                }, config);

                Portlet.prototype.asyncCall.call(this, config);
            }
        });

        return PortletForm;
    }
);
