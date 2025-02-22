<template>
	<z-paging :safe-area-inset-bottom="true">
		<template #top>
			<CommonHeader defindTitle="AI一键生成PPT" />
		</template>
		<view class="body">
			<!-- 描述 -->
			<text
				class="description">AI赋能，释放内容创造力，一键生成PPT。省去大量的时间自动由人工智能驱动为你的主题/课题/论点生成大量:标题、大纲、子纲、要点、内容等，并自动生成一份简洁大气的PPT(可手动插入内容后由AI帮你制造PPT演示文件!)</text>
			<!-- 标题 -->
			<text class="title">第三步,修改框架内的文字</text>
			<!-- 描述 -->
			<view class="description">
				<text>1.如果你选择由AI生成你的特定主题中的内容你不满意，框架你不满意，你可以进行二次修改。</text>
				<text>2.如果你给的内容，AI梳理后你不满意，你仍可二次修改再进行下一步，PPT的渲染</text>
			</view>
			<view class="content">
				<u-textarea :adjustPosition="false" :auto-height="true" border="surround" :maxlength="-1"
					v-model="content"></u-textarea>
			</view>
		</view>
		<template #bottom>
			<view class="btn">
				<u-button @click="onNext" style="height: 88rpx;border-radius: 15rpx;"
					type="primary">第四步:选择PPT主题</u-button>
			</view>
		</template>
	</z-paging>
</template>

<script lang="ts" setup>
	import CommonHeader from '@/components/CommonHeader.vue';
	import { defineModel } from 'vue'
	const content = defineModel<string>()

	const emit = defineEmits<{
		(e : 'next') : void
	}>()
	const onNext = () => {
		emit('next')
	}
</script>

<style lang="scss" scoped>
	.btn {
		margin: 24rpx;
	}

	.body {
		box-sizing: border-box;
		padding: 24rpx;

		.description {
			font-size: 24rpx;
			display: flex;
			flex-direction: column;
			gap: 10rpx;
			color: $uni-text-color-grey;
		}

		.title {
			display: block;
			font-size: 34rpx;
			font-weight: 700;
			margin: 40rpx 0;
		}

		.content {
			margin-top: 40rpx;
			border-radius: 20rpx;
			overflow: hidden;
			box-sizing: border-box;
			border: 2rpx solid $uni-border-color;
		}
	}
</style>