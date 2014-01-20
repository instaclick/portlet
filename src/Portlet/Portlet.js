define(
	[
		'jquery',
	],
	function ($) {
		'use strict';

		var ajaxList = {};

		var Portlet = function ($context, selector) {
			var $element = (typeof selector === 'string')
					? this.$context.find(selector)
					: selector;

			this.initialize($context, $element);
		};

		Portlet.fromHtml = function (html, $context) {
			return new Portlet($context || $(document), $(html));
		};

		$.extend(Portlet.prototype, {
			getContext: function () {
				return this.$context;
			},
			getElement: function () {
				return this.$element;
			},
			getConfig: function (item) {
				return this.hasConfig(item)
					? this.config[item]
					: this.config;
			},
			hasConfig: function (item) {
				return (typeof this.config[item] !== 'undefined');
			},
			initialize: function ($context, $element) {
				var name;

				this.$context = $context;
				this.$element = $element;
				this.config = {};

				$.extend(this.config, this.$element.data());

				this.abort();
			},
			abort: function () {
				var name = this.getConfig('name');

				if (ajaxList[name]) {
					ajaxList[name].abort();

					ajaxList[name] = null;

					delete ajaxList[name];
				}
			},
			replaceWith: function (portlet) {
				var $element = this.getElement();

				this.abort();
				portlet.abort();

				this.initialize(portlet.getContext(), portlet.getElement().clone());

				$element.replaceWith(this.getElement());
			},
			load: function (animation) {
				var method = this.hasConfig('method') ? this.getConfig('method') : 'GET',
					cache  = this.hasConfig('cache') ? this.getConfig('cache') : true,
					name   = this.getConfig('name'),
					uri    = this.getConfig('uri');

				this.abort();

				ajaxList[name] = $.ajax({
					url:      uri,
					type:     method,
					dataType: 'html',
					cache:    cache,
					context:  this,
					beforeSend: function (xhr, settings) {
						// Deal with Animation
						animation && animation.start(this);
					},
					success: function (html) {
						var $html = $(html);

						if (this.$element) {
							this.$element.replaceWith($html);
						}

						// We need to assign jqueryfied html, otherwise element points to old DOM
						this.$element = $html;
					},
					error: function (xhr, status) {
						// Do nothing
					},
					complete: function (xhr, status) {
						// Deal with Animation
						animation && animation.end(this);

						ajaxList[name] = null;

						delete ajaxList[name];
					}
				});
			},
			on: function (name, selector, handler) {
				this.$context.on(name, selector, handler);
			},
		});

		return Portlet;
	}
);
