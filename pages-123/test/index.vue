<template>
	<view>
		<view class="space">
			这是一个自定义出来的tabbar页面，但是我没有写tabbar配置，系统自动读取了配置，你只需要定义基础的配置就可以了
		</view>
		<view class="space">
			注意，如果你的页面有多个tabbar，想用自动读取的话，最好添加上name值 `m-tabbar name="new"`
		</view>
		<view class="space">
			等待3秒，看下方的变化，变化后试着返回看看有没有同步更新，注意重新刷新状态会丢失
		</view>
		<view class="space">
			调试自动读取的时候，打开控制台把`mTab_tabbarConfig_[name]`项清楚即可
		</view>
		<m-tabbar name="new" ref="tabbar" fill fixed current="1">
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
			return {
			}
		},
		mounted() {
			setInterval(() => {
				const random = Math.floor(Math.random() * 10) + 1
				this.$refs.tabbar.setTabBarItem({
					index: 1,
					text: `变化${random}`,
					iconPath: '/static/tabbar/site-in.png',
					selectedIconPath: '/static/tabbar/site-on.png'
				})
				this.$refs.tabbar.setTabBarBadge({
					index: 0,
					text: random * 2
				})
			}, 3000)

		},
		methods: {

		}
	}
</script>

<style>

</style>