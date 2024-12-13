<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<template v-if="!showOverlay">
				<CommonHeader defindTitle="真人转3D" />
			</template>
		</template>
		<view class="aiRever3D">
			<ChangeFaceUploadImage noUseCorpImage v-model:showupOverlay="showupOverlay" v-model:images="parmas.imageUrl"
				v-model:FileMode="parmas.FileMode" />
			<Revers3DTem v-model:parmas="parmas" />
		</view>
		<template #bottom>
			<template v-if="!showOverlay">
				<up-button :customStyle="btnStyles" @click="create3D">开始生成</up-button>
			</template>
		</template>
	</z-paging>
	<up-overlay z-index="10" :show="showOverlay">
		<view class="overlayMusicHeader">
			<view class="loadingMusicHeader" :style="{height: navBarHeight + 'px' }">
				<view :style="{paddingTop:menuButtonInfo?.top + 'px'}">
					<view class="loadingMusicHeader_title">
						<up-icon @click="backPage" name="arrow-left"></up-icon>
						<text>等待图片生成</text>
						<view class=""></view>
					</view>
				</view>
			</view>
			<view class="loadingMusic">
				<view class="loadingMusic_loading">
					<template v-if="waitPages">
						<view class="waitPagespages">
							<image @click="previewImage(parmas.showImg[0])" show-menu-by-longpress
								class="waitPagespages_images" :src="parmas.showImg[0]" />

							<view class="waitPagespages_bottom">
								<template v-for="(items,index) in parmas.showImg" :key="index">
									<image @click="previewImage(items)" show-menu-by-longpress
										class="waitPagespages_images" :src="items" />
								</template>

							</view>
							<view class="tips">
								图片不会保存在本地，请长按保存图片
							</view>
						</view>
					</template>
					<template v-else>
						<ZuiProgressCircle :range="[0, 360]" :position="progress" :ringWidth="20" :fixOverlay="true"
							:texture="gradientTexture" :direction="'clockwise'" :linecap="'round'">
							<view class="circle_view">
								<text class="circle_view_text">{{ (progress * 100).toFixed(0) }} %</text>
							</view>
						</ZuiProgressCircle>
						<text class="circle_view_desc">{{message}}</text>
					</template>
				</view>
			</view>
		</view>
	</up-overlay>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue'
	import ChangeFaceUploadImage from '../CommonChangeFace/ChangeFaceUploadImage.vue'
	import Revers3DTem from './Revers3DTem.vue'
	import ZuiProgressCircle from '../ZuiProgressCircle/components/zui-progress-circle/zui-progress-circle.vue'
	import { reactive, ref } from 'vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	import { parmasTypes } from './types'
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import { useCounterStore } from '@/store';
	import { storeToRefs } from "pinia"
	const gradientTexture = [
		[
			45,
			'#FF66B2',
			'#6A0D91'
		],
		[
			135,
			'#E0F7FA',
			'#00796B'
		]
	];
	const { checkNumFun, checkSubmit } = useStreamHooks()
	const { $api } = useGlobalProperties()
	const showOverlay = ref(false)
	const showupOverlay = ref(false)
	const waitPages = ref(false)
	const progress = ref(0.01)
	const message = ref('')
	//  #ifdef MP-WEIXIN
	const system = useCounterStore()
	const { statusBarHeight, menuButtonInfo, navBarHeight } = storeToRefs(system)
	statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight
	menuButtonInfo.value = uni.getMenuButtonBoundingClientRect()
	navBarHeight.value = menuButtonInfo.value.height + statusBarHeight.value + 10
	// #endif
	const btnStyles = {
		margin: "30rpx auto",
		height: '70rpx',
		borderRadius: '100rpx',
		border: '0rpx',
		width: '70%',
		color: 'white',
		background: 'linear-gradient(to right, rgb(49, 76, 215), rgb(174, 29, 253)'
	}
	const parmas = reactive<parmasTypes>({
		seletedNumber: 1,
		face_restoration: 0,
		hand_restoration: 0,
		denoising_strength: 6,
		steps: 20,
		batch_size: 1,
		imageUrl: '',
		prompt: '',
		FileMode: null,
		width: '',
		height: '',
		showImg: []
	})
	const previewImage = (url : string) => {
		uni.previewImage({
			urls: [url],

		})
	}
	const create3D = async () => {
		const PromptPromise = await imgPropmt()
		if (!PromptPromise) {
			uni.$u.toast('prompt解析失败请重新解析！');
			return
		}
		if (checkNumFun('draw')) {
			const img3DPro = await img3D()
			if (!img3DPro) {
				uni.$u.toast('3D模型解析失败请重新解析！');
				return
			}
			queryTask(img3DPro)

		}
	}

	const imgPropmt = () => {
		return new Promise(async (resolve, reject) => {
			let formdata : any = null
			let isJson = false
			let isWechatSendImages = false
			// #ifdef H5
			formdata = new FormData()
			formdata.append('img', parmas.FileMode)
			// #endif
			// #ifdef MP-WEIXIN
			formdata = { img: parmas.FileMode }
			isJson = true
			isWechatSendImages = true
			// #endif
			const imgPropmtReq = await $api.post('api/v1/img/prompt', formdata, isJson, {}, null, isWechatSendImages)
			if (imgPropmtReq.code == 0) {
				parmas.prompt = imgPropmtReq.data
				parmas.width = imgPropmtReq.width
				parmas.height = imgPropmtReq.height
				resolve(true)
			} else {
				reject(false)
			}
		})
	}

	const img3D = () => {
		return new Promise(async (resolve, reject) => {
			const data = {
				"lora": {
					"lora_prompt": "<lora:kk-3d:1>,3D,kk(3d character),"
				},
				"loraId": "",
				"option": {
					"sd_checkpoints_limit": 5,
					"CLIP_stop_at_last_layers": 2,
					"sd_model_checkpoint": "IP DESIGN _ 3D可爱化模型_V4.0.safetensors"
				},
				"param": {
					"batch_size": parmas.batch_size,
					"face_restoration": parmas.face_restoration,
					"hand_restoration": parmas.hand_restoration,
					"denoising_strength": parmas.denoising_strength / 10,
					"width": parmas.width,
					"steps": parmas.steps,
					"height": parmas.height,
					"prompt": "1boy, male focus, glasses, solo, shirt, black hair, smile, realistic, white shirt, looking at viewer, upper body, blurry, blurry background, collared shirt",
					"init_images": [parmas.imageUrl],
					"cfg_scale": 7,
					"inpainting_mask_invert": 1,
					"negative_prompt": "EasyNegative,ng_deepnegative_v1_75t",
					"sampler_name": "DPM++ 2M",
					"scheduler": "Karras",
					"seed": -1,
					"translate": 0
				}
			}
			const Ima3dReq = await $api.post('api/v1/img/3d', data)
			if (Ima3dReq.code == 0) {
				progress.value = 0
				showOverlay.value = true
				waitPages.value = false
				resolve(Ima3dReq.task_id)
			} else {
				reject(false)
			}
		})
	}
	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	const queryTask = async (taskId : string) => {
		const queryReq = await $api.post('api/v1/img/3d_query', { task_id: taskId })
		if (queryReq.code == 1) {
			await delay(3000)
			queryTask(taskId)
			progress.value += 5 / 100;
			return
		}
		if (queryReq.code == 2) {
			await delay(3000)
			queryTask(taskId)
			return
		}
		if (queryReq.code == 0) {
			await checkSubmit('draw')
			waitPages.value = true
			parmas.showImg = queryReq.msg.images
		}
	}
	const backPage = () => {
		showOverlay.value = false
	}
</script>


<style lang="scss">
	.aiRever3D {
		display: flex;
		flex-direction: column;
	}

	.overlayMusicHeader {
		width: 100%;
		height: 100%;
		background-color: #fff;

	}

	.loadingMusicHeader {
		font-weight: 800;
		font-size: 30rpx;

		&_title {
			padding: 18rpx;
			display: flex;
			justify-content: space-between;

		}
	}

	.loadingMusic {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		padding: 20rpx 0;

		&_loading {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		&_desc {
			display: flex;
			font-weight: 800;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}

	.circle_view {
		display: flex;
		align-items: center;
		flex-direction: column;
		height: 100%;
		justify-content: center;


		&_text {
			font-size: 40rpx;
			font-weight: 1000;
		}

		&_desc {
			display: block;
			margin: 50rpx 0;
			font-size: 30rpx;
			text-align: center;
		}
	}

	.waitPagespages {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		&_images {
			width: 500rpx;
			height: 300rpx;
			margin: 20rpx;
		}

		&_bottom {
			width: 100vw;
			display: grid;
			overflow: scroll;
			margin: 20px 0;
			grid-template-columns: repeat(4, 1fr);

		}
	}

	.tips {
		font-size: 30rpx;
		font-weight: 800;
	}
</style>