<template>
	<z-paging :pagingStyle="{padding:'0 24rpx'}">
		<template #top>
			<CommonHeader defindTitle="AI一键生成PPT" />
			<text class="title">最后一步,等待AI完成任务吧</text>
			<text
				class="description">所有模板我们团队会不断的在后台进行上传，只需要选择你喜欢的模板，M即刻开始任务，不久后你就的PPT就完成者!当然，我们非常希望你能够给我们提供更多的模板，这样，我们的AI生态即会更加完整</text>
		</template>
		<view class="body">
			<view class="icon"></view>
			<text class="description">生成成功!您也可以重新编辑文案，再次生成新的PPT</text>
			<view class="btn">
				<u-button @click="onPreview" type="primary">预览PPT</u-button>
				<u-button @click="onDownLoad" type="primary">下载</u-button>
			</view>
		</view>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	const emit = defineEmits<{
		(e : 'download') : void
		(e : 'preview') : void
	}>()

	const onPreview = () => {
		emit('preview')
	}
	const onDownLoad = () => {
		emit('download')
	}
</script>

<style lang="scss" scoped>
	.title {
		font-size: 32rpx;
		font-weight: 700;
		margin: 40rpx 0;
		display: block;
		text-align: center;
	}

	.description {
		font-size: 24rpx;
		color: $uni-text-color-grey;
	}

	.body {
		display: flex;
		align-items: center;
		flex-direction: column;

		.btn {
			width: 400rpx;
			display: flex;
			flex-direction: column;
			gap: 20rpx;
			margin-top: 30rpx;
		}

		.description {
			display: block;
			text-align: center;
		}

		.icon {
			background-color: red;
			width: 300rpx;
			margin: 60rpx 0;
			height: 300rpx;
		}
	}
</style>