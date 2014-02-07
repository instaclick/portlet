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

                    expect(portletForm.getElement().find('[name="email"]').is(':enabled')).to.be.ok;
                    expect(portletForm.getElement().find('[name="password"]').is(':enabled')).to.be.ok;
                    expect(portletForm.getButtonList().filter(':submit').is(':disabled')).to.be.ok;
                    expect(portletForm.getButtonList().filter('button').is(':disabled')).to.be.ok;
                });

                it('should enable all buttons from a portlet', function () {
                    portletForm.enableButton();

                    expect(portletForm.getButtonList().filter(':submit').is(':enabled')).to.be.ok;
                    expect(portletForm.getButtonList().filter('button').is(':enabled')).to.be.ok;
                });
            });

            describe('request handling', function () {
                it('should have form buttons disabled as soon as something is requested', function (done) {
                    portletForm.addEventListener('load.start', function () {
                        expect(this.getElement().find('[name="email"]').is(':enabled')).to.be.ok;
                        expect(this.getElement().find('[name="password"]').is(':enabled')).to.be.ok;
                        expect(this.getButtonList().filter(':submit').is(':disabled')).to.be.ok;
                        expect(this.getButtonList().filter('button').is(':disabled')).to.be.ok;

                        done();
                    });

                    portletForm.load();
                });
            });

        });
    }
);
