<template>
	<video class="sunny-video" :id="videoId" :title="title" :src="src" :show-center-play-btn="false"
		:controls="state.controls" :enable-play-gesture="state.enablePlayGesture" :muted="muted"
		:show-mute-btn="showMuteBtn" :autoplay="autoplay" :object-fit="objectFit"
		:style="{ width: addUnit(videoWidth), height: addUnit(videoHeight) }" @play="play" @pause="emit('pause')"
		@ended="ended" @error="handleVideoError" @loadedmetadata="handleVideoLoaded"
		@timeupdate="timeupdate"
		@fullscreenchange="fullscreenchange">
		<cover-view v-if="!state.isPlay" class="banner-view">
			<cover-image class="banner" :style="{ width: addUnit(videoWidth), height: addUnit(videoHeight) }"
				:src="poster" @click="changePlay" />
			<cover-image class="imgPal" :style="[playImgStyle]" :src="playImg" @click="changePlay" />
		</cover-view>
		<!-- 当前倍速标记 -->
		<cover-view v-if="state.isPlay && !state.isShowRateBox" class="speedText" :style="[speedStyle]"
			@click="state.isShowRateBox = true">
			<!-- #ifdef APP-NVUE -->
			<text class="text">{{ state.rateText }}X</text>
			<!-- #endif -->
			<!-- #ifndef APP-NVUE -->
			<cover-view class="text">{{ state.rateText }}X</cover-view>
			<!-- #endif -->
		</cover-view>
		<!-- 倍速选择 -->
		<cover-view v-if="state.isShowRateBox" class="vertical" :class="{ 'vertical-full': state.isFullScreen }"
			:style="[speedBoxMaskStyle]">
			<cover-view class="vertical_left" :style="[speedBoxLeftStyel]" @click="state.isShowRateBox = false" />
			<!-- #ifdef APP-NVUE -->
			<view class="speed-box" :style="[speedBoxStyle]">
				<text class="speed-text" :class="{ act: item.isSelect }" v-for="(item, index) in rateList"
					:key="item.name" @click="changeRate(item, index)">{{ item.name }}X</text>
			</view>
			<!-- #endif -->
			<!-- #ifndef APP-NVUE -->
			<cover-view class="speed-box" :style="[speedBoxStyle]">
				<cover-view class="speed-text" :class="{ act: item.isSelect }" v-for="(item, index) in rateList"
					:key="item.name" @click="changeRate(item, index)">{{ item.name }}X</cover-view>
			</cover-view>
			<!-- #endif -->
		</cover-view>
		<!-- 试看盒子 -->
		<cover-view v-if="state.visibleTrialEndBox" class="trialEndBox" :style="[trialEndBoxStyle]">
			<!-- #ifdef APP-NVUE -->
			<text class="tipText">{{ tipText }}</text>
			<text class="closeBtn" @click.stop="handleClickTrialEnd">{{ btnText }}</text>
			<!-- #endif -->
			<!-- #ifndef APP-NVUE -->
			<cover-view class="tipText">{{ tipText }}</cover-view>
			<cover-view class="closeBtn" @click.stop="handleClickTrialEnd">{{ btnText }}</cover-view>
			<!-- #endif -->
		</cover-view>
		<!-- 进度记录跳转提示 -->
		<cover-view class="mplayer-toast" :class="{ 'mplayer-show': state.showMplayerToast }">
			<!-- #ifdef H5 -->
			<text class="text">
				记忆你上次看到{{ convertSecondsToHMS(seekTime) }}<text class="btn_text" @click="handelSeek">跳转</text>
			</text>
			<!-- #endif -->
			<!-- #ifndef H5 | APP-NVUE -->
			<cover-view v-if="state.showMplayerToast" class="text">
				{{ '已为您定位至' + convertSecondsToHMS(seekTime) }}
				<!-- #ifdef MP-WEIXIN -->
				<cover-view class="kong" />
				<!-- #endif -->
			</cover-view>
			<!-- #endif -->
			<!-- #ifdef APP-NVUE -->
			<text class="text">已为您定位至{{ convertSecondsToHMS(seekTime) }}</text>
			<!-- #endif -->
		</cover-view>
	</video>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, ref, toRefs, reactive, computed, onMounted, getCurrentInstance, nextTick, watch, defineExpose } from './vue-composition-api'
import VideoProps from './props'
import { getPx, addUnit, convertSecondsToHMS } from './utils'
import type { StateData, rateListData } from './type'

const name = 'sunny-video'
export default defineComponent({
	name,
	props: VideoProps,
	emits: ['play', 'pause', 'ended', 'timeupdate', 'trialEnd', 'playError', 'changeSeek', 'fullscreenchange', 'handleBtn'],
	setup(props, { emit }) {
		const { proxy } = getCurrentInstance()
		const { screenWidth, screenHeight } = uni.getSystemInfoSync()
		const state = reactive<StateData>({
			isPlay: false,
			controls: false,
			enablePlayGesture: false,
			countPlay: 0,
			isFullScreen: false,
			rateText: '1.0',
			isShowRateBox: false,
			visibleTrialEndBox: false,
			showMplayerToast: false
		})
		const rateList = ref<rateListData[]>([{
			name: '0.5',
			isSelect: false
		}, {
			name: '0.8',
			isSelect: false
		}, {
			name: '1.0',
			isSelect: true
		}, {
			name: '1.25',
			isSelect: false
		}, {
			name: '1.5',
			isSelect: false
		}
			// #ifdef MP-WEIXIN
			, {
			name: '2.0',
			isSelect: false
		}
			// #endif
		])
		const videoCtx = ref(null)
		const { isFullScreen } = toRefs(state)
		/** 播放按钮样式 */
		const playImgStyle = computed(() => {
			const wh = getPx(props.playImgHeight)
			const style = {
				width: addUnit(wh),
				height: addUnit(wh),
				top: `${getPx(props.videoHeight) / 2}px`,
				left: `${getPx(props.videoWidth) / 2}px`,
				transform: `translate(-${getPx(wh) / 2}px,-${getPx(wh) / 2}px)`
			}
			return style
		})
		const speedStyle = ref({})
		const speedBoxMaskStyle = ref({})
		const speedBoxLeftStyel = ref({})
		const speedBoxStyle = ref({})
		const trialEndBoxStyle = ref({})

		/** 设置样式 */
		const setStyles = () => {
			/** 当前倍速样式 */
			(function speedStyleFn() {
				let tops = getPx(props.videoHeight) / 2
				if (isFullScreen.value) {
					tops = getPx(props.videoWidth) / 2
				}
				Object.assign(speedStyle.value, { top: tops - 15 + 'px' })
			})();
			/** 倍速盒子背景遮罩 */
			(function speedBoxMaskStyleFn() {
				let style = {
					width: addUnit(props.videoWidth),
					height: addUnit(props.videoHeight)
				}
				if (isFullScreen.value) {
					style = {
						width: `${screenHeight}px`,
						height: `${screenWidth}px`
					}
				}
				Object.assign(speedBoxMaskStyle.value, style)
			})();
			/** 倍速盒子左侧遮罩 */
			(function speedBoxLeftStyelFn() {
				const w = getPx(props.speedBoxWidth)
				const pw = getPx(props.videoWidth)
				let style = {
					width: `${pw - w}px`,
					height: addUnit(props.videoHeight)
				}
				if (isFullScreen.value) {
					style = {
						width: `${screenHeight - w}px`,
						height: `${screenWidth}px`
					}
				}
				Object.assign(speedBoxLeftStyel.value, style)
				proxy.$forceUpdate()
			})();

			/** 倍速盒子样式 */
			(function speedBoxStyleFn() {
				let style = {
					width: addUnit(props.speedBoxWidth),
					height: addUnit(props.videoHeight)
				}
				if (isFullScreen.value) {
					style = {
						width: addUnit(props.speedBoxWidth),
						height: `${screenWidth}px`
					}
				}
				Object.assign(speedBoxStyle.value, style)
			})();
			/** 试看样式 */
			(function trialEndBoxStyleFn() {
				let style = {
					width: addUnit(props.videoWidth),
					height: addUnit(props.videoHeight)
				}
				if (isFullScreen.value) {
					style = {
						width: `${screenHeight}px`,
						height: `${screenWidth}px`
					}
				}
				Object.assign(trialEndBoxStyle.value, style)
			})();
			proxy.$forceUpdate()
		}

		onMounted(() => {
			videoCtx.value = uni.createVideoContext(props.videoId, proxy)
			setStyles()
		})
		// 监听src变化
		watch(() => props.src, (newVal) => {
			if (newVal) {
				resetVideoContext()
			}
		})

		// 重置视频上下文
		const resetVideoContext = () => {
			if (videoCtx.value) {
				videoCtx.value.stop()
				videoCtx.value = null
			}
			nextTick(() => {
				videoCtx.value = uni.createVideoContext(props.videoId, proxy)
			})
		}

		/**
		 * 播放视频
		 */
		function changePlay() {
			nextTick(() => {
				videoCtx.value.play()
				if (state.countPlay <= 0 && props.seekTime > 0) {
					// 没有播放过并且需要跳转视频
					// #ifndef H5
					seek(props.seekTime)
					// #endif
					state.showMplayerToast = true
					setTimeout(() => {
						state.showMplayerToast = false
					}, 3000)
				}
				state.countPlay++
			})
		}
		/**
		 * 跳转到指定位置，单位 s
		 * @param {Object} position 
		 * @description V1.1.1
		 */
		function seek(position: number | string) {
			nextTick(() => {
				videoCtx.value.seek(position)
				emit('changeSeek', position)
			})
		}
		/**
		 * 切换倍速
		 * @param {Object} item 当前点击项
		 * @param {Object} index 倍速索引
		 */
		function changeRate(item: rateListData, index: number) {
			if (item.isSelect) return state.isShowRateBox = false
			rateList.value.forEach((v, i) => {
				i == index ? v.isSelect = true : v.isSelect = false
			})
			videoCtx.value.playbackRate(+item.name)
			state.rateText = item.name
			state.isShowRateBox = false
		}
		/**
		 * 当开始/继续播放时触发play事件 - 会触发emit事件
		 * @param {EventHandle} e 
		 */
		function play(e) {
			state.isPlay = true
			state.controls = true
			state.enablePlayGesture = true
			emit('play', e)
		};
		/**
		 * 视频播放进度变化 - 会触发emit事件
		 * @param {Object} e event.detail = {currentTime, duration}
		 */
		function timeupdate(e) {
			emit('timeupdate', e)
			// 是否判断需要视频试看 V1.1.0
			if (props.trialTime <= 0) return
			if (e.detail.currentTime >= props.trialTime) {
				emit('trialEnd')
				showTrialEnd()
				state.enablePlayGesture = false
				state.controls = false
			}
		};
		/**
		 * 控制试看模块显示 V1.1.0
		 */
		function showTrialEnd() {
			state.visibleTrialEndBox = true
			videoCtx.value.pause()
		}
		/**
		 * 点击试看结束按钮 V1.1.6
		 * @param {Event} e
		 */
		function handleClickTrialEnd(e) {
			if (e.hasOwnProperty('touches')) {
				emit('handleBtn')
			}
		}
		/**
		 * H5用户手动跳转指定位置播放 v1.2.0
		 */
		function handelSeek() {
			seek(props.seekTime)
			videoCtx.value.play()
			state.showMplayerToast = false
		}
		/**
		 * 全屏操作 - 会触发emit
		 */
		function fullscreenchange(e) {
			state.isFullScreen = e.detail.fullScreen
			setStyles()
			emit('fullscreenchange', e.detail)
		}
		/**
		 * 监听视频结束 - 会触发emit事件
		 */
		function ended() {
			emit('ended')
			if (!props.isExitFullScreen) return
			videoCtx.value.exitFullScreen(); //退出全屏
		};
		/**
		 * 控制试看模块隐藏 V1.1.0
		 */
		function closeTrialEnd() {
			state.visibleTrialEndBox = false
			changePlay()
		}
		/**
		 * 手动全屏方法 v1.1.8
		 * @param {Object} direction  direction取为 vertical 或 horizontal
		 * @description H5和抖音小程序不支持{direction}参数
		 */
		function requestFullScreen(direction: 'vertical' | 'horizontal' = 'horizontal') {
			videoCtx.value.requestFullScreen({
				direction
			})
		}
		/**
		 * 手动退出全屏 v1.1.8
		 */
		function exitFullScreen() {
			videoCtx.value.exitFullScreen()
		}
		/**
		 * v1.1.8
		 * 显示状态栏，仅在iOS全屏下有效
		 * 平台差异：仅微信小程序、百度小程序、QQ小程序
		 */
		function showStatusBar() {
			videoCtx.value.showStatusBar()
		}
		/**
		 * v1.1.8
		 * 隐藏状态栏，仅在iOS全屏下有效
		 * 平台差异：仅微信小程序、百度小程序、QQ小程序
		 */
		function hideStatusBar() {
			videoCtx.value.hideStatusBar()
		}
		/**
		 * 停止视频 v1.1.8
		 */
		function handelStop() {
			videoCtx.value.stop()
		}

		function resetVideo() {
			state.isPlay = false;
			state.controls = false;
			state.enablePlayGesture = false;
			state.countPlay = 0;
			
			// 重置视频上下文
			if (videoCtx.value) {
				videoCtx.value.stop();
				videoCtx.value = null;
			}
			nextTick(() => {
				videoCtx.value = uni.createVideoContext(props.videoId, proxy);
			});
		}

		const reload = () => {
			if (videoCtx.value) {
				videoCtx.value.stop()
				videoCtx.value.play()
			}
		}

		// 监听src变化
		watch(() => props.src, (newVal) => {
			if (newVal) {
				nextTick(() => {
					reload()
				})
			}
		}, { immediate: true })

		// 暴露方法给父组件
		defineExpose({
			reload
		})

		const handleVideoError = (e) => {
			console.error('视频加载错误:', e)
			uni.$u.toast('视频加载失败，请重试')
		}

		const handleVideoLoaded = () => {
			console.log('视频加载成功')
		}

		return {
			emit,
			addUnit,
			convertSecondsToHMS,
			state,
			play,
			ended,
			timeupdate,
			changePlay,
			speedStyle,
			playImgStyle,
			speedBoxStyle,
			speedBoxMaskStyle,
			speedBoxLeftStyel,
			rateList,
			trialEndBoxStyle,
			fullscreenchange,
			handleClickTrialEnd,
			handelSeek,
			changeRate,
			closeTrialEnd,
			requestFullScreen,
			exitFullScreen,
			showStatusBar,
			hideStatusBar,
			handelStop,
			resetVideo
		}
	},
})

</script>

<style lang="scss">
@import './index.scss';
</style>