<template>
	<up-modal :show="showImageModal" :closeOnClickOverlay="true" @close="emit('closeImage')" @confirm="confirm"
		ref="uModal">
		<template #confirmButton>
			发到手机哦发动机死哦
		</template>
	</up-modal>
</template>

<script setup lang="ts">
	import { ref } from 'vue';

	const props = defineProps<{ showImageModal : boolean }>()
	const emit = defineEmits<{
		(event : 'closeImage') : void;
	}>();
	const confirm = () => {
		emit('closeImage');
		console.log(123123, props.showImageModal + '')
	};
</script>

<style lang='scss'>
</style>