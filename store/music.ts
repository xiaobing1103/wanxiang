import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserInfoDTO } from '../type/userTypes'
import $api from '@/http'

export interface musicHistoryType {
	audio_url : string
	code : number
	duration : number
	image_url : string
	model : string
	msg : string
	prompt : string
	tags : string
	task_id : string
	title : string
}
export interface VideoHistoryDataType {
	cover_image_url ?: string
	url : string
	title : string
}

const useMusicStore = defineStore("wanxiang_Music", () => {
	const musicHistoryData = ref<Array<musicHistoryType>>([])
	const VideoHistoryData = ref<VideoHistoryDataType[]>([])
	const NumbersPeopleHistoryData = ref<VideoHistoryDataType[]>([])
	const setMusicHistoryData = (newArr : musicHistoryType[]) => {
		musicHistoryData.value = newArr
	}
	// const VideoBase64Image = ref('')
	// const setVideoBase64Image = (base64 : string) => {
	// 	VideoBase64Image.value = base64
	// }
	const addVideoHistoryData = (datas : VideoHistoryDataType) => {
		VideoHistoryData.value.push(datas)
	}

	const deleteNumbersPeopleHistoryData = (url : string) => {
		const currentDatas = NumbersPeopleHistoryData.value.filter((items) => items.url !== url)
		NumbersPeopleHistoryData.value = currentDatas
	}

	const addNumbersPeopleHistoryData = (datas : VideoHistoryDataType) => {
		NumbersPeopleHistoryData.value.push(datas)
	}
	const deleteVideoHistoryData = (cover_image_url : string) => {
		const currentDatas = VideoHistoryData.value.filter((items) => items.url !== cover_image_url)
		VideoHistoryData.value = currentDatas
	}

	const addMusicHistoryData = (datas : musicHistoryType) => {
		const currentId = datas.task_id
		const resetDatas = musicHistoryData.value.find((items) => currentId == items.task_id)
		if (!resetDatas) {
			musicHistoryData.value.push(datas)
		}
	}

	const deleteMusicHistoryData = (task_id : string) => {
		const resetDatas = musicHistoryData.value.filter((items) => task_id !== items.task_id)
		musicHistoryData.value = resetDatas
		uni.$u.toast('删除歌曲成功！');
	}

	return {
		addMusicHistoryData,
		setMusicHistoryData,
		deleteMusicHistoryData,
		musicHistoryData,
		addVideoHistoryData,
		VideoHistoryData,
		deleteVideoHistoryData,
		NumbersPeopleHistoryData,
		addNumbersPeopleHistoryData,
		deleteNumbersPeopleHistoryData,
		// setVideoBase64Image,
		// VideoBase64Image
	}
}, { unistorage: { paths: ['musicHistoryData', 'VideoHistoryData', 'NumbersPeopleHistoryData'] } })
export default useMusicStore