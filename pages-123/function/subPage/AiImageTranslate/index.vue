<template>
	<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)'}" :show-scrollbar=" false">
		<template #top>
			<CommonHeader defindTitle="AI图像翻译" />
		</template>
		<view class="TranslatePages">
			<view class="uploadFileTranslate">
				<view class="uploadFileTranslate_top">
					<view class="uploadFileTranslate_right" @click="changeLang('first')">
						{{currentLangFirst}} <up-icon :style="{margin:'0 10rpx'}" name="arrow-down" size="15"></up-icon>
					</view>
					<view class="uploadFileTranslate_middle">
						→
					</view>
					<view class="uploadFileTranslate_right" @click="changeLang('second')">
						{{currentLang}} <up-icon :style="{margin:'0 10rpx'}" name="arrow-down" size="15"></up-icon>
					</view>
				</view>
				<ChangeFaceUploadImage appuUseBase64 noUseCorpImage v-model:showupOverlay="showupOverlay"
					description="请上传自定义原图" v-model:images="image1" :showAngle="true" :width="900" :height="800" />
			</view>
			<view class="bottomView">
				<view class="bottomView_title">
					<text class="bottomView_title_text">翻译结果</text>
				</view>
				<view class="bottomView_desception">
					<text>结合AI人工智能，翻译书面文档、路标、菜单、手册等场景使用 NO .1！</text>
					<text>上传图片直接翻译，准确率高，维持原有排版格式!</text>
				</view>

				<view class="bottomView_desception_example">
					<image @click="openExample(showResultImage)" :style="{width:'100%',margin:'20rpx 0'}"
						:src="showResultImage" mode=""></image>
				</view>
			</view>
		</view>
		<template #bottom>
			<view class="TranslatePages_footer">
				<view :style="{margin:'25rpx',}">
					<up-button :style="{borderRadius:'15rpx !important'}" @click="translateImages"
						type="primary">立即翻译</up-button>
				</view>
				<view :style="{margin:'25rpx'}">
					<up-button :style="{borderRadius:'15rpx !important'}" @click="saveImage1"
						type="primary">保存图片</up-button>
				</view>

			</view>
		</template>
	</z-paging>
	<up-popup :show="openPopup" round="15" @open="openPopup = true" @close="openPopup = false">
		<view class="upPopupLayout">
			<view class="upPopup" v-for="(items,index) in languageData" :key="index" @click="seletedLangs(items)">
				<text>{{items.label}}</text>
			</view>
		</view>

	</up-popup>
</template>

<script setup lang="ts">
	import ChangeFaceUploadImage from '../ChangeFaceUploadImage'
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { languageData } from '../TranslatePages/type'
	import { reactive, ref, nextTick } from 'vue';
	import { toCopyText, uploadFileBefore, saveImage } from '@/utils';
	import { useUserStore, useChatStore } from '@/store';
	import { saveFile } from '../TranslatePages/downLoadLocal';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	const currentLang = ref('英文')

	const currentLangFirst = ref('中文')
	const currentObj = reactive({
		currentLangFirstValue: 'zh',
		currentLangValue: 'en'
	})
	const { checkNumFun, checkSubmit } = useStreamHooks()
	const pagingRef = ref(null)
	const ChatStore = useChatStore()
	const currentType = ref('')
	const openPopup = ref(false)
	const showupOverlay = ref(false)
	const image1 = ref(null)
	const isTransLateLoading = ref(false)
	const { userInfo } = useUserStore()
	const { $api, $assets } = useGlobalProperties()
	const showResultImage = ref($assets.AiImageExampleImage)
	const changeLang = (type : string) => {
		currentType.value = type
		openPopup.value = !openPopup.value

	}
	const seletedLangs = ({ label, value }) => {
		if (currentType.value == 'first') {
			currentLangFirst.value = label;
			currentObj.currentLangFirstValue = value
		} else {
			currentLang.value = label;
			currentObj.currentLangValue = value
		}
		openPopup.value = false
	}

	interface LanguageItem {
		label : string;
		value : string;
	}
	const openExample = (url : string) => {
		uni.previewImage({
			urls: [url]
		})
	}
	const translateImages = async () => {
		if (!await checkNumFun('fun')) {
			return
		}
		await checkSubmit('fun')
		const datas = {
			field: "general",
			image_base64: image1.value,
			source_language: currentObj.currentLangFirstValue,
			target_language: currentObj.currentLangValue,
		}
		const imageReq = await $api.post('api/v1/translate/image', datas)
		console.log(imageReq)
		if (imageReq.code == 200) {
			uni.$u.toast('翻译成功！');
			showResultImage.value = imageReq.data
		} else {
			uni.$u.toast('翻译失败，请重试！');
		}
	}

	const saveImage1 = () => {
		saveImage(showResultImage.value)


	}
</script>

<style lang="scss">
	.TranslatePages {
		padding: 30rpx 0;
		display: flex;
		flex-direction: column;

		&_rightBox {
			flex: 1;
		}

		&_footer {
			display: flex;
			justify-content: space-between;
		}
	}

	.uploadFileTranslate {
		padding: 0 30rpx;
		display: flex;
		width: 100%;
		flex-direction: column;



		&_top {
			font-size: 27rpx;
			display: flex;
			text-align: center;
			justify-content: space-between;
			align-items: center;
		}

		&_left {
			padding: 10rpx;
			border-radius: 10rpx;
			border: 1rpx solid #ccc;
		}

		&_right {
			padding: 10rpx;
			border-radius: 10rpx;
			border: 1rpx solid #ccc;
		}

		&_middle {
			padding: 0 50rpx;

		}

		&_right {
			display: flex;
			align-items: center;
		}

		&_content {
			margin: 30rpx 0;
			border-radius: 15rpx;
		}
	}

	.upPopupLayout {
		padding: 30rpx;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	.upPopup {
		display: flex;
		justify-content: center;
		padding: 20rpx;
	}


	.overlayBox {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.noData {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 500rpx;

		&_image {
			width: 100%;
			height: 400rpx;
		}

	}


	.seletedType {
		font-size: 27rpx;
		padding: 10rpx;
		border: 1rpx solid #ccc;
		border-radius: 15rpx;
		margin: 0 20rpx;

		&_items {
			display: flex;
			align-items: center;
		}
	}



	.Zero {
		background-color: #fff;
		min-height: 400rpx;
		margin: 30rpx;
		padding: 15rpx;
		border-radius: 15rpx;
		border: 1rpx solid #ccc;
		font-size: 27rpx;
	}

	.bottom {
		margin: 30rpx;
		display: flex;

		&_button {

			// padding: \;
		}
	}

	.bottomView {

		padding: 0 30rpx;
		margin: 20rpx 0;

		&_title {
			padding: 15rpx 0;
			display: flex;
			justify-content: space-between;

			&_button {
				display: flex;
				justify-content: flex-end;
			}
		}

		&_desception {
			display: flex;
			flex-direction: column;
			font-size: 25rpx;
			color: #888;

			&_example {
				width: 100%;
			}
		}
	}
</style>