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
					<ZuiProgressCircle :range="[0, 360]" :position="progress" :ringWidth="20" :fixOverlay="true"
						:texture="gradientTexture" :direction="'clockwise'" :linecap="'round'">
						<view class="circle_view">
							<text class="circle_view_text">{{ (progress * 100).toFixed(0) }} %</text>
						</view>
					</ZuiProgressCircle>
				</view>
			</view>
			<text class="circle_view_desc">{{message}}</text>
		</view>
		<view class="tips">
			<text class="tips_top"> 如果一直图片没有加载完成可能是因为服务器压力过大的原因，请您耐心等待，您也可以尝试其他图片生成项目
			</text>
		</view>
		<ChangeDrawProject :Config="config" v-model:intervalId="intervalId" />
	</z-paging>
</template>

<script setup lang="ts">
	import ZuiProgressCircle from '../ZuiProgressCircle/components/zui-progress-circle/zui-progress-circle.vue'
	import { onMounted, onUnmounted, ref } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue'
	import CommonTitle from '@/components/CommonTitle.vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import ChangeDrawProject from '../ChangeDrawProject'
	import { useDrawStore } from '@/store';
	import { drawTaskJson, taskIdTypeKey } from '@/store/draw';
	import { DrawProjectConfig, drawProjectConfig } from '../../data';

	const config = ref<DrawProjectConfig>(drawProjectConfig)
	const progress = ref(0.01)
	const intervalId = ref<number | null>(null);
	const { $api } = useGlobalProperties()
	const drawStore = useDrawStore()

	const gradientTexture = [
		[
			45,
			'#FF66B2',
			'#6A0D91'
		],
		[
			135,
			'#E0F7FA',
			'#00796B'
		]
	];

	const message = ref('')
	const changeProject = () => {
		drawStore.setChangeProject(true)
	}
	onMounted(() => {
		const taskId = drawStore.taskIdParmas[drawStore.seletedDrawProject].task_id
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
				if (isRequesting) {
					intervalId.value = setTimeout(() => queryTask(taskId), 5000);
				}
			} else if (data.state === '1') {
				message.value = '生成成功，正在取回图片，预计需要5-10秒';
				progress.value = m / 100;
				if (isRequesting) {
					intervalId.value = setTimeout(() => queryTask(taskId), 5000);
				}
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
		console.log('卸载组件')
		if (intervalId.value) {
			clearInterval(intervalId.value);
		}
	});

	const handlerImages = async (data : drawTaskJson) => {
		const taskType : taskIdTypeKey = drawStore.seletedDrawProject;
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
		await $api.post('api/v1/number2/submit', { number: data?.images.length, type: "draw" })
		uni.navigateTo({
			url: '/pages/draw/subPage/PreviewPage/index',
			success: res => {

			},
			fail: () => { },
			complete: () => {

			}
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


	.tips {
		padding: 25rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		&_top {
			font-size: 27rpx;
			color: $aichat-border-color;
		}

		&_bottom {
			width: 80%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 100rpx 0;
			padding: 25rpx;
			font-size: 30rpx;
			border-radius: 1.09375rem !important;
			height: 80rpx !important;
			color: #ffffff !important;
			background: linear-gradient(to right, #1cd8ba, #06c0f9);
			cursor: pointer;
		}
	}
</style>