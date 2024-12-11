<template>
	<z-paging :scroll-with-animation="true" :show-scrollbar="false" ref="pagingRef" :pagingStyle="{padding:'0 40rpx '}">
		<template #top>
			<CommonHeader defindTitle="音乐广场" />
		</template>
		<MyCreateMusicPages v-model:playMuiscParmas="playMuiscParmas" :style="{width:'100%'}"
			v-model:currentPages="currentPages" v-model:succes="succes" @overPlays="overPlays" :PublicMuisc="MusicList"
			MusicSquare />
		<template #bottom>
			<template v-if="playMuiscParmas.isPalyMusic">
				<NewCxAudioplay ref='CxAudioplayRef' v-model:succes="succes" v-model:num="num"
					v-model:list="playMuiscParmas.list" v-model:recorPath="playMuiscParmas.currentUrl" />
			</template>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import CommonHeader from '@/components/CommonHeader.vue';
	import NewCxAudioplay from '../CommonComponents/cx-audio-play/index.vue'
	import MyCreateMusicPages from '../CommonComponents/AIMusicCommon/MyCreateMusicPages.vue'
	import { onMounted, reactive, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	const CxAudioplayRef = ref(null)
	const { $api } = useGlobalProperties()
	const pagingRef = ref(null)
	const succes = ref(false)
	const num = ref(0)
	const currentPages = ref(2)
	const playMuiscParmas = reactive({
		list: [],
		isPalyMusic: false,
		currentUrl: '',

	})
	const overPlays = (boo : boolean) => {
		num.value = playMuiscParmas.list.findIndex((item) => item == playMuiscParmas.currentUrl)
		if (boo) {
			CxAudioplayRef.value?.plays('play')
		} else {
			CxAudioplayRef.value?.plays('pause')
		}
	}
	onMounted(() => {
		getPublicMuisc()
	})
	const MusicList = ref([])
	const getPublicMuisc = async () => {
		const MusicListReq = await $api.post('api/v1/music/public')
		console.log(MusicListReq)
		if (MusicListReq.code == 200) {
			MusicList.value = MusicListReq.data
		}
	}
</script>

<style lang="scss" scoped>
</style>