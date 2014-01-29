require(
    [
        'jquery',
        'Portlet/Portlet'
    ],
    function ($, Portlet) {
        'use strict';

        describe('Portlet', function () {

            beforeEach(function (done) {
                reloadFixtures(function () {
                    done();
                });
            });

            describe('events', function () {

                 var $SuccessNotification = null,
                    portlet               = null;

                beforeEach(function () {
                    $SuccessNotification = $('#SuccessNotification');
                    portlet              = new Portlet($SuccessNotification);
                });

                it('should call a event called "create" as soon as portlet be created', function (done) {
                    portlet.on('create', function () {
                        expect(portlet.getElement()).to.eql($SuccessNotification);
                        done();
                    });
                });

                it('should call a event "complete" when a portlet get a request done', function (done) {
                    portlet.on('complete', function () {
                        done();
                    });
                    portlet.load();
                });

                it('should call a event called "beforeLoad"', function (done) {
                    portlet.on('beforeLoad', function () {
                        done();
                    });
                    portlet.load();
                });

                it('should call a event called "error" if a portlet uri be wrong', function (done) {
                    $SuccessNotification.data('uri', 'foobar');
                    portlet.on('error', function () {
                        done();
                    });
                    portlet.load();
                });

                it('should call a event called "replace" when a portlet be replaced', function (done) {
                    var $DefaultForm = $('#DefaultForm'),
                        newPortlet   = new Portlet($DefaultForm);

                    portlet.on('replace', function () {
                        expect(portlet.getElement().attr('id')).to.eql($DefaultForm.attr('id'));
                        done();
                    });
                    portlet.replaceWith(newPortlet);
                });

            });

        });
    }
);
