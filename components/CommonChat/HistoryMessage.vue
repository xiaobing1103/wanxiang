<template>
	<up-popup :show="chatStore.openHistoryModel" mode="left" @close="close" @open="open">
		<view :style="{paddingTop:screenStore.safeTopHeight + 'rpx'}" class="historyBox">
			<view class="historyBox_header">
				<up-button size="small" type="primary" @click="addChat"
					class="historyBox_header_button">新建对话</up-button>
			</view>
			<up-line></up-line>
			<view class="historyBox_main">
				<template v-for="(item,index) in chatStore.chats" :key="index">
					<view
						:style="{background: item.id ==  chatStore.selectChatId  ? '#3c9cff' : '',color: item.id ==  chatStore.selectChatId  ? '#fff' : ''}"
						class="historyBox_main_box" @click="changeChat(item.id,item.model)">
						<view class="historyBox_main_box_left">
							<image class="historyBox_main_box_icon" :src="item.iconUrl" mode=""></image>
							<text class="historyBox_main_box_text">{{item.title}}</text>
						</view>

						<up-icon @click="deleteChat" stop name="close" size="15"></up-icon>
					</view>
				</template>
			</view>
			<view class="historyBox_footer">

			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import { useChatStore, useScreenStore } from '@/store';
	import { ModelType } from '@/type/chatData';
	const screenStore = useScreenStore()
	const chatStore = useChatStore()
	const open = () => {
		chatStore.setopenHistoryModel(true)
	}
	const close = () => {
		chatStore.setopenHistoryModel(false)
	}
	const addChat = () => {
		chatStore.initChatInfo(true)
	}
	const deleteChat = () => {
		chatStore.delChats(chatStore.selectChatId)
	}
	const changeChat = (id : string, model : ModelType) => {
		chatStore.changeSelectChatId(id)
		chatStore.setModel(model)
	}
</script>
<style lang="scss">
	.historyBox {
		width: 50vw;
		background-color: white;
		border-radius: 30rpx;
		display: flex;
		flex-direction: column;

		&_view {

			display: flex;
			align-items: center;
			justify-content: center;

			&_image {
				height: 50rpx;
				width: 50rpx;
				padding: 0 20rpx;
			}

			&_text {
				font-size: 27rpx;
			}
		}

		&_header {
			display: flex;
			justify-content: center;
			width: 100%;
			padding: 30rpx;
			box-sizing: border-box;

			&_button {
				width: 80% !important;
			}
		}

		&_main {
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;


			&_box {
				display: flex;
				align-items: center;
				// background-color: #eaeaee;
				justify-content: space-between;
				border-radius: 10rpx;
				padding: 10rpx;
				margin-top: 20rpx;
				border: 2rpx solid #eaeaee;


				&_left {
					display: flex;
					align-items: center;
				}

				&_icon {
					height: 40rpx;
					width: 40rpx;
					margin-right: 20rpx;
				}

				&_text {
					font-size: 20rpx;
				}
			}
		}
	}
</style>