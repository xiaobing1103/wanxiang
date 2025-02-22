<template>
	<view>
		<view class="space">我是第一个页面，我在页面做了路由拦截，其他页面没有做哦</view>
		<navigator class="space" style="color: #f00;" url="/pages/tabbar/tabbar">点击我进入内页使用案例</navigator>
		<view style="height: 100vh;">
			<navigator class="space" style="color: #f00;" url="/pages/test/index">点击这里体验自动读取配置</navigator>
		</view>
		<m-tabbar name="new" ref="tabbar" native :beforeChange="onBeforeChange">
			<template v-slot:tabbar_index_2>
				<view class="custom_style">
					<view class="custom_style_icon">+</view>
				</view>
			</template>
		</m-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onShow(){
			this.$nextTick(()=>{
				this.$refs.tabbar.reload()
			})
		},
		methods: {
			onBeforeChange(next, index) {
				uni.showModal({
					title: '非法进入',
					content: `你点击了第${index}个tab,被系统拦截了,是否继续`,
					success: function(res) {
						if (res.confirm) {
							next()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
