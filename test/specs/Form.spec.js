require(
    [
        'jquery',
        'Portlet/Form'
    ],
    function ($, PortletForm) {
        'use strict';

        describe('Portlet Form', function () {

            var $DefaultForm = null,
                portletForm  = null;

            beforeEach(function (done) {
                reloadFixtures(function () {
                    $DefaultForm = $('#DefaultForm');
                    portletForm          = new PortletForm($DefaultForm);
                    done();
                });
            });

            describe('Buttons', function () {
                it('should get all buttons from a portlet', function () {
                    expect(portletForm.getButtonList()).to.have.length(2);
                });

                it('should disable all buttons from a portlet', function () {
                    portletForm.disableButton();

                    expect(portletForm.getElement().find('[name="email"]').is(':enabled')).to.be.true;
                    expect(portletForm.getElement().find('[name="password"]').is(':enabled')).to.be.true;
                    expect(portletForm.getButtonList().filter(':submit').is(':disabled')).to.be.true;
                    expect(portletForm.getButtonList().filter('button').is(':disabled')).to.be.true;
                });

                it('should enable all buttons from a portlet', function () {
                    portletForm.enableButton();

                    expect(portletForm.getButtonList().filter(':submit').is(':enabled')).to.be.true;
                    expect(portletForm.getButtonList().filter('button').is(':enabled')).to.be.true;
                });
            });

            describe('request handling', function () {
                it('should have form buttons disabled as soon as something is requested', function (done) {
                    portletForm.addEventListener('load.start', function () {
                        expect(this.getElement().find('[name="email"]').is(':enabled')).to.be.true;
                        expect(this.getElement().find('[name="password"]').is(':enabled')).to.be.true;
                        expect(this.getButtonList().filter(':submit').is(':disabled')).to.be.true;
                        expect(this.getButtonList().filter('button').is(':disabled')).to.be.true;

                        done();
                    });

                    portletForm.load();
                });
            });

            describe('Request actions', function () {

                beforeEach(function () {
                    sinon.spy($, 'ajax');
                });

                afterEach(function () {
                    $.ajax.restore();
                });

                it('should update a form with new elements', function (done) {
                    var emailValue    = 'foobar@foobar.com',
                        passwordValue = '123321';

                    portletForm.getElement().find('[name="email"]').val(emailValue);
                    portletForm.getElement().find('[name="password"]').val(passwordValue);

                    portletForm.addEventListener('submit.start', function () {
                        var ajaxConfig = $.ajax.getCall(0).args[0];

                        expect($.ajax.calledOnce).to.be.true;
                        expect(ajaxConfig.dataType).to.eql('html');
                        expect(ajaxConfig.type).to.eql(portletForm.getConfig('method'));
                        expect(ajaxConfig.data.split('&')[0]).to.have.string(encodeURIComponent(emailValue));
                        expect(ajaxConfig.data.split('&')[1]).to.have.string(encodeURIComponent(passwordValue));

                        done();
                    });


                    portletForm.setConfig('method', 'POST');
                    portletForm.submit();
                });

                // it('should submit a form and return a validation message', function (done) {

                // });

                // it('should submit a form and return a success message', function (done) {

                // });
            });

        });
    }
);
