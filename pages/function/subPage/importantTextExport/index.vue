<template>
	<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)',padding:'0 20rpx'}"
		:show-scrollbar=" false">
		<template #top>
			<CommonHeader defindTitle="AI关键词提取" />
		</template>
		<view class="importantTextExport">
			<view class="importantTextExport_title">
				<view class="label">
					标题：
				</view>
				<view class="values">
					<up-input :customStyle="{border:'1rpx solid #ccc',foneSize:'25rpx',background:'#fff'}"
						v-model="inputValue" placeholder="请填写标题"></up-input>
				</view>
			</view>
			<view class="importantTextExport_content">
				<view class="label">
					内容：
				</view>
				<view class="values">
					<up-textarea height="200rpx" count maxlength="2000" v-model="textareaValue"
						:placeholder="placeholder"></up-textarea>
				</view>
			</view>
			<view class="BtnGroup">
				<up-button :customStyle="{...btnStyles,background:'white',color:'#888',border:'1rpx solid #ccc'}"
					@click="clearResult">
					清空
				</up-button>
				<up-button :disabled="isRecive" :customStyle="btnStyles" @click="onFetchChat">
					一键提取
				</up-button>
			</view>
			<view class="importantTextExport_result">
				<view class="label">
					结果：
				</view>
				<view class="values">
					<up-textarea height="200rpx" maxlength="10000" v-model="result"></up-textarea>
				</view>
			</view>
			<view class="BtnGroup">
				<up-button :customStyle="{...btnStyles,background:'white',color:'#888',border:'1rpx solid #ccc'}"
					@click="copyText">
					一键复制
				</up-button>
			</view>
		</view>

	</z-paging>
</template>

<script setup lang="ts">
	import { useChatStore } from '@/store';
	import CommonHeader from '@/components/CommonHeader.vue';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { ref } from 'vue';
	import { toCopyText } from '@/utils';
	const { streamRequest, isRecive } = useStreamHooks()
	const ChatStore = useChatStore()
	const inputValue = ref('')
	const textareaValue = ref('')
	const result = ref('')
	const placeholder = `1.输入文章.
2.点击'一键改写'.
3.改写完成,点击一键复制.
	`;

	const btnStyles = {
		width: '100%',
		height: '70rpx',
		border: '0rpx',
		background: 'rgb(41, 121, 255)',
		color: 'white',
		margin: ' 10rpx',
		borderRadius: '15rpx'
	}

	const clearResult = () => {
		inputValue.value = ''
		textareaValue.value = ''
	}
	const onFetchChat = async () => {
		if (isRecive.value) {
			uni.$u.toast('正在输出中请等待！')
			return
		}
		const prompt = `你是一个专业的关键词提取器，你的任务是帮助用户提取关键词，请只返回关键词，不要返回其他任何内容`
		const questions = [
			{
				role: 'user',
				content: `帮我根据标题:${inputValue.value}提取出下面文章的关键词:${textareaValue.value}`

			}
		]
		const data = {
			params: JSON.stringify(questions),
			prompt,
		}
		result.value = ''
		const streamOptions = {
			url: 'api/v1/chat2/v35',
			data: data,
			onmessage(text) {
				result.value += text
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
	const copyText = () => {
		toCopyText(result.value)
	}
</script>

<style lang="scss" scoped>
	.importantTextExport {
		padding: 30rpx 0;
	}

	.label {
		font-size: 31rpx;
		font-weight: 800;
	}

	.values {
		padding: 20rpx 0;
	}

	.BtnGroup {
		display: flex;
		width: 100%;
	}
</style>