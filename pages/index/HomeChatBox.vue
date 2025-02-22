<template>
	<view class="HomeChatBox">
		<up-icon :customStyle="{padding:'10rpx'}" name="camera" size="30"></up-icon>
		<view class="Chat" :style="{ paddingLeft: isShowCamera ? '0rpx' :  '30rpx' }">
			<textarea @keyboardheightchange="keyboardheightchange" :adjust-position="isIOS" :show-confirm-bar="false"
				auto-height disable-default-padding
				:style="{margin:'0rpx' , overflow: 'scroll',maxHeight:'100rpx', padding:'10rpx', fontSize:'30rpx', width:'100%'}"
				maxlength="-1" placeholder="请输入内容" border="surround" v-model="chatValue"></textarea>
		</view>
		<view class="right">
			<!-- activeSend : ChatStore.loadingMessage ? -->
			<image @click="ClickMessage" class="image" :src="chatValue ?  activeSend : send" mode=""></image>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { onLoad } from '@dcloudio/uni-app'
	import { ref, watch } from 'vue';
	import activeSend from '@/static/activeSend.svg'
	import send from '@/static/send.svg'
	import { useChatStore } from '@/store';
	const chatValue = ref('')
	const ChatStore = useChatStore()
	const isShowCamera = ref(true)
	const KeyHight = defineModel('KeyHight')
	
	const isIOS = ref(false)
	// 检查平台
	// // #ifdef MP-WEIXIN 
	// onLoad(() => {
	// 	const system = uni.getSystemInfoSync()
	// 	isIOS.value = syste·m.platform === 'ios'
	// })
	// // #endif 
	const ClickMessage = (e) => {
		if (!chatValue.value) {
			uni.$u.toast('请先输入内容后再进行对话！');
			return
		}
		ChatStore.setLoadingMessage(false)
		uni.navigateTo({
			url: `/pages/index/subPage/AllChatPage/index?keywords=${chatValue.value}`,
			success: () => {
				chatValue.value = ''
			}
		})
	}
	const keyboardheightchange = (event : any) => {
		// iOS小程序不处理键盘高度变化
		if (isIOS.value) return
		KeyHight.value = event.detail.height
		console.log('键盘高度变化', event.detail.height)
	}
</script>

<style lang="scss" scoped>
	.HomeChatBox {
		display: flex;
		margin: 18rpx 30rpx;
		border-radius: 10rpx;
		align-items: center;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
		min-height: 90rpx;
		background-color: #fff;

		.Chat {
			flex: 1;
			height: 100%;
		}

		.right {
			padding: 0 20rpx;

			.image {
				height: 56rpx;
				width: 56rpx;
			}
		}
	}
</style>