define(
	'Pages/Index',
	[
		'jquery',
		'Portlet/Manager'
	],
	function ($, PortletManager) {
		'use strict';

		var PageIndex = function () {

			var Portlets = new PortletManager($('body'));

			Portlets.initialize();

			Portlets.get('SignInForm').on(
				'submit', 
				'form', 
				function (e) {
					e.preventDefault();
					e.stopPropagation();

					Portlets.get('SignInForm').replaceWith(Portlets.get('SuccessNotification'));
				}
			);
		};

		return PageIndex;
	}
);
