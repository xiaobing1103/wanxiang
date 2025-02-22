<template>
	<z-paging ref="pagingRef" :pagingStyle="{padding:'24rpx'}">
		<template #top>
			<CommonHeader noBackGround defindTitle="ORC图片识别" />
		</template>

		<view class="AiORCModel">
			<view class="AiORCModel_header">
				可对办公类文档的版面进行分析，输出图、表、标题、文本、目录、栏、页眉、页码、和脚注的位置，并输出 分版块内容的OCR识别结果，支持中、英两种语言，手写、印刷体混排多种场景
			</view>
			<view class="AiORCModel_main">
				<view class="AiORCModel_main_headers">
					图片ORC识别
				</view>
				<ChangeFaceUploadImage noUseCorpImage v-model:showupOverlay="showupOverlay" description="请上传自定义原图"
					v-model:images="image1" :showAngle="true" :width="1000" :height="600" />
				<view class="AiORCModel_main_example">
					示例图片
				</view>
				<view class="AiORCModel_main_items">

					<view class="AiORCModel_main_items_images" v-for="(items,index) in images">
						<image @click="changeImages(index)" class="AiORCModel_main_items_images_img" :src="items"
							mode="">
						</image>
					</view>
				</view>
				<view class="AiORCModel_main_InputContent">
					网址ORC识别
				</view>
				<view class="AiORCModel_main_InputMain">
					<up-input maxlength="500" v-model="modelValue" placeholder="请输入要识别的图片地址" border="surround"
						clearable></up-input>
				</view>


				<view class="AiORCModel_main_results">
					<view class="AiORCModel_main_example">
						识别结果
					</view>
					<view class="AiORCModel_main_items">
						<zero-markdown-view :markdown="value"></zero-markdown-view>
					</view>
				</view>
			</view>
		</view>
		<template #bottom>
			<view class="createVioce" v-if="!showupOverlay">
				<view class="createVioce_item">
					<up-button type="primary" @click="onCreateVoice">图片识别</up-button>
				</view>
				<view class="createVioce_item">
					<up-button type="primary" @click="onCreateVoice2">网址识别</up-button>
				</view>
				<view class="createVioce_item">
					<up-button @click="copy">复制结果</up-button>
				</view>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import ChangeFaceUploadImage from '../ChangeFaceUploadImage'
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { ref } from 'vue';
	import { isPureLink, isValidURL, isWeChatTempPath, toCopyText } from '@/utils';
	import { base64ToFile } from '@/utils/base642file';
	const { $api, $assets } = useGlobalProperties();
	const showupOverlay = ref(false)
	const image1 = ref(null)
	const modelValue = ref('')
	const value = ref(`## 此处为ORC示例识别结果 ： 
 ### 产品详细信息如下： 
 ### 营养成分表 项目 每100克 (g) 营养素参考值 能量 1367千焦 (KJ) 16% 蛋白质 23.4克 (g) 39% 脂肪 26.2克 (g) 44% 碳水化合物 0克 (g) 0% 钠 1124毫克(mg) 56% 
以上成分仅供参考，具体请以实际为准，如有其它疑问，可致电联系我们 0571-8827631或Q：2398763527`)
	const images = [
		$assets.OrcScannerIcon1, $assets.OrcScannerIcon2, $assets.OrcScannerIcon3, $assets.OrcScannerIcon4, $assets.OrcScannerIcon5
	]

	const reverseUrlToBase64 = async (url : string) => {
		const base64Images = await $api.get(`api/v1/img/getbase64?url=${url}`)
		return new Promise((resolve, reject) => {
			if (base64Images.code == 200) {
				resolve(base64Images.data)
			} else {
				uni.$u.toast('设置图片错误请重试！');
			}
		})
	}

	const onCreateVoice = async () => {
		if (!image1.value) {
			uni.$u.toast('请上传ORC图片！');
			return
		}
		let isWeChatSendImages = false
		let formData : FormData | any = image1.value
		// 如果是连接的情况
		let AllRes

		// #ifdef H5
		// 一定是base64 或者连接模式
		if (isValidURL(image1.value)) {
			onCreateVoice2(image1.value)
		} else {
			const file = base64ToFile(image1.value, '图片')
			formData = new FormData()
			formData.append('image', file)
			AllRes = await $api.post('api/v1/ocr/scan2', formData, true, {}, null, isWeChatSendImages)

		}
		// #endif


		// #ifdef MP-WEIXIN || APP
		// 一定是临时路径或者链接
		console.log(image1.value)
		if (isWeChatTempPath(image1.value)) {
			formData = { image: image1.value }
			if (isWeChatTempPath(image1.value)) {
				isWeChatSendImages = true
			}
			AllRes = await $api.post('api/v1/ocr/scan2', formData, true, { 'content-type': 'application/x-www-form-urlencoded' }, null, isWeChatSendImages)
		} else {
			onCreateVoice2(image1.value)
		}
		// #endif
		if (typeof AllRes == 'string') {
			AllRes = JSON.parse(AllRes)
		}
		
		if (AllRes?.code == 200) {
			uni.$u.toast('识别图片成功,请查看识别结果！');
			value.value = AllRes.data
		} else {
			uni.$u.toast(AllRes.msg);
		}
	}

	const onCreateVoice2 = async (url ?: string) => {
		const textUrl = modelValue.value || url
		if (!textUrl) {
			uni.$u.toast('请上传图片地址！');
			return
		}
		if (!isPureLink(textUrl)) {
			uni.$u.toast('请输入正确的图片地址，要以http://或者 https:// 开头的网络连接！');
			return
		}
		const urlRqs = await $api.post('api/v1/ocr/scan2', { url: textUrl })
		if (urlRqs.code == 200) {
			uni.$u.toast('识别图片成功,请查看识别结果！');
			value.value = urlRqs.data
		} else {
			uni.$u.toast(urlRqs.msg);
		}
	}
	const changeImages = (index : number) => {
		image1.value = images[index]
	}

	const copy = () => {
		toCopyText(value.value)
	}
</script>

<style lang="scss" scoped>
	.AiORCModel {
		&_header {
			font-size: 20rpx;
			text-align: center;
			color: #ccc;
		}

		&_main {
			&_example {
				padding: 20rpx 0;
			}

			&_items {
				padding: 15rpx;
				border: 1rpx solid #ccc;
				display: flex;
				overflow-x: scroll;
				border-radius: 15rpx;

				&_images {
					margin: 10rpx;

					&_img {
						width: 300rpx;
						height: 200rpx;
					}
				}
			}
		}
	}

	.AiORCModel_main_InputContent {
		padding: 25rpx 0;
	}

	.AiORCModel_main_InputMain {
		border: 1rpx solid #ccc;
		border-radius: 15rpx;
	}

	.createVioce {
		display: flex;
		justify-content: space-between;

		&_item {
			margin: 20rpx;
		}
	}
</style>