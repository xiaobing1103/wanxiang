<template>
	<view class="m-tabbar-box" :style="tabbarBoxStyle" v-if="isShowTabBar">
		<view class="m-tabbar__fill" v-if="fill || native" :class="{'m-tabbar__safe': (safeBottom || native)}"
			:style="tabbarFillStyle" />
		<view id="m-tabbar" class="m-tabbar"
			:class="{'fixed': (fixed || native), 'm-tabbar__safe': (safeBottom || native)}" :style="tabbarStyle">
			<view class="m-tabbar__border" v-if="borderStyle === 'black'" />
			<!-- tabbar border -->
			<view class="m-tabbar__flex">
				<view class="m-tabbar__item" @click="_tabChange(index)" v-for="(item, index) in tabbarList" :key="index"
					:class="{
						'm-tabbar__item__active': index === currentIndex,
					}">
					<slot :name="`tabbar_index_${index}`">
						<view class="m-tabbar__icon">
							<view class="m-tabbar__badge" v-if="item.dot">{{item.dot}}</view>
							<image :src="currentIndex === index ? item.selectedIconPath : item.iconPath"
								class="m-tabbar__icon_img" />
						</view>
						<view class="m-tabbar__label"
							:style="{'color': index === currentIndex ? tabbarConfig.selectedColor : tabbarConfig.color }">
							{{ item.text }}
						</view>
					</slot>
				</view>
				<!-- tabbar item -->
			</view>
			<!-- tabbar item box -->
		</view>
		<!-- tabbar block -->
	</view>
	<!-- tabbar box -->
</template>

<script>
	// style转为string
	const obj2strStyle = (obj) => {
		let style = ''
		for (let key in obj) {
			style += `${key}:${obj[key]};`
		}
		return style
	}

	// 自动填充路径
	const padFirstSymbol = (str, smb) => {
		if (str.startsWith(smb) || str.startsWith('http')) {
			return str
		}
		return `/${str}`
	}

	// 替换原生路径问题
	const replaceTabbarList = (list) => {
		if (!list.length > 0) {
			return []
		}
		return list.map(item => {
			if (item.iconPath) {
				item.iconPath = padFirstSymbol(item.iconPath, '/')
			}
			if (item.pagePath) {
				item.pagePath = padFirstSymbol(item.pagePath, '/')
			}
			if (item.selectedIconPath) {
				item.selectedIconPath = padFirstSymbol(item.selectedIconPath, '/')
			}
			return item
		})
	}

	// 设置缓存，方便重复调用方法
	const setTabbarStorage = (key, value, name) => {
		try {
			uni.setStorageSync(`mTab_${key}_${name}`, value)
		} catch (e) {
			console.error(e)
		}
	}

	// 读取缓存
	const getTabbarStorage = (key, name) => {
		try {
			const value = uni.getStorageSync(`mTab_${key}_${name}`)
			if (value) {
				return value
			}
			return ''
		} catch (e) {
			console.error(e)
		}
	}


	import PageConfig from '@/pages.json'

	export default {
		emits: ['change', 'click'],
		props: {
			// 使用原生配置自动生成
			native: {
				type: Boolean,
				default: false
			},
			// 当前选择下标，默认0开始
			current: {
				type: [Number, String],
				default: 0
			},
			// tabbar配置项
			tabbar: {
				type: Object,
				default () {
					return {}
				}
			},
			// 是否固定在底部
			fixed: {
				type: Boolean,
				default: false
			},
			// 是否自动填充底部
			fill: {
				type: Boolean,
				default: false
			},
			// 显示层级
			zIndex: {
				type: [Number, String],
				default: 9999
			},
			// 是否自动规避底部安全距离
			safeBottom: {
				type: Boolean,
				default: true
			},
			// 切换时拦截事件(有兼容性，部分平台不支持)
			beforeChange: {
				type: Function,
				default: null
			},
			// 自定义tabbar高度，单位rpx
			tabbarHeight: {
				type: [Number, String],
				default: 100
			},
			// 自定义tabbar的name,方便读取默认tabbar
			name: {
				type: String,
				default: 'custom'
			}
		},
		data() {
			return {
				isShowTabBar: false, //是否显示导航
				currentIndex: 0, //当前值
				beforeData: {}, //切换前值
				initTabbarConfig: {},
				isReload: false //uni不支持computed的get set，使用reload无感重置刷新
			}
		},
		watch: {
			current(val) {
				this.currentIndex = val * 1
			}
		},
		computed: {
			tabbarConfig() {
				const {
					isReload,
					native,
					initTabbarConfig: tabbar
				} = this
				if(isReload){}
				// 如果是native模式，直接读取执行
				if (native) {
					if (!tabbar) {
						console.error('Native mode, Pages.json no tabbar config')
						return {
							borderStyle: 'black',
							list: []
						}
					}
					return tabbar
				}
				// 如果没有配置tabbar，会尝试在缓存读取
				if (!tabbar.color) {
					return this._getDefaultTabbar()
				}
				return tabbar
			},
			tabbarList() {
				const {
					isReload,
					tabbarConfig: {
						list
					}
				} = this
				if(isReload){}
				if (!list) {
					console.error('No tabbar config')
					return []
				}
				return replaceTabbarList(list)
			},
			borderStyle() {
				const {
					isReload,
					borderStyle
				} = this.tabbarConfig
				if(isReload){}
				return borderStyle
			},
			tabbarBoxStyle() {
				const {
					isReload,
					zIndex
				} = this
				if(isReload){}
				return obj2strStyle({
					'z-index': zIndex,
				})
			},
			tabbarFillStyle() {
				const {
					isReload,
					tabbarHeight
				} = this
				if(isReload){}
				return obj2strStyle({
					'height': `${tabbarHeight}rpx`
				})
			},
			tabbarStyle() {
				const {
					isReload,
					tabbarHeight,
					tabbarConfig: {
						backgroundColor
					}
				} = this
				if(isReload){}
				return obj2strStyle({
					'height': `${tabbarHeight}rpx`,
					'background-color': backgroundColor || '#fff',
				})
			},
			tabbarItemStyle() {
				const {
					isReload,
					currentIndex,
					tabbarConfig: {
						color,
						selectedColor
					}
				} = this
				if(isReload){}
				return obj2strStyle({
					'color': currentIndex ? selectedColor : color
				})
			}
		},
		created() {
			const {
				tabbar,
				native
			} = this
			const pageTabbar = PageConfig.tabBar
			this.initTabbarConfig = native ? pageTabbar : tabbar
			console.log(this.name)
			this._initTabbar()
		},
		methods: {
			_initTabbar() {
				const {
					current,
					fill,
					native,
					tabbarList
				} = this
				this.currentIndex = current * 1
				if (native && tabbarList.length > 0) {
					const currentPage = `/${getCurrentPages()[0].route}`
					const currentIndex = tabbarList.findIndex(item => item.pagePath === currentPage)
					this.currentIndex = currentIndex
					uni.hideTabBar()
				}
				setTimeout(() => {
					this.isShowTabBar = true
				})
				this._setTabbarStorage('tabbarConfig')
			},
			_setTabbarStorage(key){
				setTabbarStorage(key, this.tabbarConfig, this.name)
				this._setReload()
			},
			_getDefaultTabbar() {
				return getTabbarStorage('tabbarConfig', this.name)
			},
			_checkMaxIndex(index) {
				const {
					tabbarConfig: {
						list
					}
				} = this
				if (list.length < 1) {
					return false
				}
				if (!list[index]) {
					console.error('Max tabbar index')
					return false
				}
				return true
			},
			_setReload(){
				this.isReload = true
				setTimeout(()=>{
					this.isReload = false
				})
			},
			setTabBarBadge(obj) {
				const {
					index,
					text
				} = obj
				if (this._checkMaxIndex(index)) {
					this.tabbarConfig.list[index].dot = text
					this._setTabbarStorage('tabbarConfig')
				}
			},
			setTabBarItem(obj) {
				const {
					index,
					text,
					pagePath: newPagePath,
					iconPath,
					selectedIconPath
				} = obj
				const {
					pagePath: oldPagePath
				} = this.tabbarConfig.list[index]
				if (this._checkMaxIndex(index)) {
					this.tabbarConfig.list[index] = {
						pagePath: newPagePath ? newPagePath : oldPagePath,
						text,
						iconPath,
						selectedIconPath
					}
					this._setTabbarStorage('tabbarConfig')
				}
			},
			showTabBar() {
				this.isShowTabBar = true
			},
			hideTabBar() {
				this.isShowTabBar = false
			},
			reload(){
				this.initTabbarConfig = this._getDefaultTabbar()
			},
			_tabChange(index) {
				const {
					currentIndex
				} = this
				this.$emit('click', index)
				if (index === currentIndex) {
					return
				}
				this.beforeData = {
					newIndex: index,
					oldIndex: currentIndex,
					next: this.jumpPage
				}
				if (this.beforeChange) {
					this.beforeChange(this._jumpPage, index)
				} else {
					this._jumpPage()
				}
			},
			_jumpPage() {
				const {
					native,
					beforeData: {
						newIndex: index
					},
					tabbarList: list
				} = this
				const {
					pagePath: url,
					openType
				} = list[index]
				if (url) {
					if (native) {
						uni.switchTab({
							url
						})
					} else {
						if (openType !== 'navigate') {
							this.currentIndex = index
						}
						switch (openType) {
							case 'navigate':
								uni.navigateTo({
									url
								})
								break;
							case 'redirect':
								uni.redirectTo({
									url
								})
								break;
							case 'reLaunch':
								uni.reLaunch({
									url
								})
								break;
							case 'switchTab':
								uni.switchTab({
									url
								})
								break;
							case 'navigateBack':
								uni.navigateBack({
									delta: 1
								})
								break;
							default:
								uni.reLaunch({
									url
								})
						}
					}
				}
				this.$emit('change', index)
			}
		}
	};
</script>

<style lang="scss" scoped>
	.m-tabbar-box {
		position: relative;
		z-index: 9999;
	}

	.m-tabbar {
		position: relative;

		&.fixed {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100vw;
		}

		&__safe {
			padding-bottom: env(safe-area-inset-bottom);
		}
	}

	.m-tabbar__fill {
		pointer-events: none;
		opacity: 0;
	}

	.m-tabbar__flex {
		display: flex;
		flex-direction: row;
	}

	.m-tabbar__border {
		background-color: rgba(0, 0, 0, 0.33);
		width: 100%;
		height: 1rpx;
		transform: scaleY(0.5);
	}

	.m-tabbar__item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		padding: 4px 0 2px;
	}

	.m-tabbar__icon {
		width: 48rpx;
		height: 48rpx;
		margin-bottom: 6rpx;
		position: relative;

		&_img {
			display: block;
			width: 100%;
			height: 100%;
		}

		.m-tabbar__badge {
			color: #fff;
			background-color: #f00;
			border-radius: 20rpx;
			font-size: 22rpx;
			position: absolute;
			right: -25rpx;
			left: 40rpx;
			padding: 2rpx 0;
			width: 100%;
			text-align: center;
			white-space: nowrap;
		}
	}

	.m-tabbar__label {
		font-size: 24rpx;
	}
</style>