<template>
	<view>
		<!-- ħ������ -->
		<view class="V35Template">
			11👋你好啊，我是🐘万象AI,很高兴认识你！，我可厉害�😎 对话、绘画�写作什么的统统不在话下，想试试吗？
		</view>		
		<!-- �˵� -->
		<ChatMenuTooltip/>
	</view>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import ChatMenuTooltip from '@/components/CommonChat/ChatMenuTooltip.vue'
	export default defineComponent({
		name: 'V35Template',
		components:{
			ChatMenuTooltip
		},
		props: {
			onFun: {
				type: Function,
				required: true
			},
			onTemplates: {
				type: Function,
				required: true
			}
		},
		methods: {
			handleClick() {
				this.onFun('Sample string from V35Template');
			},
			handleTemplatesClick() {
				this.onTemplates('Sample message from V35Template');
			}
		}
	});
</script>

<style scoped>
	/* 你的样式 */
	.V35Template {
		background-color: white;
		padding: 15rpx;
		border-radius: 10rpx;
	}
</style>