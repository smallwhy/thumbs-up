
// 送心特效算法
!function (t, e) {
	"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.BubbleHearts = e()
}(this, function () {
	"use strict";

	function t(t, n, r) {
		var i = e.uniformDiscrete(89, 91) / 100,
			o = 1 - i,
			u = (e.uniformDiscrete(45, 60) + e.uniformDiscrete(45, 60)) / 100,
			a = function (t) {
				return t > i ? Math.max(((1 - t) / o).toFixed(2), .1) * u : u
			},
			c = e.uniformDiscrete(-30, 30),
			f = function (t) {
				return c
			},
			h = 10,
			s = n.width / 2 + e.uniformDiscrete(-h, h),
			d = (n.width - Math.sqrt(Math.pow(t.width, 2) + Math.pow(t.height, 2))) / 2 - h,
			l = e.uniformDiscrete(.8 * d, d) * (e.uniformDiscrete(0, 1) ? 1 : -1),
			m = e.uniformDiscrete(250, 400),
			w = function (t) {
				return t > i ? s : s + l * Math.sin(m * (i - t) * Math.PI / 180)
			},
			v = function (e) {
				return t.height / 2 + (n.height - t.height / 2) * e
			},
			p = e.uniformDiscrete(14, 18) / 100,
			g = function (t) {
				return t > p ? 1 : 1 - ((p - t) / p).toFixed(2)
			};
		return function (e) {
			if (!(e >= 0)) return !0;
			r.save();
			var n = a(e),
				i = f(e),
				o = w(e),
				u = v(e);
			r.translate(o, u), r.scale(n, n), r.rotate(i * Math.PI / 180), r.globalAlpha = g(e), r.drawImage(t, -t.width / 2, -t.height / 2, t.width, t.height), r.restore()
		}
	}
	var e = function (t) {
		var e = t,
			n = Math.floor,
			r = Math.random;
		return t.uniform = function (t, e) {
			return t + (e - t) * r()
		}, t.uniformDiscrete = function (t, r) {
			return t + n((r - t + 1) * e.uniform(0, 1))
		}, t
	}({}),
		n = function (t, e) {
			if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
		},
		r = function () {
			function t(t, e) {
				for (var n = 0; n < e.length; n++) {
					var r = e[n];
					r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
				}
			}
			return function (e, n, r) {
				return n && t(e.prototype, n), r && t(e, r), e
			}
		}(),
		i = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (t) {
			return setTimeout(t, 16)
		},
		o = function () {
			function o() {
				n(this, o);
				var t = this.canvas = document.createElement("canvas"),
					e = this.context = t.getContext("2d"),
					r = this._children = [];
				this.context.scale(2, 2);
				var u = function n() {
					i(n), e.clearRect(0, 0, t.width, t.height);
					for (var o = 0, u = r.length; o < u;) {
						var a = r[o];
						a.render.call(null, (a.timestamp + a.duration - new Date) / a.duration) ? (r.splice(o, 1), u--) : o++
					}
				};
				i(u)
			}
			return r(o, [{
				key: "bubble",
				value: function (n) {
					var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e.uniformDiscrete(2400, 3600),
						i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : t(n, this.canvas, this.context);
					return this._children.push({
						render: i,
						duration: r,
						timestamp: +new Date
					}), this
				}
			}]), o
		}();
	return o
});

// 自定义送心效果对象
function SendFlow(params) {
	// 对象所需参数
	this.options = {
		iconArray: [],
		jqDomID: '',
		canvasWidth: 170,
		canvasHeight: 300,
		bubbleHearts: null,
		initDomFinish: function () { },
		click: function () { }
	};
	$.extend(this.options, params);
	// 初始化送花
	this.initImg();
	// 初始化画布
	this.initCanvas();
	// 添加点击事件
	this.addEvent();
}
SendFlow.prototype.initImg = function () {
	var _this = this;
	this.options.iconArray.forEach(function (iconUrl, index) {
		_this.options.iconArray[index] = new Promise(function (resolve) {
			var img = new Image;
			img.onload = resolve.bind(null, img);
			img.src = iconUrl;
		});
	});
}
SendFlow.prototype.initRandomRule = function (min, max) {
	return min + (max - min) * Math.random();
}
SendFlow.prototype.initRule = function (i, j) {
	// return i + Math.floor((j - i + 1) * this.initRandomRule(0, 1));
	return Math.floor((Math.random() * this.options.iconArray.length))
}
SendFlow.prototype.initCanvas = function () {
	var _this = this;
	Promise.all(this.options.iconArray).then(function (icon) {
		_this.options.bubbleHearts = new BubbleHearts();
		var canvas = _this.options.bubbleHearts.canvas;
		canvas.width = _this.options.canvasWidth * 2;
		canvas.height = _this.options.canvasHeight * 2;
		canvas.style['width'] = _this.options.canvasWidth + 'px';
		canvas.style['height'] = _this.options.canvasHeight + 'px';
		document.body.appendChild(canvas);
		// DOM元素初始化完成
		_this.options.initDomFinish.call(_this, _this.options.bubbleHearts, icon);
	});
}
SendFlow.prototype.addEvent = function () {
	var _this = this;
	Promise.all(this.options.iconArray).then(function (icon) {
		document.getElementById(_this.options.jqDomID).onclick = function () {
			_this.options.click.call(_this, _this.options.bubbleHearts, icon);
		}
	});
}