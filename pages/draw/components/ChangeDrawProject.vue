<template>
	<view class="ChangeDrawProject">
		<view>
			<up-popup :show="show" @close="close" @open="open">
				<view>
					<text>出淤泥而不染，濯清涟而不妖</text>
				</view>
			</up-popup>
			<up-popup v-model:show="show">
				<view>
					<text>出淤泥而不染，濯清涟而不妖</text>
				</view>
			</up-popup>
			<up-button @click="show = true">打开</up-button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';

	// 创建响应式数据  
	const show = ref(false);

	// 定义方法  
	function open() {
		// 打开逻辑，比如设置 show 为 true  
		show.value = true;
		// console.log('open');  
	}

	function close() {
		// 关闭逻辑，设置 show 为 false  
		show.value = false;
		// console.log('close');  
	}
</script>

<style scoped lang="scss">
</style>