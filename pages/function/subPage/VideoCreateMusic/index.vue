<template>
	<FileCreateMusic :FileParmas="FileParmas" />
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import FileCreateMusic from '../CommonComponents/AIMusicCommon/FileCreateMusic.vue'
	const language = ref('')
	const FileParmas = {
		title: 'AI图片创作音乐',

		srouce: [
			{
				name: '桥下泛舟',
				lyrics: '桥下泛舟,划破湖面\n 绿树成荫,阳光灿烂\n 一人一舟,悠悠荡荡\n 心旷神怡,好不惬意\n  \n 桥上人来人往\n 桥下我独自悠然\n 任凭风吹雨打\n 此处风景独好\n \n 桥下泛舟,划破湖面\n 绿树成荫,阳光灿烂\n 一人一舟,悠悠荡荡\n 心旷神怡,好不惬意',
				audio_url: 'https://gpt.53at.com/music/桥下泛舟.mp3',
				image_url: 'http://file.1foo.com/2024/10/22/de9ae33d915ab121940b94743ab8fa92.png'
			},
			{
				name: '兔子打字',
				lyrics: '(副歌)\n 兔子打字,快又准,\n 键盘敲击,不停顿。\n 桌上糕点,一旁放,\n  月亮照耀,夜色浓。\n \n (副歌)\n 兔子打字,快又准,\n 键盘敲击,不停顿。\n 桌上糕点,一旁放,\n  月亮照耀,夜色浓。\n  \n',
				audio_url: 'https://gpt.53at.com/music/兔子打字.mp3',
				image_url: 'http://file.1foo.com/2024/10/22/4b5656bcedc66fe5eac530c24317e110.png'
			},
			{
				name: 'Ocean Breeze',
				lyrics: `Verse 1:\n On the sandy shore, where the waves gently crash,\n  A silhouette stands, in the sun's warm embrace.\n Long hair flows, like the sea's endless grace,\n  In a world of blue, where dreams take flight.\n \n Chorus:\n Ocean breeze, carry my thoughts away,\n In thi`,
				audio_url: 'https://gpt.53at.com/music/Ocean Breeze.mp3',
				image_url: 'http://file.1foo.com/2024/10/22/5a141bcd6d90619fded8047dd790a536.png'
			},
		],
		requestUrl: '',
		prompt: `为该图片创作一首${language.value}，直接输出歌名歌曲歌词就可以了`
	}
</script>

<style lang="scss" scoped>
</style>