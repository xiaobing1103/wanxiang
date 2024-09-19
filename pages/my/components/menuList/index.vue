<template>
	<view class="menu-list">
		<view class="menu-module">
			<view class="head">
				<text class="title">会员中心</text>
			</view>
			<view class="list">
				<form-cell isHasToken label="个人中心" description="手机、邮箱、特权" :expand="true"
					path="/pages/my/subPage/PersonalCenter/index"></form-cell>
				<form-cell label="我的会员" :expand="true" path="/pages/my/subPage/vip/index">
					<template #extra>
						<text
							:class="{'vip-desc' : UserStore.userInfo?.vip !== 0 } ">{{UserStore.userInfo?.vipType}}</text>
					</template>
				</form-cell>
				<form-cell isHasToken label="安全" description="修改密码、注销账号" :expand="true"
					@change="openPop = true"></form-cell>
			</view>
		</view>
		<view class="menu-module">
			<view class="head">
				<text class="title">相关协议</text>
			</view>
			<view class="list">
				<form-cell @change="openPop1 = true" label="协议" description="用户协议、隐私协议" :expand="true"></form-cell>
				<form-cell label="关于万象" :expand="true" @change="topath"></form-cell>
				<form-cell label="联系我们" @change="openRelation" description="在线客服" :expand="true"></form-cell>
			</view>
		</view>



	</view>
</template>

<script lang="ts" setup>
	import FormCell from '@/components/FormCell/index.vue'
	import { useUserStore } from '@/store';
	const openPop = defineModel<boolean>('openPop')
	const openPop1 = defineModel<boolean>('openPop1')
	const popupShow6 = defineModel<boolean>('popupShow6')
	const UserStore = useUserStore()
	const topath = () => {
		uni.navigateTo({
			url: '/pages/my/subPage/AboutWe/index'
		})
	}
	const openRelation = () => {
		popupShow6.value = true
	}
</script>

<style lang="scss" scoped>
	.menu-list {
		.menu-module {
			padding-bottom: 40rpx;

			.list {
				border-radius: 20rpx;
				overflow: hidden;

				.vip-desc {
					color: #FE6938;
				}
			}

			.head {
				padding: 20rpx 0;

				.title {
					font-size: 30rpx;
					font-weight: 700;
				}
			}
		}
	}
</style>