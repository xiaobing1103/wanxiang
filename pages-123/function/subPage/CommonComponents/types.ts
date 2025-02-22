export interface publicMethodsType {
	title : string
	uploadImageSrc : string[]
}
export interface commonParmasType {
	tags : string[],
	prompt : string,
	title : string
	make_instrumental : number,
	appid ?: number,
	mv : string,
	uid ?: number
}

export const showTags = [{ name: '普通' }, { name: '流行' }, { name: '摇滚' }, { name: '蓝调' }, { name: '舞曲' }, { name: '金属' }, { name: '其他' }]

export const layoutShowTags = [
	'Bluegrass(草莓乐)', 'Country(多村音乐)', 'Folk(民谣)', 'Afro-Cuban(阿弗罗-古巴)', 'Dance Pop(流行舞曲)', 'Disco(迪斯科)'
]

export const musicTags = [
	{
		"name": "普通",
		"text": "Bluegrass(草莓乐)"
	},
	{
		"name": "普通",
		"text": "Country(多村音乐)"
	},
	{
		"name": "普通",
		"text": "Dubstep(配音步)"
	},
	{
		"name": "普通",
		"text": "Ambient(环境音)"
	},
	{
		"name": "普通",
		"text": "Folk(民谣)"
	},
	{
		"name": "普通",
		"text": "Afro-Cuban(阿弗罗-古巴)"
	},
	{
		"name": "普通",
		"text": "House(浩室音乐)"
	},
	{
		"name": "普通",
		"text": "Drum'n'bass(鼓与贝斯)"
	},
	{
		"name": "普通",
		"text": "Synthwave(合成波)"
	},
	{
		"name": "普通",
		"text": "High-NRG(高能量)"
	},
	{
		"name": "普通",
		"text": "Techno(技术音乐)"
	},
	{
		"name": "普通",
		"text": "Trap(陷阱音乐)"
	},
	{
		"name": "普通",
		"text": "Bebop(比博普)"
	},
	{
		"name": "普通",
		"text": "Dub(配音)"
	},
	{
		"name": "普通",
		"text": "Reggae(雷鬼)"
	},
	{
		"name": "普通",
		"text": "Reggaeton(雷盖顿)"
	},
	{
		"name": "普通",
		"text": "Afrobeat(非洲节奏)"
	},
	{
		"name": "普通",
		"text": "Forró(弗约罗)"
	},

	{
		"name": "流行",
		"text": "Dance Pop(流行舞曲)"
	},
	{
		"name": "流行",
		"text": "Synthpop(合成流行)"
	},
	{
		"name": "流行",
		"text": "Forró(弗约罗)"
	},
	{
		"name": "流行",
		"text": "Kpop(韩流音乐)"
	},
	{
		"name": "流行",
		"text": "Jpop(日流音乐)"
	},
	{
		"name": "流行",
		"text": "Pop Rock(流行摇滚)"
	},
	{
		"name": "流行",
		"text": "Pop(流行音乐)"
	},
	{
		"name": "流行",
		"text": "Chinese pop(中国流行音乐)"
	},


	{
		"name": "摇滚",
		"text": "Classic Rock(经典摇滚)"
	}, {
		"name": "摇滚",
		"text": "Blues Rock(布鲁斯摇滚)"
	}, {
		"name": "摇滚",
		"text": "Emo(情绪)"
	}, {
		"name": "摇滚",
		"text": "Glam Rock(华丽摇滚)"
	}, {
		"name": "摇滚",
		"text": "Indie(独立音乐)"
	}, {
		"name": "摇滚",
		"text": "Industrial Rock(工业摇滚)"
	}, {
		"name": "摇滚",
		"text": "Punk(朋克摇滚)"
	}, {
		"name": "摇滚",
		"text": "Rock(摇滚)"
	}, {
		"name": "摇滚",
		"text": "Skate Rock(滑板摇滚)"
	},
	{
		"name": "摇滚",
		"text": "Skatecore(滑板核)"
	},
	{
		"name": "摇滚",
		"text": "Disco(迪斯科)"
	},
	{
		"name": "摇滚",
		"text": "Jazz(爵士)"
	},
	{
		"name": "摇滚",
		"text": "Latin Jazz(拉丁爵士)"
	}, {
		"name": "摇滚",
		"text": "Bossa Nova(波萨诺瓦)"
	}, {
		"name": "摇滚",
		"text": "Reggae(雷鬼)"
	}, {
		"name": "摇滚",
		"text": "Afrobeat(非洲节奏)"
	},

	{
		"name": "蓝调",
		"text": "Gospel(福音)"
	}, {
		"name": "蓝调",
		"text": "RnB(节奏蓝调)"
	}, {
		"name": "蓝调",
		"text": "Soul(灵魂乐)"
	}, {
		"name": "蓝调",
		"text": "Reggae(雷鬼)"
	},

	{
		"name": "舞曲",
		"text": "Disco Funk(迪斯科放克)"
	}, {
		"name": "舞曲",
		"text": "EDM(电子舞曲)"
	}, {
		"name": "舞曲",
		"text": "Electro(电子)"
	}, {
		"name": "舞曲",
		"text": "Trance(迷幻舞曲)"
	}, {
		"name": "舞曲",
		"text": "Disco(迪斯科)"
	}, {
		"name": "舞曲",
		"text": "Electronic(电子音乐)"
	}, {
		"name": "舞曲",
		"text": "IDM(智能舞曲)"
	}, {
		"name": "舞曲",
		"text": "Salsa(萨尔萨舞)"
	}, {
		"name": "舞曲",
		"text": "Reggaeton(雷盖顿)"
	}, {
		"name": "舞曲",
		"text": "Tango(探戈)"
	}, {
		"name": "舞曲",
		"text": "Dancehall(舞厅)"
	}, {
		"name": "舞曲",
		"text": "Cabaret(歌舞表演)"
	}, {
		"name": "舞曲",
		"text": "Bangra(班格拉舞)"
	},

	{
		"name": "金属",
		"text": "Deathcore(死亡核)"
	}, {
		"name": "金属",
		"text": "Death Metal(死亡金属)"
	}, {
		"name": "金属",
		"text": "Festive Heavy Metal(节日重金属)"
	}, {
		"name": "金属",
		"text": "Heavy Metal(重金属)"
	}, {
		"name": "金属",
		"text": "Black Metal(黑金属)"
	}, {
		"name": "金属",
		"text": "Nu Metal(新金属)"
	}, {
		"name": "金属",
		"text": "Power Metal(力量金属)"
	}, {
		"name": "金属",
		"text": "Metalcore(金属核)"
	},

	{
		"name": "其他",
		"text": "Progressive(进步)"
	}, {
		"name": "其他",
		"text": "Aggressive(激进)"
	}, {
		"name": "其他",
		"text": "Banger(热门曲目)"
	}, {
		"name": "其他",
		"text": "Power(力量)"
	}, {
		"name": "其他",
		"text": "Stomp(重踏)"
	}, {
		"name": "其他",
		"text": "Stadium(体育场)"
	}, {
		"name": "其他",
		"text": "Broadway(百老汇)"
	}, {
		"name": "其他",
		"text": "Lounge(酒吧歌手)"
	}, {
		"name": "其他",
		"text": "Operatic(歌剧式的)"
	}, {
		"name": "其他",
		"text": "Vegas(拉斯维加斯风格)"
	}, {
		"name": "其他",
		"text": "Storytelling(讲故事)"
	}, {
		"name": "其他",
		"text": "Torch-Lounge(酒吧歌曲)"
	}, {
		"name": "其他",
		"text": "Theatrical(戏剧性的)"
	}, {
		"name": "其他",
		"text": "Mysterious(神秘)"
	}, {
		"name": "其他",
		"text": "Troubadour(吟游诗人)"
	}, {
		"name": "其他",
		"text": "Ethereal(虚幻)"
	}, {
		"name": "其他",
		"text": "Majestic(雄伟)"
	}, {
		"name": "其他",
		"text": "Ambient(环境音乐)"
	}, {
		"name": "其他",
		"text": "Cinematic(电影)"
	}, {
		"name": "其他",
		"text": "Slow(缓慢)"
	}, {
		"name": "其他",
		"text": "Sparse(稀疏)"
	}, {
		"name": "其他",
		"text": "Glam(华丽)"
	}, {
		"name": "其他",
		"text": "Glitter(闪耀)"
	}, {
		"name": "其他",
		"text": "Groovy(悠扬)"
	}, {
		"name": "其他",
		"text": "Grooveout(活力爆发)"
	}, {
		"name": "其他",
		"text": "Ambient(环境音乐)"
	}, {
		"name": "其他",
		"text": "Chillwave(轻松浪潮)"
	}, {
		"name": "其他",
		"text": "Intimate(亲密)"
	}, {
		"name": "其他",
		"text": "Carnival(嘉年华)"
	},

]