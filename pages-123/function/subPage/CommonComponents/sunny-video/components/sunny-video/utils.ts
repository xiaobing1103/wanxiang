// @ts-nocheck

/**
 * @description 用于获取用户传递值的px值  如果用户传递了"xxpx"或者"xxrpx"，取出其数值部分，如果是"xxxrpx"还需要用过uni.upx2px进行转换
 * @param {number|string} value 用户传递值的px值
 * @param {boolean} unit 
 * @returns {number|string}
 */
export const getPx = (value, unit = false)=> {
	if (testNumber(value)) {
		return unit ? `${value}px` : Number(value)
	}
	// 如果带有rpx，先取出其数值部分，再转为px值
	if (/(rpx|upx)$/.test(value)) {
		return unit ? `${uni.upx2px(parseInt(value))}px` : Number(uni.upx2px(parseInt(value)))
	}
	return unit ? `${parseInt(value)}px` : parseInt(value)
}
/**
 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
 * @param {string|number} value 需要添加单位的值
 * @param {string} unit 添加的单位名 比如px
 */
export const addUnit =(value = 'auto', unit = 'px')=> {
	value = String(value)
	// number判断是否为数值
	return testNumber(value) ? `${value}${unit}` : value
}
/**
 * 验证十进制数字
 */
function testNumber(value) {
    return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
}
/**
 * @description 获取系统信息同步接口
 * @link 获取系统信息同步接口 https://uniapp.dcloud.io/api/system/info?id=getsysteminfosync 
 */
export const sys=()=> {
	return uni.getSystemInfoSync()
}
/**
 * 将秒转时分秒
 * @param {number} 数字
 */
export const convertSecondsToHMS =(seconds)=> {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // 在数字小于10时，在前面补零
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const secondsStr = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    if (hours === 0) {
        return minutesStr + ":" + secondsStr;
    } else {
        const hoursStr = hours < 10 ? "0" + hours : hours;
        return hoursStr + ":" + minutesStr + ":" + secondsStr;
    }
}