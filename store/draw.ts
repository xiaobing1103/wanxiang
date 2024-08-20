import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Image2TextParmas, drawProjectConfig } from '@/pages/draw/data';
import { deepClone } from '@/utils/deepClone';
import { useGlobalProperties } from '@/hooks/useGlobalHooks';
export interface drawTaskJson {
	create_time: string;
	do_use: number;
	end_in: string;
	error: null;
	id: string;
	images: string[];
	queue: number;
	start_in: string;
	state: string;
	state_name: string;
	task_id: string;
	time: number;
	wait_for: number;
}

export type taskIdTypeKey = 'txt2img_task_json' | 'img2img_task_json' | 'coloringLineArt_task_json' | 'image2cartoon_task_json' | 'partialRepaint_task_json';

// 定义每种任务类型的历史记录数据
export type taskIdTypesData = {
	task_id: string;
	historyTasks: drawTaskJson[];
};

const useDrawStore = defineStore(
	'wanxiang_drawStore',
	() => {
		const seletedDrawProject = ref<taskIdTypeKey>('txt2img_task_json');
		const changeProject = ref(false);
		const currentIamgeBase64 = ref('');
		const currentParmasData = ref();
		const { $api } = useGlobalProperties();
		const taskIdParmas = ref<Record<taskIdTypeKey, taskIdTypesData>>({
			txt2img_task_json: {
				task_id: '',
				historyTasks: [] as drawTaskJson[]
			},
			img2img_task_json: {
				task_id: '',
				historyTasks: [] as drawTaskJson[]
			},
			coloringLineArt_task_json: {
				task_id: '',
				historyTasks: [] as drawTaskJson[]
			},
			image2cartoon_task_json: {
				task_id: '',
				historyTasks: [] as drawTaskJson[]
			},
			partialRepaint_task_json: {
				task_id: '',
				historyTasks: [] as drawTaskJson[]
			}
		});

		// 更新任务 ID 参数的方法
		const setTaskIdParmas = (key: taskIdTypeKey, data: taskIdTypesData) => {
			taskIdParmas.value[key] = data;
		};

		// 设置当前的绘画项目
		const setSeletedDrawProject = (value: taskIdTypeKey) => {
			seletedDrawProject.value = value;
		};
		const setChangeProject = (value: boolean) => {
			changeProject.value = value;
		};
		const setCurrentIamgeBase64 = (value: string) => {
			currentIamgeBase64.value = value;
		};
		const setCurrentParmasData = (value: any) => {
			currentParmasData.value = value;
		};

		const getTask = async (parmas: any) => {
			let isformDataRequest = true;
			if (seletedDrawProject.value == 'img2img_task_json' || seletedDrawProject.value == 'image2cartoon_task_json') {
				isformDataRequest = false;
			}
			let taskDTO = await $api.post<Image2TextParmas>(drawProjectConfig[seletedDrawProject.value].api, parmas, isformDataRequest);
			console.log(taskDTO);
			if (taskDTO && typeof taskDTO == 'string') {
				taskDTO = JSON.parse(taskDTO);
			}
			if (taskDTO.code == 200) {
				if (taskDTO.data.task_id) {
					// 获取当前的任务数据
					const currentData = taskIdParmas.value[seletedDrawProject.value];
					setTaskIdParmas(seletedDrawProject.value, {
						task_id: taskDTO.data.task_id,
						historyTasks: currentData.historyTasks as drawTaskJson[]
					});

					uni.navigateTo({
						url: `/pages/draw/subPage/QueueQueryPage/index`
					});
				}
			} else {
				uni.$u.toast(taskDTO.message);
			}
		};
		return {
			taskIdParmas,
			setTaskIdParmas,
			setSeletedDrawProject,
			seletedDrawProject,
			changeProject,
			setChangeProject,
			setCurrentIamgeBase64,
			currentIamgeBase64,
			currentParmasData,
			setCurrentParmasData,
			getTask
		};
	},
	{ unistorage: { paths: ['taskIdParmas', 'seletedDrawProject', 'currentIamgeBase64', 'currentParmasData'] } }
);
export default useDrawStore;
