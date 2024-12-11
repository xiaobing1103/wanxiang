// @ts-nocheck
import playIcon from '../../static/play.png'

export default {
	/** 视频地址 */
	src: {
		type: String,
		default: ''
	},
	/** 视频标题 */
	title: {
		type: String,
		default: ''
	},
	/** 视频封面 */
	poster: {
		type: String,
		default: ''
	},
	/** 视频高度 */
	videoHeight: {
		type: [String, Number],
		default: '230px'
	},
	/** 视频宽度 v1.1.3 */
	videoWidth: {
		type: [String, Number],
		default: '750rpx'
	},
	/** v2.0.0 当视频大小与 video 容器大小不一致时，视频的表现形式。contain：包含，fill：填充，cover：覆盖 */
	objectFit:{
		type: String,
		default: 'contain'
	},
	/** 播放图片按钮宽高 */
	playImgHeight: {
		type: [String, Number],
		default: '70rpx'
	},
	/** 暂停按钮 */
	playImg: {
		type: String,
		default: () => playIcon
	},
	/** 是否显示静音按钮 */
	showMuteBtn: {
		type: Boolean,
		default: false
	},
	/** 播放完毕是否退出全屏 */
	isExitFullScreen: {
		type: Boolean,
		default: true
	},
	/** 主题色 */
	primaryColor: {
		type: String,
		default: '#5C91EF'
	},
	/** 试看提示的文字 */
	tipText: {
		type: String,
		default: '试看已结束，本片是会员专享内容'
	},
	/** 试看按钮的文字 */
	btnText: {
		type: String,
		default: '成为会员免费观看'
	},
	/** 视频试看时间（秒） */
	trialTime: {
		type: Number,
		default: 0
	},
	/** 倍速盒子宽度 v1.1.3 */
	speedBoxWidth: {
		type: [String, Number],
		default: '160rpx'
	},
	/**  是否循环播放 v1.1.3 */
	loop: {
		type: Boolean,
		default: false
	},
	/** 是否静音播放 v1.1.3 */
	muted: {
		type: Boolean,
		default: false
	},
	/** 是否自动播放 */
	autoplay: {
		type: Boolean,
		default: false
	},
	/** 历史观看位置 v1.2.0 */
	seekTime: {
		type: Number,
		default: 0
	},
	/** 视频唯一ID v1.2.1 */
	videoId: {
		type: String,
		default: 'sunnyVideo'
	}
}