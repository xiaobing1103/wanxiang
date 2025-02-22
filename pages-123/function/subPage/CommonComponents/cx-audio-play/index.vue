<template>
	<!--音频组件-->
	<view>
		<view class="bgfff">
			<view>
				<view class="audo-video">
					<!--音频播放按钮处-->
					<view class="audo-top">
						<!--上一首切换按钮-->
						<!-- <image v-if="jian" style="width:50rpx;height:50rpx;transform:rotate(180deg)" @click="nosig"
							src="http://file.1foo.com/2024/11/07/f1fb6bf2d370d08e827b40671d77693d.png"
							mode="aspectFill"></image> -->
						<!-- v-else -->
						<image @click="sig" src="http://file.1foo.com/2024/11/07/f1fb6bf2d370d08e827b40671d77693d.png"
							:style="{width:'50rpx',height:'50rpx',transform:'rotate(180deg)'}" mode="aspectFill">
						</image>
						<!--上一首切换按钮-->
						<!--快退按钮-->
						<image src="http://file.1foo.com/2024/11/07/d338a979700e65d7878b4f93d514b310.png"
							style="width:45rpx;height:45rpx;transform:rotate(0deg)" mode="aspectFill" @click="kt()">
						</image>
						<!--快退按钮-->
						<!--播放按钮-->
						<image
							:src="succes?'http://file.1foo.com/2024/11/07/3c6d71b9d97d2f35126f0bba62901433.png':  'http://file.1foo.com/2024/11/07/78c21706a4fff25f23b9ab6586cca9eb.png' "
							mode="aspectFill" style="width:100rpx;height:100rpx;" @click="plays(succes?'play':'pause')">
						</image>
						<!--播放按钮-->
						<!--快进按钮-->
						<image src="http://file.1foo.com/2024/11/07/7d18ad18493fc479c67afb67efcf113b.png"
							style="width:45rpx;height:45rpx;" mode="aspectFill" @click="kj()">
						</image>
						<!--快进按钮-->
						<!--下一首切换按钮-->
						<!-- <image v-if="jia" @click="noxig" style="width:50rpx;height:50rpx;transform:rotate(0deg)"
							src="http://file.1foo.com/2024/11/07/f1fb6bf2d370d08e827b40671d77693d.png"
							mode="aspectFill"> </image> -->
						<!-- v-else -->
						<image style="width:50rpx;height:50rpx;"
							src="http://file.1foo.com/2024/11/07/f1fb6bf2d370d08e827b40671d77693d.png" @click="xig"
							mode="aspectFill"></image>
						<!--下一首切换按钮-->
					</view>
					<!--音频播放按钮处-->
					<!--音频api处[视频代替音频-实现倍数功能]-->
					<video id="myVideo" ref="myVideo" :src="recorPath" class="hidden" @timeupdate="timeupdate"
						:autoplay="autoplays" @loadedmetadata="loadedmetadata" @ended="next" controls
						style="width: 10rpx;height:10rpx;">
					</video>
					<!--音频api处[视频代替音频-实现倍数功能]-->
					<view class="audo-a" style="margin:0 auto;">
						<!--进度条-->
						<view class="slider-box">
							<text class="mm">{{timer}}</text>

							<slider style="width: 370rpx;" @change="sliderChange" @changing="sliderChanging"
								class="audio-slider" block-size="16" :min="0" :max="duration" :value="currentTime"
								activeColor="#FFA929" @touchstart="lock= true" @touchend="lock = false" />
							<text class="ss" v-if="overTimer!='NaN:NaN'">{{overTimer}}</text>
							<text class="ss" v-else>00.00</text>
						</view>
						<!--进度条-->
						<!--倍数-->
						<!-- @click="beishu" -->
						<view class="beishu" style="border:3rpx solid #C8C9CC;" @click="openBeisu">
							{{BsNav[bsindex].bs}} X
						</view>
						<view class="absolute" style="right:0;top:80rpx;" v-if="shows">
							<view class="beishu-a" style="border:2rpx solid #C8C9CC;" v-if="show">
								<view v-for="(item,index) in BsNav" :key="index" @click="setRate(index,item)"
									class="title" :style="{color:bsid==item.id?'#8D48FE':''}">
									{{item.bs}} X
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="h-100"></view>
		<!--占位-->
	</view>
	<!--音频组件 Author:chenxin-->
</template>


<script setup lang="ts">
	import { computed, nextTick, onMounted, ref, watch } from 'vue';
	import { getCurrentInstance } from 'vue'
	import { onHide, onUnload } from '@dcloudio/uni-app'
	const instance = getCurrentInstance()
	interface playpamas {
		list : string[],
		Faskms : number,
		Slowms : number,
		autoNext : boolean,
		autoplays : boolean,
		slideYes : boolean,
		switAud : boolean,
		BsNav : Array<{ id : number, bs : string }>,
	}


	const props = withDefaults(defineProps<playpamas>(), {
		Faskms: 15,
		Slowms: 15,
		autoNext: false,
		autoplays: false,
		slideYes: false,
		switAud: true,
		BsNav: () => [{
			id: 1.0,
			bs: '1.0',
		}, {
			id: 1.5,
			bs: '1.5'
		}, {
			id: 2.0,
			bs: '2.0'
		}]
	})
	const shows = ref(false) //倍数弹框
	const show = ref(false)//倍数弹框动画默认开启
	const jian = ref(true)//减-切换图标
	const jia = ref(true)//加-切换图标
	const bsid = ref('')//倍数默认显示第一个
	const bsindex = ref(0)//倍数默认显示第一个
	const num = defineModel('num')
	const current = ref(0)//当前选中的索引
	const recorPath = defineModel('recorPath')//音频播放地址
	const list = defineModel<string[]>('list')//音频播放地址
	const succes = defineModel('succes')//音频播放地址
	const lock = ref(false) // 锁
	const currentTime = ref(0)
	const duration = ref(100) // 总进度
	const videoContext = ref(null)
	const loading = ref(true)
	onMounted(() => {
		videoContext.value = uni.createVideoContext('myVideo', instance)
		//默认播放第一个 -- 按钮展示
		// if (list.value.length != 0) {
		// 	if (list.value.length > 1) { 
		// 		jia.value = false
		// 		if (props.autoplays) {
		// 			succes.value = true
		// 		}
		// 	}
		// }
		if (props.BsNav.length != 0) {
			bsid.value = props.BsNav[0].id
			nextTick(() => {
				videoContext.value.playbackRate(bsid.value)
			})
		}
		changeMusic()

	})

	watch(recorPath, (val, oldVal) => {
		if (val !== oldVal) {
			changeMusic()
		}
	})

	const timer = computed(() => calcTimer(currentTime.value))
	const overTimer = computed(() => calcTimer(duration.value))
	onHide(() => {
		videoContext.value.stop();
	})
	onUnload(() => {
		videoContext.value.stop();
	})

	const sliderChanging = (data) => {
		if (data.detail.value == 0) {
			succes.value = false
			videoContext.value.pause()
		}
		currentTime.value = data.detail.value
	}
	const openBeisu = () => {
		uni.$u.toast('暂不支持倍速播放！')
	}
	function calcTimer(timer) {
		if (timer === 0 || typeof timer !== 'number') {
			return '00:00'
		}
		let mm = Math.floor(timer / 60)
		let ss = Math.floor(timer % 60)
		if (mm < 10) {
			mm = '0' + mm
		}
		if (ss < 10) {
			ss = '0' + ss
		}
		return mm + ':' + ss
	}

	const plays = (type : 'play' | 'pause') => {
		console.log(type)
		if (!list.value || list.value.length == 0) {
			console.log('暂无音频数据~')
			return;
		}
		if (type == 'pause') {
			videoContext.value.play()
			succes.value = true
		}
		if (type == 'play') {
			uni.hideLoading()
			videoContext.value.pause()
			succes.value = false
		}
	}

	const playloading = () => {
		if (loading.value) {
			uni.showLoading({
				title: "音频缓存中..."
			})

		}
		setTimeout(() => {
			uni.hideLoading()
		}, 1600)
		loading.value = false
	}



	const beishu = () => {
		shows.value = !shows.value
	}

	const changeMusic = () => {
		loading.value = true
		playloading()
		succes.value = true
		setTimeout(() => {
			videoContext.value.play()
		}, 1000)
	}

	const setRate = (index, item) => {
		bsid.value = item.id
		bsindex.value = index
		shows.value = false
		videoContext.value.playbackRate(item.id)
	}

	const timeupdate = (event) => {
		if (lock.value) return; // 锁
		let NewcurrentTime, Newduration;
		if (event.detail.detail) {
			NewcurrentTime = event.detail.detail.currentTime
			Newduration = event.detail.detail.duration
		} else {
			NewcurrentTime = event.detail.currentTime
			Newduration = event.detail.duration
		}
		currentTime.value = NewcurrentTime
		duration.value = Newduration
	}


	const sliderChange = (data) => {
		//此处滑动进度条--开始播放
		if (props.slideYes && !succes.value) {
			videoContext.value.play()
			succes.value = true
		}
		videoContext.value.seek(data.detail.value)
	}

	const loadedmetadata = (data) => {
		duration.value = data.detail.duration
	}
	const sig = () => {
		if (!list.value || list.value.length == 0) {
			console.log('暂无音频数据~')
			return;
		}
		// 判断是否等于第一首length长度
		if (num.value == 0) {
			uni.$u.toast('已经到头了！')
			return
		}
		num.value = num.value - 1
		nextTick(() => {
			recorPath.value = list.value[num.value]
		})
	}

	const xig = () => {
		if (!list.value || list.value.length == 0) {
			console.log('暂无音频数据~')
			return;
		}
		// 判断是否超过length长度
		if (num.value + 1 == list.value.length) {
			uni.$u.toast('已经到底了！')
			return
		}
		num.value = num.value + 1
		nextTick(() => {
			recorPath.value = list.value[num.value]
		})
	}
	const nosig = () => {
		uni.showToast({
			title: '到头了~',
			icon: "none"
		})
	}

	const noxig = () => {
		uni.showToast({
			title: '没有更多了~',
			icon: "none"
		})
	}


	const kt = () => {
		if (!list.value || list.value.length == 0) {
			console.log('暂无音频数据~')
			return;
		}
		let a = (currentTime.value - Math.floor(15 % 60)).toFixed(0) //当前时间-15秒
		if (a < 1) {
			succes.value = false
			videoContext.value.pause()
		}
		console.log(a)
		setTimeout(() => {
			videoContext.value.seek(parseInt(a))
			console.log(videoContext.value)
		}, 200)

	}

	const kj = () => {
		if (!list.value || list.value.length == 0) {
			console.log('暂无音频数据~')
			return;
		}
		let a = (currentTime.value + Math.floor(15 % 60)).toFixed(0) //当前时间+15秒
		console.log(a)
		setTimeout(() => {
			console.log(videoContext.value)
			videoContext.value.seek(parseInt(a))
		}, 200)

	}
	const next = (data) => {
		if (!props.autoNext) {
			return
		}
		if (num.value + 1 < list.value.length) {
			succes.value = true
			num.value += 1
			recorPath.value = list.value[num.value]
			setTimeout(() => {
				videoContext.value.play()
			}, 100)
		} else {
			jia.value = true //下按钮 - 灰且阻止
			jian.value = false //上按钮 - 亮可点击
		}
		// console.log('音频结束-------')
	}

	defineExpose({
		plays
	});
</script>
<style lang="scss" scoped>
	page {
		background-color: #F6F6F8;
	}

	/* 	#video {
		width: 100%;
	} */
	.audo-video {
		padding-bottom: 40rpx;
		color: #999;
	}

	.slider-box {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 27rpx;
		color: #999;
	}

	button {
		display: inline-block;
		width: 100rpx;
		background-color: #fff;
		font-size: 24rpx;
		color: #000;
		padding: 0;
	}

	.hidden {
		position: fixed;
		top: 0;
		left: -10rpx;
		z-index: -1;
		width: 1rpx;
		height: 1rpx;
	}

	.audo-top {
		// padding: 20rpx 40rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;

		image {
			width: 45rpx;
			height: 45rpx;
		}
	}

	.audo-a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 700rpx;
		position: relative;
		z-index: 9;
	}

	.beishu {
		position: relative;
		width: 100rpx;
		padding-top: 5rpx;
		padding-bottom: 5rpx;
		text-align: center;
		border-radius: 25rpx;
		font-size: 28rpx;
	}

	.absolute {
		position: absolute;

		.beishu-a {
			width: 200rpx;
			border-radius: 20rpx;
			text-align: center;
			line-height: 90rpx;
			background: #fff;

			.title {
				padding-left: 30rpx;
			}
		}
	}
</style>