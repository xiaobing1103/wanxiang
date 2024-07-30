<template>
	<z-paging :pagingStyle="{background:'rgb(246, 247, 249)',padding:'0 30rpx'}">
		<template #top>
			<CommonHeader />
		</template>
		<!-- 对话框 -->
		<CommonChat />
		<template #bottom>
			<!-- 气泡选择 -->
			<ChatInputToolTipVue />
			<!-- 聊天输入框 -->
			<Chat />
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import api from '@/api/api.ts'
	import Chat from "@/components/CommonChat/Chat.vue"
	import CommonHeader from '@/components/CommonHeader.vue'
	import CommonChat from '@/components/CommonChat/index.vue'
	import ChatInputToolTipVue from '@/components/CommonChat/ChatInputToolTip.vue'
	import {
		ref
	} from 'vue';
	const show = ref(true);
	const title = ref('带我去带我去五点前')
	const list = ref([{
		text: '点赞',
		color: 'blue',
		fontSize: 28
	},
	{
		text: '分享'
	},
	{
		text: '评论'
	}
	]);
	const onLoad = () => {
		console.log(123)
	}

	// export default {
	// 	components: {

	// 	},
	// 	data() {
	// 		return {
	// 			title: 'He带我去带我去五点前llo'
	// 		}
	// 	},
	// 	onLoad() {

	// 	},
	// 	methods: {

	// 	}
	// }
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column
	}
</style>