<template>
	<view class="ImageLoraScale">
		<up-slider v-model="sliderValue" :min="min" :max="max" showValue :blockStyle="{ background: 'red' }">
		</up-slider>
		<!-- <hao-slider ref="haoSlider" :value="sliderValue" :min="min" :max="max"></hao-slider> -->
	</view>
</template>

<script setup lang="ts">
	import { computed, defineProps } from 'vue';
	import { Image2TextParmas } from '../../data';
	const props = defineProps<{ type : 'loraScale' | 'step' | 'cfg_scale' | 'denoising_strength' | 'weight', min : string, max : string }>();
	const parmas = defineModel<Image2TextParmas>('parmas');
	const sliderValue = computed({
		get: () => {
			if (props.type === 'loraScale') {
				return parmas.value.loraScale;
			} else if (props.type === 'step') {
				return parmas.value.step;
			} else if (props.type === 'cfg_scale') {
				return parmas.value.cfg_scale;
			} else if (props.type === 'denoising_strength') {
				return parmas.value.denoising_strength;
			} else if (props.type === 'weight') {
				return parmas.value.weight;
			}
		},
		set: (value : number) => {
			if (props.type === 'loraScale') {
				parmas.value.loraScale = value;
			} else if (props.type === 'step') {
				parmas.value.step = value;
			} else if (props.type === 'cfg_scale') {
				parmas.value.cfg_scale = value;
			} else if (props.type === 'weight') {
				return parmas.value.weight;
			}
		},
	});
</script>

<style lang="scss" scoped>
	.ImageLoraScale {
		width: 100%;
		// Add your styles here, if any
	}
</style>