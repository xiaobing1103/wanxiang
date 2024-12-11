<template>
	<view class="CommonViewer">
		<view class="CommonViewer_title">
			<image class="CommonViewer_title_image" :src="$assets.ArticleUserIcon" mode=""></image>
			<text>来自一些内测用户的评价</text>
		</view>
		<view class="CommonViewer_items" v-for="(items,index) in userCommet" :key="index">
			<text class="CommonViewer_items_userName">{{items.userName}} : </text>
			<text class="CommonViewer_items_comment">{{items.comment}}</text>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const { $assets } = useGlobalProperties()
	const userCommet = [
		{
			userName: '用户评价',
			comment: '系统能快速、自动地识别语言，将单词转 化为你想要的语言，并尝试添加特殊的语 言细微差别和表达方式。'
		},
		{
			userName: '用户评价',
			comment: '在第一次测试中--中文翻译成英语 结果显示，它非常准确，特别善于把握句 子的意思，而不是局限于字面翻译。AI能 力真是太强了',
		},
		{
			userName: '用户评价',
			comment: '就我个人而言，令我刮目相看，是的，我 觉得这真的很棒，机器翻译到AI翻译，发 展到这个新的阶段，真的很棒，他有别于 传统的翻译，他可以根据用户需要的风格 进行改写等等，而且翻译出来的文字具备 流畅性，一切皆有可能。'
		}
	]
</script>

<style lang="scss" scoped>
	.CommonViewer {
		font-size: 27rpx;

		&_title {
			display: flex;
			align-items: center;
			font-size: 800;

			&_image {
				width: 40rpx;
				height: 40rpx;
			}
		}

		&_items {
			// display: flex;
			// flex-direction: column;
			padding: 20rpx 0;

			&_userName {
				font-weight: 800;
			}

			&_comment {
				color: #ccc;
			}
		}
	}
</style>