define(
	[
		'jquery',
		'Portlet/Portlet'
	],
	function ($, Portlet) {
		'use strict';

		var PortletManager = function ($context) {
			this.$context    = $context;
			this.portletList = {};
		},
		load = function ($list, index) {
			var $context = $list.eq(index);

			this.add(new Portlet(this.$context, $context));
		};

		$.extend(PortletManager.prototype, {
			create: function ($element, config, animation) {
				var portlet = new Portlet(this.$context, $element);

				portlet.setConfig(config);

				portlet.load(animation);
			},
			get: function (name) {
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
				var $portletList = this.$context.find('.portlet');

				if ($portletList.length) {
					$portletList.map($.proxy(load, this, $portletList));
				}
			}
		});

		return PortletManager;
	}
);
