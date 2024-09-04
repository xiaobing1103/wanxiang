<template>
	<template v-if="IamgeTypes.historyType !== 'txt2img_task_json'">
		<ImageUpload v-model:parmas="parmas" v-model:url="url" :type="IamgeTypes.historyType" ref="ImageUploadRef" />
	</template>
	<PreviewImageArae v-model:parmas="parmas" />
	<UseAiChatConfirm />
	<ReversePromptUploadedImage />
	<ChangeView v-model:parmas="parmas" :IamgeTypes='IamgeTypes' />
	<view class="footer">
		<view class="footer_box">
			<view @click="submit" class="footerButton">AI生成(消耗1次)</view>
		</view>
	</view>
</template>

<script setup lang='ts'>
	import PreviewImageArae from './PreviewImageArae'
	import UseAiChatConfirm from './UseAiChatConfirm'
	import ImageUpload from './ImageUpload'
	import ReversePromptUploadedImage from './ReversePromptUploadedImage'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import ChangeView from './ChangeView/index'
	import {
		Image2TextParmas,
		ImageProjectTypes
	} from '../data';
	import {
		onMounted,
		ref
	} from 'vue';
	import {
		useGlobalProperties
	} from '@/hooks/useGlobalHooks';
	import {
		useDrawStore
	} from '@/store';

	import {
		deepClone
	} from '@/utils/deepClone';
	const {
		$api
	} = useGlobalProperties()
	const props = defineProps < {
		IamgeTypes: ImageProjectTypes,
		parmas ? : Image2TextParmas
	} > ()
	const url = ref('');
	const ImageUploadRef = ref(null)
	const parmas = ref < Image2TextParmas > (props.parmas)
	const drawStore = useDrawStore()
	onMounted(() => {
		drawStore.setSeletedDrawProject(props.IamgeTypes.historyType)
	})
	// 	
	const reversNums = (newParmas: Image2TextParmas) => {
		if (props.IamgeTypes.DifferenceStrength) {
			newParmas.denoising_strength += props.IamgeTypes.DifferenceStrength
		}
	}

	const getQueueTask = async () => {
		let file = parmas.value.image
		let newParmas: Image2TextParmas = deepClone({
			...parmas.value,
			image: undefined
		})
		reversNums(newParmas)

		if (props.IamgeTypes.historyType == "img2img_task_json" || props.IamgeTypes.historyType ==
			"image2cartoon_task_json" || props.IamgeTypes.historyType == "partialRepaint_task_json") {

			let formdata: Image2TextParmas | FormData
			// #ifdef H5
			formdata = new FormData()
			for (const key in newParmas) {
				if (key !== 'image') {
					formdata.append(key, newParmas[key])
				}
			}
			formdata.append('image', file)
			newParmas = formdata
			// #endif

			// #ifdef MP-WEIXIN
			newParmas.image = file
			// #endif
		} else {
			newParmas.image = file
		}
		// 把当前的请求parmas保存到vuex 为了再来一次功能
		drawStore.setCurrentParmasData(newParmas)
		drawStore.getTask(newParmas)
	}

	const submit = async () => {
		// 图生图
		if (props.IamgeTypes.historyType == 'img2img_task_json' && !parmas.value.image) {
			uni.$u.toast('请上传图片后再继续！')
			return
		}
		// 文生图
		if (props.IamgeTypes.historyType == 'txt2img_task_json' && !parmas.value.prompt) {
			uni.$u.toast('请输入生成文案！')
			return
		}
		// 线稿生徒
		if (props.IamgeTypes.historyType == 'coloringLineArt_task_json' && !parmas.value.image) {
			uni.$u.toast('请上传图片后再继续！')
			return
		}


		await getQueueTask()

	}


	onLoad(async (query) => {
		if (query.temImages) {
			url.value = query.temImages
		}

		// if (query.id) {
		// 	const res = await $api.get(`api/v1/img/publishInfo?id=${query.id}`)
		// 	debugger
		// 	if (res.code == 200) {
		// 		console.log(res)
		// 	}
		// }
	});

	onMounted(() => {
		if (ImageUploadRef.value && url.value) {
			ImageUploadRef.value.hanlderImages(url.value)
		}
	})
</script>

<style lang="scss">
	.footer {
		position: sticky;
		bottom: 0;
		z-index: 1;
		height: 80rpx;
		z-index: 1000;
		width: 100%;
		background: $aichat-golbal-background;
		display: flex;
		justify-content: center;
		align-items: center;

		&_box {
			width: 60%;

		}
	}

	.footerButton {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: 25rpx;
		font-size: 30rpx;
		border-radius: 1.09375rem;
		height: 60rpx;
		color: #ffffff;

		background: linear-gradient(to right, #1cd8ba, #06c0f9);
		cursor: pointer;
	}
</style>