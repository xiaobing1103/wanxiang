<template>
	<z-paging ref="srollRef" :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader />
		</template>
		<view class="body">
			<view class="QueueQueryPage">
				<view class="QueueQueryPage_header">
					<CommonTitle title="查询任务" desc="请耐心等待任务完成" />
				</view>
				<view class="QueueQueryPage_main">
					<zui-progress-circle :range="[0, 360]" :position="progress" :ringWidth="20" :fixOverlay="true"
						:texture="gradientTexture" :direction="'clockwise'" :linecap="'round'">
						<view class="circle_view">
							<text class="circle_view_text">{{ (progress * 100).toFixed(0) }} %</text>
						</view>
					</zui-progress-circle>
				</view>
			</view>
			<text class="circle_view_desc">{{message}}</text>
		</view>

		<!-- <template #bottom>
			<button @click="increaseProgress">增加进度</button>
		</template> -->
	</z-paging>
</template>

<script setup lang="ts">
	import { onMounted, onUnmounted, ref } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import CommonTitle from '@/components/CommonTitle.vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { onLoad } from '@dcloudio/uni-app'
	import { useDrawStore } from '@/store';
	import { drawTaskJson, taskIdTypeKey } from '@/store/draw';
	const progress = ref(0.01)
	const intervalId = ref<number | null>(null);
	const { $api } = useGlobalProperties()
	const drawStore = useDrawStore()
	const gradientTexture = [
		// 前景纹理：从亮粉色到深紫色的线性渐变
		[
			45,  // 渐变角度
			'#FF66B2', // 起始颜色
			'#6A0D91'  // 结束颜色
		],
		// 背景纹理：从浅蓝色到深蓝色的线性渐变
		[
			135, // 渐变角度
			'#E0F7FA', // 起始颜色
			'#00796B'  // 结束颜色
		]
	];
	const task_id = ref('')
	const historyTask = ref<drawTaskJson>()
	const message = ref('')
	// const increaseProgress = () => {
	// 	if (progress.value < 1) {
	// 		progress.value += 0.01
	// 	}
	// }
	onMounted(() => {
		const taskId = drawStore.taskIdParmas.txt2img_task_json.task_id
		if (taskId) {
			queryTask(taskId)

		} else {
			message.value = '无任务id';
		}

	})
	let isRequesting = false;

	const queryTask = async (taskId : string) => {
		if (isRequesting) return;
		isRequesting = true;
		try {
			const res = await $api.get('api/v1/img/query', { task_id: taskId });
			if (res.code !== 200) {
				message.value = '查询失败';
				return;
			}
			const data = res.data;
			let r = (data.queue + 1) * 2;
			if (data.wait_for > r) {
				r = data.wait_for;
			}
			const m = parseInt(((data.wait_for / r) * 100).toString());
			if (data.state === '0') {
				message.value = '正在排队，预计需要' + r + '秒';
				progress.value = m / 100;
				setTimeout(() => queryTask(taskId), 2000);
			} else if (data.state === '1') {
				message.value = '生成成功，正在取回图片，预计需要5-10秒';
				progress.value = m / 100;
				setTimeout(() => queryTask(taskId), 2000);
			} else if (data.state === '1' && data.do_use > 60) {
				message.value = '请求超时';
			} else if (data.state === '2') {
				message.value = '生成成功,正在加载图片....';
				progress.value = m / 100;
				handlerImages(data)
			} else if (data.state === '3') {
				message.value = '生成失败';
			}
		} catch (error) {
			message.value = '查询失败';
		} finally {
			isRequesting = false;
		}
	};

	onUnmounted(() => {
		if (intervalId.value) {
			clearInterval(intervalId.value);
		}
	});

	const handlerImages = (data : drawTaskJson) => {
		const taskType : taskIdTypeKey = 'txt2img_task_json';
		// 获取当前的任务数据
		const currentData = drawStore.taskIdParmas[taskType];
		// 检查是否已经存在相同任务的数据
		const isTaskAlreadyAdded = currentData.historyTasks.some(task => task.id === data.id);
		if (!isTaskAlreadyAdded) {
			// 更新 historyTasks
			currentData.historyTasks.push(data);
			// 更新 store 中的任务数据
			drawStore.setTaskIdParmas(taskType, {
				task_id: currentData.task_id,
				historyTasks: currentData.historyTasks as drawTaskJson[]
			});
		}
		uni.navigateTo({
			url: '/pages/draw/subPage/PreviewPage/index',
			success: res => { },
			fail: () => { },
			complete: () => { }
		});
	};
</script>

<style lang="scss" scoped>
	.body {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.QueueQueryPage {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;

		&_header {
			padding: 25rpx;
			font-size: 35rpx;
			box-sizing: border-box;
			font-weight: 1000;
		}
	}

	.circle_view {
		display: flex;
		align-items: center;
		flex-direction: column;
		height: 100%;
		justify-content: center;


		&_text {
			font-size: 40rpx;
			font-weight: 1000;
		}

		&_desc {
			padding: 25rpx;
			font-size: 30rpx;
			text-align: center;
		}
	}
</style>