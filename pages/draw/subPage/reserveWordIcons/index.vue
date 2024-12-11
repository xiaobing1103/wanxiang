<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader defindTitle="图片反推提示词" defindPath="/pages/draw/index" />
		</template>

		<view class="body">
			<view class="body_title">
				<image class="body_title_image" :src="$assets.reserveWordHeaderIcon" mode=""></image>
				<text class="body_title_text">上传原图</text>
			</view>
			<ImageUpload v-model:parmas="parmas" v-model:url="url" type="reserveWordIcons_task_json" />
			<view class="body_title">
				<image class="body_title_image" :src="$assets.reserveContentIcon" mode=""></image>
				<text class="body_title_text">推演结果</text>
			</view>
			<view class="body_textarea">
				<up-textarea v-model="value2"
					placeholder="A road passes through the plateau, and there is a river next to it. Under the sunset, the dark red light shines on the river and the road,<lora: KK_still_life_v2:0.66>"
					height="200" maxlength="-1"></up-textarea>
				<view class="body_buttons">
					<up-button @click="copyText"
						:customStyle="{width:'50%',margin:'20rpx 0',padding:'10rpx 0',height:'60rpx'}" shape="circle"
						:disabled="!value2" size="normal" type="primary">
						<image class="body_buttons_images" :src="$assets.reserveCopyContentIcon" mode=""></image>
						<text>复制结果</text>
					</up-button>
				</view>

			</view>
		</view>

		<template #bottom>
			<view class="footer">
				<view class="footer_box">
					<view class="footerButton" @click="onSubmitImages">
						立即推演
					</view>
				</view>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import { onMounted, reactive, ref } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import ImageUpload from '../ImageUpload'
	import { useDrawStore } from '@/store';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { toCopyText } from '@/utils';
	const parmas = reactive({
		image: ''
	})
	const value2 = ref('')
	const { $assets, $api } = useGlobalProperties()

	const DrawStore = useDrawStore()
	const url = ref('')
	onMounted(() => {
		DrawStore.setSeletedDrawProject('reserveWordIcons_task_json')
	})

	const onSubmitImages = async () => {
		let formData : FormData | any
		let res : any
		// #ifdef H5
		formData = new FormData()
		formData.append('file', parmas.image)
		res = await $api.post('api/v1/img/deep_danbooru', formData)
		// #endif

		// #ifdef MP-WEIXIN
		formData = { file: parmas.image }
		res = await $api.post('api/v1/img/deep_danbooru', formData, true, {}, null, true)
		res = JSON.parse(res)
		// #endif
		if (res.code == 200) {
			uni.$u.toast('图片推演提示词成功！')
			value2.value = res.data
		} else {
			uni.$u.toast('图片推演失败,请重试！')
		}
	}
	const copyText = () => {
		toCopyText(value2.value)
	}
</script>

<style lang="scss" scope>
	.body {
		padding: 25rpx;

		&_title {
			display: flex;
			align-items: center;
			margin-top: 20rpx;

			&_image {
				width: 44rpx;
				height: 40rpx;
				margin-right: 20rpx;

			}

			&_text {
				font-size: 27rpx;
				font-weight: 700;
			}
		}

		&_textarea {
			padding: 20rpx 0;
		}
	}

	.footer {
		width: 100%;
		background: #f6f7f9;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 25rpx 0;

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
		padding: 0.78125rem;
		font-size: 0.9375rem;
		border-radius: 1.09375rem;
		height: 1.875rem;
		color: #ffffff;
		background: linear-gradient(to right, #1cd8ba, #06c0f9);
	}


	.body_buttons {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		&_images {
			width: 35rpx;
			height: 35rpx;
			margin-right: 20rpx;
		}
	}
</style>