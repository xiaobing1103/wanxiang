<template>
	<z-paging ref="pagingRef" :pagingStyle="{padding:'24rpx'}">
		<template #top>
			<CommonHeader noBackGround defindTitle="AI真人语音合成" />
		</template>
		<view class="aiVioceDesc">
			<view class="aiVioceDesc_title">
				高拟真度、灵活配置的语音合成产品，打通人机交互的闭环，让应用逼真发声。多种角色可供选择，并提供调节语速、语调、音量等功能
			</view>
			<view class="aiVioceDesc_changeVioceBox">
				<view class="aiVioceDesc_changeVioceBox_header">
					<view class="aiVioceDesc_changeVioceBox_header_title">
						语音合成器
					</view>
				</view>
				<view class="aiVioceDesc_changeVioceBox_input">
					<up-textarea maxlength="500" count v-model="value" placeholder="输入需要转换的文字" />
				</view>
			</view>
			<view class="aiVioceDesc_changeVioceBox">
				<view class="aiVioceDesc_changeVioceBox_header">
					<view class="aiVioceDesc_changeVioceBox_header_title">
						选择真人AI
					</view>
				</view>
				<view class="changeVioceOverBox">
					<view class="changeVioceOverBox_models">
						<template v-for="(items,index) in Tags" :key="index">
							<view class="TagsItems" @click="setShowSound(items,index)"
								:style="{color:showSound == index ?'#69b1ff':''}">
								{{items}}
							</view>
						</template>
					</view>
					<view class="changeVioceOverBox_modelsDatas">
						<template v-for="(datas,index) in data" :key="index">
							<view class="modelsDatas" @click="setShowSoundItems(datas,index)"
								:style="{color:showSoundItems == index ? '#69b1ff' :''}">
								<image class="modelsDatas_images" :src="datas.img" mode=""></image>
								<text class="modelsDatas_text">{{datas.speaker}} - {{datas.speechType}}</text>
								<view class="modelsDatas_tags" v-if="datas.tag">
									{{datas.tag}}
								</view>
							</view>
						</template>
					</view>
				</view>
			</view>
		</view>
		<template #bottom>
			<view class="createVioce">
				<up-button :customStyle="{margin:'35rpx'}" type="primary" class="createVioce_item"
					@click="onCreateVoice">开始合成</up-button>
				<up-button :customStyle="{margin:'35rpx'}" class="createVioce_item" @click="againLintens">重听</up-button>
				<up-button :customStyle="{margin:'35rpx'}" class="createVioce_item" @click="exportMp3">导出音频</up-button>
			</view>
		</template>
	</z-paging>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import CommonHeader from '@/components/CommonHeader.vue';
	import { voicer } from './data'
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { toCopyText } from '@/utils';
	const value = ref('')
	const Tags = ref([])
	const CurTag = ref('')
	const em = ref('')
	const emScale = ref(0)
	const data = ref([])
	const CurData = ref({})
	const showSound = ref(0)
	const showSoundItems = ref(0)
	const { $api } = useGlobalProperties();
	const url = ref('')
	const setShowSound = (items : string, index : number) => {
		showSound.value = index
		showSoundItems.value = 0
		CurTag.value = items
		setCurTags()
		setValue()
	}
	const setShowSoundItems = (items : string, index : number) => {
		showSoundItems.value = index
		CurData.value = items
		setValue()
	}
	onMounted(() => {
		const uniqueScenes = new Set<string>()
		voicer.data.list.forEach((item) => {
			uniqueScenes.add(item.scene)
		})
		Tags.value = Array.from(uniqueScenes)
		CurTag.value = Array.from(uniqueScenes)[0]
		setCurTags()
		setValue()
	})
	const innerAudioContext = wx.createInnerAudioContext({
		useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
	})
	const onCreateVoice = async () => {
		const param = {
			voice: CurData.value?.speakerId,
			volmue: 50,
			speech_rate: 0,
			pitch_rate: 0,
			text:
				(CurData.value?.emotions
					? '<speak><emotion category="' + em.value + '" intensity="' + emScale.value + '">'
					: '') +
				value.value +
				(CurData.value?.emotions != undefined ? '</emotion></speak>' : '')
		}

		console.log(param)
		const takeVoice = await $api.post('api/v1/media/takeVoice', { param: param })
		if (takeVoice.code !== 200) {
			uni.$u.toast('语音合成失败！');
			return
		}
		url.value = 'https://gpt-wechat.java68.cn/' + takeVoice.data
		innerAudioContext.src = url.value
		innerAudioContext.play()
	}
	const againLintens = () => {
		if (!url.value) {
			uni.$u.toast('请先生成音频后重试！');
			return
		}
		innerAudioContext.play()
	}

	const exportMp3 = () => {
		if (!url.value) {
			uni.$u.toast('请先生成音频后重试！');
			return
		}
		toCopyText(url.value, '复制链接成功，请到浏览器打开下载音频文件！')
	}
	const setCurTags = () => {
		if (CurTag.value) {
			const filteredData = voicer.data.list.filter((item) => item.scene === CurTag.value)
			data.value = filteredData
			CurData.value = filteredData[0]
		}
	}

	const setValue = () => {
		value.value = CurData.value?.text
	}
</script>

<style lang="scss" scoped>
	.aiVioceDesc {
		&_title {
			color: #ccc;
			font-size: 24rpx;
			text-align: center;
		}



		&_changeVioceBox {
			border: 1rpx solid #ccc;
			border-radius: 15rpx;
			margin-top: 20rpx;

			&_header {
				border-bottom: 1rpx solid #ccc;
				padding: 15rpx;

				&_title {}
			}

			&_input {
				padding: 5rpx;
			}

			&_models {
				overflow-y: scroll;

			}
		}

	}



	.createVioce {

		display: flex;
		// padding-bottom: 30rpx;

		&_item {
			margin: 15rpx !important;
		}
	}

	.TagsItems {
		margin: 20rpx;
		white-space: nowrap;

	}


	.changeVioceOverBox {
		display: flex;
		flex-direction: column;

		&_models {
			display: flex;
			overflow-x: scroll;
		}

		&_modelsDatas {
			padding: 15rpx;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			align-items: center;

		}
	}

	.modelsDatas {
		padding: 15rpx 0;
		display: flex;
		align-items: center;

		&_images {
			width: 40rpx;
			height: 40rpx;
		}

		&_text {
			margin-left: 5rpx;
			font-size: 25rpx;
			width: 220rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		&_tags {
			margin-left: 10rpx;
			background-color: $aichat-button-color;
			color: white;
			font-size: 20rpx;
			display: flex;
			align-items: center;
			padding: 5rpx;
			border-radius: 5rpx;
		}
	}
</style>