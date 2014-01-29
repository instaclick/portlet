require(
    [
        'jquery',
        'Portlet/Factory',
        'test/fixtures/MyPortlet'
    ],
    function ($, PortletFactory) {
        'use strict';

        describe('Portlet Factory', function () {

            beforeEach(function (done) {
                reloadFixtures(function () {
                    done();
                });
            });

            describe('#fromElement' , function () {

                it('should factory a portlet from a element with default portlet Class', function () {
                    var portlet = PortletFactory.fromElement($('#SuccessNotification'));

                    expect(portlet).to.have.property('$element');
                    expect(portlet.$element).to.have.length(1);
                    expect(portlet.getConfig('name')).to.eql('SuccessNotification');
                });

                it('should factory a portlet from a element with a specific portlet Class', function () {

                    var portlet              = null,
                        $SuccessNotification = $('#SuccessNotification');

                    $SuccessNotification.data('portlet', 'test/fixtures/MyPortlet');

                    portlet = PortletFactory.fromElement($SuccessNotification);

                    expect(portlet).to.have.property('$element');
                    expect(portlet.$element).to.have.length(1);
                    expect(portlet.getConfig('name')).to.eql('SuccessNotification');
                });

            });

        });
    }
);
