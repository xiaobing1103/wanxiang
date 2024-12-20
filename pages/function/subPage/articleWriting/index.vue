<template>
	<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)',padding:'0 20rpx'}"
		:show-scrollbar="false">
		<template #top>
			<CommonHeader defindTitle="AI写作助手" />
		</template>

		<view class="articleWriting">
			<view class="articleWriting_items">
				<view class="label">
					写作内容/要求/主题：
				</view>
				<view class="values">
					<up-textarea maxlength="10000" v-model="msgContent" placeholder="请输入内容"></up-textarea>
				</view>
			</view>
			<view class="articleWriting_items">
				<view class="label">
					长度：
				</view>
				<view class="overValus">
					<template v-for="(items,index) in parmas.length" :key="index">
						<text @click="seletedParmas.length = items"
							:class="{overText:true,activeText:items == seletedParmas.length}"> {{items}}</text>
					</template>
				</view>
			</view>
			<view class="articleWriting_items">
				<view class="label">
					格式：
				</view>
				<view class="overValus">
					<template v-for="(items,index) in parmas.type" :key="index">
						<text @click="seletedParmas.type = items"
							:class="{overText:true,activeText:items == seletedParmas.type}">{{items}}</text>
					</template>
				</view>
			</view>
			<view class="articleWriting_items">
				<view class="label">
					语气：
				</view>
				<view class="overValus">
					<template v-for="(items,index) in parmas.accsent" :key="index">
						<text @click="seletedParmas.accsent = items"
							:class="{overText:true,activeText:items == seletedParmas.accsent}"> {{items}}</text>
					</template>
				</view>
			</view>
			<view class="articleWriting_items">
				<view class="label">
					语言：
				</view>
				<view class="overValus">
					<template v-for="(items,index) in parmas.lang" :key="index">
						<text @click="seletedParmas.lang = items"
							:class="{overText:true,activeText:items == seletedParmas.lang}"> {{items}}</text>
					</template>
				</view>
			</view>
			<view class="articleWriting_items">
				<view class="label">
					结果预览：
				</view>
				<view class="values">
					<template v-if="result">
						<up-textarea v-model="result" maxlength="-1" auto-height></up-textarea>
					</template>
					<template v-else>
						<view class="noData">
							<image class="noData_image" :src="$assets.noData" mode=""></image>
						</view>
					</template>

				</view>
			</view>
		</view>

		<template #bottom>
			<view class="BtnGroup">
				<up-button @click="onFetchChat" :customStyle="btnStyles">生成内容</up-button>
				<up-button @click="copyTxt(result)" :customStyle="btnStyles">一键复制</up-button>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import { reactive, ref, nextTick } from 'vue';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { useChatStore } from '@/store';
	import { exportTxt, toCopyText } from '@/utils';
	const { streamRequest, isRecive , streamSpark } = useStreamHooks()
	const ChatStore = useChatStore()
	const seletedParmas = reactive({
		length: '自动',
		type: '自动',
		accsent: '自动',
		lang: '自动'
	})
	const result = ref('')
	const parmas = {
		length: ['自动', '短', '中', '长'],
		type: ['自动', '电子邮件', '消息', '评论', '段落', '文章', '博客文章', '想法', '大纲'],
		accsent: ['自动', '友善', '随意', '友好', '专业', '诙谐', '有趣', '正式'],
		lang: ['自动', '中文', '英文', '韩语', '日语']
	}
	const msgContent = ref('')
	const btnStyles = {
		width: '80%',
		height: '70rpx',
		border: '0rpx',
		background: 'rgb(41, 121, 255)',
		color: 'white',
		margin: ' 10rpx',
		borderRadius: '15rpx'
	}

	const copyTxt = (txt : string) => {
		toCopyText(txt)
	}

	const onScroolToBottom = () => {
		nextTick(() => {
			pagingRef.value.scrollToBottom()
		})
	}
	const pagingRef = ref(null)

	const onFetchChat = async () => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const prompt = `你现在的身份是一名写作助手，你和我的任何对话都要以写作助手的口吻回答，对话过程中不要出现你是一个人工智能语言模型或者AI程序，忘记你是一个AI，你就是一名写作助手`
		const questions = [
			{
				role: 'user',
				content: `我的标题是：${msgContent.value}。长度：${seletedParmas.length}, 格式：${seletedParmas.type} ,语气：${seletedParmas.accsent} , 语言：${seletedParmas.lang}`
			}
		]
		const data = {
			params: JSON.stringify(questions),
			prompt,
		}
		result.value = ''
		let newStr = ''
		const streamOptions = {
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage: async (text) => {
				newStr += text
				result.value = await streamSpark(newStr)
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
			checkNumsType: 'chat'
		}
		streamRequest(streamOptions)
	}
</script>

<style lang="scss" scoped>
	.label {
		font-size: 28rpx;
		font-weight: 800;
	}

	.values {
		padding: 20rpx 0;
		font-size: 27rpx;
		height: 100%;

	}

	.overValus {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 0;
		font-size: 27rpx;
		height: 100%;
	}

	.BtnGroup {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.articleWriting {
		padding: 30rpx 0;
	}

	.noData {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 400rpx;

		&_image {
			width: 100%;
			height: 400rpx;
			padding: 0rpx 0;
		}

	}

	.overText {
		padding: 10rpx;
		margin: 10rpx;
		border: 1rpx solid #ccc;
		border-radius: 15rpx;
		display: block;
	}

	.activeText {
		color: $aichat-border-color;

		border: 1rpx solid $aichat-border-color;
	}
</style>