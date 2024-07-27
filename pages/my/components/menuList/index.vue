<template>
	<view class="menu-list">
		<view class="menu-module">
			<view class="head">
				<text class="title">会员中心</text>
			</view>
			<view class="list">
				<form-cell label="个人中心" description="手机、邮箱、特权" :expand="true"></form-cell>
				<form-cell label="我的会员" description="高级办公会员" :expand="true"></form-cell>
				<form-cell label="安全" description="修改密码、注销账号" :expand="true"></form-cell>
			</view>
		</view>
		<view class="menu-module">
			<view class="head">
				<text class="title">相关协议</text>
			</view>
			<view class="list">
				<form-cell label="个人中心" description="手机、邮箱、特权" :expand="true"></form-cell>
				<form-cell label="我的会员" description="高级办公会员" :expand="true"></form-cell>
				<form-cell label="安全" description="修改密码、注销账号" :expand="true"></form-cell>
			</view>
		</view>			
	</view>
</template>

<script lang="ts" setup>
	import FormCell from '@/components/FormCell/index.vue'
</script>

<style lang="scss" scoped>
	.menu-list{
		padding-top: 81rpx;
		.menu-module{
			padding-bottom: 40rpx;
			.list{
				border-radius: 20rpx;
				overflow: hidden;
			}
			.head{
				padding: 20rpx 0;
				.title{
					font-size: 34rpx;
					font-weight: 700;
				}
			}
		}
	}
</style>