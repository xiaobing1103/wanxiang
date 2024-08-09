
import $assets from '@/config/assets.config';

export const menuList = [
	{
		cover: $assets.xgst_cover,
		title: '线稿上色',
		description: '线稿一键变画作',
		path: '/pages/draw/subPage/coloringLineArt/index'
	},
	{
		cover: $assets.tpzkt_cover,
		title: '图片转卡通',
		description: '一张图片制作你的Q版卡通形象',
		path: '/pages/draw/subPage/image2cartoon/index'
	},
	{
		cover: $assets.aihl_cover,
		title: 'AI换脸',
		description: '一账图片让你当明星',
		path: '/pages/draw/subPage/aiFaceSwapping/index'
	},
	{
		cover: $assets.paintAixz_cover,
		title: 'AI写真',
		description: '在线写真馆',
		path: '/pages/draw/subPage/aiPhotoShoots/index'
	},
	{
		cover: $assets.tpst_cover,
		title: '图片生图',
		description: '导入照片,AI百变风格',
		path: '/pages/draw/subPage/image2image/index'
	},
	{
		cover: $assets.wzst_cover,
		title: '文字生图',
		description: '一句话,AI帮你写',
		path: '/pages/draw/subPage/text2image/index'
	},
	{
		cover: $assets.jbzh_cover,
		title: '局部重绘',
		description: '想改哪里改哪里',
		path: '/pages/draw/subPage/partialRepaint/index'
	},
	{
		cover: $assets.rxkt_cover,
		title: '人像抠图',
		description: '只能提取人像，精确到发丝',
		path: '/pages/draw/subPage/portraitCutout/index'
	}
]
export type model_nameTypes = '通用模型1' | '通用模型2' | '通用模型3' | '真人美女1' | '真人美女2' | '亚洲人像' | '近景写真' | '二次元动漫1' | '二次元动漫2' | '二次元动漫3' | '2.5D国风' | '卡通场景' | '图标设计' | '游戏图标' | '建筑场景设计'

export interface ImageParmasDTO {
	"model" : string
	"width" : number
	"height" : number
	"prompt" : string
	"cfg_scale" : number,
	"step" : number,
	"negative_prompt" : string
	"seed" : string
	"num" : number
}
export interface ImageListDTO {
	avatar : string
	count : number
	id : string
	image : string
	images : string[]
	model_name : model_nameTypes
	nick : string
	param : ImageParmasDTO
	title : string

}