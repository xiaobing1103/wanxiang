<template>
	<view class="DefaultMusicPages_lang">
		<view class="DefaultMusicPages_lang_title">
			<text class="DefaultMusicPages_lang_title_top">音乐语言</text>
			<text class="DefaultMusicPages_lang_title_buttom">中文歌词用中文，英文歌词用英文，系统会自动适配</text>
		</view>
		<view class="DefaultMusicPages_lang_tabs">
			<up-radio-group v-model="radiovalue1" @change="groupChange">
				<up-radio :customStyle="{marginRight: '8px'}" v-for="(item, index) in radiolist1" :key="index"
					:label="item.name" :name="item.name">
				</up-radio>
			</up-radio-group>
		</view>
	</view>

</template>

<script setup lang="ts">
	const radiovalue1 = defineModel('radiovalue1')
	defineProps<{
		radiolist1 : {
			name : string;
			disabled : boolean;
		}[],
		groupChange : () => void
	}>()
</script>

<style scoped lang="scss">
	.DefaultMusicPages_lang {

		&_title {
			display: flex;
			flex-direction: column;

			&_top {
				font-weight: 800;
				font-size: 27rpx;
			}

			&_buttom {
				font-size: 24rpx;
				color: #ccc;
			}
		}

		&_tabs {
			padding: 20rpx 0;
		}
	}
</style>