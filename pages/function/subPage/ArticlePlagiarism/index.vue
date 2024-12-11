<template>
	<ArtistWriteComTem :tabconfigData="tabconfigData" :currentType="currentType" :defineFunctions="defineFunctions" />

</template>

<script setup lang="ts">
	import { reactive, ref } from 'vue';
	import ArtistWriteComTem from '../ArtistWriteComTem.vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const { $api } = useGlobalProperties();

	const tabconfigData = [
		{
			name: '提交检测',
			imgSrc: 'http://file.1foo.com/2024/05/20/dcc361b90ef4fea67e85e31a60d37e71.png'
		},
		{
			name: '改写列表',
			imgSrc: 'http://file.1foo.com/2024/05/20/e8bcfc7a6e18b2eb5cfcf81ad49e9ae2.png'
		},
		{
			name: '我的文件',
			imgSrc: 'http://file.1foo.com/2024/05/20/c29b43ea8c0b4301fe0f7c1fa6c32f6a.png'
		}
	]
	const aigcTaskCheck = async (parmas : { file_id : number; rewrite_sw : number; score : 30 }, headers ?: any) => {
		return await $api.post('https://appc.1foo.com/api/app/aigc/task/rewrite', parmas, null, { 'Content-Type': 'multipart/form-data', ...headers })
	}

	const taskLists = async (data ?: { file_id : number; rewrite_sw : number; score : 30 }, headers ?: any) => {
		return await $api.post('https://appc.1foo.com/api/app/aigc/task/rewriteList', data, null, { 'Content-Type': 'multipart/form-data', ...headers })
	}

	const tasksEmpty = async (headers : any) => {
		return await $api.post('https://appc.1foo.com/api/app/aigc/task/emptyRewrite', {}, null, headers)
	}

	const tasksDelete = async (param : { task_id : Key }, headers : any) => {
		return await $api.post('https://appc.1foo.com/api/app/aigc/task/deleteRewrite', param, null, headers)
	}

	const defineFunctions = reactive<DefineFunc>({
		aigcTaskCheck,
		taskLists,
		tasksEmpty,
		tasksDelete,
	})

	const currentType = ref('智能降AIGC')
</script>