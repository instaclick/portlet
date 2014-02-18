require(
    [
        'jquery',
        'Portlet/Portlet'
    ],
    function ($, Portlet) {
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

            it('should load an external portlet', function (done) {
                var portlet = new Portlet('/test/fixtures/portlet-error.html');

                portlet.addEventListener('load.complete', function () {
                    expect(portlet.getElement()).to.have.length(1);
                    expect(portlet.getConfig('name')).to.eql('ErrorNotification');

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

            });

            describe('events', function () {

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

            });

        });
    }
);
