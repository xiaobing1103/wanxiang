"use strict";
let TextDecoderPolyfill;
if (Object.defineProperty(exports, "__esModule", {
		value: !0
	}), "undefined" == typeof TextDecoder) {
	const e = String.fromCharCode,
		t = Object.prototype.toString,
		r = t.call(ArrayBuffer.prototype),
		o = "undefined" != typeof SharedArrayBuffer ? t.call(SharedArrayBuffer) : "",
		d = function(t) {
			const r = t.charCodeAt(0),
				o = 0 | t.length;
			let d = 1114112,
				c = 0,
				a = "";
			switch (r >>> 4) {
				case 12:
				case 13:
					d = (31 & r) << 6 | 63 & t.charCodeAt(1), c = d < 128 ? 0 : 2;
					break;
				case 14:
					d = (15 & r) << 12 | (63 & t.charCodeAt(1)) << 6 | 63 & t.charCodeAt(2), c = d < 2048 ? 0 : 3;
					break;
				case 15:
					r >>> 3 == 30 && (d = (7 & r) << 18 | (63 & t.charCodeAt(1)) << 12 | (63 & t.charCodeAt(2)) << 6 | t
						.charCodeAt(3), c = d < 65536 ? 0 : 4)
			}
			for (c && (o < c ? c = 0 : d < 65536 ? a = e(d) : d < 1114112 ? (d = d - 65664 | 0, a = e(55296 + (d >>>
					10) | 0, 56320 + (1023 & d) | 0)) : c = 0); c < o; c = c + 1 | 0) a += " ";
			return a
		},
		c = ["utf-8", "utf8", "unicode-1-1-utf-8"];
	class a {
		constructor(e, t) {
			if (this.encoding = "utf-8", this.fatal = !1, this.ignoreBOM = !1, e && -1 === c.indexOf(e
					.toLowerCase())) throw new RangeError(
				`Failed to construct 'TextDecoder': The encoding label provided ('${e}') is invalid.`);
			if (t) {
				if (t.fatal) throw new Error(
					"Failed to construct 'TextDecoder': the 'fatal' option is unsupported.");
				if (t.ignoreBOM) throw new Error(
					"Failed to construct 'TextDecoder': the 'ignoreBOM' option is unsupported.")
			}
		}
		decode(c, a) {
			if (a && a.stream) throw new Error("Failed to decode: the 'stream' option is unsupported.");
			const i = c && c.buffer || c,
				n = t.call(i);
			if (n !== r && n !== o && void 0 !== c) throw TypeError(
				"Failed to execute 'decode' on 'TextDecoder': The provided value is not of type '(ArrayBuffer or ArrayBufferView)'"
			);
			const f = new Uint8Array(i);
			let l = "";
			for (let t = 0, r = 0 | f.length; t < r; t = t + 32768 | 0) l += e.apply(0, f.subarray(t, t + 32768 |
				0));
			return l.replace(/[\xc0-\xff][\x80-\xbf]+|[\x80-\xff]/g, d)
		}
		toString() {
			return "[object TextDecoder]"
		}
	}
	"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(a.prototype, Symbol.toStringTag, {
		value: "TextDecoder"
	}), TextDecoderPolyfill = a
} else TextDecoderPolyfill = TextDecoder;
exports.default = TextDecoderPolyfill, module.exports = exports.default;