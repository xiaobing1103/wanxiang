<template>
	<view class="msg">
		<view class="head">
			<view class="head_imageBox">
				<image v-if="loadingWebPage" class="head_image" :src="$assets.aiAigentLoadingImage" mode=""></image>
				<image v-else class="head_image" :src="msg.icon" mode=""></image>
			</view>
			<view class="head_text">{{msg.name}}</view>
		</view>
		<view class="msg_wrap">
			<template v-if="msg.SearchTitle">
				<template v-if="loadingWebPage">
					<view class="loadingWebPage">
						<up-loading-icon size="20" textSize="14" :text="'正在联网搜索'+ msg.SearchTitle +'....'"
							mode="semicircle"></up-loading-icon>
					</view>
				</template>
				<template v-else>
					<view class="searchResult">
						<image class="searchResult_image" :src="$assets.aiAigentLoadingIcon" mode=""></image> 查询 1 次，打开
						<view class="searchResult_desc">
							{{msg.aiAgentSearchList?.length}}个网页并总结
						</view>
					</view>
				</template>
			</template>
			<template v-if="!msg.content && !msg.SearchTitle ">
				<view class="search_box">
					<view class="search_box_text">
						正在组织语言...
					</view> <up-loading-icon :customStyle="{marginLeft:'15rpx'}" size="20"
						mode="semicircle"></up-loading-icon>
				</view>
			</template>
			<template v-if="msg.aiAgentSearchList">
				<view class="aiAgentSearchListBox">
					<template v-for="(items,index) in msg.aiAgentSearchList">
						<view class="aiAgentSearchListBox_items">
							<view class="aiAgentSearchListBox_items_link">
								<up-link :customStyle="{display:' -webkit-box',webkitBoxOrient: 'vertical',webkitLineClamp: 2,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'normal',
									maxHeight: '4em',
									fontSize:'27rpx'
									}" underLine :href="items.link" :text="index + 1 +'. '+items.title"></up-link>
							</view>
							<view class="aiAgentSearchListBox_items_orilink">
								{{items.link}}
							</view>
						</view>
					</template>
				</view>
			</template>
			<template v-if="msg.content">
				<zero-markdown-view :markdown="msg.content" />
			</template>
			<template v-if="isCurrent">
				<view class="bottom">
					<view class="bottom_left">
						<image class="bottom_left_image"
							src="//file.1foo.com/2024/08/21/8528dc60c5172f8d2a68fdb6e7d05e18.svg" mode=""></image>
					</view>
					<view class="bottom_right">
						<template v-for="(items,index) in bottomActionList" :key="index">
							<view class="bottom_right_box" @click="items.function(msg.content)">
								<up-icon :customStyle="{margin:'0 10rpx'}" :name="items.icon"></up-icon>
								<text>{{items.name}}</text>
							</view>
						</template>
					</view>
				</view>
			</template>
		</view>
		<template v-if="isCurrent">
			<view class="three">
				<template v-if="!loaddingKeyword">
					<template v-for="(items,index) in keywords" :key="index">
						<view class="three_word" @click="sendMessage(items)">
							<view class="three_word_text">{{items}}</view>
							<up-icon name="arrow-rightward"></up-icon>
						</view>
					</template>
				</template>
				<template v-else>
					<view class="loading">
						<view></view>
						<view></view>
						<view></view>
					</view>
				</template>
			</view>
		</template>

	</view>
</template>

<script setup lang="ts">
	import { useGlobalProperties } from '@/hooks/useGlobalHooks'
	import { useChatStore } from '@/store'
	import useAiAgentChats, { AChat } from '@/store/aiAgentChats'
	import { toCopyText } from '@/utils'
	const { $assets } = useGlobalProperties()
	const AiAgentChats = useAiAgentChats()
	const ChatStore = useChatStore()
	const emit = defineEmits(['onsendTemMessage'])

	const reloadSendMsg = () => {
		const length = AiAgentChats.messageList.length - 2
		if (length >= 0) {
			const content = AiAgentChats.messageList[length].content
			const files = AiAgentChats.messageList[length].files
			emit('onsendTemMessage', content, files)
		}
	}
	const copyTxt = (msg : string) => {
		toCopyText(msg)
	}
	const sendMessage = (msg : string) => {
		emit('onsendTemMessage', msg, [])
	}
	const bottomActionList = [
		{
			name: '重新',
			icon: 'reload',
			key: 'again',
			function: reloadSendMsg
		},
		{
			name: '复制',
			icon: 'file-text',
			key: 'copy',
			function: copyTxt
		}
	]

	interface Props {
		msg : AChat.SystemMessageItem
		isCurrent : boolean
		loaddingKeyword ?: boolean
		keywords ?: string[]
		onRevertChat ?: () => void
		// senMessage : (val : string) => void
		loadingWebPage : boolean
		isRecive : boolean
	}
	const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
	.msg {

		padding: 20rpx 0;
		overflow: hidden;


		&_wrap {
			display: flex;
			flex-direction: column;
			max-width: 95%;
			padding: 15rpx;
			background-color: white;
			border-radius: 10rpx;
			min-width: 100rpx;
			width: max-content;
			margin-right: auto;
		}

	}

	.head {
		display: flex;
		align-items: center;

		margin-bottom: 20rpx;

		&_imageBox {
			display: flex;
			align-items: center;

		}

		&_image {
			border-radius: 50%;
			width: 50rpx;
			height: 50rpx;
			margin-right: 20rpx;
		}

	}

	.bottom {
		display: flex;
		align-items: center;
		background-color: white;
		border-top: 1rpx solid #eaeaea;
		justify-content: space-between;

		&_left {

			&_image {
				width: 300rpx;
				height: 70rpx
			}
		}

		&_right {
			display: flex;

			&_box {
				display: flex;
			}
		}
	}

	.three {
		// width: max-content;
		display: flex;
		flex-direction: column;

		&_word {
			width: max-content;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
			margin: 15rpx;
			padding: 15rpx;
			border-radius: 15rpx;
			background-color: white;

			&_text {
				margin-right: 10rpx;
			}
		}
	}

	.aiAgentSearchListBox {
		display: flex;
		overflow: scroll;
		background-color: #F6F7F9;
		padding: 30rpx 15rpx;
		border-radius: 20rpx;
		margin: 20rpx 0;

		&_items {
			min-width: 400rpx;
			border-radius: 20rpx;
			padding: 20rpx;
			box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
			margin: 0 20rpx;
			font-size: 21rpx;
			display: flex;
			flex-direction: column;

			&_link {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				/* 限制为两行 */
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: normal;

				/* 或者可以设置为nowrap，取决于是否允许文本自动换行 */
				max-height: 4em;
				/* 两行文本的高度，根据字体大小调整 */
			}

			&_orilink {
				width: 350rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-top: 20rpx;
				color: #838A95;
			}
		}
	}

	.loadingWebPage {
		display: flex;
	}

	.searchResult {
		display: flex;
		padding: 20rpx 0;
		font-weight: 800;
		align-items: center;

		&_image {
			width: 50rpx;
			height: 50rpx;
			margin-right: 44rpx;
		}

		&_desc {}
	}

	.search_box {
		display: flex;
		font-size: 27rpx;
		align-items: center;

		&_text {}
	}


	.loading,
	.loading>view {
		position: relative;
		box-sizing: border-box;
	}

	.loading {
		display: block;
		font-size: 0;
		color: #000;
	}

	.loading.la-dark {
		color: #333;
	}

	.loading>view {
		display: inline-block;
		float: none;
		background-color: currentColor;
		border: 0 solid currentColor;
	}

	.loading {
		width: 54px;
		height: 18px;
		padding: 30rpx 0;
	}

	.loading>view {
		width: 10px;
		height: 10px;
		margin: 4px;
		border-radius: 100%;
		animation: ball-beat 0.7s -0.15s infinite linear;
	}

	.loading>view:nth-child(2n-1) {
		animation-delay: -0.5s;
	}

	@keyframes ball-beat {
		50% {
			opacity: 0.2;
			transform: scale(0.75);
		}

		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>