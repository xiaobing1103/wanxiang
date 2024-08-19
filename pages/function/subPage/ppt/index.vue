<template>
		<stepTemplate @next="onNextStep" v-if="currentStep == stepEnum.STEP_TEMPLATE"></stepTemplate>
		<createContent @next="onNextStep"  v-else-if="currentStep == stepEnum.CREATE_CONTENT"/>
		<updateContent v-model="createForm.content" @next="onNextStep"  v-else-if="currentStep == stepEnum.UPDATE_CONTENT"/>
		<selectTheme  @next="onNextStep" v-else-if="currentStep == stepEnum.SELECT_THEME"/>
		<previewResult @download="onDwonLoad"  @preview="onPreview" v-else-if="currentStep == stepEnum.PREVIEW_RESULT"/>
</template>

<script setup lang="ts">
	import {ref,nextTick} from 'vue'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks.ts'
	import {useUserStore} from '@/store/index'
	import stepTemplate from './components/stepTemplate.vue'
	import selectTheme from './components/selectTheme.vue'
	import createContent from './components/createContent.vue'
	import previewResult from './components/previewResult.vue'
	import updateContent from './components/updateContent.vue'
	import APP_CONFIG from '@/config/config.ts'
	
	enum stepEnum{
		'STEP_TEMPLATE' = 0,
		'CREATE_CONTENT' = 1,
		'UPDATE_CONTENT' = 2,
		'SELECT_THEME' = 3,
		'PREVIEW_RESULT' = 4
	}
	const { $api } = useGlobalProperties()
	const userStore = useUserStore()
	const previewRef = ref()
	//当前步骤
	const currentStep = ref(stepEnum.STEP_TEMPLATE)
	//任务_id
	const taskId = ref('')
	//内容
	const createForm = ref({
		id:'',
		content:'',
		type:''
	})
	//创建一个PPT
	const createPpt =  ():Promise<string> =>{
		return new Promise(async (reslove,reject) =>{
			try{
				const res = await $api.post('api/v1/ppt/create',createForm.value)
				reslove(res.data.task_id)
			}catch(err){
				reject()
			}
		})
	}
	//小程序下载
	const wechatDownLoad = async() =>{
		const userInfo = userStore.userInfo;
		uni.downloadFile({
			url:`https://ai1foo.com/api/v1/ppt/down?id=`+taskId.value,
			header:{
				'Access-Token':userInfo.access_token,
				'App':userInfo.appid,
				'token':userInfo?.token,
				'Vt':userInfo?.vip,
				'uid':userInfo?.id
			},
			success(res) {
				uni.openDocument({
					filePath:res.tempFilePath,
					fileType:'ppt',
					showMenu:true,
					success(res) {
						console.log(res,"res")
					},
					fail(err) {
						console.log(err,"err")
					}
				})
			},
			fail(err) {
				console.log(err,"err")
			}
		})
	}
	//h5下载
	const h5Download = async () =>{
		uni.showLoading({
			title:'正在下载...',
			icon:'none'
		})
		try{
			const res = await $api.get('api/v1/ppt/down?id='+taskId.value,null,{
				'Content-Type':'application/x-www-form-urlencoded'
			})
			const bl = new Blob([res], {
				type: "application/octet-stream;charset=utf-8",
			});
			const url = window.URL.createObjectURL(bl);
			const a = document.createElement("a");
			a.href = url;
			a.download = "PDF文件下载_" + new Date().getTime() + ".pptx";
			document.body.appendChild(a); // 添加到DOM中以触发下载
			a.click();
			a.remove(); // 然后从DOM中移除
			window.URL.revokeObjectURL(url);
			uni.hideLoading()	
		}catch(err){
			uni.hideLoading()	
		}
	}
	//下载ppt
	const onDwonLoad = async () =>{
		// #ifdef MP-WEIXIN
			wechatDownLoad()
		// #endif
		// #ifdef H5
			h5Download()
		// #endif
	}
	//预览ppt
	const onPreview = async () =>{
		const res = await $api.post('api/v1/ppt/createNewPPT',createForm.value)
		console.log(res,"res.data")
		if(res.data){
			uni.navigateTo({
				url:'/pages/function/subPage/webview/index?url='+res.data.url
			})	
		}
	}
	//下一个步骤
	const onNextStep = async (val?:any) =>{
		switch(currentStep.value){
			case stepEnum.STEP_TEMPLATE:
				currentStep.value++
				break;
			case stepEnum.CREATE_CONTENT:
				createForm.value.content = val.content
				createForm.value.type = val.type
				currentStep.value++
				break;
			case stepEnum.UPDATE_CONTENT:
				currentStep.value++
				break;
			case stepEnum.SELECT_THEME:
				createForm.value.id = val
				const res = await createPpt()
				taskId.value = res
				currentStep.value++
				break;
			case stepEnum.PREVIEW_RESULT:
				break;
		}
	}
</script>

<style lang="scss" scoped>
	.body{
		padding: 28rpx;
	}
	.btn{
		padding: 28rpx;
	}
</style>