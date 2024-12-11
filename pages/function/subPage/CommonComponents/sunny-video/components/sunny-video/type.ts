// @ts-nocheck
export interface Props {
	
}

export type rateListData = {
	/** 名称 */
	name: string
	/** 是否选中 */
	isSelect: boolean
}

export interface StateData {
	/** 视频是否播放过 */
	isPlay: boolean
	/** 是否显示原生控件 */
	controls: boolean
	/** 是否开启播放手势，即双击切换播放/暂停 */
	enablePlayGesture: boolean
	/** 视频播放次数 */
	countPlay: number | string
	/** 全屏状态 */
	isFullScreen: boolean
	/** 当前倍速 */
	rateText: string
	/** 是否显示倍速盒子 */
	isShowRateBox: boolean
	/** 控制试看结束内容显示隐藏 */
	visibleTrialEndBox: boolean
	/** 控制H5历史播放位置的显示隐藏 */
	showMplayerToast: boolean
}