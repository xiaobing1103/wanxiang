<template>
	<z-paging fixed ref="srollRef" safe-area-inset-bottom :pagingStyle="{ 		
		backgroundImage:`url(${$assets.OverBGImage})`, 
		backgroundRepeat: 'repeat',
		padding: '0 ' ,
		backgroundSize: 'cover',
		backgroundPosition: '-491px 0px'}">
		<template #top>
			<NewIndexHeader />
			<NewIndexTabbar />
		</template>
		<template v-if="ChatStore.isShowSearchTabbar == 'HomeTemPlate'">
			<IndexMainBox />
		</template>
		<template v-if="ChatStore.isShowSearchTabbar == 'DeepSeekTemplate'">
			<!-- <IndexMainBox /> -->
		</template>
		<template v-if="ChatStore.isShowSearchTabbar == 'AiAgentTemplate'">
			<!-- <IndexMainBox /> -->
		</template>

		<template #bottom>
			<view class="chatAll">
				<view class="chatInput">
					<view class="chatInput_left">
						<image class="chatInput_left_image" src="@/static/image.svg" mode=""></image>
					</view>

					<view class="chatInput_input">
						<textarea :adjust-position="false" cursor-spacing="100rpx" :show-confirm-bar="false" auto-hei
							ght disable-default-padding
							:style="{margin:'0rpx' ,overflow: 'scroll',maxHeight:'100rpx', padding:'0rpx', fontSize:'30rpx', width:'100%'}"
							maxlength="-1" placeholder="请输入内容" border="surround" v-model="chatValue"></textarea>
					</view>
					<view class="chatInput_right">
						<image class="chatInput_right_image" :src="chatValue ? 
						activeSend : ChatStore.loadingMessage ?  stop : send" mode=""></image>
					</view>
				</view>
			</view>
			<m-tabbar native safeBottom></m-tabbar>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import NewIndexHeader from './NewIndexHeader.vue';
	import NewIndexTabbar from './NewIndexTabbar.vue';
	import activeSend from '@/static/activeSend.svg'
	import stop from '@/static/stop.svg'
	import send from '@/static/send.svg'
	const chatValue = defineModel<string>("chatValue")
	import IndexMainBox from './IndexMainBox.vue'
	import { useChatStore } from '@/store';
	import { ref } from 'vue';
	const ChatStore = useChatStore()
	const searchContent = ref('')
	// const search = () => {
	// 	if (this.isBlank(this.searchContent)) {
	// 		this.$toast("输入股票代码/首字母");
	// 		return;
	// 	}
	// 	if (this.tab == 1) {
	// 		this.search_index(this.searchContent);
	// 	} else if (this.tab == 2) {
	// 	} else if (this.tab == 3) {
	// 	}
	// }
</script>

<style lang="scss" scoped>
	.chatAll {
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		padding: 0 30rpx;
		margin-bottom: 15rpx;
		max-height: 90rpx;
		z-index: 900;
	}

	.chatInput {
		width: 100%;
		display: flex;
		background-color: #fff;
		box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.1);
		border-radius: 40rpx;
		align-items: center;

		&_left {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			height: 100%;

			&_image {
				height: 40rpx;
				width: 40rpx;
				padding: 25rpx 25rpx;
			}
		}

		&_input {
			width: 100%;
			flex: 1;
			background-color: white;
			overflow: hidden;
			height: auto;
			padding: 20rpx 0;

		}

		&_right {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			height: 100%;

			&_image {
				height: 50rpx;
				width: 50rpx;
				padding: 20rpx 20rpx;
			}
		}
	}

	.input-text {
		margin-left: 20rpx;
		margin-right: 20rpx;
		width: 100%;
		font-size: 32rpx;
	}
</style>