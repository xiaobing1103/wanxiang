
<script lang="ts">
	export default {
		onLaunch: function () {

			console.log('App Launch')
			uni.getSystemInfo({
			});

		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss" scoped>
	/*每个页面公共css */
	@import url("@/assets/css/index.scss");
</style>