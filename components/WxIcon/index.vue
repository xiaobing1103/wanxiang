<template>
	<view class="icon-content">
		<!-- 彩色图标 -->
		<view v-if="type=='symbol'" :class="symbolClasses" :style="[symbolIconStyle, $u.addStyle(customStyle)]"/>
	</view>
</template>

<script setup lang="ts">
	import {computed} from 'vue'
	interface Props{
		type?:"symbol" | "icon",
		size?:number;
		name:string;
		customStyle?:Record<string,any>
		color?:string;
	}
	const props = withDefaults(defineProps<Props>(),{
		size:16,
		type:'symbol'
	})
	
	const symbolClasses = computed(() =>{
		let classes = []
		classes.push('wx-' + props.name, 'wx')
		return classes.join(' ')
	})
	
	const symbolIconStyle = computed(() =>{
		let style = {}
		style = {
			width: uni.$u.addUnit(props.size),
			height: uni.$u.addUnit(props.size),
		}		
		return style
	})
</script>

<style lang="scss" scoped>
	@import './iconfont/symbol-icon.css';
</style>