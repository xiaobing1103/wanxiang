<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'0 40rpx'}">
		<template #top>
			<CommonHeader :defindTitle="defindDatas.title" />
		</template>
		<view class="HandlerImage">
			<view class="restNums">
				<view class="restNums_box">
					<up-button @click="toVipPages"
						:customStyle="{background:'linear-gradient(to right, #314cd7, #ae1dfd)',width:'100%',height:'60rpx',borderRadius:'15rpx',color:'white'}">
						<image class="restNums_box_icon" :src="$assets.createVideoVipIcon" mode=""></image>
						<text :style="{marginRight:'10rpx'}">剩余次数</text>
						{{restNum}}
					</up-button>

				</view>
				<!-- <view class="restNums_history" @click="toHistory">
					历史记录
				</view> -->
			</view>

			<view class="HandlerImage_upLoad">
				<up-upload :customStyle="{ width: '100%' ,display:'flex',alignItems:'center'}" accept='video'
					:previewImage="false" :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1"
					multiple :maxCount="1">
					<view class="UploadMain">
						<image class="UploadMain_icon" :src="$assets.videoModelIcon" mode="" />
						<view class="UploadMain_desc"> 点击上传视频 </view>
						<view class="UploadMain_desc2"> 支持 MP4 / MOV 格式视频，分辨率不超过1080P，时长不超过 {{secoend}} 秒</view>
					</view>

				</up-upload>
			</view>
		</view>
		<view class="playpreview">
			<view class="playpreview_label"> 视频结果预览</view>
			<view class="playpreview_tips" v-if="defindDatas.title == 'AI视频抠图'">有些视频没有画面是因为视频播放器不支持的原因，请下载视频到本地后打开视频查看,部分苹果机型不支持下载，可以复制链接到浏览器下载到本地查看视频</view>
			<view class="playpreview_tips" v-else>有部分手机机型不支持mp3文件下载，需要复制链接到浏览器下载音频</view>
			<view class="playpreview_video" v-if="playVideo">
				<SunnyVideo :src="playVideo" />
			</view>

		</view>
		<template #bottom>
			<view class="bottomBox">
				<up-button
					:customStyle="{margin:'0 20rpx',height:'60rpx',border:'0',background:'linear-gradient(to right, rgb(49, 76, 215), rgb(174, 29, 253))',borderRadius:'40rpx',width:'80%',color:'white'}"
					@click="fastCreate">复制链接</up-button>

				<up-button
					:customStyle="{margin:'0 20rpx',height:'60rpx',border:'0',background:'linear-gradient(to right, rgb(49, 76, 215), rgb(174, 29, 253))',borderRadius:'40rpx',width:'80%',color:'white'}"
					@click="downLoadVideo">下载</up-button>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import SunnyVideo from '../sunny-video/components/sunny-video/sunny-video.vue';
	import { ref, computed, onMounted } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useUserStore } from '@/store';
	import { AppName } from '@/http';
	import { toCopyText } from '@/utils';
	const playVideo = ref('')
	const props = defineProps<{ defindDatas : { title : string, requestUrl : string } }>()
	const { $assets, $api } = useGlobalProperties()
	const UserStore = useUserStore()
	const restNum = ref(0)
	const toVipPages = () => {
		uni.navigateTo({
			url: "/pages/function/subPage/VideoVip/index"
		})
	}
	// const toHistory = () => {
	// 	uni.navigateTo({
	// 		url: '/pages/function/subPage/TextCreateVideo/videoHistory/index?type=numbersPeople'
	// 	})
	// }
	const secoend = computed(() => {
		const vipType = UserStore.userInfo.vip
		if (AppName == 'bianjie') {
			if ([58, 78, 79].indexOf(vipType) != -1) {
				return 90;
			} else if ([120, 152, 53].indexOf(vipType) != -1) {
				return 60
			} else {
				return 30
			}
		}
		if (AppName == 'wanxiang') {
			if ([58, 78, 79, 200, 199, 203, 204].indexOf(vipType) != -1) {
				return 90;
			} else if ([120, 152, 53, 201, 202, 198].indexOf(vipType) != -1) {
				return 60
			} else {
				return 30
			}
		}

	})
	const fileList1 = ref([]);
	// 新增图片
	const afterRead = async (event) => {
		console.log(event)
		const { file } = event
		const type = file[0].type
		if (type !== "video") {
			uni.$u.toast('格式不正确！');
			return
		}
		const min = file[0].duration
		if (min > secoend) {
			uni.$u.toast('视频时间过长！');
			return
		}
		let formdata = null
		let isJson = false
		let isWechatSendImages = false
		// #ifdef H5

		formdata = new FormData()
		formdata.append('video', file[0].tempFile)
		formdata.append('time_limit', secoend.value * 10)
		// #endif

		// #ifdef MP-WEIXIN
		formdata = { video: file[0].url, time_limit: secoend.value * 10 }
		isJson = true
		isWechatSendImages = true
		// #endif

		let VidoeReq = await $api.post(props.defindDatas.requestUrl, formdata, isJson, {}, null, isWechatSendImages)
		if (typeof VidoeReq == 'string') {
			VidoeReq = JSON.parse(VidoeReq)
		}
		if (VidoeReq.code == 200) {
			uni.$u.toast('成功,请在下面预览！');
			playVideo.value = VidoeReq.url
			getCounts()
		} else {
			uni.$u.toast(VidoeReq.msg);
		}

	};
	const downLoad = (url : string) => {
		uni.downloadFile({
			url: url,
			success: (res) => {
				// 2 成功下载后而且状态码为200时将视频保存到本地系统
				if (res.statusCode === 200) {
					uni.saveVideoToPhotosAlbum({
						filePath: res.tempFilePath
					})
					uni.hideLoading();
					// 提示用户下载成功
					uni.showToast({ title: "下载成功", icon: "success" });
				}
				// 如果该资源不可下载或文件格式出错则提示用户
				else {
					uni.showToast({ title: "资源格式错误，请联系管理员" });
				}
			},
			fail: (err) => {
				// 下载失败提醒
				uni.hideLoading();
				uni.showToast({ title: "下载失败" })
			}
		})
	}

	onMounted(() => {
		getCounts()
	})
	const getCounts = async () => {
		const countReq = await $api.post('api/v1/video/count', {})
		if (countReq.code == 200) {
			restNum.value = countReq.data
		}
	}

	// 删除图片
	const deletePic = (event : { index : number; }) => {
		fileList1.value.splice(event.index, 1);
	};

	const fastCreate = () => {
		if (!playVideo.value) {
			uni.$u.toast('请先上传视频！');
			return
		}
		toCopyText(playVideo.value)
	}

	const downLoadVideo = () => {
		if (!playVideo.value) {
			uni.$u.toast('请先上传视频！');
			return
		}

		downLoad(playVideo.value)
	}
</script>

<style lang="scss" scoped>
	.HandlerImage {
		display: flex;
		flex-direction: column;

		&_upLoad {
			width: 100%;
		}
	}

	.UploadMain {
		font-size: 27rpx;
		margin: 40rpx 0;
		padding: 80rpx 80rpx;
		display: flex;
		align-items: center;
		border: 1rpx solid #ccc;
		border-radius: 15rpx;
		width: 100%;
		flex-direction: column;

		&_icon {
			height: 80rpx;
			width: 100rpx;
		}

		&_desc {
			padding: 30rpx 0;
			font-size: 33rpx;
			font-weight: 800;
		}

		&_desc2 {
			color: #888;
			text-align: center;
			width: 500rpx;
			// display: -webkit-box;
			// -webkit-box-orient: vertical;
			// -webkit-line-clamp: 2;
			// /* 限制为两行 */
			// overflow: hidden;
			// /* 隐藏超出部分 */
			// text-overflow: ellipsis;
			// /* 超出部分显示省略号 */
		}
	}

	.bottomBox {
		display: flex;
		padding-top: 10rpx;
		padding-bottom: 40rpx;
	}

	.playpreview {
		display: flex;
		flex-direction: column;
		font-size: 30rpx;

		&_label {}

		&_tips {
			font-size: 24rpx;
			color: #ccc;
			padding: 20rpx 0;
		}

		&_video {
			border-radius: 20rpx;
			overflow: hidden;
		}

		// font-weight: 800;
		// flex-
	}

	.restNums {
		width: 100%;
		justify-content: space-between;
		display: flex;
		align-items: center;
		padding-top: 30rpx;

		&_box {
			display: flex;
			font-size: 25rpx;
			align-items: center;

			&_icon {
				width: 40rpx;
				height: 40rpx;
				margin: 0 20rpx;
			}
		}

		&_history {
			color: #1677ff;
		}
	}
</style>