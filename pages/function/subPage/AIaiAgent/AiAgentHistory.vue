<template>
	<up-popup closeable safeAreaInsetTop closeIconPos="top-right" :show="AiAgentChats.openHistoryModal" mode="left"
		@close="AiAgentChats.setOpenHistoryModal(false)">
		<view :style="{paddingTop:screenStore.safeTopHeight + 'rpx'}" class="historyBox">
			<view class="historyBox_header">
				历史记录
			</view>
			<up-line></up-line>

			<view class="historyBox_main">
				<template v-for="(item,index) in AiAgentChats.chatList[AiAgentChats.agentId]" :key="index">

					<view :style="{
							background: index ==  AiAgentChats.currentConversation_id  ? '#dfecff' : '',
							color: index == AiAgentChats.currentConversation_id   ? '#3c9cff' : ''
							}" class="historyBox_main_box" @click="changeChat(index)">
						<view class="historyBox_main_box_left">
							<!-- <image class="historyBox_main_box_icon" :src="item[0].role" mode=""></image> -->
							<text class="historyBox_main_box_text">{{item[0].content}}</text>
						</view>
						<up-icon :color="index == AiAgentChats.currentConversation_id  ? '#3c9cff' : '' "
							@click="deleteChat(index)" stop name="close" size="15"></up-icon>
					</view>
				</template>
			</view>
			<view class="historyBox_footer">
				<view class="historyBox_footer_button">
					<up-button size="small" type="primary" @click="addChat">新建对话</up-button>
				</view>
				<view class="historyBox_footer_button">
					<up-button size="small" type="error" @click="showModals2 = true">删除所有</up-button>
				</view>
			</view>
		</view>
	</up-popup>
	<up-modal showCancelButton :show="showModals" title="提示" content="是否删除当前智能体对话记录？" @cancel="showModals=false"
		@confirm="deleteCurrent"></up-modal>
	<up-modal showCancelButton :show="showModals2" title="提示" content="是否删除所有智能体对话记录？" @cancel="showModals=false"
		@confirm="AiAgentChats.clearAllLists();showModals2 = false;"></up-modal>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useAiAgentChats, useScreenStore } from '@/store';
	const showModals = ref(false)
	const showModals2 = ref(false)
	const screenStore = useScreenStore()
	const AiAgentChats = useAiAgentChats()
	const seletedKey = ref('')
	const changeChat = (key : string) => {
		AiAgentChats.setCurrentConversation_id(key)
		AiAgentChats.changeMessageList(key)
	}
	const addChat = () => {
		const currentId = AiAgentChats.currentConversation_id
		if (!currentId) {
			uni.$u.toast('已经是最新的对话！');
			AiAgentChats.setMessageList([])
			return
		}
		if (AiAgentChats && AiAgentChats.chatList && AiAgentChats.agentId) {
			let keysLength = Object.keys(AiAgentChats.chatList[AiAgentChats.agentId]).length;
			if (keysLength >= 5) {
				uni.$u.toast('每个智能体对话不能超过五条，请你清除后继续对话！');
				return;
			}
		}

		AiAgentChats.setCurrentConversation_id(null)

	}

	const deleteChat = (key : string) => {
		seletedKey.value = key
		showModals.value = true

	}
	
	const deleteCurrent =() =>{
		AiAgentChats.deleteChatListSingleChat(seletedKey.value);
		AiAgentChats.setCurrentConversation_id('')
		showModals.value = false;
	}

</script>

<style lang="scss" scoped>
	.historyBox {
		width: 50vw;
		background-color: white;
		border-radius: 30rpx;
		display: flex;
		flex-direction: column;

		&_view {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;

			&_image {
				height: 50rpx;
				width: 50rpx;
				padding: 0 20rpx;
			}

			&_text {
				font-size: 30rpx;
			}
		}

		&_header {
			display: flex;
			justify-content: flex-start;
			width: 100%;
			font-weight: 800;
			padding: 10rpx 30rpx;
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
					font-size: 25rpx;
					width: 200rpx;
					white-space: nowrap;
					/* 强制文本在一行显示，不换行 */
					overflow: hidden;
					/* 隐藏溢出的文本 */
					text-overflow: ellipsis;
					/* 超出部分显示省略号 */
				}
			}
		}

		&_footer {
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			width: 100%;
			position: absolute;
			border-top: 1rpx solid #ccc;
			bottom: 0;
			padding: 20rpx 0;
			overflow: hidden;

			&_button {
				width: 80% !important;
				margin: 10rpx 0;
			}
		}
	}
</style>