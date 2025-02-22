<template>
	<up-popup :show="chatStore.openHistoryModel" mode="left" @close="close" @open="open">
		<view :style="{paddingTop:screenStore.safeTopHeight + 'rpx'}" class="historyBox">
			<view class="historyBox_header">
				<view class="historyBox_header_title">
					历史记录
				</view>
				<view class="historyBox_header_close" @click="chatStore.setopenHistoryModel(false)">
					<up-icon name="close" size="20"></up-icon>
				</view>
			</view>
			<up-line></up-line>
			<view class="historyBox_main">
				<template v-for="(item,index) in chatStore.chats" :key="index">
					<view
						:style="{background: item?.id ==  chatStore.selectChatId  ? '#dfecff' : '',color: item?.id ==  chatStore.selectChatId  ? '#3c9cff' : ''}"
						class="historyBox_main_box" @click="changeChat(item?.id,item.model)">
						<view class="historyBox_main_box_left">
							<image class="historyBox_main_box_icon" :src="item.iconUrl" mode=""></image>
							<text class="historyBox_main_box_text">{{item.title}}</text>
						</view>
						<up-icon :color="item?.id ==  chatStore.selectChatId  ? '#3c9cff' : '' "
							@click="deleteChat(item?.id)" stop name="close" size="20"></up-icon>
					</view>
				</template>
			</view>
			<view class="historyBox_footer">
				<view class="historyBox_footer_button">
					<up-button size="small" type="primary" @click="addChat">新建对话</up-button>
				</view>
				<view class="historyBox_footer_button">
					<up-button size="small" type="error" @click="deleteAllChat">删除所有</up-button>
				</view>
			</view>
		</view>
	</up-popup>
	<up-modal showCancelButton :show="showModals" title="提示" content="是否删除所有记录对话记录？" @cancel="showModals=false"
		@confirm="chatStore.clearChats()">
	</up-modal>
</template>

<script setup lang="ts">
	import { ref, toRefs } from 'vue';
	import { useChatStore, useScreenStore } from '@/store';
	import { ItemMessage, ModelType } from '@/type/chatData';
	import { storeToRefs } from 'pinia';
	const screenStore = useScreenStore()
	const chatStore = useChatStore()
	const showModals = ref(false)
	const { messageList } = storeToRefs(chatStore)
	const deleteAllChat = () => {
		showModals.value = true
	}
	const open = () => {
		chatStore.setopenHistoryModel(true)
	}
	const close = () => {
		chatStore.setopenHistoryModel(false)
	}
	const addChat = () => {
		if (chatStore.loadingMessage) {
			uni.$u.toast('请等待消息回复完成...');
			return
		}
		chatStore.changeSelectChatId('')
		messageList.value = chatStore.getInitTemplate();
	}
	const deleteChat = (id : string) => {
		if (chatStore.loadingMessage) {
			uni.$u.toast('请等待消息回复完成...');
			return
		}

		chatStore.delChats(id)
		messageList.value = chatStore.getInitTemplate();
		uni.$u.toast('删除成功！');
	}
	const changeChat = (id : string, model : ModelType) => {
		if (chatStore.loadingMessage) {
			uni.$u.toast('请等待消息回复完成...');
			return
		}
		const currentMsg = chatStore.chats.find((item) => item?.id == id).data;
		uni.showLoading({
			title: '加载中.....'
		})
		if (currentMsg.length > 0) {
			messageList.value.clear()
			setTimeout(() => {
				currentMsg.forEach((item : ItemMessage, index : number) => {
					messageList.value.set(item?.id, item);
				});
				uni.hideLoading()
			}, 2000);
		} else {
			uni.hideLoading()
		}

		chatStore.changeSelectChatId(id)
		chatStore.setModel(model)
	}
</script>
<style lang="scss" scoped>
	.historyBox {
		width: 70vw;
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
			justify-content: space-between;
			width: 100%;
			font-weight: 800;
			padding: 10rpx 30rpx;
			box-sizing: border-box;
			align-items: center;

			&_button {
				width: 80% !important;

			}
		}

		&_main {
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;
			overflow: scroll;
			max-height: 800rpx;

			&_box {
				display: flex;
				align-items: center;
				// background-color: #eaeaee;
				justify-content: space-between;
				border-radius: 10rpx;
				padding: 20rpx;
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
					width: 350rpx;
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