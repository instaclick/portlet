define(
	[
		'jquery',
		'jquery.eventCloner'
	],
	function ($) {
		'use strict';

		var ajaxList = {};

		var Portlet = function (selector) {
			var $element = (typeof selector === 'string')
					? $(selector)
					: selector;

			this.initialize($element);
		};

		Portlet.fromHtml = function (html) {
			return new Portlet($(html));
		};

		$.extend(Portlet.prototype, {
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
			initialize: function ($element) {
				this.$element = $element;
				this.config = $.extend({}, this.$element.data());

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
				var $target  = this.getElement(),
					$element = (portlet.config) 
								? portlet.getElement()
								: portlet;

				this.abort();

				if (portlet.abort) {
					portlet.abort();
				}

				this.initialize($element.clone());

				$element = this.getElement();

				$element.eventCloner({
					source: $target
				});
				$target.replaceWith($element);
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
							this.replaceWith($html);

							return;
						}

						this.initialize($html);
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
				var self = this;

				this.$element.on(name, selector, function (e) {
					handler(e, self);
				});
			},
		});

		return Portlet;
	}
);
