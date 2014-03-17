define(
    [
        'jquery',
        'Portlet/Portlet'
    ],
    function ($, Portlet) {
        'use strict';

        var PortletForm = function ($element) {
                var passwordList = {};

                Portlet.call(this, $element);

                this.addEventListener('load.start', this.disableButton);
                this.addEventListener('update.start', function () {
                    passwordList = {};

                    this.getElement().find('input:password').each(function () {
                        passwordList[this.getAttribute('name')] = this.value;
                    });
                }, this);
                this.addEventListener('update.success', function () {
                    var $element = this.getElement(),
                        $current = null;

                    for (var password in passwordList) {
                        if (passwordList.hasOwnProperty(password)) {
                            $current = $element.find('[name="' + password + '"]');

                            if ($current.length) {
                                $current.val(passwordList[password]);
                            }

                            passwordList[password] = null;
                            delete passwordList[password];
                        }
                    }
                }, this);
                this.delegateSubmitEvent();
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
            getFormElement: function () {
                var $element = this.getElement();

                return ($element.prop('tagName').toLowerCase() !== 'form') ? $element.find('form') : $element;
            },
            update: function (animation) {
                var $form          = this.getFormElement(),
                    $passwordField = $form.find('input:password'),
                    passwordLength = $passwordField.length,
                    fieldValueList = $form.serializeArray(),
                    uri            = $form.attr('action') || '',
                    config         = {
                        uri:       uri + (/\?+/i.test(uri) ? '&' : '?') + 'updateField=1',
                        animation: animation,
                        prefix:    'update'
                    };

                if (passwordLength) {
                    fieldValueList = fieldValueList.filter(function (index) {
                        for (var i = 0; i < passwordLength; i++) {
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
                var $form = this.getFormElement();

                config = $.extend({
                    requestType: 'form',
                    method:      $form.attr('method') || 'POST',
                    uri:         $form.attr('action') || '#', // TODO: # will not work, fix me!
                    data:        $form.serialize()
                }, config);

                Portlet.prototype.asyncCall.call(this, config);
            },
            delegateSubmitEvent: function () {
                this.getElement().on('click', ':submit', $.proxy(function (e) {
                    e.preventDefault();

                    this.submit();
                }, this));
            }
        });

        return PortletForm;
    }
);
