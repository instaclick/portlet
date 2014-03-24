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
                    portletForm  = new PortletForm($DefaultForm);
                    done();
                });
            });

            describe('Buttons', function () {
                it('should get all buttons from a portlet', function () {
                    expect(portletForm.getButtonList()).to.have.length(2);
                });

                it('should disable all buttons from a portlet', function () {
                    portletForm.enableButton();
                    portletForm.disableButton();

                    expect(portletForm.getElement().find('[name="email"]').is(':enabled')).to.be.true;
                    expect(portletForm.getElement().find('[name="password"]').is(':enabled')).to.be.true;
                    expect(portletForm.getButtonList().filter(':submit').is(':disabled')).to.be.true;
                    expect(portletForm.getButtonList().filter('button').is(':disabled')).to.be.true;
                });

                it('should enable all buttons from a portlet', function () {
                    portletForm.disableButton();
                    portletForm.enableButton();

                    expect(portletForm.getButtonList().filter(':submit').is(':enabled')).to.be.true;
                    expect(portletForm.getButtonList().filter('button').is(':enabled')).to.be.true;
                });

                it('should delegate submit event to respective buttons', function () {
                    var spy           = Dexter.spy(portletForm, 'submit'),
                        $submitButton = portletForm.getElement().find('input:submit');

                    $submitButton.trigger('click');
                    expect(spy.called).to.eql(1);
                    spy.restore();
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

                it('should submit a form as portlet tag', function (done) {
                    reloadFixtures(function() {
                        var emailValue    = 'foobar@foobar.com',
                            passwordValue = '123321';

                        $DefaultForm = $('#form');
                        portletForm  = new PortletForm($DefaultForm);

                        portletForm.getElement().find('[name="email"]').val(emailValue);
                        portletForm.getElement().find('[name="password"]').val(passwordValue);

                        portletForm.addEventListener('submit.start', function () {
                            var httpRequest = this.httpRequest;

                            expect(httpRequest.dataType).to.eql('html');
                            expect(httpRequest.method).to.eql('POST');
                            expect(httpRequest.url).to.eql('/foo/bar');
                            expect(httpRequest.contentType).to.eql('application/x-www-form-urlencoded; charset=UTF-8');
                            expect(httpRequest.data.split('&')[0]).to.have.string(encodeURIComponent(emailValue));
                            expect(httpRequest.data.split('&')[1]).to.have.string(encodeURIComponent(passwordValue));

                            done();
                        });

                        portletForm.submit();
                    }, 'fixtures/form.html');
                });

                describe('update a form', function () {
                    var $comboBox = null;

                    beforeEach(function () {
                        $comboBox = $('#comboBox');
                        $comboBox.find('option').eq(1).prop('selected', true);
                    });

                    it('should update with a action without params', function (done) {

                        portletForm.addEventListener('update.start', function () {
                            var httpRequest = this.httpRequest;

                            expect(httpRequest.dataType).to.eql('html');
                            expect(httpRequest.method).to.eql('POST');
                            expect(httpRequest.url).to.eql('/foo/bar?updateField=1');
                            expect(httpRequest.contentType).to.eql('application/x-www-form-urlencoded; charset=UTF-8');
                            expect(httpRequest.dataType).to.eql('html');
                            expect(httpRequest.data.split('&')[2]).to.have.string('value2');

                            done();
                        });

                        portletForm.update();
                    });

                    it('should update a form as portlet tag', function (done) {
                        reloadFixtures(function() {
                            $DefaultForm = $('#form');
                            portletForm  = new PortletForm($DefaultForm);

                            $('#comboBox').find('option').eq(1).prop('selected', true);

                            portletForm.addEventListener('update.start', function () {
                                var httpRequest = this.httpRequest;

                                expect(httpRequest.dataType).to.eql('html');
                                expect(httpRequest.method).to.eql('POST');
                                expect(httpRequest.url).to.eql('/foo/bar?updateField=1');
                                expect(httpRequest.dataType).to.eql('html');
                                expect(httpRequest.data.split('&')[2]).to.have.string('value2');

                                done();
                            });

                            portletForm.update();
                        }, 'fixtures/form.html');
                    });

                    it('should update with a action with params', function (done) {

                        portletForm.getElement().find('form').attr('action', '/foo/bar?foo=1&bar=2');

                        portletForm.addEventListener('update.start', function () {
                            var httpRequest = this.httpRequest;

                            expect(httpRequest.dataType).to.eql('html');
                            expect(httpRequest.method).to.eql('POST');
                            expect(httpRequest.url).to.eql('/foo/bar?foo=1&bar=2&updateField=1');
                            expect(httpRequest.contentType).to.eql('application/x-www-form-urlencoded; charset=UTF-8');
                            expect(httpRequest.dataType).to.eql('html');
                            expect(httpRequest.data.split('&')[2]).to.have.string('value2');

                            done();
                        });

                        portletForm.update();
                    });

                    it('should not run child form default submit', function (done) {
                        var spy = null;

                        $DefaultForm.find('form').attr('action', '/test/fixtures/portlet-form.html');

                        portletForm  = new PortletForm($DefaultForm);

                        spy = Dexter.spy(portletForm, 'submit', function () {
                            expect(spy.called).to.eql(1);

                            // should have submit event attached to portlet element
                            expect($._data(this.getElement()[0], 'events')).to.have.ownProperty('submit');

                            spy.restore();
                            done();
                        });

                        portletForm.getFormElement().trigger('submit');
                    });

                    it('should not run portlet form default submit', function (done) {
                        reloadFixtures(function() {
                            var spy = null;

                            $DefaultForm = $('#form');

                            $DefaultForm.find('form').attr('action', '/test/fixtures/portlet-form.html');

                            portletForm  = new PortletForm($DefaultForm);

                            spy = Dexter.spy(portletForm, 'submit', function () {
                                expect(spy.called).to.eql(1);

                                // should have submit event attached to portlet element
                                expect($._data(this.getElement()[0], 'events')).to.have.ownProperty('submit');

                                spy.restore();
                                done();
                            });

                            portletForm.getFormElement().trigger('submit');
                        }, 'fixtures/form.html');
                    });

                    it('should not send password field values and keep it cached', function (done) {

                        var expected = '&^T^&$%&5879895&$%^$7';

                        portletForm.getElement().find('input:password').val(expected);
                        portletForm.getElement().find('form').attr('action', '/test/fixtures/portlet-form.html');

                        portletForm.addEventListener('update.start', function () {
                            var httpRequest = this.httpRequest;

                            expect(httpRequest.dataType).to.eql('html');
                            expect(httpRequest.method).to.eql('POST');
                            expect(httpRequest.url).to.eql('/test/fixtures/portlet-form.html?updateField=1');
                            expect(httpRequest.contentType).to.eql('application/x-www-form-urlencoded; charset=UTF-8');
                            expect(httpRequest.data).to.not.have.string(encodeURIComponent(expected));
                        });
                        portletForm.addEventListener('update.end', function () {
                            expect(portletForm.getElement().find('input:password').val()).to.eql(expected);
                            done();
                        });

                        portletForm.update();
                    });
                });

            });

        });
    }
);
