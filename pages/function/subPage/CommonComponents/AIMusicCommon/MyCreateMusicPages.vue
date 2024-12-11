<template>
	<view class="MyCreateMusicPages">
		<template v-if="MusicList.length >0">
			<template v-for="(music,index) in MusicList" :key="index">
				<view class="MyCreateMusicPages_items" :style="{
						background:music.audio_url == playMuiscParmas.currentUrl? 'linear-gradient(99.36deg, rgb(126, 61, 255) 0%, rgb(252, 106, 201) 100%)':'',
						color: music.audio_url == playMuiscParmas.currentUrl? 'white':''
						}">
					<view class="MyCreateMusicPages_items_image">
						<image :style="{width:'100rpx',height:'100rpx',borderRadius:'15rpx'}" :src="music.image_url"
							mode="">
						</image>
					</view>
					<view class="MyCreateMusicPages_items_songsName">
						<text class="MyCreateMusicPages_items_songsName_title">{{music.title}}</text>
						<text class="MyCreateMusicPages_items_songsName_tags">{{music.tags}}</text>
					</view>
					<view class="MyCreateMusicPages_items_songsbuttons">
						<up-icon @click="play(music.audio_url)" :customStyle="{padding:'10rpx'}"
							:name="playMuiscParmas.currentUrl == music.audio_url && succes ?  'pause':'play-right-fill'"></up-icon>
						<up-icon @click="deleteSong(music.task_id)" :customStyle="{padding:'10rpx'}"
							name="trash-fill"></up-icon>
						<up-icon @click="downLoadSong(music.audio_url)" :customStyle="{padding:'10rpx'}"
							name="download"></up-icon>
					</view>
				</view>
			</template>
		</template>
		<template v-else>
			<view class="noData">
				<image class="noData_image" :src="$assets.noData" mode=""></image>
			</view>
		</template>
	</view>

	<up-modal :show="openModal" title="删除歌曲" showCancelButton @confirm="onconfirm" @cancel="oncancel">
		<view class="">
			是否需要删除此歌曲，删除后任何手段将无法恢复！
		</view>
	</up-modal>
</template>

<script setup lang="ts">
	import { computed, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { useMusicStore } from '@/store';
	import { toCopyText } from '@/utils';
	import { musicHistoryType } from '@/store/music';
	const MusicStore = useMusicStore()
	const props = defineProps<{ PublicMuisc ?: Array<musicHistoryType>, MusicSquare ?: boolean }>()
	const MusicList = computed(() => {
		if (props.MusicSquare) {
			return props.PublicMuisc
		} else {
			return MusicStore.musicHistoryData
		}
	})


	const { $api, $assets } = useGlobalProperties()
	const emits = defineEmits(['overPlays'])
	const succes = defineModel('succes')
	const openModal = ref(false)
	const deleteId = ref('')
	const playMuiscParmas = defineModel<{ list : Array<string>, isPalyMusic : boolean, currentUrl : string, }>('playMuiscParmas')
	const play = (url : string) => {
		playMuiscParmas.value.list = MusicList.value.map((items) => items.audio_url)
		if (playMuiscParmas.value.isPalyMusic) {
			playMuiscParmas.value.currentUrl = url
		} else {
			playMuiscParmas.value.currentUrl = url
			playMuiscParmas.value.isPalyMusic = true
		}
		emits('overPlays', succes.value)

	}
	const deleteSong = (id : string) => {
		console.log('deleteSong', id)
		deleteId.value = id
		openModal.value = true
	}
	const downLoadSong = (url : string) => {
		console.log('downLoadSong', url)
		toCopyText(url, '音频文件地址复制成功，请粘贴到浏览器下载！')
	}

	const onconfirm = () => {
		MusicStore.deleteMusicHistoryData(deleteId.value)
	}
	const oncancel = () => {
		openModal.value = false
	}
</script>

<style scoped lang="scss">
	.MyCreateMusicPages {
		width: 100%;

		&_items {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10rpx;
			border-radius: 15rpx;

			&_image {}

			&_songsName {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 20rpx;
				max-width: 400rpx;

				&_title {

					font-weight: 800;
					font-size: 27rpx;
					padding-bottom: 5rpx;
				}

				&_tags {
					font-size: 24rpx;
					color: #ccc;
					max-width: max-content;
					white-space: nowrap;
					overflow: hidden;
					/* 隐藏溢出的文本 */
					text-overflow: ellipsis;
					/* 溢出部分显示省略号 */

				}
			}

			&_songsbuttons {
				display: flex;
			}
		}
	}

	.noData {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;

		&_image {
			width: 100%;
			height: 400rpx;
			padding: 50% 0;
		}

	}
</style>