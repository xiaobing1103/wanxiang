<template>
	<div>
		<button @click="handleClick">Click me</button>
		<button @click="handleTemplatesClick">Send Template</button>
	</div>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	export default defineComponent({
		name: 'V35Template',
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
</style>