export default {
	color: "#161616",
	selectedColor: "#161616",
	borderStyle: "black",
	backgroundColor: "#ffffff",
	list: [{
			pagePath: "/pages/index/index",
			// iconPath: "/static/tabbar/index.png",
			// selectedIconPath: "/static/tabbar/index_active.png",
			text: "对话",
			openType: 'navigate', //新版本新增，页面被打开方式，默认为reLaunch
			dot: 1 //新版本新增参数，详细看页面最下方使用说明
		},
		{
			pagePath: "/pages/draw/index",
			// iconPath: "/static/tabbar/index.png",
			// selectedIconPath: "/static/tabbar/index_active.png",
			text: "绘画",
			dot: 2
		},
		{
			pagePath: "/pages/chat/index",

			// iconPath: "/static/tabbar/shop.png",
			// selectedIconPath: "/static/tabbar/shop_active.png",
			text: "门店",
			dot: 3,
		}, {
			pagePath: "/pages/function/index",
			// iconPath: "/static/tabbar/my.png",
			// selectedIconPath: "/static/tabbar/my_active.png",

			text: "功能",
			dot: 4,
		},
		{
			pagePath: "/pages/my/index",
			// iconPath: "/static/tabbar/my.png",
			// selectedIconPath: "/static/tabbar/my_active.png",
			text: "我的",
			dot: 5,
		}
	]
}