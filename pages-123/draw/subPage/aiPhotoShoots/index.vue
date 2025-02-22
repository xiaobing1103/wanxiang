<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0'}">
		<template #top>
			<CommonHeader />
		</template>
		<view class="body">
			<CommonTitle title="AI写真" desc="上传自拍生活照,挑选喜欢的形象照模版,一键只能生成各种风格高级专业职业形象照" />
			<CommonChangeFace v-model:showupOverlay="showupOverlay" v-model:parmas="parmas"
				:ChangeFaceTypes="ChangeFaceTypes" />
		</view>

		<view class="aiFaceSwapping_fooer" v-if="!showupOverlay">
			<view class="aiFaceSwapping_fooer_button" :style="{borderRadius: '35rpx',width:'75%'}" @click="changeFace">
				开始换脸</view>
		</view>
	</z-paging>
	<up-overlay :show="showOverlay" opacity="0.8">
		<view class="aiFaceSwapping_overlay">
			<view class="aiFaceSwapping_overlay_header" :style="{height:ScreenStore.navBarHeight + 'px'}">
				<view class="aiFaceSwapping_overlay_header_Box">
					<up-icon @click="showOverlay = false" name="arrow-left" size="20"></up-icon>
					<text class="aiFaceSwapping_overlay_header_Box_text">AI换脸（图片版）结果</text>
				</view>
			</view>
			<view class="aiFaceSwapping_overlay_main">
				<image class="aiFaceSwapping_overlay_main_image" :src="currentImage" mode="aspectFit"></image>
				<text class="aiFaceSwapping_overlay_main_image_text">融合后图像</text>
			</view>
			<view class="aiFaceSwapping_overlay_footer">
				<view class="aiFaceSwapping_overlay_footer_button" @click="saveImages">
					保存图片
				</view>
			</view>
			<view class="aiFaceSwapping_overlay_desc">
				请遵守相关法律法规，反对非法用途，违者100%封号，包括但不限于侵犯他人隐私、散步虚假信息、进行诈骗等行为！
			</view>
		</view>
	</up-overlay>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue'
	import CommonChangeFace from "../CommonChangeFace/index.vue"
	import CommonTitle from '@/components/CommonTitle.vue'
	import { onMounted, reactive, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { ChangeFaceTypesProps } from '../../data';
	import { base64ToFile } from '@/utils/base642file';
	import { downloadReport, isValidURL, isWeChatTempPath, weChatTempPathToBase64 } from '@/utils';
	import { storeToRefs } from 'pinia';
	import { useChatStore, useScreenStore } from '@/store';
	import { downloadBase64Image } from '@/utils/downLoadLocal';
	const { $api } = useGlobalProperties();
	const showupOverlay = ref(false)

	const ScreenStore = useScreenStore()
	const showOverlay = ref(false)
	const chatStore = useChatStore()
	const ChangeFaceTypes : ChangeFaceTypesProps = reactive({
		type: 'changeFace',
		historyType: "changeFace_task_json",
		humanFaceImage: [],
		formworkImage: [],
	})
	const currentImage = ref('')
	const parmas = reactive({
		image1: null,
		image2: null,
	})
	onMounted(async () => {
		const faceModels = await $api.get('api/v1/img/faceswapByPhotography')
		if (faceModels) {
			ChangeFaceTypes.formworkImage = faceModels.data
		}
	})

	const changeFace = async () => {
		const parmasRes = { ...parmas }

		if (!parmasRes.image1) {
			uni.$u.toast('请上传自定义原图！');
			return
		}
		if (!parmasRes.image2) {
			uni.$u.toast('请上传人脸图！');
			return
		}
		let isWeChatSendImages = false
		// 区分当前是否是url h5端的时候只有url 和 base64
		// #ifdef H5
		if (isValidURL(parmasRes.image1)) {
			parmasRes.image1 = await reverseUrlToBase64(parmasRes.image1)
		}
		if (isValidURL(parmasRes.image2)) {
			parmasRes.image2 = await reverseUrlToBase64(parmasRes.image2)
		}
		// #endif
		// 微信的时候只有临时路径 和 url
		// #ifdef MP-WEIXIN || APP

		if (isWeChatTempPath(parmasRes.image1)) {
			parmasRes.image1 = await weChatTempPathToBase64(parmasRes.image1)
		} else {
			parmasRes.image1 = await reverseUrlToBase64(parmasRes.image1)
		}
		if (isWeChatTempPath(parmasRes.image2)) {
			parmasRes.image2 = await weChatTempPathToBase64(parmasRes.image2)
		} else {
			parmasRes.image2 = await reverseUrlToBase64(parmasRes.image2)
		}
		// #endif
		console.log(parmasRes)
		const sendParmas = revasedImages(parmasRes)
		let res

		const checkRes = await $api.post('api/v1/number2/check', { type: 'draw_face' })
		if (checkRes.code !== 200) {
			chatStore.setShowLevelUpVipContent(checkRes.msg)
			chatStore.setShowlevelUpVip(true)
			return
		}
		// #ifdef H5
		res = await $api.post('api/v1/img/face', sendParmas, true, {}, null, isWeChatSendImages);
		// #endif

		// #ifdef MP-WEIXIN || APP
		res = await $api.post('api/v1/img/face_base64', sendParmas);
		// #endif
		if (res.code == 200) {
			currentImage.value = res.data
			showOverlay.value = true
			await $api.post('api/v1/number2/submit', { type: "draw_face", number: 1 })
		} else {
			uni.$u.toast(res.msg);
		}
	}
	const reverseUrlToBase64 = async (url : string) => {
		const base64Images = await $api.get(`api/v1/img/getbase64`, { url: url })
		return new Promise((resolve, reject) => {
			if (base64Images.code == 200) {
				resolve(base64Images.data)
			} else {
				uni.$u.toast('设置图片错误请重试！');
			}
		})
	}

	const revasedImages = (parmasRes : { image1 : any, image2 : any }) => {
		let formdata : any | FormData
		let sendParmas = parmasRes
		// #ifdef H5
		const file1 = base64ToFile(parmasRes.image1, '图片1')
		const file2 = base64ToFile(parmasRes.image2, '图片2')
		formdata = new FormData()
		formdata.append('image1', file1)
		formdata.append('image2', file2)
		sendParmas = formdata
		// #endif
		return sendParmas
	}

	const saveImages = () => {
		// #ifdef H5
		downloadBase64Image(currentImage.value, '下载')
		// #endif
		// #ifdef MP-WEIXIN || APP
		downloadReport(currentImage.value).then((res) => {
			uni.$u.toast(res);
			showOverlay.value = false
		}).catch((err) => {
			console.log(err)
			uni.$u.toast(err);
		})
		// #endif
	}
</script>


<style lang="scss">
	.body {
		display: flex;
		flex-direction: column;
		padding: 0 30rpx;
		box-sizing: border-box;
	}


	.aiFaceSwapping_fooer {
		padding: 35rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;

		&_button {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 50%;
			font-size: 27rpx;
			padding: 12rpx;
			box-sizing: border-box;
			border-radius: 20rpx;
			color: #ffffff !important;
			background: linear-gradient(to right, #1cd8ba, #06c0f9);
		}
	}

	.aiFaceSwapping_overlay {
		height: 100vh;
		width: 100%;
		background-color: #fff;

		&_header {
			display: flex;
			align-items: flex-end;
			padding-top: 30rpx;
			box-sizing: content-box;

			&_Box {
				display: flex;
				align-items: center;
				padding: 20rpx;
				font-size: 30rpx;
				font-weight: 800;

				&_text {
					margin-left: 20rpx;
				}
			}
		}

		&_main {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 50rpx;
			flex-direction: column;

			&_image {
				height: 600rpx;
				width: 90%;

				&_text {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 27rpx;
					padding: 25rpx 0;
				}
			}
		}



		&_footer {

			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			&_button {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 50%;
				font-size: 35rpx;
				padding: 12rpx;
				box-sizing: border-box;
				border-radius: 20rpx;
				color: #ffffff !important;
				background: linear-gradient(to right, #1cd8ba, #06c0f9);
			}
		}


		&_desc {
			padding: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 27rpx;

		}
	}
</style>