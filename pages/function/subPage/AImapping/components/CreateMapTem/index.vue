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
					color:isRecive?'var(--uni-text-color-disable)': 'var(--uni-bg-color)'
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
	import { ref } from 'vue'
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
		contentStr.value = '';
		const endContent = key == createEnum.TITLE ? `我的标题是:${content}` : `我的内容是:${content}`
		const params = [
			{
				role: 'user',
				content: endContent,
			}
		]
		const data = {
			params: JSON.stringify(params),
			type: "Web-PPT生成内容",
			prompt: "我希望你根据我的标题生成文档，以下格式中 ## 为章节、###为大纲、####为小纲、- 为根据\"小纲\"补充的回答，必须对小纲进行回答，严格要求必须有2个以上章节，严格要求每个小纲必须有2个以上的回答，严格按照以下格式输出：\n\n# 标题\n\n## 1\n### 1.1\n#### 1.1.1\n- \n- \n\n#### 1.1.2\n- \n- \n\n#### 1.1.3\n- \n- \n\n### 1.2\n#### 1.2.1\n- \n- \n\n#### 1.2.2\n- \n- \n\n#### 1.2.3\n- \n- \n\n### 1.3\n#### 1.3.1\n- \n- \n\n#### 1.3.2\n- \n- \n\n#### 1.3.3\n- \n- \n\n## 2\n### 2.1\n#### 2.1.1\n- \n- \n\n#### 2.1.2\n- \n- \n\n#### 2.1.3\n- \n- \n\n### 2.2\n#### 2.2.1\n- \n- \n\n#### 2.2.2\n- \n- \n\n#### 2.2.3\n- \n- \n\n### 2.3\n#### 2.3.1\n- \n- \n\n#### 2.3.2\n- \n- \n\n#### 2.3.3\n- \n- \n\n## 3\n### 3.1\n#### 3.1.1\n- \n- \n\n#### 3.1.2\n- \n- \n\n#### 3.1.3\n- \n- \n\n### 3.2\n#### 3.2.1\n- \n- \n\n#### 3.2.2\n- \n- \n\n#### 3.2.3\n- \n- \n\n### 3.3\n#### 3.3.1\n- \n- \n\n#### 3.3.2\n- \n- \n\n#### 3.3.3\n- \n- \n\n\n## 4\n### 4.1\n#### 4.1.1\n- \n- \n\n#### 4.1.2\n- \n- \n\n#### 4.1.3\n- \n- \n\n### 4.2\n#### 4.2.1\n- \n- \n\n#### 4.2.2\n- \n- \n\n#### 4.2.3\n- \n- \n\n### 4.3\n#### 4.3.1\n- \n- \n\n#### 4.3.2\n- \n- \n\n#### 4.3.3\n- \n请严格按照我的设定回答"
		}
		streamRequest({
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage(text) {
				contentStr.value += text
				uni.$emit('update', { msg: contentStr.value })
				emit('scrollBottom')
			},
			onfinish() {
				console.log('成功')

			},
			onerror(err) {
				console.log(err, "错误")
			}
		})
	}
</script>

<style lang="scss" scoped>
	.ppt-con {
		padding: 25rpx;
		margin-bottom: 24rpx;

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