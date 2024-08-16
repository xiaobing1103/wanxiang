import $assets from "@/config/assets.config";
import { taskIdTypeKey } from "@/store/draw";

export const menuList = [
	{
		cover: $assets.xgst_cover,
		title: "线稿上色",
		description: "线稿一键变画作",
		path: "/pages/draw/subPage/coloringLineArt/index",
	},
	{
		cover: $assets.tpzkt_cover,
		title: "图片转卡通",
		description: "一张图片制作你的Q版卡通形象",
		path: "/pages/draw/subPage/image2cartoon/index",
	},
	{
		cover: $assets.aihl_cover,
		title: "AI换脸",
		description: "一账图片让你当明星",
		path: "/pages/draw/subPage/aiFaceSwapping/index",
	},
	{
		cover: $assets.paintAixz_cover,
		title: "AI写真",
		description: "在线写真馆",
		path: "/pages/draw/subPage/aiPhotoShoots/index",
	},
	{
		cover: $assets.tpst_cover,
		title: "图片生图",
		description: "导入照片,AI百变风格",
		path: "/pages/draw/subPage/image2image/index",
	},
	{
		cover: $assets.wzst_cover,
		title: "文字生图",
		description: "一句话,AI帮你写",
		path: "/pages/draw/subPage/text2image/index",
	},
	{
		cover: $assets.jbzh_cover,
		title: "局部重绘",
		description: "想改哪里改哪里",
		path: "/pages/draw/subPage/partialRepaint/index",
	},
	{
		cover: $assets.rxkt_cover,
		title: "人像抠图",
		description: "只能提取人像，精确到发丝",
		path: "/pages/draw/subPage/portraitCutout/index",
	},
];
// 定义键名的联合类型
export type DrawExampleKeys =
	| "超级赛亚人"
	| "可爱小狗"
	| "皮卡丘"
	| "蜘蛛侠"
	| "维多利亚男人"
	| "女战士"
	| "赛博城市"
	| "水彩住宅"
	| "礼盒"
	| "春日"
	| "春日2"
	| "草原";

export type DrawExamplePromptsType = Record<DrawExampleKeys, string>;
export const drawExamplePrompts = {
	超级赛亚人:
		"超级赛亚人，男人，肌肉纹理极其清晰，蓝色的闪电，雨天，表情狂暴，容眉大眼，充满火焰的眼睛，牙齿，面部特写",
	可爱小狗:
		"最高画质，超高清，杰作，精美的CG，一只可爱的白色博美，小狗，圆圆的脑袋，又大又圆的眼睛，微笑，可爱呆萌，大眼睛，可爱的笑容",
	皮卡丘:
		"宣传艺术，一个非常非常可爱的迪斯尼((皮卡丘))，圆形蓬松，非常毛茸茸，白色背景，标志性的电影角色，90年代的((皮卡丘))侦探皮卡丘，细致的毛皮，概念图，3D渲染官方艺术，宣传艺术，迪士尼皮克斯疯狂动物城",
	蜘蛛侠: "赤壁蜘蛛侠，辛烷值渲染，现代迪士尼风格",
	维多利亚男人:
		"一个粗犷的 19 世纪男人的肖像，穿着夹克，维多利亚时代，概念艺术，详细的脸，幻想，特写脸，非常详细，电影灯光，greg rutkowski 的数字艺术绘画",
	女战士:
		"女人,战士,手拿盾牌,手拿长枪,战场,插在地上的剑,地上的头骨,详细插画,数字艺术 镜头,丹·芒福德、彼得·莫尔巴赫、格雷格·鲁特科夫斯基，奇幻人物,详细插画,高清,4k,数字艺术,过度细节艺术,概念艺术,艺术站的趋势。",
	赛博城市:
		"赛博朋克城市景观，如东京，黄昏黄金时段的高楼大厦，史诗般的构图，金色的日光，超现实的环境，超级复杂的细节，逼真的照片，电影和体积光，史诗般的概念艺术， Octane 渲染和虚幻引擎, artstation 上的趋势",
	水彩住宅: "arti chauhan 的夏季水彩画，两旁是老住宅。",
	礼盒: "一个巨大的（礼盒）矗立在小树之间，冬季景观，3d渲染，柔和的日光，辛烷值渲染，虚幻的引擎。",
	春日: "春天的小溪流水潺潺，娇艳欲滴的花朵在溪边摇曳生姿，蝴蝶蜜蜂来回舞动。",
	春日2: "春天的小溪流水潺潺，花朵在溪边摇曳生姿，蝴蝶蜜蜂来回舞动。",
	草原: "风吹草低见牛羊，在一片开阔的草原上，几匹野马追逐戏耍。",
};

export type model_nameTypes =
	| "通用模型1"
	| "通用模型2"
	| "通用模型3"
	| "真人美女1"
	| "真人美女2"
	| "亚洲人像"
	| "近景写真"
	| "二次元动漫1"
	| "二次元动漫2"
	| "二次元动漫3"
	| "2.5D国风"
	| "卡通场景"
	| "图标设计"
	| "游戏图标"
	| "建筑场景设计";

export interface ImageParmasDTO {
	model : string;
	width : number;
	height : number;
	prompt : string;
	cfg_scale : number;
	step : number;
	negative_prompt : string;
	seed : string;
	num : number;
}
export interface ImageListDTO {
	avatar : string;
	count : number;
	id : string;
	image : string;
	images : string[];
	model_name : model_nameTypes;
	nick : string;
	param : ImageParmasDTO;
	title : string;
}
export interface modelsDTO {
	id : string;
	model_id : string;
	name : model_nameTypes;
	prompt : string;
	image : string;
}

export interface stylesDTO {
	id : string;
	image : string;
	name : string;
}

export interface Image2TextParmas {
	/**
	 *  文本强度
	 */
	cfg_scale : number;
	/**
	 *   高度 
	 */
	height : number;
	/**
	 *   图片分辨率 0 普通  1 高清
	   */
	hire : number;
	/**
	 *  图片风格id
	 */
	loraId : string;
	/**
	 *    风格强度  线稿上色 是 60 到 70 
	 */
	loraScale : number;
	/**
	 *    变化强度  
	 */
	denoising_strength ?: number
	/**
	 *     模型id
	 */
	model : string;
	/**
	 *   负标签
	 */
	negative_prompt : string;
	/**
	 *     图片张数
	 */
	num : number;
	/**
	 *     输入参数
	 */
	prompt : string;
	/**
	 *    随机种子
	 */
	seed : number;
	/**
	 * 采样器
	 */
	simpler : string;
	/**
	 * 迭代数
	 */
	step : number;
	/**
	 * 宽度
	 */
	width : number;
	/**
	 * 未知参数
	 */
	type ?: '0' | '1',
	/**
	 * 图片参数
	 */
	image ?: null | any
	/**
	 * 权重 1.0 到 2.0 一般显示为 0 - 200
	 */
	weight ?: 1.0,
}
export const sizeList : {
	label : string
	value : string
	parent : string
}[] = [
		{
			label: '方图(512x512)[1:1]',
			value: '512x512',
			parent: '1 : 1'
		},
		{
			label: '长图(512x680)[3:4]',
			value: '512x680',
			parent: '3 : 4'
		},
		{
			label: '长图(512x768)[2:3]',
			value: '512x768',
			parent: '2 : 3'
		},
		{
			label: '长图(512x912)[9:16]',
			value: '512x912',
			parent: '9 : 16'
		},
		{
			label: '宽图(680x512)[4:3]',
			value: '680x512',
			parent: '4 : 3'
		},
		{
			label: '宽图(768x512)[3:2]',
			value: '768x512',
			parent: '3 : 2'
		},
		{
			label: '宽图(912x512)[16:9]',
			value: '912x512',
			parent: '16 : 9'
		}
	]


export interface ImageProjectTypes {
	type : string
	historyType : taskIdTypeKey
	api : string
	loraScaleStepList ?: number[]
	denoising_strengthStepList ?: number[]
	stepStepList ?: number[]
	cfg_scaleStepList ?: number[]
	weightStepList ?: number[]
	denoising_strengthStepMin ?: string
	denoising_strengthStepMax ?: string
	DifferenceStrength ?: number
}
interface TaskConfig {
	title : string;
	icons : string;
	path : string
}

export interface DrawProjectConfig {
	[taskIdTypeKey : string] : TaskConfig;
}
export const drawProjectConfig : DrawProjectConfig = {
	txt2img_task_json: {
		title: '文字生成图片',
		icons: '//file.1foo.com/2024/02/28/9461b8e0963772622b040442b1ec5213.png',
		path: '/pages/draw/subPage/text2image/index'
	},
	img2img_task_json: {
		title: '图片生成图片',
		icons: '//file.1foo.com/2024/02/28/556b893875c846a0e27a96ccf2228847.png',
		path: '/pages/draw/subPage/image2image/index'
	},
	coloringLineArt_task_json: {
		title: '线稿上色',
		icons: '//file.1foo.com/2024/07/05/e87075cd8bc3d216bfae25a93c1ffa2b.png',
		path: '/pages/draw/subPage/coloringLineArt/index'
	},
	image2cartoon_task_json: {
		title: '图片转卡通',
		icons: '//file.1foo.com/2024/07/05/2104a26010ef6ba3df218a3ba54ac016.png',
		path: '/pages/draw/subPage/image2cartoon/index'
	},
	partialRepaint_task_json: {
		title: '局部重绘',
		icons: '//file.1foo.com/2024/07/05/abf3c1f40ec88f783ee6c6f332893e88.png',
		path: '/pages/draw/subPage/partialRepaint/index'
	}
}