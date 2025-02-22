export const exampleData = [
	{
		url: 'https://sfile.chatglm.cn/testpath/video_cover/656fa9f4-41fc-5f83-b5c7-03f4c551fb53_cover_0.png',
		text: '一只土拨鼠在吃冰淇淋',
		playUrl: 'https://sfile.chatglm.cn/testpath/video/656fa9f4-41fc-5f83-b5c7-03f4c551fb53_0.mp4'
	},
	{
		url: 'https://sfile.chatglm.cn/testpath/video_cover/ce53b179-0954-5f2a-8129-78aa65f7a35e_cover_0.png',
		text: '人物的眼光闪烁，眼罩上的光闪动',
		playUrl: 'https://sfile.chatglm.cn/testpath/video/ce53b179-0954-5f2a-8129-78aa65f7a35e_0.mp4'
	},
	{
		url: 'https://sfile.chatglm.cn/testpath/video_cover/422c33ac-53d2-51c9-8521-5747b0fa087a_cover_0.png',
		text: '一只柴犬在草地上奔跑',
		playUrl: 'https://sfile.chatglm.cn/testpath/video/422c33ac-53d2-51c9-8521-5747b0fa087a_0.mp4'
	},
	{
		url: 'https://sfile.chatglm.cn/testpath/video_cover/ee947213-9c0b-522e-82e2-cc2ebd719b05_cover_0.png',
		text: '一朵鲜花慢慢绽放的过程',
		playUrl: 'https://sfile.chatglm.cn/testpath/video/ee947213-9c0b-522e-82e2-cc2ebd719b05_0.mp4'
	},
	{
		url: 'https://sfile.chatglm.cn/testpath/video_cover/4b7c5392-870d-525d-a0cb-572ca1270399_cover_0.png',
		text: '人物的轻轻微笑',
		playUrl: 'https://sfile.chatglm.cn/testpath/video/4b7c5392-870d-525d-a0cb-572ca1270399_0.mp4'
	}
]
//描述词
export const videoword = [
	{
		key: '金鱼',
		prompt: '一只金鱼在一只鱼缸里慢慢地游来游去'
	},
	{
		key: '油画少女',
		prompt: '美丽的油画少女，年轻女子，光透过树叶形成斑驳的影子，柔光落在她的脸上'
	},
	{
		key: '苏轼',
		prompt: '庭院中，苏轼在月光下起舞。镜头环绕苏轼旋转，捕捉其舞动的身影和清影'
	},
	{
		key: '自然美女',
		prompt: '手撩头发轻盈，自然的眨眼，笑起来'
	},
	{
		key: '落霞孤鹜',
		prompt: '落霞与孤鹜齐飞，秋水共长天一色'
	},
	{
		key: '鸟瞰',
		prompt:
			"A bird's-eye view of a city. The camera is flying above the city, capturing the sprawling landscape of skyscrapers, buildings, and streets. The city is filled with people, cars, and other vehicles"
	},
	{
		key: '恶龙',
		prompt: '低角度向上推进，缓缓抬头，冰山上突然出现一条恶龙，然后恶龙发现你，冲向你。好莱坞电影风'
	},
	{
		key: '小王子',
		prompt: '小王子和狐狸在月球一起看星空，狐狸时不时看向小王子'
	},
	{
		key: '老式电视',
		prompt:
			'摄像机围绕着一大堆老式电视旋转，这些电视播放着不同的节目——20世纪50年代的科幻电影、恐怖电影、新闻、静态、70年代的情景喜剧等，背景设在纽约博物馆的一个大型画廊里'
	},
	{
		key: '喝咖啡',
		prompt:
			'咖啡厅里靠窗的位置，一位西装革履的男士端坐在桌前缓缓举起咖啡品尝，眼神看向窗外，街上车水马龙，男士陷入沉思'
	},
	{
		key: '滑板车',
		prompt: '黑白老照片风格，80年代，两个小孩在玩滑板车'
	},
	{
		key: '沉船',
		prompt: '深海里的一艘沉船，电影质感，由远到近'
	},
	{
		key: '海上晚餐',
		prompt:
			'豪华游艇的甲板上，一张圆桌被布置得优雅而浪漫，桌上摆放着香槟和精美的海鲜拼盘，海风轻拂，波光粼粼的海面在夕阳下闪烁着金色的光芒'
	},
	{
		key: '江南',
		prompt:
			'一位穿着传统旗袍的女士,手持油纸伞,优雅地走在江南小填的石板桥上。雨丝轻轻飘落,营造出一种惬意而松弛的氛围。摄影机采用一镜到底的技术,跟随女士的步伐,暖缓穿过烟雨朦胧的小镇,捕捉着雨水滴落在桥面上泛起的涟漪,以及伞尖滴落的雨珠。整个场景如同一幅流动的的水墨画,充满了诗意的韵味'
	},
	{
		key: '城堡',
		prompt:
			'雨天，18世纪中叶欧洲，一座古老的城堡，城堡外面有一颗参天大树和一片绿油油的草坪，镜头由远推近'
	},
	{
		key: '帆船',
		prompt:
			'一艘巨大的古典帆船在巨浪的海面上行驶，灰蒙蒙的夜晚，月光照出蓝色的光影，风浪显得气氛很紧张'
	}
]
export interface VideoVmodalType {
	image_url ?: string
	showVideo : boolean
	playVideo : string
	restNum ?: number
	openVipModal ?: boolean
	openModal ?: boolean
	cover_image_url ?: string
	prompt ?: string
	isQuery : boolean
	aloneChecked ?: boolean
}

export const Tips = `尊敬的用户：

			感谢您一直以来对我们AI视频功能的关注与支持。由于AI视频生成的复杂性和对服务器及算力的巨大要求，我们面临了一些挑战。以下是我们的优化措施和付费政策：


			1. AI视频生成复杂性：

			- AI视频生成的过程中，例如文本转视频、图像转视频、数字人等前沿功能，对服务器和算力资源的需求远超过传统的AI图像生成。
			- 一个3至6秒的AI视频生成所需的算力，是AI生图的至少64倍以上。
			- 生成一个视频所需的计算资源是图像生成所需资源的64倍，甚至更多。

			2. 资源限制与付费政策：
			- 尽管我们已经具备了AI视频处理的能力，但在当前资源限制下，我们无法大规模提供免费服务。
			- 为了确保我们能够持续提供高质量的服务，并不断优化我们的技术，我们决定对于AI视频功能采取付费模式。
			- 购买次数包，可以体验AI 处理视频的能力。

			我们非常感谢您的理解和支持。如果您有任何疑问或需要进一步了解，请随时联系我们。我们将继续努力，为您提供更加出色的AI视频服务。 谢谢您的配合！`


export const imgword = [
	{
		key: '让背景体现出时光的流逝'
	},
	{
		key: '画面中的主体显现出幸福的微笑'
	},
	{
		key: '让图片中的人物之间进行互动'
	},
	{
		key: '生成从全景到某一细节的放大效果，展示图片中的某个特征或物件细节'
	},
	{
		key: '添加动态天气效果到图片中，如下雨'
	},
	{
		key: '让画面整体动起来'
	},
	{
		key: '添加微风效果，使图片中的树叶、花草或人物的头发轻轻摆动，模拟风的存在'
	},
	{
		key: '动态展示图片中人物的情感变化过程，比如从平静到愤怒'
	}
]