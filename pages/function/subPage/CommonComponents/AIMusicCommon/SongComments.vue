<template>
	<view class="CommonInput_input">
		<view class="CommonInput_input_title">
			<text class="CommonInput_input_title_comment"> 歌词描述</text>
			<text v-if="currentPages == 0" class="CommonInput_input_title_ai" @click="onFetchChat">Ai写歌词</text>
		</view>
		<up-textarea v-model="commonParmas.prompt" height="150" :customStyle="{border:'1rpx solid #ccc'}"
			maxlength="3000" count border="surround" placeholder="请输入你的歌词描述(例如:关于夏天的动感流行音乐)"></up-textarea>
	</view>

</template>

<script setup lang="ts">
	import { commonParmasType } from '../types';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { useChatStore } from '@/store';
	const { streamRequest, isRecive } = useStreamHooks()
	const commonParmas = defineModel<commonParmasType>('commonParmas')
	const currentPages = defineModel<number>('currentPages')
	const ChatStore = useChatStore();
	const onFetchChat = async () => {
		if (!commonParmas.value.title) {
			uni.$u.toast('请先输入歌曲名称！')
			return
		}
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const prompt = `为歌曲标题为:${commonParmas.value.title},创作一首歌词`
		const questions = [
			{
				role: 'user',
				content: '以歌词形似输出，不要回复任何与歌词无关的话,字数不得超过200个字数。标题为:' + commonParmas.value.title

			}
		]

		const data = {
			params: JSON.stringify(questions),
			prompt
		}
		commonParmas.value.prompt = ''
		const streamOptions = {
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage(text) {
				commonParmas.value.prompt += text
				// onScroolToBottom()
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

<style scoped lang="scss">
	.CommonInput {
		width: 100%;

		&_input {
			width: 100%;
			padding-bottom: 20rpx;

			&_title {

				padding-bottom: 20rpx;
				font-weight: 800;
				font-size: 27rpx;
				display: flex;
				justify-content: space-between;

				&_comment {}

				&_ai {
					color: #583ab4;
				}
			}
		}

	}
</style>