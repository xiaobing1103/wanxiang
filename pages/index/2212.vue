<template>
	<view class="pagesone" :class="'bg-'+themeColor.name" style="padding-top: 100rpx;">
		<view class="searchdemo" :style="{bottom:KeyHight?KeyHight+'px':KeyHight}"
			style="display: flex;flex-direction: row;">

			<view class="input" :class="'input-'+themeColor.name">
				<view class="icon">
					<image class="icon-child" :src="'/static/search-'+themeColor.name+'.png'" />
				</view>
				<input :adjust-position="false" :always-system="true" :value="searchContent" confirm-type="search"
					@confirm="search" @input="onInputSearch" :class="'text-'+themeColor.name" class="input-text"
					placeholder="输入股票名称/缩写/代码" placeholder-class="placeholder-class" :focus="true"></input>
				<view class="icon" v-show="this.searchContent!=''" @click="clearSearch()">
					<image class="icon-child" :src="'/static/delete.png'" />
				</view>
			</view>
			<text :class="'text-'+themeColor.name" @click="back"
				style="font-size: 32rpx;margin-top: 15rpx;margin-left: 20rpx;">取消</text>
		</view>

		<!-- <view style="margin-top: 30rpx; display: flex;flex-direction: row;justify-content: center;">
			<text :class="'text-'+themeColor.name" style="font-size: 28rpx;" v-show="tab == 1"
				@click="ChangeTab(1)">股票</text>
			<text style="font-size: 28rpx;color: #6F6F6F;" v-show="tab != 1" @click="ChangeTab(1)">股票</text>
 
			<text :class="'text-'+themeColor.name" style="font-size: 28rpx;margin-left: 130rpx;margin-right: 130rpx;"
				v-show="tab == 2" @click="ChangeTab(2)">概念</text>
			<text style="font-size: 28rpx;color: #6F6F6F;margin-left: 130rpx;margin-right: 130rpx;" v-show="tab != 2"
				@click="ChangeTab(2)">概念</text>
 
			<text :class="'text-'+themeColor.name" style="font-size: 28rpx;" v-show="tab == 3"
				@click="ChangeTab(3)">资讯</text>
			<text style="font-size: 28rpx;color: #6F6F6F;" v-show="tab != 3" @click="ChangeTab(3)">资讯</text>
		</view> -->


		<view class="blist" :style="{bottom:KeyHight?KeyHight+40+'px':'80rpx'}" style="padding-top: 30rpx;"
			v-show="tab == 1">
			<block v-for="(item, index) in gpList.slice().reverse()" :key="index">
				<u-GPList :item="item"></u-GPList>
			</block>
		</view>

		<view :class="'bg-'+themeColor.name" style='position: fixed;width:100%;height: 100%;z-index: 0;'>
		</view>

	</view>

</template>

<script>
	import uGPList from './search-main-gupiao-list.vue';

	export default {

		components: {
			uGPList,
		},

		data() {
			return {
				tab: 1,
				searchContent: "",
				gpList: [],
				KeyHight: 0,
			}
		},

		onLoad(option) {
			this.$statusColor.modification();
			uni.onKeyboardHeightChange((res) => {
				console.log(res.height);
				//转化为rpx
				this.KeyHight = res.height;
			});
		},

		methods: {

			back() {
				uni.navigateBack({

				});
			},

			clearSearch() {
				this.searchContent = "";
			},

			ChangeTab(tab) {
				this.tab = tab;
			},

			/* 键盘上完成(回车)的事件 */
			search() {
				if (this.isBlank(this.searchContent)) {
					this.$toast("输入股票代码/首字母");
					return;
				}
				if (this.tab == 1) {
					this.search_index(this.searchContent);
				} else if (this.tab == 2) {

				} else if (this.tab == 3) {

				}

			},

			onInputSearch: function(e) {
				if (this.tab == 1) {
					this.searchContent = e.detail.value;
					if (this.searchContent != "") {
						this.search_index(this.searchContent);
					}
				} else if (this.tab == 2) {

				} else if (this.tab == 3) {

				}
			},

			search_index(word) {
				var _this = this;
				this.request({
					urlInfo: this.$REQUEST.SEARCH_INDEX,
					body: {
						word: word,
						showtype: 'app',
					},
					success(res) {
						console.log("search_index==", res)
					},
					fail: (res) => {
						console.log("search_index==", res)
						var newList = [];
						res.data.data.filter((item, i) => {

							var obj = {};
							var sList = item.split(" ")
							obj.code = sList[0];
							obj.name = sList[1];
							obj.sx = sList[2];
							obj.foxxcode = sList[3];
							newList[i] = obj;

							return item >= res.data.data.length
						})

						_this.gpList = newList;
					}
				})

			},

		},


	}
</script>

<style lang="scss">
	.pagesone {
		width: 100%;
		height: 100%;
	}

	.searchdemo {
		//触底
		width: 100vw;
		position: absolute;
		bottom: 0;
		z-index: 99;
		//被键盘顶起
	}

	.blist {
		width: 100vw;
		position: absolute;
		bottom: 80rpx;
		z-index: 99;
	}

	.icon {
		.icon-child {
			width: 40rpx;
			height: 40rpx;
			margin-top: 10rpx;
		}
	}

	.input {
		margin-left: 30rpx;
		width: 75%;
		height: 76rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 10rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	.input-text {
		margin-left: 20rpx;
		margin-right: 20rpx;
		width: 100%;
		font-size: 32rpx;
	}

	.placeholder-class {
		color: #6F6F6F;
		font-size: 32rpx;
	}
</style>