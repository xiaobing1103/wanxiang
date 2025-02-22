<template>
	<view class="ChangeModelButton">
		<view class="ChangeModelButton_box">
			<view @longpress="longpress" class="ChangeModelButton_box_button" :style="{ 
					border : seletedModel  == chatStore.model ?  '1px solid #abc8f4;' : '',
					background: seletedModel  == chatStore.model ?  'rgb(223, 236, 255)' : '',
					color: seletedModel == chatStore.model ? '#0066ff' : '' }" @click="openPicker(seletedModel)">
				<image class="ChangeModelButton_box_image"
					:src="seletedModel  == chatStore.model ?  $assets.activeLianWang: $assets.DeepSeekModalThinkIngIcon"
					mode=""></image>
				深度思考（{{showR1Name}}）
			</view>

			<view :style="{marginLeft:'20rpx',
			 border :  chatStore.openLianWangModel ?  '1px solid #abc8f4;' : '',
			 background:  chatStore.openLianWangModel ?  'rgb(223, 236, 255)' : '',
			 color:  chatStore.openLianWangModel ? '#0066ff' : ''
			 }" class="ChangeModelButton_box_button" @click="openlianwang()">
				<image class="ChangeModelButton_box_image"
					:src=" chatStore.openLianWangModel ? $assets.activeLianwangIcon :$assets.lianwangIcon" mode="">
				</image>
				联网搜索
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { useChatStore } from '@/store';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { columns, commonModel } from '@/config/modelConfig';
	import { ref, watch } from 'vue';

	const chatStore = useChatStore()
	const { $assets } = useGlobalProperties()
	const seletedModel = ref('')
	const showR1Name = ref('R1')
	const isR1Models = ['DeepSeek_R1', 'deepseek_r1_qwen_32b', 'deepseek_r1_qwen_70b']

	// 监听 model 变化
	watch(() => chatStore.model, (newModel) => {
		if (isR1Models.includes(newModel)) {
			showR1Name.value = commonModel[newModel].R1Name
			seletedModel.value = newModel
		}
	}, { immediate: true })

	const openPicker = () => {
		if (chatStore.loadingMessage) {
			uni.$u.toast('请等待消息回复完成...');
			return
		}
		// 如果当前是 R1 相关模型，切换到 v35
		if (isR1Models.includes(chatStore.model)) {
			seletedModel.value = ''
			chatStore.setModel('v35')
			chatStore.changeSelectChatId('')
		} else {
			// 如果当前不是 R1 模型，切换到 DeepSeek_R1
			seletedModel.value = 'DeepSeek_R1'
			showR1Name.value = commonModel['DeepSeek_R1'].R1Name
			chatStore.setModel('DeepSeek_R1')
			chatStore.changeSelectChatId('')
		}
	}

	const longpress = () => {
		console.log(123)
	}
	const openlianwang = () => {
		if (chatStore.loadingMessage) {
			uni.$u.toast('请等待消息回复完成...');
			return
		}
		chatStore.setopenLianWangModel(!chatStore.openLianWangModel)
		if (chatStore.openLianWangModel && !chatStore.isDeepSeekModels.includes(chatStore.model)) {
			uni.navigateTo({
				url: '/pages/function/subPage/AIaiAgent/mainPages?id=659e54b1b8006379b4b2abd6',
				success: () => {
					chatStore.setopenLianWangModel(false)

				}
			})
		}
	}
</script>
<style lang="scss" scoped>
	.ChangeModelButton {
		display: flex;
		justify-content: flex-start;
		width: 100%;
		padding: 0 30rpx;
		padding-bottom: 10rpx;

		&_box {
			display: flex;
			width: 100%;
			font-size: 20rpx;
			margin-right: 20rpx;

			&_button {
				height: 55rpx;
				border-radius: 50rpx;
				border: 0rpx;
				width: max-content;
				font-size: 22rpx;
				background: #fff;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				padding: 15rpx;
				border: 1rpx solid #ccc;
			}

			&_image {
				padding-right: 10rpx;
				width: 30rpx;
				height: 30rpx;
			}
		}
	}
</style>