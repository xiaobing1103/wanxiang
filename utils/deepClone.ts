/* 深拷贝实现函数 */
export let deepClone = (val, wm = new WeakMap) => {
	if (val == null) return val;
	if (typeof val !== "object") return val;
	if (val instanceof Date) return new Date(val);
	if (val instanceof RegExp) return new RegExp(val);
	if (wm.has(val)) return wm.get(val);
	let _instance = new val.constructor;
	wm.set(val, _instance);

	for (let key in val) {
		if (val.hasOwnProperty(key)) _instance[key] = deepClone(val[key], wm);
	}
	return _instance;
}