<template>
	<view>
		<up-popup v-model:show="drawStore.changeProject" @close="close" @open="open">
			<view class="ChangeDrawProject">
				<view class="ChangeDrawProject_header">
					切换
				</view>
				<view class="ChangeDrawProject_main">
					<template v-for="(items,index) in Config" :key="index">
						<view class="ChangeDrawProject_main_box" @click="changeProject(index,items.path)">
							<image class="ChangeDrawProject_main_box_image" :src="items.icons" mode=""></image>
							<text class="ChangeDrawProject_main_box_text">{{items.title}}</text>
						</view>
					</template>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { DrawProjectConfig } from '../data';
	defineProps<{ Config : DrawProjectConfig }>()
	import { useDrawStore } from "@/store";
	// 创建响应式数据  
	const show = ref(false);
	const drawStore = useDrawStore()
	const intervalId = defineModel<number | null>("intervalId")

	// 定义方法  
	function open() {
		// 打开逻辑，比如设置 show 为 true  
		drawStore.changeProject = true;
		// console.log('open');  
	}

	function close() {
		// 关闭逻辑，设置 show 为 false  
		drawStore.changeProject = false;
		// console.log('close');  
	}

	const changeProject = (key : string, path : string) => {
		clearInterval(intervalId.value)
		drawStore.setSeletedDrawProject(key)
		uni.navigateTo({
			url: path
		})
	}
</script>

<style scoped lang="scss">
	.ChangeDrawProject {
		display: flex;
		flex-direction: column;
		padding: 0 50rpx;

		&_header {
			display: flex;
			justify-content: center;
			padding: 15rpx 0;
			font-size: 27rpx;
			font-weight: 700;
		}

		&_main {

			display: grid;
			grid-template-columns: repeat(2, 1fr);
			font-size: 27rpx;

			&_box {
				display: flex;

				align-items: center;
				padding: 15rpx 0;

				&_image {
					height: 40rpx;
					width: 40rpx;
				}

				&_text {
					margin-left: 15rpx;
				}
			}
		}
	}
</style>