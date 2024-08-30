<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader />
		</template>
		<view class="body">
			<CommonTitle title="AI换脸" desc="通过上传模版图和人脸图,AI会把人脸图中的任务替换" />
			<CommonChangeFace v-model:parmas="parmas" :ChangeFaceTypes="ChangeFaceTypes" />
		</view>
		<template #bottom>
			<view class="aiFaceSwapping_fooer">
				<view class="aiFaceSwapping_fooer_button" :style="{borderRadius: '35rpx',width:'75%'}"
					@click="changeFace">开始换脸</view>

			</view>
		</template>
	</z-paging>

	<up-overlay :show="showOverlay" opacity="0.8">
		<view class="aiFaceSwapping_overlay">
			<view class="aiFaceSwapping_overlay_header" :style="{height:navBarHeight + 'px'}">
				<view class="aiFaceSwapping_overlay_header_Box" :style="{paddingTop:menuButtonInfo?.top + 'px'}">
					AI换脸（图片版）结果
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
		</view>
	</up-overlay>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue'
	import CommonChangeFace from "../../components/CommonChangeFace/index.vue"
	import CommonTitle from '@/components/CommonTitle.vue'
	import { onMounted, reactive, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { ChangeFaceTypesProps } from '../../data';
	import { base64ToFile } from '@/utils/base642file';
	import { Url2temUrl, isValidURL, isWeChatTempPath, weChatTempPathToBase64 } from '@/utils';
	import { storeToRefs } from 'pinia';
	import { useCounterStore } from '@/store';
	import { saveImage } from '@/utils/saveImages';
	const { $api } = useGlobalProperties();
	// #ifdef MP-WEIXIN
	const system = useCounterStore()
	const { menuButtonInfo, navBarHeight } = storeToRefs(system)
	// #endif
	const showOverlay = ref(false)
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
		const faceModels = await $api.get('api/v1/img/faceModel')
		if (faceModels) {
			ChangeFaceTypes.formworkImage = faceModels.formworkImage
			ChangeFaceTypes.humanFaceImage = faceModels.humanFaceImage
		}
	})

	const changeFace = async () => {
		if (!parmas.image1) {
			uni.$u.toast('请上传自定义原图！');
			return
		}
		if (!parmas.image2) {
			uni.$u.toast('请上传人脸图！');
			return
		}
		let isWeChatSendImages = false

		// 区分当前是否是url h5端的时候只有url 和 base64
		// #ifdef H5
		if (isValidURL(parmas.image1)) {
			parmas.image1 = await reverseUrlToBase64(parmas.image1)
		}
		if (isValidURL(parmas.image2)) {
			parmas.image2 = await reverseUrlToBase64(parmas.image2)
		}
		// #endif

		// 微信的时候只有临时路径 和 url 将url转成临时路径
		// #ifdef MP-WEIXIN
		if (!isWeChatTempPath(parmas.image1)) {
			parmas.image1 = await Url2temUrl(parmas.image1)
			parmas.image1 = await weChatTempPathToBase64(parmas.image1)
		}
		if (!isWeChatTempPath(parmas.image2)) {
			parmas.image2 = await Url2temUrl(parmas.image2)
			parmas.image2 = await weChatTempPathToBase64(parmas.image2)
		}
		isWeChatSendImages = true
		// #endif
		const sendParmas = revasedImages()
		let res
		// #ifdef H5
		res = await $api.post('api/v1/img/face', sendParmas, true, {}, null, isWeChatSendImages);
		// #endif
		// #ifdef MP-WEIXIN

		res = await $api.post('api/v1/img/face_base64', sendParmas);
		// #endif
		if (res.code == 200) {
			currentImage.value = res.data
			showOverlay.value = true
		} else {
			uni.$u.toast(res.msg);
		}
	}
	const reverseUrlToBase64 = async (url : string) => {
		const base64Images = await $api.get(`api/v1/img/getbase64?url=${url}`)
		if (base64Images.code == 200) {
			return base64Images.data
		} else {
			uni.$u.toast('设置图片错误请重试！');
		}
	}

	const revasedImages = () => {
		let formdata : any | FormData
		let sendParmas = parmas
		// #ifdef H5
		const file1 = base64ToFile(parmas.image1, '图片1')
		const file2 = base64ToFile(parmas.image2, '图片2')
		formdata = new FormData()
		formdata.append('image1', file1)
		formdata.append('image2', file2)
		sendParmas = formdata
		// #endif
		return sendParmas
	}

	const saveImages = () => {
		saveImage(currentImage.value, '图片')
		showOverlay.value = false
	}
</script>


<style lang="scss">
	.body {
		display: flex;
		flex-direction: column;
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
			font-size: 25rpx;
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
			&_Box {
				padding: 20rpx;
				font-size: 30rpx;
				font-weight: 800;
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
					font-size: 25rpx;
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
				font-size: 25rpx;
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
			font-size: 25rpx;

		}
	}
</style>