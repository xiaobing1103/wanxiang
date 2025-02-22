<template>
	<z-paging ref="pagingRef" :pagingStyle="{padding:'24rpx'}">
		<template #top>
			<CommonHeader defindTitle="AI文章纠正" />
		</template>
		<view class="ppt-con">
			<view class="create-type">
				<view class="create-type_header">
					<image class="create-type_header_image"
						src="//file.1foo.com/2024/02/23/25c6e977e956602478494c328e5dde73.png" mode=""></image>
					请输入你要纠正的文章
				</view>
				<view class="input-box">
					<textarea :style="{fontSize:'30rpx',width:'100%',minHeight: '400rpx'}" auto-height
						v-model="inputValue" maxlength='-1'
						placeholder="示例:我们公司最近在开发一款新产品，目的是让用户更容易的使用我们的服务。虽然开发过程中遇到了一些问题，但我们正积极寻找解决方案。比如，我们的后台系统有时候会出现一些未知的错误，这可能导致用户在使用时遇到困难。我们正在努力提高系统的稳定性，以确保用户的体验不会受到影响。"></textarea>
				</view>
				<view class="create-type_header">
					输出内容:
				</view>
				<view class="input-outBox">
					<MessageItem :content="contentStr" />
				</view>

				<view class="btn">
					<u-button :customStyle="{height:'60rpx', borderRadius:'25rpx',width:'80%'}" class="bth_content"
						:disabled="isRecive" @click="onCreateContent" type="primary">开始批改</u-button>
				</view>

				<view class="btn">
					<u-button :customStyle="{height:'60rpx', borderRadius:'25rpx',width:'80%'}" class="bth_content"
						:disabled="isRecive" @click="exportFile">导出</u-button>
				</view>
			</view>
		</view>
	</z-paging>
	<!-- #ifdef APP -->
	<ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore"
		@onFinish="finishCore" />
	<!-- #endif -->
</template>

<script setup lang="ts">
	// #ifdef APP
	import ChatSSEClient from "@/components/gao-ChatSSEClient/gao-ChatSSEClient.vue";
	// #endif
	import { ref, nextTick } from 'vue'
	import CommonHeader from '@/components/CommonHeader.vue'
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	import MessageItem from '../AidocumentChat/components/MessageItem.vue';
	import { debounce, exportTxt } from '@/utils';
	import { useGlobalProperties } from '../../../../hooks/useGlobalHooks';
	import { useChatStore } from '@/store';
	const { $api } = useGlobalProperties()
	const inputValue = ref('')
	const contentStr = ref(`> **纠正后示例**：
	> 我们公司最近正在开发一款新产品，旨在让用户更方便地使用我们的服务。尽管开发过程中遇到了一些挑战，但我们正在积极寻找解决方案。例如，我们的后台系统偶尔会出现一些未知错误，可能导致用户使用时遇到问题。我们正努力提升系统的稳定性，确保用户体验不受影响。
	 `)

	const ChatStore = useChatStore();
	const exportFile = () => {
		if (contentStr.value) {
			exportTxt(contentStr.value);
		}
	}

	const { streamRequest, isRecive, streamSpark
		// #ifdef APP
		, openCore, errorCore, messageCore, finishCore, chatSSEClientRef
		// #endif
	} = useStreamHooks()
	const pagingRef = ref(null)
	const onScroolToBottom = () => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}
	const onCreateContent = () => {
		if (!inputValue.value) {
			uni.$u.toast('请输入内容！')
			return
		}
		const params = [
			{
				role: 'user',
				content: `我的文章是： ${inputValue.value}`
			}
		]
		const data = {
			params: JSON.stringify(params),
			type: "Web-日报周报月报生成器",
			prompt: '1. 语法纠正：检查并纠正文章中的拼写错误、标点错误以及其他语法错误，以确保文章流畅且符合语法规范。2. 句子结构和表达：检查文章中的句子结构和表达方式，提出修改建议，使句子更加清晰、简洁和易于理解。3. 内容逻辑和连贯性：检查文章中的段落顺序和逻辑关系，确保段落之间的过渡自然流畅，整个文章的内容结构紧密有序。4. 词汇和用词准确性：我会检查文章中的词汇使用是否准确、恰当，提出替换词或短语，使文章的表达更加准确、精确。5. 文体与写作风格：检查文章的文体和写作风格是否一致、得体，提出修改建议，使文章的语调和风格与目标读者的期望相符。根据1 2 3 4 5，为我发给你的文章进行修改后输出，结尾处需要列出修改的地方。我发给你的文章：今天跟好友聊天，各自聊到了自己的父母。朋友还哭起来了，觉得自己的父母这些年太偏心了。你输出的文章：今天跟好友聊天，各自聊到了自己的父母。朋友哭诉起来，觉得自己的父母从小到大都太偏心了修改部分：1.将【还哭起来了】改为【哭诉起来】2.将【这些年】改为【从小到大】'

		}
		contentStr.value = ''
		let newStr = ''
		streamRequest({
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage: async (text) => {
				newStr += text
				contentStr.value = await streamSpark(newStr)
				onScroolToBottom()
			},
			onfinish() {
				console.log('成功')
			},
			onerror(err) {
				if (err.includes('请升级会员')) {
					ChatStore.setShowLevelUpVipContent(err)
					ChatStore.setShowlevelUpVip(true)
				}
				console.log(err, "错误")
			},
			checkNumsType: 'fun_article_correction'
		})
	}
</script>

<style lang="scss" scoped>
	::v-deep .placeClass {
		font-size: 27rpx;
	}

	.head {
		font-size: 32rpx;
		display: flex;
		width: 100%;
		gap: 30rpx;
		margin: 40rpx 0;

		.head-item {
			position: relative;
		}

		.active-item {
			&::after {
				content: '';
				position: absolute;
				width: 50rpx;
				height: 6rpx;
				border-radius: 4rpx;
				bottom: -10rpx;
				left: 0;
				background-color: $uni-color-primary;
			}
		}
	}

	.description {
		font-size: 24rpx;
		color: $uni-text-color-grey;
	}

	.ppt-con {
		margin-bottom: 24rpx;

		.create-type {

			&_header {
				font-size: 34rpx;
				font-weight: 800;
				padding: 15rpx 0;
				display: flex;
				align-items: center;

				&_image {
					height: 50rpx;
					width: 50rpx;
					margin-right: 10rpx;
				}
			}

			.input-box {
				width: 100%;
				overflow-y: scroll;
				border-radius: 20rpx;
				border: 1px solid $uni-border-color;
				min-height: 400rpx;
				padding: 20rpx;
				font-size: 27rpx;

				&_textarea {
					min-height: 200rpx;
				}
			}

			.content {
				margin-top: 20rpx;
				border-radius: 20rpx;
				overflow: hidden;
				box-sizing: border-box;
				border: 2rpx solid $uni-border-color;
			}


		}
	}


	.btn {
		margin-top: 30rpx;
		width: 100%;

		&_content {
			border-radius: 15rpx;
		}
	}


	.AiDailyModel_footer {
		display: flex;
		align-items: center;
		justify-content: center;

		&_content {
			font-size: 27rpx;
			color: $aichat-text-color;
		}
	}

	.input-outBox {
		border: 1px solid $uni-border-color;
		padding: 20rpx;
		overflow-y: scroll;
		border-radius: 20rpx;
		font-size: 27rpx;
	}

	.input-box {
		overflow-y: scroll;
		border-radius: 20rpx;
		border: 1px solid $uni-border-color;
		// max-height: 400rpx;
		padding: 20rpx;
		font-size: 27rpx;

		// &_textarea {
		// 	min-height: 400rpx;
		// }
	}
</style>