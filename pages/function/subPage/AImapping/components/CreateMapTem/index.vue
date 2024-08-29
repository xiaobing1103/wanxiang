<template>
	<view class="ppt-con">
		<view class="create-type">
			<view class="create-type_header">
				输入内容即可生成思维导图
			</view>
			<view class="input-box">
				<u-textarea height="150" v-model="currentCreateItem.content"
					:placeholder="currentCreateItem.placeholder"></u-textarea>
			</view>
			<view class="btn">
				<view class="btn_top" @click="onCreateContent" :style="{
					background:isRecive ? 'var(--u-primary-disabled)' : 'var(--aichat-button-color)',
					color:isRecive ? 'var(--uni-text-color-disable)' : 'var(--uni-bg-color)'
					}" type="primary">
					生成思维导图
				</view>
			</view>

			<view class="contentHeader">
				内容大纲
			</view>
			<view class="content">
				<!-- <u-textarea :disabled="true" autoHeight v-model="contentStr" :adjustPosition="false" border="surround"
					:maxlength="-1"></u-textarea> -->
				<textarea class="content_textarea" auto-height :value="contentStr" maxlength='-1'>
				</textarea>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import { useStreamHooks } from '@/hooks/useStreamHooks'
	enum createEnum {
		'TITLE' = 'title',
		'CONTENT' = 'content'
	}
	interface TypeItem {
		name : string;
		key : createEnum;
		btnText : string;
		content : string;
		placeholder : string;
	}
	const emit = defineEmits<{
		(e : 'next', val : { content : string, type : createEnum }) : void
		(e : 'scrollBottom') : void
	}>()
	const { streamRequest, isRecive } = useStreamHooks()

	const contentStr = defineModel<string>('contentStr')

	//类型列表
	const typeList : Record<createEnum, TypeItem> = {
		[createEnum.TITLE]: {
			name: "主题由AI生成",
			key: createEnum.TITLE,
			btnText: '第二步:开始生成内容',
			content: "",
			placeholder: "请输入你想要生成的内容描述,AI会为你生成一份思维导图"
		},
		[createEnum.CONTENT]: {
			name: "有内容?内容梳理后生成",
			key: createEnum.CONTENT,
			btnText: '第二步:开始总结用户内容',
			content: "",
			placeholder: "你可以输入一片文章/演讲稿/新闻/报道/任意长的文字,AI会帮你整理该段文本,适配PPT演示格式"
		}
	}

	const currentCreateItem = ref<TypeItem>(typeList[createEnum.TITLE])
	const onCreateContent = () => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const { key, content } = currentCreateItem.value
		if (!content) {
			uni.$u.toast('输入内容为空！')
			return
		}

		// const endContent = key == createEnum.TITLE ? `我的标题是:${content}` : `我的内容是:${content}`
		// const params = [
		// 	{
		// 		role: 'user',
		// 		content: endContent,
		// 	}
		// ]
		// const data = {
		// 	params: JSON.stringify(params),
		// 	type: "Web-AI思维导图",
		// 	prompt:
		// 		'请根据下面的主题生成思维导图:\'' +
		// 		content +
		// 		'\'，回答的时候不要有任何其他内容，你只需要输出markdown，请严格按照我的格式模版要求执行。' +
		// 		` 
		//       格式模版
		//       # 周报
		//       - 日期：[填写日期]
		//       - 目标：[填写本周目标]
		//       - 进展：
		//         - [填写任务1进展]
		//         - [填写任务2进展]
		//         - [填写任务3进展]
		//       - 问题：
		//         - [填写问题1]
		//         - [填写问题2]
		//         - [填写问题3]
		//       - 下周计划：
		//         - [填写任务1计划]
		//         - [填写任务2计划]
		//         - [填写任务3计划]`
		// }
		// #ifdef H5
		contentStr.value = ''
		// streamRequest({
		// 	url: 'api/v1/chat2/v35',
		// 	data: data,
		// 	onmessage(text) {
		// 		contentStr.value += text
		// 		uni.$emit('update', { msg: contentStr.value })
		// 		emit('scrollBottom')
		// 	},
		// 	onfinish() {
		// 		console.log('成功')

		// 	},
		// 	onerror(err) {
		// 		console.log(err, "错误")
		// 	}
		// })
		uni.navigateTo({
			url: `/pages/function/subPage/AImappingPreview/index?sendMsg=${content}`
		})
		// #endif

		// #ifdef MP-WEIXIN
		uni.navigateTo({
			url: `/pages/function/subPage/WeChatWebview/index?sendMsg=${content}`
		})
		// #endif

	}
</script>

<style lang="scss" scoped>
	.ppt-con {
		padding: 25rpx;
		margin-bottom: 24rpx;
		--u-primary-disabled: #{$u-primary-disabled};
		--aichat-button-color: #{$aichat-button-color};
		--uni-text-color-disable: #{$uni-text-color-disable};
		--uni-bg-color: #{$uni-bg-color};

		.create-type {

			&_header {
				padding: 15rpx 0;
				font-size: 25rpx;
			}

			.input-box {
				overflow: hidden;
				border-radius: 20rpx;
				border: 1px solid $uni-border-color;
			}

			.content {
				height: 100%;
				min-height: 400rpx;
				margin-top: 20rpx;
				border-radius: 20rpx;
				overflow: auto;
				box-sizing: border-box;
				padding: 20rpx;
				border: 2rpx solid $uni-border-color;

				&_textarea {
					font-size: 25rpx;
				}
			}

			.btn {
				margin-top: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				&_top {
					height: 60rpx;
					width: 60%;
					font-size: 25rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 15rpx;
				}
			}
		}
	}

	.contentHeader {}
</style>