import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export interface drawTaskJson {
	create_time : string
	do_use : number
	end_in : string
	error : null
	id : string
	images : string[]
	queue : number
	start_in : string
	state : string
	state_name : string
	task_id : string
	time : number
	wait_for : number
}

export type taskIdTypeKey = 'txt2img_task_json' | 'img2img_task_json';

// 定义每种任务类型的历史记录数据
export type taskIdTypesData = {
	task_id : string;
	historyTasks : drawTaskJson[];
};

const useDrawStore = defineStore("wanxiang_drawStore", () => {
	const taskIdParmas = ref<Record<taskIdTypeKey, taskIdTypesData>>({
		'txt2img_task_json': {
			task_id: '',
			historyTasks: [] as drawTaskJson[]
		},
		'img2img_task_json': {
			task_id: '',
			historyTasks: [
			] as drawTaskJson[]
		}
	});

	// 更新任务 ID 参数的方法
	const setTaskIdParmas = (key : taskIdTypeKey, data : taskIdTypesData) => {
		taskIdParmas.value[key] = data;
	};

	return {
		taskIdParmas,
		setTaskIdParmas
	}
}, { unistorage: { paths: ['taskIdParmas'] } })
export default useDrawStore