require(
    [
        'jquery',
        'Portlet/Portlet',
        'Bisna/HttpRequest'
    ],
    function ($, Portlet, HttpRequest) {
        'use strict';

        describe('Portlet', function () {

            var $SuccessNotification = null,
                portlet              = null;

            beforeEach(function (done) {
                reloadFixtures(function () {
                    $SuccessNotification = $('#SuccessNotification');
                    portlet              = new Portlet($SuccessNotification);
                    done();
                });
            });

            describe('config', function () {

                it('Should get a config', function () {
                    expect(portlet.getConfig('name')).to.eql('SuccessNotification');
                });

                it('Should get a full config', function () {
                    expect(portlet.getConfig()).to.eql({
                        name: 'SuccessNotification',
                        uri: '/test/fixtures/portlet-error.html',
                        method: 'GET'
                    });
                });

                it('Should change a config', function () {
                    portlet.setConfig('uri', 'foobar');
                    expect(portlet.getConfig('uri')).to.eql('foobar');
                });

                it('Should merge a config', function () {
                    portlet.setConfig({
                        uri: 'foobar',
                        name: 'Foo-Bar',
                    });

                    expect(portlet.getConfig('uri')).to.eql('foobar');
                    expect(portlet.getConfig('name')).to.eql('Foo-Bar');
                    expect(portlet.getConfig('method')).to.eql('GET');
                });

                it('Should replace a config', function () {
                    portlet.setConfig({
                        uri: 'foobar',
                        name: 'Foo-Bar',
                    }, true);

                    expect(portlet.getConfig('uri')).to.eql('foobar');
                    expect(portlet.getConfig('name')).to.eql('Foo-Bar');
                    expect(portlet.getConfig()).to.not.have.property('method');
                });

                it('Should use default value', function () {
                    expect(portlet.getConfig('format')).to.not.be.ok;
                    expect(portlet.getConfig('format', 'json')).to.eql('json');
                });
            });

            describe('async events', function () {

                it('should stop asyncCall if event prefix is not valid', function (done) {

                    // mock an invalid dispatchEvent call
                    portlet.dispatchEvent = function (eventName) {
                        expect(eventName).to.eql('load');
                        done();
                    };

                    portlet.load();
                });

                it('should call a event when a portlet request is done', function (done) {
                    portlet
                        .addEventListener('load.end', function () {
                            done();
                        })
                        .load();
                });

                it('should call a event called "beforeLoad"', function (done) {
                    portlet
                        .addEventListener('load.start', function () {
                            done();
                        })
                        .load();
                });

                it('should call a event called "error" if a portlet uri be wrong', function (done) {
                    portlet
                        .setConfig('uri', 'foobar')
                        .addEventListener('load.error', function () {
                            done();
                        })
                        .load();
                });

                it('should call a event called "replace" when a portlet be replaced', function (done) {
                    var $DefaultForm = $('#DefaultForm'),
                        newPortlet   = new Portlet($DefaultForm);

                    portlet
                        .addEventListener('replace', function () {
                            expect(portlet.getElement().attr('id')).to.eql($DefaultForm.attr('id'));
                            done();
                        })
                        .replaceWith(newPortlet);
                });

                it('should abort delayed portlet requests', function (done) {
                    portlet.httpRequest = new HttpRequest('GET', 'foobar');

                    var spy = Dexter.spy(portlet.httpRequest, 'abort', function () {
                        expect(spy.called).to.eql(1);
                        done();
                    });

                    portlet.load();
                });

            });

        });
    }
);
