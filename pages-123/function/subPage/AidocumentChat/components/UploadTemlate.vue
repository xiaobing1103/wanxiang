<template>
	<view class="up-upload-box">
		<view class="com">
			<view class="comBox">
				<view class="comBoxList" v-for="(items,index) in docList" :key="index">
					<image class="com_icons" :src="items.icon" mode="" />
					<text class="com_texts">{{items.title}}</text>
				</view>
			</view>
			<text class="com_top">请点击上传文档</text>
			<text class="com_bottom">您可以上传PDF、Word、Excel、PPTX或ePub文件，快速获取文档总结与分析</text>
		</view>
	</view>

</template>

<script setup lang="ts">
	import { reactive } from 'vue';

	const docList = reactive([{
		title: 'DOC文档',
		icon: '//file.1foo.com/2023/11/06/ef9fbb611df1426d6e3909da3f5324da.png'
	},
	{
		title: 'PDF文档',
		icon: '//file.1foo.com/2023/11/06/af288b5ee7d03e055a52ecff4b680858.png'
	},
	{
		title: 'CSV文档',
		icon: '//file.1foo.com/2023/11/06/3c69a8ef4ceb28442b4233361a28e060.png'
	},
	{
		title: 'PPT文档',
		icon: '//file.1foo.com/2023/11/06/8a40b46bbcc9b10d7fcbbca08b8c8c99.png'
	},
	{
		title: 'PUB文档',
		icon: '//file.1foo.com/2023/11/06/25ca3372d739680d19564d170e536bcf.png'
	},
	])
</script>

<style lang="scss" scoped>
	.com {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 15rpx;
		padding: 25rpx;
		background-color: #f1f1ff;

		&_icons {
			width: 50rpx;
			height: 50rpx;
		}

		&_texts {
			font-size: 20rpx;
		}

		&_top {
			font-weight: 800;
			padding: 20rpx 0;
			font-size: 30rpx;
		}

		&_bottom {
			font-size: 27rpx;
			text-align: center;
		}

	}

	.comBox {
		display: flex;
	}

	.comBoxList {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 15rpx;
		box-sizing: border-box;
		flex-direction: column;
	}
</style>