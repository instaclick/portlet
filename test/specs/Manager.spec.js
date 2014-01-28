require(
    [
        'jquery',
        'Portlet/Manager'
    ],
    function ($, PortletManager) {
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

            it('should get a Portlet', function () {
                var name    = 'SignInForm',
                    portlet = Portlets.get(name);

                expect(portlet).to.have.property('$element');
                expect(portlet.$element).to.have.length(1);
                expect(portlet.getConfig('name')).to.eql(name);
            });

        });
    }
);
