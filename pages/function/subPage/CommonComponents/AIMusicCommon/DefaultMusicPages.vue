<template>
	<view class="DefaultMusicPages">
		<SongsName v-if="currentPages == 0" v-model:commonParmas="commonParmas" />
		<SongComments v-model:currentPages="currentPages" v-model:commonParmas="commonParmas"
			v-if="currentPages == 1 || currentPages == 0" />
		<SongSwitch v-model:commonParmas="commonParmas" />
		<MusicChangeLang :radiolist1="radiolist1" v-model:radiovalue1="radiovalue1" :groupChange="groupChange" />
		<view class="DefaultMusicPages_seleted">
			<view class="DefaultMusicPages_seleted_title">
				作曲引擎
			</view>
			<view class="DefaultMusicPages_seleted_change" @click="openPicker">
				<view>{{commonParmas.mv}}</view>
				<view><up-icon name="arrow-down"></up-icon></view>
			</view>
		</view>
		<view class="DefaultMusicPages_MusicStyle" v-if="currentPages == 0">
			<view class="DefaultMusicPages_MusicStyle_title">
				<text class="DefaultMusicPages_MusicStyle_title_nums"> 音乐风格（最多3个）</text>
				<text class="DefaultMusicPages_MusicStyle_title_somes" @click="showPopup = true">更多</text>
			</view>
			<view class="DefaultMusicPages_MusicStyle_showTags">
				<template v-for="(items,index) in layoutShowTags" :key="index">

					<text @click="ChangeSeletedTags(items)"
						:class="{'activeTags' : commonParmas.tags.find((item)=> item == items)  ,'DefaultMusicPages_MusicStyle_showTags_items': true }">{{items}}</text>
				</template>
			</view>
		</view>
	</view>
	<up-picker @confirm="confirmPicker" @cancel="showPicker = false" :show="showPicker" :columns="columns"></up-picker>
	<up-popup round="15" :show="showPopup" @close="showPopup = false" @open="showPopup =true">
		<view class="viewPopup">
			<view class="viewPopup_header">
				音乐风格 （最多3个）
			</view>
			<view class="viewPopup_header_tabs">
				<up-tabs :current="currentMusicStyle" @change="changeStyle" :itemStyle="{padding:'15rpx 30rpx' }"
					scrollable :list="showTags"></up-tabs>
				<view class="viewPopup_header_tabsContent">
					<template v-for="(items,index) in musicTags.filter((items)=>items.name == currentMusicStyleName)"
						:key="index">
						<view @click="ChangeSeletedTags(items.text)"
							:class="{'activeTags' : commonParmas.tags.find((item)=> item == items.text) ,'DefaultMusicPages_MusicStyle_showTags_items': true }">
							{{items.text}}
						</view>
					</template>
				</view>
			</view>
		</view>
	</up-popup>
</template>

<script setup lang="ts">
	import { reactive, ref } from 'vue';
	import { showTags, musicTags, layoutShowTags, commonParmasType } from '../types'
	import SongsName from './SongsName.vue'
	import SongComments from './SongComments.vue'
	import SongSwitch from './SongSwitch.vue'
	import MusicChangeLang from './MusicChangeLang.vue'
	const commonParmas = defineModel<commonParmasType>('commonParmas')
	const currentPages = defineModel('currentPages')
	const showPicker = ref(false)
	const showPopup = ref(false)
	// const tabs = reactive(showTags)
	const currentMusicStyle = ref(false)
	const currentMusicStyleName = ref('普通')


	const columns = reactive([
		['chirp-v3-5', 'chirp-v3-0']
	]);
	const openPicker = () => {
		showPicker.value = true
	}
	const changeStyle = ({ index, name }) => {
		currentMusicStyle.value = index
		currentMusicStyleName.value = name
	}
	const confirmPicker = ({ value }) => {
		commonParmas.value.mv = value[0]
		showPicker.value = false
	}
	// 基本案列数据
	const radiolist1 = reactive([
		{
			name: '中文',
			disabled: false,
		},
		{
			name: '英文',
			disabled: false,
		}
	]);

	const radiovalue1 = ref('中文');

	const groupChange = (n) => {
		console.log('groupChange', n);
	};
	const ChangeSeletedTags = (items : string) => {
		if (commonParmas.value.tags.includes(items)) {
			commonParmas.value.tags = commonParmas.value.tags.filter((re) => items !== re)
		} else {
			if (commonParmas.value.tags.length < 3) {
				commonParmas.value.tags.push(items)
			} else {
				uni.$u.toast('只能选择三个音乐风格！');
			}
		}

	}
</script>

<style lang="scss" scoped>
	.DefaultMusicPages {
		width: 100%;

		&_input {
			width: 100%;
			padding-bottom: 20rpx;

			&_title {
				padding-bottom: 20rpx;
				font-weight: 800;
				font-size: 27rpx;
			}
		}

		&_switch {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			&_pure {
				margin-left: 20rpx;
				font-size: 27rpx;
				font-weight: 800;
			}
		}


		&_seleted {
			margin-bottom: 20rpx;

			&_title {
				font-size: 27rpx;
				margin-bottom: 20rpx;
				font-weight: 800;
			}

			&_change {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border: 1rpx solid #ccc;
				padding: 10rpx;
				font-size: 27rpx;
				border-radius: 15rpx;
			}
		}

		&_MusicStyle {
			&_showTags {
				display: flex;
				flex-wrap: wrap;

				&_items {
					background: #fff;
					font-size: 24rpx;
					padding: 10rpx 20rpx;
					border-radius: 40rpx;
					margin: 15rpx;
					border: 1rpx solid;
				}

			}

			&_title {
				display: flex;
				justify-content: space-between;

				&_nums {
					font-size: 27rpx;
					font-weight: 800;
				}

				&_somes {
					font-size: 27rpx;
					color: rgb(41, 121, 255);
				}
			}
		}
	}


	.viewPopup {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		font-size: 30rpx;
		width: 100vw;

		&_header {
			font-weight: 800;

			&_tabs {
				// display: flex;
				overflow-x: scroll;

				&_text {
					padding: 0 20rpx;
				}
			}

			&_tabsContent {
				display: flex;
				flex-wrap: wrap;
				max-height: 700rpx;
				overflow-y: scroll;

				&_warp {
					border: 1rpx solid;
					padding: 10rpx;
					border-radius: 15rpx;
					margin: 5rpx;
				}
			}

			&_showTags {}

		}

	}

	.activeTags {
		background: linear-gradient(99.36deg, rgb(180, 88, 255) 0%, rgb(252, 106, 201) 100%);
		color: #fff;
	}
</style>