require(
    [
        'jquery',
        'Portlet/Manager',
        'Portlet/Portlet'
    ],
    function ($, PortletManager, Portlet) {
        'use strict';

        var Portlets  = null;

        describe('Portlet Manager', function () {

            beforeEach(function (done) {
                reloadFixtures(function () {
                    Portlets = new PortletManager($('#fixtures'));
                    Portlets.initialize();
                    done();
                });
            });


            describe('#get', function () {
                it('should throw an error if a portlet does not exist', function () {
                    expect(function () {
                        Portlets.get('foobarfoo');
                    }).to.throw(/Portlet "foobarfoo" not found!/);
                });

                it('should get a Portlet', function () {
                    var name    = 'SignInForm',
                        portlet = Portlets.get(name);

                    expect(portlet.getElement()).to.have.length(1);
                    expect(portlet.getConfig('name')).to.eql(name);
                });
            });

            describe('#add', function () {
                it('should not instance a portlet that already exist', function () {
                    var portlet = new Portlet($('#SuccessNotification'));

                    expect(function () {
                        Portlets.add(portlet);
                    }).to.throw(/already exists/);
                });

                it('should not instance instance a portlet that already exist', function (done) {
                    $('#fixtures').load('/test/fixtures/portlet-error.html', function () {

                        var name         = 'ErrorNotification',
                            $error       = $('#' + name),
                            portlet      = new Portlet($error),
                            errorPortlet = null;

                        Portlets.add(portlet);

                        errorPortlet = Portlets.get(name);

                        expect(errorPortlet).to.have.property('$element');
                        expect($error).to.eql(errorPortlet.getElement());
                        expect(errorPortlet.getElement()).to.have.length(1);
                        expect(errorPortlet.getConfig('name')).to.eql(name);

                        done();
                    });
                });
            });

        });
    }
);
