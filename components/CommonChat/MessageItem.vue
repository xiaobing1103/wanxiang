<template>
	<view class="markdown">
		<zero-markdown-view :markdown="msgContent"></zero-markdown-view>
	</view>

</template>

<script setup lang="ts">
	import { computed } from 'vue';
	const props = defineProps<{ content : string }>()
	const msgContent = computed(() => {
		const { content } = props
		console.log(content)
		if (!content) {
			return;
		}
		let htmlString = "";
		// 判断markdown中代码块标识符的数量是否为偶数
		if (content.split("```").length % 2) {
			let msg = content;
			if (content[content.length - 1] != "\n") {
				msg += "\n";
			}
			htmlString = content;
		} else {
			htmlString = content;
		}
		return htmlString;
	})
</script>

<style lang="scss">
.markdown{
	width: 100%;
}
</style>