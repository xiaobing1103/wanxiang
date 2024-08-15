<template>
	<z-paging ref="pagingRef">
		<template #top>
			<up-navbar title="AI一键生成PPT" :fixed="false"></up-navbar>
		</template>
		<view class="body">
			<stepTemplate v-if="currentStep == stepEnum.STEP_TEMPLATE"/>
			<selectTheme v-else-if="currentStep == stepEnum.SELECT_THEME"/>
			<createContent @scrollToBottom="onScroolToBottom" v-else-if="currentStep == stepEnum.CREATE_CONTENT"/>
			<previewResult v-else/>
		</view>
		<template #bottom>
			<view class="btn">
				<u-button @click="onNextStep" style="height: 88rpx;border-radius: 15rpx;" type="primary">开始生成PPT吧</u-button>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import {ref,nextTick} from 'vue'
	
	import stepTemplate from './components/stepTemplate.vue'
	import selectTheme from './components/selectTheme.vue'
	import createContent from './components/createContent.vue'
	import previewResult from './components/previewResult.vue'
	
	enum stepEnum{
		'STEP_TEMPLATE' = 0,
		'CREATE_CONTENT' = 1,
		'SELECT_THEME' = 2,
		'PREVIEW_RESULT' = 3
	}
	const pagingRef = ref()
	//滚动到底部
	const onScroolToBottom = () =>{
		nextTick(() => {
			if (pagingRef.value) {
				console.log('滚起来')
				pagingRef.value.scrollToBottom()
			}
		})
	}
	//当前步骤
	const currentStep = ref(stepEnum.STEP_TEMPLATE)
	//下一个步骤
	const onNextStep = () =>{
		currentStep.value++
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