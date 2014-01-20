define(
	[
		'jquery',
		'Portlet/Portlet'
	],
	function ($, Portlet) {
		'use strict';

		var PortletManager = function () {
			this.portletList = {};
		},
		load = function ($list, index) {
			var $element = $list.eq(index);

			this.add(new Portlet($element));
		};

		$.extend(PortletManager.prototype, {
			create: function ($element, animation) {
				var portlet = new Portlet($element);

				portlet.load(animation);
			},
			get: function (name) {
				if (!name) {
					return this.portletList;
				}

				if (!this.portletList[name]) {
					throw new Error('Portlet "' + name + '" not found!');
				}

				return this.portletList[name];
			},
			add: function (portlet) {
				var name = portlet.getConfig('name');

				if (this.portletList[name]) {
					throw new Error('A Portlet called "' + name + '" already exists!');
				}

				this.portletList[name] = portlet;
			},
			initialize: function () {
				var $portletList = $('.portlet');

				if ($portletList.length) {
					$portletList.map($.proxy(load, this, $portletList));
				}
			}
		});

		return PortletManager;
	}
);
