<template>
	<view class="leftMenusLayout">
		<view class="leftMenus" v-for="(item,index) in datas" :key="index" @click="emitProject(item)">
			<view :class="item.title == currentProject ? 'leftMenus_box2':'leftMenus_box' ">
				<text class="leftMenus_box_text">{{item.title}}</text>
				<view class="leftMenus_box_tips" v-if="item.hot"></view>
			</view>
			<view v-if="datas.length -1 !== index" class="leftMenus_lines">
				<view class="leftMenus_lines_content" />

			</view>
		</view>

	</view>
	<view class="leftMenusLayoutfixed">

	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	const emits = defineEmits(['ChangeProJect'])
	const props = defineProps<{ currentProject : string }>()
	const datas = [
		{ title: 'AI智能体', hot: true },
		{ title: 'AI翻译', hot: true },
		{ title: 'AI音乐', hot: true },
		{ title: 'AI视频', hot: true },
		{ title: 'AI应用', hot: true },
		{ title: 'AI文档', },
		{ title: 'AI语音', },
		{ title: 'AI识别', },
		{ title: 'AI写作', },
		{ title: 'AI论文', },

	]


	const emitProject = ({ title }) => {
		emits('ChangeProJect', title)
	}
</script>

<style lang="scss">
	.leftMenusLayoutfixed {
		width: 20vw;
		min-width: 20vw;
	}

	.leftMenusLayout {
		position: fixed;

		width: 20vw;
		padding: 20rpx 0 !important;
		border-radius: 0 20rpx 20rpx 0;
		background-color: #F7F7F7;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.leftMenus {
		width: 20vw;
		display: flex;
		flex-direction: column;
		position: relative;


		&_box2 {
			margin: 20rpx 0;
			display: flex;
			align-items: center;
			color: #FB701E;

			&::before {
				content: '.';
				display: block;
				width: 8rpx;
				height: 100%;
				border-radius: 2.5rpx;
				background-color: #FB701E;
			}
		}

		&_box {
			margin: 30rpx 0;
			display: flex;
			align-items: center;


			&::before {
				content: '';
				display: block;
				width: 8rpx;
				height: 100%;
				border-radius: 2.5rpx;
				background-color: #F7F7F7;
			}

			&_text {
				width: 100%;
				text-align: center;
				font-size: 27rpx;
			}

			&_tips {
				position: absolute;
				top: 10rpx;
				right: 10rpx;
				background-color: red;
				width: 10rpx;
				height: 10rpx;
				border-radius: 50%;
			}
		}

		&_lines {

			height: 1rpx;
			width: 100%;
			display: flex;
			justify-content: center;

			&_content {
				height: 1rpx;
				width: 30%;
				background-color: #E5E5E5;
			}
		}
	}
</style>