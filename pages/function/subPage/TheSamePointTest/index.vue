<template>
	<z-paging ref="pagingRef" :pagingStyle="{ background: 'rgb(246, 247, 249)',padding:'0 20rpx'}"
		:show-scrollbar="false">
		<template #top>
			<CommonHeader defindTitle="AI相似度检测" />
		</template>
		<view class="TheSamePointTest">
			<view class="TheSamePointTest_content1  TheSamePointTestall">
				<view class="label">
					内容1：
				</view>
				<view class="values">
					<up-textarea height="200rpx" count maxlength="2000" v-model="textareaValue1"
						placeholder="请输入文章内容"></up-textarea>
				</view>
			</view>
			<view class="BtnGroup">
				<up-button :customStyle="{...btnStyles,background:'white',color:'#888',border:'1rpx solid #ccc'}"
					@click="clearResult">
					一键清空
				</up-button>
				<up-button :disabled="isRecive" :customStyle="btnStyles" @click="onFetchChat">
					开始检测
				</up-button>
			</view>
			<view class="TheSamePointTest_content2 TheSamePointTestall">
				<view class="label">
					内容2：
				</view>
				<view class="values">
					<up-textarea placeholder="请输入文章内容" height="200rpx" maxlength="2000" v-model="result"></up-textarea>
				</view>

			</view>
			<view class="TheSamePointTest_content3">
				<view class="TheSamePointTest_content3_point">
					文本相似度为: {{testvalue || 0}} %
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import { ref, computed } from 'vue';
	import DiffMatchPatch from 'diff-match-patch';
	import { useStreamHooks } from '@/hooks/useStreamHooks';
	import { useChatStore } from '@/store';
	const textareaValue1 = ref('')
	const result = ref('')
	const ChatStore = useChatStore()
	const testvalue = ref('')
	const { streamRequest, isRecive } = useStreamHooks()
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
		textareaValue1.value = ''
	}

	const onFetchChat = () => {
		const diffentInstance = new DiffMatchPatch();
		const diffs : Diff[] = diffentInstance.diff_main(textareaValue1.value, result.value)
		diffentInstance.diff_cleanupSemantic(diffs)
		let totalLength = textareaValue1.value.length + result.value.length
		let editLength = 0
		diffs.forEach((diff) => {
			if (diff[0] !== 0) {
				// 0 表示没有差异
				editLength += diff[1].length
			}
		})
		// 计算相似度
		const similarity = (1 - editLength / totalLength) * 100

		testvalue.value = similarity.toFixed(2)
	}
</script>

<style scoped lang="scss">
	.label {
		font-size: 28rpx;
		font-weight: 800;
	}

	.values {
		padding: 20rpx 0;
	}

	.BtnGroup {
		display: flex;
		width: 100%;
	}

	.TheSamePointTest {
		padding: 40rpx 0;
	}

	.TheSamePointTestall {
		padding: 20rpx 0;
	}

	.TheSamePointTest_content3 {
		display: flex;
		justify-content: center;
		color: $aichat-border-color;
	}
</style>