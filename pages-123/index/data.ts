export const NavMenuData = [
	{
		head: {
			icon: "//file.1foo.com/2024/09/24/90dd265a037e83d0526659443f14c976.svg",
			title: "AI对话专区",
			redirect: '/chat?type=index',
			description: "汇聚全球尖端对话模型，懂你所想"
		},
		bannerList: [
			{
				poster: "//file.1foo.com/2025/02/10/4d969e5a362b62b8eb07dee7ccc1bce0.png",
				name: "DeepSeek全系列",
				route: "/chat?type=deep_seek3",
				star: 5
			},
			{
				poster: "//file.1foo.com/2024/09/28/3131e32d2c53c9cb49c78c3eb8398d6b.png",
				name: "Chat4.0系列",
				route: "/chat?type=chat_40",
				star: 4
			},
			{
				poster: "//file.1foo.com/2024/09/24/4c9f0db5e60531ce9cf11c18dfba6efd.png",
				name: "智谱清言·GLM4",
				star: 4,
				
				
				route: "/chat?type=zhipu_glm4",
			},
			{
				poster: "//file.1foo.com/2024/09/24/65dce97d293fa2d02482b3fd714a585e.png",
				name: "通义千问",
				star: 4,
				route: "/chat?type=tongyi",
			},
			{
				poster: "//file.1foo.com/2024/09/24/4cd934002da21cdc7c841f7ff0ed4ab6.png",
				name: "文心一言4.0",
				star: 4,
				route: "/chat?type=baidu"
			},
			// {
			//     poster:"//file.1foo.com/2024/09/24/64fdff0edbb12caf871b64f945d694c9.png",
			//     name:"Kimi·月之暗面",
			//     star:5,
			//     route:"/chat?type=moonshot_v1_8k"
			// }
		],
		menuList: [
			{
				icon: "//file.1foo.com/2024/09/24/c4cc1f9b55c22986c6809b7f9d4528c3.svg",
				name: '文档对话',
				route: "/AiFile/DocChatPage"
			},
			{
				icon: "//file.1foo.com/2024/09/12/d6de1893c2bbd61cf16a9a0e29928c3d.svg",
				name: '图片理解',
				route: "/chat?type=image"
			},
			{
				icon: "//file.1foo.com/2024/09/24/86fed6b83fd3c2727db2e70b6475e350.svg",
				name: '视频理解',
				route: "/chat?type=video"
			},
			{
				icon: "//file.1foo.com/2024/08/21/6be420ff3f3eb46cf2a9475b52d4e366.svg",
				name: '音频理解',
				route: "/chat?type=voice"
			},
			{
				icon: "//file.1foo.com/2024/08/21/d375c55fc4603e3b81bcdc259c52ebf4.svg",
				name: '网页理解',
				route: "/chat?type=web"
			},
			{
				icon: "//file.1foo.com/2024/01/02/d4169bfc46ee0d0a29c6c9c8653ebc06.png",
				name: '图表生成',
				route: "/chat?type=echarts"
			},
			{
				icon: "//file.1foo.com/2024/08/21/62ab893cda8c5c3c852b308acf6fa140.svg",
				name: '联网模型',
				route: "/chat?type=net"
			},
			{
				icon: "//file.1foo.com/2024/09/24/b6b933a6b046164e1e3d6c05ff25661d.svg",
				name: 'AI模型角色',
				route: "/chat?type=net"
			},
			{
				icon: "//file.1foo.com/2024/08/21/31cb31214693c4a701c661d6d133bc68.svg",
				name: '大模型对抗',
				route: "/chat?type=AllModelAttack"
			},
			{
				icon: "//file.1foo.com/2024/09/11/84915a678e556e905d35d21ea0d520d2.svg",
				name: 'CodeGeex',
				route: "/chat?type=codegeex_4"
			},
			{
				icon: "//file.1foo.com/2024/08/21/2ef38da657fe22609a2dd0ab51c2b80a.svg",
				name: 'Meta模型',
				route: "/chat?type=baidu_llama"
			},
			{
				icon: "//file.1foo.com/2023/12/12/941983dadec37a257e67974675d21734.png",
				name: '极速模型',
				route: "/chat?type=talkV2"
			},
			{
				icon: "//file.1foo.com/2024/08/21/3095dc6c36fb1cf9d7f59f0237b4faf0.svg",
				name: '智慧4.0模型',
				route: "/chat?type=chat_40"
			},
			{
				icon: "//file.1foo.com/2024/09/24/446df46f66bb20f70beb5ef82e5cd601.svg",
				name: '全部功能',
				route: "/chat?type=v35"
			}
		]
	},
	{
		head: {
			icon: "//file.1foo.com/2024/09/24/c25de71e8bf46d5b4c91ba24fc366efc.svg",
			title: "AI绘画专区",
			redirect: '/draw',
			description: "多元绘画模型，释放创作潜能"
		},
		bannerList: [
			{
				poster: "//file.1foo.com/2024/09/24/891c2002fcb9844ba8ef9243e9df28f2.png",
				name: "AI生成图片",
				star: 5,
				route: '/draw/text2image'
			},
			{
				poster: "//file.1foo.com/2024/09/24/61744d35a4a1c6520b95c06aca01a219.png",
				name: "照片转卡通形象",
				star: 5,
				route: '/draw/Image2Anime'
			},
			{
				poster: "//file.1foo.com/2024/09/24/9da5431a5d81ad7dbec4baacf096b72f.png",
				name: "图片变清晰",
				star: 5,
				route: '/draw/aiImageIntensifier'
			},
			{
				poster: "//file.1foo.com/2024/09/24/ac98cd1740484a3083f9e8505b0da841.png",
				name: "AI换脸",
				star: 5,
				route: '/draw/aiChangeFace'
			},
			{
				poster: "//file.1foo.com/2024/09/24/f594b83cc9c14b6cabe8348be9cdc366.png",
				name: "人像抠图",
				star: 5,
				route: '/draw/onlineHandlerImage'
			}
		],
		menuList: [
			{
				icon: "//file.1foo.com/2024/09/24/9decac5a7240136a85da7c5a7a50ddde.svg",
				name: '文字生图',
				route: '/draw/text2image'
			},
			{
				icon: "//file.1foo.com/2024/09/24/07d86ef28e4f4dc405cc12562aab13fb.svg",
				name: '图生图',
				route: '/draw/image2image'
			},
			{
				icon: "//file.1foo.com/2024/09/24/cd0b04c45f84d67997825838ea6e98b6.svg",
				name: '局部重绘',
				route: '/draw/OldImageReverved'
			},
			{
				icon: "//file.1foo.com/2024/09/24/1b3f9dbc313ddd71cfccf3e131969123.svg",
				name: '线稿上色',
				route: '/draw/DraftsCreateImage2Color'
			},
			{
				icon: "//file.1foo.com/2024/09/24/a6e970a52dfa8ddb08087645106a7570.svg",
				name: 'AI全景',
				route: '/draw/Aipanorama'
			},
			{
				icon: "//file.1foo.com/2024/09/24/8456117700381c4331c4890c4eb9db6f.svg",
				name: 'AI证件照',
				route: '/draw/AIChangeImages'
			},
			{
				icon: "//file.1foo.com/2024/09/24/455fd5d357de2e1cf87a392324adf985.svg",
				name: 'AI写真',
				route: '/draw/faceswapByPhotography'
			},
			{
				icon: "//file.1foo.com/2024/09/24/ed28c1104b0425e2643d8823b334ba98.svg",
				name: '涂鸦生图',
				route: '/draw/GraffitiRawDrawings'
			},
			{
				icon: "//file.1foo.com/2024/09/24/72ccb3af5649bff90c5b47d460a19c16.svg",
				name: '艺术二维码',
				route: '/draw/qrcode'
			},
			{
				icon: "//file.1foo.com/2024/09/24/4d63769d9ab41c0273b4613faf8317b1.svg",
				name: 'AI毕业照',
				route: '/draw/AIChangeImages'
			},
			{
				icon: "//file.1foo.com/2024/09/24/fcb9f016596a7a5c32143d458ac33a17.svg",
				name: '人像抠图',
				route: '/draw/onlineHandlerImage'
			},
			{
				icon: "//file.1foo.com/2024/09/24/ab208b9f2f9a41bdf7a4fb247769a594.svg",
				name: '图片擦除',
				route: '/draw/aiImageErase'
			},
			{
				icon: "//file.1foo.com/2024/09/24/15853987f4c3f595a7b1ada54fb3328e.svg",
				name: '照片增强',
				route: '/draw/aiImageIntensifier'
			},
			{
				icon: "//file.1foo.com/2024/09/24/446df46f66bb20f70beb5ef82e5cd601.svg",
				route: '/draw',
				name: '全部功能'
			}
		]
	},
	{
		head: {
			icon: "//file.1foo.com/2024/09/24/3a2a947486b2ae1255c33520961db82b.svg",
			title: "AI媒体专区",
			redirect: '/AICreateVideo/createByText',
			description: "AI最前沿科技成果，以假乱真"
		},
		bannerList: [
			{
				poster: "//file.1foo.com/2024/09/24/5ec6ab7dcf423188dcb27444c039ae4e.png",
				name: "AI创作音乐",
				star: 5,
				route: '/AIMusic/creativeCenter'
			},
			{
				poster: "//file.1foo.com/2024/09/24/488012b650ac4bb81b606ade68f48fb9.png",
				name: "AI图文生成视频",
				star: 5,
				route: '/AICreateVideo/createByText'
			},
			{
				poster: "//file.1foo.com/2024/09/24/0511d01584d6fd3f3c788f63148df7e2.png",
				name: "AI数字人",
				star: 5,
				route: '/AICreateVideo/AINumPerson/index'
			},
			{
				poster: "//file.1foo.com/2024/09/24/da48a7a639a27f5976aab9a9b91fbe60.png",
				name: "AI视频抠图",
				star: 5,
				route: '/AICreateVideo/AIVideoClearImag/index'
			},
			{
				poster: "//file.1foo.com/2024/09/24/318ef34a47363f20941f190c9abcdfcd.png",
				name: "AI提取音频",
				star: 5,
				route: '/AICreateVideo/AIExtractMusic/index'
			}
		],
		menuList: [
			{
				icon: "//file.1foo.com/2024/09/26/9fd4703f87dbf1078109d7794948e102.svg",
				name: '文字生成视频',
				route: '/AICreateVideo/createByText'
			},
			{
				icon: "//file.1foo.com/2024/09/26/9fd4703f87dbf1078109d7794948e102.svg",
				name: '图片生成视频',
				route: '/AICreateVideo/createByImage'
			},
			{
				icon: "//file.1foo.com/2024/09/26/5a9d0133c9d9740f3c925849967716f8.svg",
				name: 'AI数字人',
				route: '/AICreateVideo/AINumPerson/index'
			},
			{
				icon: "//file.1foo.com/2024/09/26/78923e2ece719de94d3502e9b43f1db2.svg",
				name: 'AI视频抠像',
				route: '/AICreateVideo/AIVideoClearImag/index'
			},
			{
				icon: "//file.1foo.com/2024/09/26/f4642cd087bf60872e7e44e1078517bc.svg",
				name: 'AI提取视频',
				route: '/AICreateVideo/AIExtractMusic/index'
			},
			{
				icon: "//file.1foo.com/2024/09/26/0e12263f184d26389bcfdee1da15512d.svg",
				name: 'AI创作音乐',
				route: '/AIMusic/creativeCenter'
			},
			{
				icon: "//file.1foo.com/2024/09/24/446df46f66bb20f70beb5ef82e5cd601.svg",
				name: '全部功能',
				route: '/AICreateVideo/createByText'
			},
		]
	},
	{
		head: {
			icon: "//file.1foo.com/2024/09/24/e5e861ad508b01888d4ce7535879c448.svg",
			title: "AI功能专区",
			redirect: '/function/all',
			description: "体验AI赋能带来的便捷，轻松高效"
		},
		bannerList: [
			{
				poster: "//file.1foo.com/2024/09/24/87e812509468b8019b09ed94b3fcd9de.png",
				name: "10秒生成PPT",
				star: 5,
				route: '/AiFile/ppt'
			},
			{
				poster: "//file.1foo.com/2024/09/24/8dfb3b94ba117dcf07ad83f556281608.png",
				name: "AI思维导图",
				star: 5,
				route: '/AiFile/mapping'
			},
			{
				poster: "//file.1foo.com/2024/09/24/4ba4f5cfeafda53812b4a6e27477407b.png",
				name: "AI文档翻译",
				star: 5,
				route: '/AiFile/translate'
			},
			{
				poster: "//file.1foo.com/2024/09/24/6b1be505d9f9c29289232b247916d199.png",
				name: "智能降AIGC",
				star: 5,
				route: '/aigc/drapAigc'
			},
			{
				poster: "//file.1foo.com/2024/09/24/315edcf51e41e497156087fc71b8ddf2.png",
				name: "AI论文写作",
				star: 5,
				route: '/doc/AiLongThesis'
			}
		],
		menuList: [
			{
				icon: "//file.1foo.com/2024/09/24/86184158995314a2886723d98a5afc54.svg",
				name: '公文写作',
				route: '/AiWriter/AiWriterOffcial'
			},
			{
				icon: "//file.1foo.com/2024/09/24/7a8f6525c9e5e367e624d062eb6c45c5.svg",
				name: '文章纠正',
				route: '/doc/articleCorrection'
			},
			{
				icon: "//file.1foo.com/2024/09/24/2c0e121661f0e87f574107087ac2c5f0.svg",
				name: 'OCR识别',
				route: '/doc/AiORCModel'
			},
			{
				icon: "//file.1foo.com/2024/09/24/df8e5e0d900717c85e4615d827032f05.png",
				name: '音频理解',
				route: '/chat?type=voice'
			},
			{
				icon: "//file.1foo.com/2024/08/21/d375c55fc4603e3b81bcdc259c52ebf4.svg",
				name: '语音合成',
				route: '/AiVioce/speechSynthesis'
			},
			{
				icon: "//file.1foo.com/2024/09/24/ee4fc6e5583d989457e36e6b32b48553.svg",
				name: 'AIGC检测',
				route: '/aigc/articlePlagiarismChecking'
			},
			{
				icon: "//file.1foo.com/2024/09/24/2303f39d424074eb81cfc20a1954144f.svg",
				name: 'AI翻译',
				route: '/AiFile/translate'
			},
			{
				icon: "//file.1foo.com/2024/09/24/446df46f66bb20f70beb5ef82e5cd601.svg",
				name: '全部功能',
				route: '/function/all'
			}
		]
	}
]