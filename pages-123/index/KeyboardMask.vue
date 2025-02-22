<template>
	<up-transition :show="show" mode="fade-up">
		<view class="keyboard-mask" @click="onClick" @touchmove.prevent></view>
	</up-transition>
</template>

<script setup lang="ts">
	defineProps({
		show: {
			type: Boolean,
			default: false
		}
	})

	const emit = defineEmits(['click'])

	const onClick = () => {
		emit('click')
	}
</script>

<style lang="scss" scoped>
	.keyboard-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.1);
		z-index: 998;
		transition: opacity 0.3s;
		touch-action: none;
		/* #ifdef H5 */
		cursor: default;
		/* #endif */
	}
</style>