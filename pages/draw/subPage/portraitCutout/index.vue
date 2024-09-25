<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader defindPath="/pages/draw/index" defindTitle="AI人像抠图" />
		</template>
		<view class="portraitCutout">
			<CommonTitle title="AI人像抠图" desc="通过上传模版图和人脸图,AI会把人脸图中的任务替换" />
			<view class="portraitCutout_header">

				<view class="portraitCutout_header_title">
					<image class="portraitCutout_header_title_icon" :src="$assets.uploadImageIcon"></image>
					上传原图
				</view>
				<ImageUpload v-model:parmas="parmas" v-model:url="url" type="portraitCutout_task_json"
					ref="ImageUploadRef" />
			</view>

			<view class="portraitCutout_main">
				<view class="portraitCutout_main_title">
					<image class="portraitCutout_header_title_icon" :src="$assets.previewImageIcon"></image>
					预览作品
				</view>
				<view class="portraitCutout_main_content" @click="previewImage">
					<ImageUpload isShowPlaceholder v-model:parmas="parmas2" v-model:url="url2"
						type="portraitCutout_task_json" ref="ImageUploadRef" />
				</view>
				<view class="portraitCutout_main_footercon" v-if="url2">
					<view class="portraitCutout_main_footercon_button" @click="saveImages">
						保存图片
					</view>
				</view>
			</view>
		</view>
		<template #bottom>
			<view class="portraitCutout_footer">
				<view class="portraitCutout_footer_button" @click="startHandler">
					开始抠图
				</view>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import { onMounted, reactive, ref } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import ImageUpload from '../../components/ImageUpload'
	import { useChatStore, useDrawStore } from '@/store';
	import CommonTitle from '@/components/CommonTitle.vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { downloadReport, isWeChatTempPath } from '@/utils';
	import { saveImage } from '@/utils/saveImages';
	import { downloadBase64Image } from '@/utils/downLoadLocal';
	const { $assets, $api } = useGlobalProperties()
	const chatStore = useChatStore()
	const parmas = reactive({
		image: ''
	})
	const parmas2 = reactive({
		image: ''
	})
	const url = ref('')
	const url2 = ref('')
	const DrawStore = useDrawStore()
	onMounted(() => {
		DrawStore.setSeletedDrawProject('portraitCutout_task_json')
	})


	const startHandler = async () => {
		let formdata : FormData | any
		let isWeChatSendImages = false;
		let uploadRes : string | any

		const checkRes = await $api.post('api/v1/number2/check', { type: 'draw_matting' })
		if (checkRes.code !== 200) {
			chatStore.setShowLevelUpVipContent(checkRes.msg)
			chatStore.setShowlevelUpVip(true)
			return
		}
		// #ifdef H5
		formdata = new FormData()
		formdata.append('file', parmas.image)
		uploadRes = await $api.post('api/v1/files/upload', formdata)
		// #endif

		// #ifdef MP-WEIXIN
		formdata = { file: url.value }
		if (isWeChatTempPath(parmas.image)) {
			isWeChatSendImages = true
		}
		uploadRes = await $api.post('api/v1/files/upload', formdata, true, { 'content-type': 'application/x-www-form-urlencoded' }, null, isWeChatSendImages)
		// #endif
		if (typeof uploadRes == 'string') {
			uploadRes = JSON.parse(uploadRes)
		}
		if (uploadRes?.code == 200) {
			const res = await $api.get(`api/v1/img/matting_base64?url=${uploadRes.data}`)
			if (res.code == 200) {
				url2.value = addPrefixToBase64(res.data)
				await $api.post('api/v1/number2/submit', { type: "draw_matting", number: 1 })

			} else {
				uni.$u.toast('抠图失败，请重试！');
			}

		}
	}
	function addPrefixToBase64(base64String : string, prefix = 'data:image/png;base64,') {
		if (!base64String.startsWith('data:')) {
			return prefix + base64String;
		}
		return base64String;
	}

	const previewImage = () => {
		uni.previewImage({
			current: 0,
			urls: [url2.value]
		});
	}

	const saveImages = () => {
		// #ifdef H5
		downloadBase64Image(url2.value, '下载')
		// #endif

		// #ifdef MP-WEIXIN
		downloadReport(url2.value).then((res) => {
			uni.$u.toast(res);
		}).catch((err) => {
			uni.$u.toast(err);
		})
		// #endif
	}
</script>

<style lang="scss">
	.portraitCutout {


		&_header {
			padding: 24rpx 0;

			&_title {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				font-weight: 800;

				&_icon {
					width: 40rpx;
					height: 40rpx;
					margin-right: 20rpx;
				}
			}
		}


		&_main {
			&_title {
				font-weight: 800;
				display: flex;
				align-items: center;

				&_icon {}
			}

			&_content {}

			&_footercon {
				display: flex;
				justify-content: center;
				align-items: center;

				&_button {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 40%;
					font-size: 27rpx;
					padding: 12rpx;
					box-sizing: border-box;
					border-radius: 25rpx;
					color: #ffffff !important;
					background: linear-gradient(to right, #1cd8ba, #06c0f9);
				}


			}
		}

		&_footer {
			padding: 35rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;

			&_button {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 70%;
				font-size: 27rpx;
				padding: 12rpx;
				box-sizing: border-box;
				border-radius: 25rpx;
				color: #ffffff !important;
				background: linear-gradient(to right, #1cd8ba, #06c0f9);
			}

		}
	}
</style>