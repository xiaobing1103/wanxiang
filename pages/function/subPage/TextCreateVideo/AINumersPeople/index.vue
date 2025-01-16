<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'0 40rpx'}">
		<template #top>
			<CommonHeader defindTitle="AI数字人" />
		</template>

		<view class="AINumersPeople">
			<view class="restNums">
				<view class="restNums_box">
					<up-button @click="toVipPages"
						:customStyle="{background:'linear-gradient(to right, #314cd7, #ae1dfd)',width:'100%',height:'60rpx',borderRadius:'15rpx',color:'white',whiteSpace:'nowrap'}">
						<image class="restNums_box_icon" :src="$assets.createVideoVipIcon" mode=""></image>
						<view :style="{marginRight:'10rpx', whiteSpace:'nowrap'}">剩余次数</view>
						<view>{{restNum}}</view>

					</up-button>

				</view>
				<view class="restNums_history" @click="toHistory">
					历史记录
				</view>
			</view>
			<view class="AINumersPeople_seletedImage">
				<view class="label">
					选择音色
				</view>
				<view @click="showPicker = true" class="AINumersPeople_seletedImage_values">
					<text>{{seletedVioceName}}</text>
					<up-icon name="arrow-down" size="17"></up-icon>
				</view>
			</view>
			<view class="AINumersPeople_uploadImage">
				<view class="label">
					选择图片
				</view>
				<image @click="preimage(avatars[seletedAvatarId]?.url)" class="AINumersPeople_uploadImage_seletedImage"
					:src="avatars[seletedAvatarId]?.url" mode="aspectFill">
				</image>
				<view class="AINumersPeople_uploadImage_items">
					<template v-for="(items,index) in avatars" :key="index">
						<view @click="seletedAvatarId = items.id"
							:class="{AINumersPeople_uploadImage_seleted:true,itemActive:seletedAvatarId == items.id}">
							<image class="AINumersPeople_uploadImage_seleted_image" :src="items.url" mode="aspectFill">
							</image>
						</view>
					</template>
				</view>
			</view>
			<view class="AINumersPeople_readText">
				<view class="label">
					朗读文案
				</view>
				<view class="AINumersPeople_readText_content">
					<up-textarea v-model="text" placeholder="请输入需要朗读的内容" count maxlength="500"></up-textarea>
				</view>
			</view>
		</view>

		<template #bottom>
			<view class="bottom">
				<up-button
					:customStyle="{width:'80%',border:'0rpx',borderRadius:'50rpx',background:'linear-gradient(to right,#314cd7,#ae1dfd)',height:'60rpx',color:'white'}"
					@click="fastCreate">立即生成</up-button>
			</view>
		</template>
	</z-paging>
	<up-picker @confirm="confirmValue" @cancel="showPicker = false" :show="showPicker" :columns="[voice]"
		keyName="speechType">
	</up-picker>
	<VideoItems v-model:SoraPromptPramas="SoraPromptPramas" />

</template>

<script setup lang="ts">
	import VideoItems from '../../CommonComponents/AIVideoCommon/VideoItems.vue'
	import { VideoVmodalType } from '../../CommonComponents/AIVideoCommon/datas';
	import { ref, onMounted, reactive } from 'vue';
	import { vioceType } from './datas'
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useMusicStore } from '@/store';
	const showPicker = ref(false)
	const seletedAvatarId = ref(0)
	const text = ref('')
	const seletedVoiceId = ref(85)
	const seletedVioceName = ref('广东普通话')
	const MusicStore = useMusicStore()
	const SoraPromptPramas = reactive<VideoVmodalType>({
		showVideo: false,
		playVideo: '',
		isQuery: false
	})
	const { $api } = useGlobalProperties()
	const avatars = ref<{ id : number, url : string }[] | []>([])
	const voice = ref<vioceType | []>([])
	const restNum = ref(0)
	onMounted(() => {
		getDatas()
		getCounts()
	})
	const toVipPages = () => {
		uni.navigateTo({
			url: "/pages/function/subPage/VideoVip/index"
		})
	}
	const getCounts = async () => {
		const countReq = await $api.post('api/v1/video/count', {})
		if (countReq.code == 200) {
			restNum.value = countReq.data
		}
	}

	const getDatas = async () => {
		const DeepDanbooruModelReq = await $api.get('api/v1/video/deep_danbooru_model')
		if (DeepDanbooruModelReq.code == 200) {
			avatars.value = DeepDanbooruModelReq.data.avatar
			voice.value = DeepDanbooruModelReq.data.voice

		} else {
			uni.$u.toast(DeepDanbooruModelReq.msg)
		}
	}

	const preimage = (url : string) => {
		uni.previewImage({
			urls: [url]
		})
	}
	const confirmValue = ({ value }) => {
		console.log(value[0].sdp)
		seletedVoiceId.value = value[0].sdp
		seletedVioceName.value = value[0].speechType
		showPicker.value = false
	}
	const fastCreate = async () => {
		if (!text.value) {
			uni.$u.toast('请先输入朗读文案！')
			return
		}
		const parmas = {
			avatar_id: seletedAvatarId.value,
			lenght: 1,
			text: text.value,
			voice_id: seletedVoiceId.value
		}
		const danbooruReq = await $api.post('api/v1/video/deep_danbooru', parmas)
		if (danbooruReq.code == 200) {
			SoraPromptPramas.playVideo = danbooruReq.url
			SoraPromptPramas.showVideo = true
			MusicStore.addNumbersPeopleHistoryData({
				url: danbooruReq.url,
				title: text.value,
			})

			getCounts()
		} else {
			uni.$u.toast(danbooruReq.msg)
		}
	}
	const toHistory = () => {
		uni.navigateTo({
			url: '/pages/function/subPage/TextCreateVideo/videoHistory/index?type=numbersPeople'
		})
	}
</script>

<style lang="scss" scoped>
	.AINumersPeople {
		display: flex;
		flex-direction: column;

		&_seletedImage {
			padding: 25rpx 0;

			&_values {
				margin: 24rpx 0;
				align-items: center;
				display: flex;
				justify-content: space-between;
				font-size: 27rpx;
				width: 100%;
				border: 1rpx solid #ccc;
				padding: 10rpx;
				border-radius: 15rpx;
			}
		}

		&_uploadImage {
			margin-bottom: 24rpx;

			&_seletedImage {
				width: 100%;
				height: 400rpx;
				border-radius: 20rpx;
				margin: 24rpx 0;
			}

			&_items {
				display: grid;
				grid-template-columns: repeat(24, 3fr);
				grid-gap: 24rpx;
				overflow: scroll;
			}

			&_seleted {
				display: flex;
				border-radius: 20rpx;
				padding: 10rpx;
				border: 1rpx solid transparent;

				&_image {
					border-radius: 20rpx;
					height: 160rpx;
					width: 160rpx;
				}
			}
		}

		&_readText {


			&_content {
				margin: 24rpx 0;
				border: 1rpx solid #ccc;
				padding: 5rpx;
				border-radius: 15rpx;
			}
		}
	}

	.label {
		position: relative;
		font-size: 30rpx;
		font-weight: 800;
		padding: 0 15rpx;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 8rpx;
			background-color: #1677ff;
			border-radius: 4rpx;
		}
	}

	.itemActive {
		border: 1rpx solid #1677ff;
	}

	.bottom {
		padding-top: 10rpx;
		padding-bottom: 40rpx;
	}

	.restNums {
		width: 100%;
		justify-content: space-between;
		display: flex;
		align-items: center;
		padding-top: 30rpx;

		&_box {
			display: flex;
			font-size: 20rpx;
			align-items: center;

			&_icon {
				width: 36rpx;
				height: 36rpx;
				margin: 0 20rpx;
			}
		}

		&_history {
			color: #1677ff;
		}
	}
</style>