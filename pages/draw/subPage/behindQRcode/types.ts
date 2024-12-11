import iconConfig from '@/config/assets.config';

export interface QRcodeParmasInterface {
	title : string
}
export interface RequestParmasInterface {
	currentModes : number
	textValue : string
	imageUrl : string
	seletedModel : string
	FileMode : null | any
	step : number
}
export const gradientTexture = [
	[
		45,
		'#FF66B2',
		'#6A0D91'
	],
	[
		135,
		'#E0F7FA',
		'#00796B'
	]
];
export const requestReq = {
	model: '',
	width: 1024,
	height: 1024,
	prompt: '',
	loraId: '',
	loraScale: 66,
	cfg_scale: 7,
	step: 20,
	negative_prompt:
		'easynegative, (worst quality:1.3), (low quality:1), (normal quality:1.4), lowres,skin spots, acnes, skin blemishes, age spot, glan, extra fingers, fewer fingers, strange fingers, bad hand, bad anatomy, fused fingers, missing leg, mutated hand, malformed limbs, missing feet,multiple legs,men,boy,logo, loli,3d,extra hands,extra foots',
	simpler: 'DPM++ SDE Karras',
	seed: -1,
	num: 2,
	qrcode: '',
	brightness_weight: 0,
	brightness_start: 0,
	brightness_end: 0,
	qrocde_weight: 0,
	qrcode_start: 0,
	qrcode_end: 0,
	sampler_name: '',
	text: ''
}

export const tabsData = [
	{
		name: '图片模式',
		image: iconConfig.reserveWordHeaderIcon
	},
	{
		name: '文本模式',
		image: iconConfig.editIcon
	}
]
export const btnStyles = {
	width: '80%',
	height: '70rpx',
	border: '0rpx',
	background: 'rgb(41, 121, 255)',
	color: 'white',
	margin: ' 10rpx',
	borderRadius: '15rpx'
}