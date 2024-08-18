
<template>
	<z-paging ref="srollRef" :pagingStyle="{ background: 'rgb(246, 247, 249)', padding: '0 0rpx' }">
		<template #top>
			<CommonHeader />
		</template>
		<!-- 对话框 -->
		<!-- v-model:itemMessages="itemMessages" -->
		<view class="body">
			<view class="Doodles">
				<v-sign :width="winWidth + 'px'" @init="onSignInit">
					<!-- <v-sign-action @save="save" @clear="clear" @prev="revoke"></v-sign-action> -->
					<v-sign-pen></v-sign-pen>
				</v-sign>
			</view>
		</view>

		<template #bottom>
			<!-- 气泡选择 -->
			dsfds
			<!-- 聊天输入框 -->
			fdsfds
			<!-- <up-input v-model="chatValue" @changeData="changeData">修改子组件的数据</up-input> -->
		</template>
	</z-paging>
</template>

<script setup lang="ts">
import CommonHeader from '@/components/CommonHeader.vue'
import { useScreenStore } from '@/store'
import { ref } from 'vue'
const ScreenStore = useScreenStore()
const winWidth = ref(ScreenStore.systemInfo.windowWidth)
const signContext = ref(null)
const onSignInit = (signCtx) => {
	signContext.value = signCtx
}

const clear = () => {
	signContext.value.clear()
}
const save = (tempFilePath) => {
	console.log(tempFilePath);
}
const revoke = () => {
	signContext.value.revoke()
}
</script>

<style lang="scss"></style>