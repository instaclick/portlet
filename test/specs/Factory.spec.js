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

            describe('#fromURI', function (done) {
                it('should factory a portlet from a element with default portlet Class', function (done) {
                    var portlet = PortletFactory.fromURI('/test/fixtures/portlet-error.html');

                    portlet.addEventListener('load.complete', function () {
                        expect(portlet.getElement()).to.have.length(1);
                        expect(portlet.getConfig('name')).to.eql('ErrorNotification');

                        done();
                    });
                });
            });

            describe('#fromHTML', function () {
                it('should factory a portlet from a element with default portlet Class', function () {
                    var html    = $('#SuccessNotification')[0].outerHTML,
                        portlet = PortletFactory.fromHTML(html);

                    expect(portlet.getElement()).to.have.length(1);
                    expect(portlet.getConfig('name')).to.eql('SuccessNotification');
                    expect(portlet.getElement()[0].outerHTML).to.eql(html);
                });

                it('should factory a portlet from a element with a specific portlet Class', function () {
                    var portlet              = null,
                        html                 = null,
                        $SuccessNotification = $('#SuccessNotification');

                    $SuccessNotification.data('portlet', 'test/fixtures/MyPortlet');

                    html    = $SuccessNotification[0].outerHTML;
                    portlet = PortletFactory.fromHTML(html);

                    expect(portlet.getElement()).to.have.length(1);
                    expect(portlet.getConfig('name')).to.eql('SuccessNotification');
                    expect(portlet.getElement()[0].outerHTML).to.eql(html);
                });
            });

            describe('#fromElement' , function () {
                it('should factory a portlet from a element with default portlet Class', function () {
                    var portlet = PortletFactory.fromElement($('#SuccessNotification'));

                    expect(portlet.getElement()).to.have.length(1);
                    expect(portlet.getConfig('name')).to.eql('SuccessNotification');
                });

                it('should factory a portlet from a element with a specific portlet Class', function () {

                    var portlet              = null,
                        $SuccessNotification = $('#SuccessNotification');

                    $SuccessNotification.data('portlet', 'test/fixtures/MyPortlet');

                    portlet = PortletFactory.fromElement($SuccessNotification);

                    expect(portlet.getElement()).to.have.length(1);
                    expect(portlet.getConfig('name')).to.eql('SuccessNotification');
                });
            });

        });
    }
);
