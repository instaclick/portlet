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

                it('should submit a form', function (done) {
                    var emailValue    = 'foobar@foobar.com',
                        passwordValue = '123321';

                    portletForm.getElement().find('[name="email"]').val(emailValue);
                    portletForm.getElement().find('[name="password"]').val(passwordValue);

                    portletForm.addEventListener('submit.start', function () {
                        var httpRequest = this.httpRequest;

                        expect(httpRequest.dataType).to.eql('html');
                        expect(httpRequest.method).to.eql('POST');
                        expect(httpRequest.url).to.eql('/foo/bar');
                        expect(httpRequest.data.split('&')[0]).to.have.string(encodeURIComponent(emailValue));
                        expect(httpRequest.data.split('&')[1]).to.have.string(encodeURIComponent(passwordValue));

                        done();
                    });

                    portletForm.submit();
                });

                describe('update a form', function () {
                    var $comboBox = null;

                    beforeEach(function () {
                        $comboBox = $('#comboBox');
                        $comboBox.find('option')[1].setAttribute('selected', true);
                    });

                    it('should with a action without params', function (done) {

                        portletForm.addEventListener('update.start', function () {
                            var httpRequest = this.httpRequest;

                            expect(httpRequest.dataType).to.eql('html');
                            expect(httpRequest.method).to.eql('POST');
                            expect(httpRequest.url).to.eql('/foo/bar?updateField=1');
                            expect(httpRequest.dataType).to.eql('html');
                            expect(httpRequest.data.split('&')[3]).to.have.string('value2');

                            done();
                        });

                        portletForm.update();
                    });

                    it('should with a action with params', function (done) {

                        portletForm.getElement().find('form').attr('action', '/foo/bar?foo=1&bar=2')

                        portletForm.addEventListener('update.start', function () {
                            var httpRequest = this.httpRequest;

                            expect(httpRequest.dataType).to.eql('html');
                            expect(httpRequest.method).to.eql('POST');
                            expect(httpRequest.url).to.eql('/foo/bar?foo=1&bar=2&updateField=1');
                            expect(httpRequest.dataType).to.eql('html');
                            expect(httpRequest.data.split('&')[3]).to.have.string('value2');

                            done();
                        });

                        portletForm.update();
                    });
                });

            });

        });
    }
);
