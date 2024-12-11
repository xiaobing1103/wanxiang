<template>
	<view class="elseTips">
		<text class="elseTips_text">由AI生成,注意甄别</text>
	</view>
	<view class="ChatEelseHandler">
		<view class="ChatEelseHandler_item">
			<image class="ChatEelseHandler_item_newIcon"
				src="//file.1foo.com/2024/08/23/9980b2a11f01db21440dc639f4a67260.svg" mode=""></image>
		</view>
		<view class="ChatEelseHandler_item" @click="openJubao">
			<text class="ChatEelseHandler_item_text">举报</text>
			<up-icon color="#ccc" class="ChatEelseHandler_item_icon" name="arrow-down-fill" size="10"></up-icon>
		</view>
		<view class="ChatEelseHandler_item" @click="exprotFile">
			<text class="ChatEelseHandler_item_text">导出</text>
			<up-icon color="#ccc" class="ChatEelseHandler_item_icon" name="arrow-down-fill" size="10"></up-icon>
		</view>
		<view class="ChatEelseHandler_item" @click="copy">
			<text class="ChatEelseHandler_item_text">复制</text>
		</view>

		<view class="ChatEelseHandler_item" @click="againAsk">
			<text class="ChatEelseHandler_item_text">重试</text>
		</view>
	</view>
	<up-modal :showConfirmButton="false" :show="show" @cancel="oncancel" closeOnClickOverlay @close="oncancel">
		<view class="juibaoModal">
			<view class="juibaoModal_header">举报该内容涉嫌一下违规</view>
			<template v-for="item in juBaoList" :key="item">
				<view class="juibaoModal_items" @click="jubao(item)">
					{{ item }}
				</view>
			</template>
		</view>
	</up-modal>

	<up-popup :show="showAngel" @close="closeShowAngel" round="15" zIndex="999999" mode="bottom" @open="openShowAngel">
		<view class="showAngel">
			<view class="showAngel_header">
				<text class="showAngel_header_top">回复角度</text>
				<text class="showAngel_header_bottom">选择后会重新再次向认知模型在此请求获取与之相应的回复。众所周知，回复质量往往与人们提问的文字息息相关</text>
			</view>
			<view class="showAngel_main">
				<template v-for="(item,index) in angelItem" :key="index">
					<view
						:style="{ background: item.name == currentAsk ? '#3c9cff' : '#f1f1f1', color: item.name == currentAsk ? '#f1f1f1' : '' }"
						class="showAngel_items" @click="setAngle(item.name)">
						{{ item.name }}
					</view>
				</template>
			</view>
		</view>
	</up-popup>

</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { angelItem } from '@/config/modelConfig';
	import { exportTxt, toCopyText } from '@/utils';
	const show = ref(false);
	const showAngel = ref(false);
	const closeShowAngel = () => {
		showAngel.value = false;
	};
	const openShowAngel = () => {
		showAngel.value = true;
	};
	const props = defineProps<{ msgId : string; text : string }>();
	const currentAsk = ref('默认');
	const juBaoList = ['政治谣言、舆论与虚假新闻', '暴力与仇恨言论', '色情与淫秽内容', '侵犯隐私', '垃圾信息', '其他'];

	const openJubao = () => {
		show.value = true;
	};
	const oncancel = () => {
		show.value = false;
	};
	const jubao = (item : string) => {
		uni.$u.toast('已举报' + item + '！');
		show.value = false;
	};

	const setAngle = (item : string) => {
		currentAsk.value = item;
		closeShowAngel();
	};
	const emit = defineEmits(['passUp']);

	const againAsk = () => {
		emit('passUp', { currentAsk: currentAsk.value, msgId: props.msgId });
	};
	const saveTextToFile = (textContent : string) => {
		const fileSystemManager = wx.getFileSystemManager();
		const tempFilePath = wx.env.USER_DATA_PATH + '/exported-file.txt';

		// 1. 创建临时文件并写入内容
		fileSystemManager.writeFile({
			filePath: tempFilePath,
			data: textContent,
			encoding: 'utf8',
			success: (res) => {
				console.log('文件写入成功:', res);
				// 2. 使用 getFileSystemManager().saveFile 代替 wx.saveFile 保存文件到本地
				fileSystemManager.saveFile({
					tempFilePath: tempFilePath,
					success: (res) => {
						console.log('文件保存成功:', res.savedFilePath);
						// 3. 提供用户打开或操作文件的方式
						wx.openDocument({
							filePath: res.savedFilePath,
							success: function () {
								console.log('文件打开成功');
							}
						});
					},
					fail: (err) => {
						console.error('文件保存失败:', err);
					}
				});
			},
			fail: (err) => {
				console.error('文件写入失败:', err);
			}
		});
	};
	const copy = () => {
		toCopyText(props.text)
	}
	const exprotFile = () => {
		if (typeof props.text == 'string') {
			exportTxt(props.text);
		}
	};
</script>

<style lang="scss">
	.ChatEelseHandler {
		display: flex;
		border-top: 1rpx solid #f1f1ff;
		padding-top: 10rpx !important;
		// justify-content: space-between;

		&_item {
			font-size: 22rpx;
			display: flex;
			padding: 0 10rpx;
			align-items: center;
			box-sizing: border-box;
			color: #ccc;
			justify-content: center;

			&_newIcon {
				width: 40rpx;
				height: 40rpx;
			}

			&_text {
				padding: 0rpx 5rpx;
				box-sizing: border-box;
			}

			&_icon {
				// padding: 5rpx 10rpx;
				box-sizing: border-box;

			}
		}
	}

	.juibaoModal {
		width: 100%;

		&_header {
			font-size: 30rpx;
			font-weight: 800;
		}

		&_items {
			padding: 30rpx 0;
			width: 100%;
			display: flex;
		}
	}

	.showAngel {
		height: 50vh;
		display: flex;
		flex-direction: column;

		&_header {
			padding: 15rpx;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;

			&_top {
				font-size: 30rpx;
				font-weight: 800;
			}

			&_bottom {
				font-size: 20rpx;
			}
		}

		&_main {
			display: flex;
			flex-wrap: wrap;
			overflow-y: auto;
		}

		&_items {
			padding: 7rpx 15rpx;
			// background-color: #f1f1f1;
			border-radius: 15rpx;
			font-size: 20rpx;
			margin: 15rpx;

			white-space: nowrap;
		}
	}

	.elseTips {
		display: flex;
		justify-content: flex-end;
		padding: 5rpx 0;

		&_text {
			background-color: rgb(245, 248, 255);
			color: rgb(195, 201, 205);
			padding: 5rpx 10rpx;
			border-radius: 5rpx;
			font-size: 24rpx;
		}
	}
</style>