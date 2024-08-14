<template>
	<template v-if="IamgeTypes.type == 'image2image'">
		<ImageUpload v-model:parmas="parmas" />
	</template>
	<PreviewImageArae v-model:parmas="parmas" />
	<UseAiChatConfirm />
	<ReversePromptUploadedImage />
	<ChangeView v-model:parmas="parmas" />
	<view class="footer">
		<view class="footer_box">
			<up-button @click="submit" class="footerButton" text="AI生成(消耗1次)"></up-button>
		</view>
	</view>
</template>

<script setup lang='ts'>
	import PreviewImageArae from './PreviewImageArae'
	import UseAiChatConfirm from './UseAiChatConfirm'
	import ImageUpload from './ImageUpload'
	import ReversePromptUploadedImage from './ReversePromptUploadedImage'
	import ChangeView from './ChangeView/index'
	import {
		Image2TextParmas
	} from '../data';
	import {
		ref
	} from 'vue';
	import {
		useGlobalProperties
	} from '@/hooks/useGlobalHooks';
	import {
		useDrawStore
	} from '../../../store';
	import {
		drawTaskJson,
		taskIdTypeKey
	} from '../../../store/draw';
	import fly from 'flyio'
	// !// #ifdef MP-WEIXIN
	import FormData from '@/tools/FormData.js'
	// #endif

	const {
		$api
	} = useGlobalProperties()
	const props = defineProps < {
		IamgeTypes: {
			type: string,
			historyType: taskIdTypeKey,
			api: string
		}
	} > ()
	const parmas = ref < Image2TextParmas > ({
		cfg_scale: 7,
		height: 512,
		hire: 0,
		loraId: "fc1be0561c11fe7019f4424f5e7b2c85",
		loraScale: 66,
		model: "fd422ef3f7285ee610eee4d150ca87c9",
		negative_prompt: "easynegative, (worst quality:1.3), (low quality:1), (normal quality:1.4), lowres,skin spots, acnes, skin blemishes, age spot, glan, extra fingers, fewer fingers, strange fingers, bad hand, bad anatomy, fused fingers, missing leg, mutated hand, malformed limbs, missing feet,multiple legs,men,boy,logo, loli,3d,extra hands,extra foots",
		num: 2,
		prompt: "",
		seed: -1,
		simpler: "DPM++ SDE Karras",
		step: 20,
		width: 512,
		textScale: 6,
		image: null
	})


	const drawStore = useDrawStore()
	const TaskID = ref('')
	const getQueueTask = async () => {
		let newParmas: FormData | Image2TextParmas = parmas.value
		if (props.IamgeTypes.historyType == "img2img_task_json") {
			let formdata = new FormData()
			// #ifdef MP-WEIXIN
			for (const key in parmas.value) {
				formdata.append(key, parmas.value[key])
			}
			formdata.appendFile('image', parmas.value.image)
			const data = formdata.getData();
			newParmas = data
			// #endif

			// #ifdef H5
			for (const key in parmas.value) {
				formdata.append(key, parmas.value[key])
			}
			formdata.append('image', parmas.value.image)
			newParmas = formdata
			// #endif

		}
		const taskDTO = await $api.post < Image2TextParmas > (props.IamgeTypes.api, newParmas, false)
		if (taskDTO.code == 200) {
			TaskID.value = taskDTO.data.task_id
		} else {
			uni.$u.toast(taskDTO.msg)
		}
	}


	const submit = async () => {
		// if (props.IamgeTypes.historyType == 'img2img_task_json' && parmas.value.image) {
		// 	console.log(parmas)
		// 	uni.$u.toast('请上传图片后再继续！')
		// 	return
		// }
		if (props.IamgeTypes.historyType !== 'img2img_task_json' && !parmas.value.prompt) {
			uni.$u.toast('请输入生成文案！')
			return
		}

		// let data = {
		// 	'userId': 'a85e5678-419d-4e8f-8da0-c961b4186333',
		// 	'package': 'io.changchun.app',
		// 	'taskId': 1,
		// 	'taskName': 'test2',
		// 	// "injectObject":'{"url":"/pages/myMission/myMission"}'
		// }
		// let formData = new FormData()
		// Object.keys(data).forEach((index) => {
		// 	formData.append(index, data[index])
		// })

		// fly.post('https://ai1foo.com/api/v1/img/img2img', {
		// 	...formData
		// }, {
		// 	headers: {

		// 		"content-type": "multipart/form-data"
		// 	}
		// })

		await getQueueTask()
		// 查询队列
		if (TaskID.value) {
			const taskType: taskIdTypeKey = props.IamgeTypes.historyType;
			// 获取当前的任务数据
			const currentData = drawStore.taskIdParmas[taskType];
			drawStore.setTaskIdParmas(taskType, {
				'task_id': TaskID.value,
				historyTasks: currentData.historyTasks as drawTaskJson[]
			})
			uni.navigateTo({
				url: `/pages/draw/subPage/QueueQueryPage/index`
			})
		} else {
			uni.$u.toast('任务id错误！')
		}
	}
</script>

<style lang="scss">
	.footer {
		position: sticky;
		bottom: 0;
		z-index: 1;
		height: 80rpx;
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
		border-radius: 35rpx !important;
		height: 60rpx !important;
		color: $uni-bg-color !important;
		background: linear-gradient(to right, #1cd8ba, #06c0f9)
	}
</style>