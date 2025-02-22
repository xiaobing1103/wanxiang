<template>
	<FileCreateMusic :FileParmas="FileParmas" />
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import FileCreateMusic from '../CommonComponents/AIMusicCommon/FileCreateMusic.vue'
	const language = ref('')
	const FileParmas = {
		title: 'AI图片创作音乐',
		srouce: [{
			name: '狗狗的温柔',
			lyrics: 'Verse \n  在柔软的沙发上，我找到了我的家戴着墨镜，耳机里播放着音乐我是一只温柔的狗狗，享受着这份宁静\n  "Chorus:哦，狗狗的温柔，像阳光洒满心房哦，狗狗的温柔，让世界变得不一样',
			audio_url: 'https://gpt.53at.com/music/狗狗的温柔.mp3',
			image_url: 'http://file.1foo.com/2024/10/22/21ae342ee7daf741f866043fd67aac60.png'
		},
		{
			name: '奔驰的旋律',
			lyrics: '奔驰的旋律，唤醒了沉睡的心灵，\n  我们不畏艰难，勇往直前，\n 在这片激情的舞台上，我们绽放光芒。',
			audio_url: 'https://gpt.53at.com/music/奔驰的旋律.mp3',
			image_url: 'http://file.1foo.com/2024/10/22/7b79ec59c43e85bdddbb3111b18b2a2a.png'
		},
		{
			name: 'Whispers of the Night',
			lyrics: 'Verse 1:\n  In the shadows where the moonlight weeps,\n A silhouette stands, a mystery deep.\nWhispers of the night, secrets untold,\n In the darkness, where the world grows old.\n \n Chorus:\n Whispers of the night, guide me through the dark,\n In the silence, where the truth is stark.\n Whispers of the night, lead me to the light,\n In the darkness, where the world takes flight.',
			audio_url: 'https://gpt.53at.com/music/Elegance in Shadows.mp3',
			image_url: 'http://file.1foo.com/2024/10/22/d7d6c128c9655499476c489c06bd2b08.png'
		},
		],
		requestUrl: '',
		prompt: `为该图片创作一首${language.value}，直接输出歌名歌曲歌词就可以了`,
		example: `   示例（Examples）
        
    歌名：鱿鱼游戏
     
    歌词:
    
    Verse 1:  
    鱿鱼鱿鱼，游戏开始  
    你追我赶，不分昼夜  
    快乐时光，如此短暂  
    珍惜当下，不要错过
    
    Chorus:  
    鱿鱼游戏，欢乐无限  
    让我们一起，尽情玩耍  
    鱿鱼游戏，永不结束  
    让我们一起，追逐梦想
    
    Verse 2:  
    鱿鱼鱿鱼，游戏继续  
    变幻莫测，充满惊喜  
    挑战自我，不断超越  
    成为最强，是我们的目标
    
    Chorus:  
    鱿鱼游戏，欢乐无限  
    让我们一起，尽情玩耍  
    鱿鱼游戏，永不结束  
    让我们一起，追逐梦想
    
    Bridge:  
    鱿鱼鱿鱼，不要害怕  
    即使失败，也不要放弃  
    坚持到底，就是胜利  
    让我们一起，迎接未来
    
    Chorus:  
    鱿鱼游戏，欢乐无限  
    让我们一起，尽情玩耍  
    鱿鱼游戏，永不结束  
    让我们一起，追逐梦想
    
    Outro:  
    鱿鱼鱿鱼，游戏结束  
    回忆满满，感慨万千  
    珍惜友谊，不要忘记  
    让我们一起，迎接未来
     
    请以这样的格式输出
    
    为该视频创作一首${language.value}，直接输出歌名歌曲歌词就可以了`
	}
</script>

<style lang="scss" scoped>
</style>