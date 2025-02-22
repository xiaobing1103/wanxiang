<template>
	<view class="VipNumberSteps">
		<view class="VipNumberSteps_headers">
			<view class="VipNumberSteps_headers_textbox">
				{{AppStrName}}AI平台会员权益 · {{TableTh[seletedVipIds].thName}}
			</view>
			<view class="VipNumberSteps_headers_buttonBox" @click="buChaJiaModal = true">
				<up-icon color="#974d1c" name="question-circle"></up-icon>
				<text class="VipNumberSteps_headers_buttonBox_text">有疑惑？联系客服</text>
			</view>
		</view>
		<view class="VipNumberSteps_middle">
			<view class="tables">
				<view class="tables_items">
					<template v-for="(items,index) in quanYiArr" :key="index">
						<view class="tables_items_td"
							:style="{fontWeight: items?.isHeader ? '900' : '', background: index%2 !== 0 ? '#fff' : '',fontSize:items?.isHeader ? '25rpx' : '20rpx'}">
							<view class="tables_items_td_text">
								{{items?.name}}
							</view>
						</view>
					</template>
				</view>
				<view class="tables_items">
					<view class="tables_items_td"
						:style="{fontWeight:'900',fontSize:'23rpx',background:'linear-gradient(to right,#fff7e6,#fadaae)'}">
						<view class="tables_items_td_text">
							{{TableTh[seletedVipIds].thName}}
						</view>
						<image class="tables_items_td_image" :src="$assets.vipIcon" mode=""></image>
					</view>
					<template v-for="(items,index) in quanYiArr" :key="index">
						<view class="tables_items_td" v-if="items.key"
							:style="{fontWeight: items?.isHeader ? '900' : '', background: index%2 !== 0 ? '#fff' : 'linear-gradient(to right,#fff7e6,#fadaae)',fontSize:items?.isHeader ? '25rpx' : '20rpx'}">
							<template v-if="currentData">
								<view class="tables_items_td_text">
									{{ reviewTexts(currentData[items?.key],items?.key)}}
								</view>
							</template>
						</view>
					</template>
				</view>
				<view class="tables_items">
					<view class="tables_items_td" :style="{fontWeight:'900',fontSize:'25rpx'}">
						<view class="tables_items_td_text">
							非会员
						</view>
					</view>
					<template v-for="(items,index) in quanYiArr" :key="index">
						<view class="tables_items_td" v-if="items.key"
							:style="{fontWeight: items?.isHeader ? '900' : '', background: index%2 !== 0 ? '#fff' : '',fontSize:items?.isHeader ? '25rpx' : '20rpx'}">
							<template v-if="rightData">
								<view class="tables_items_td_text">
									{{reviewTexts(rightData[items?.key],items?.key) }}
								</view>
							</template>
						</view>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { AppStrName } from '@/http';
	import { computed, onMounted, ref } from 'vue';
	import { useGlobalProperties } from '@/hooks/useGlobalHooks';
	import { vipShowModals, TableTh, quanYiArr, defaultTh } from '../data'
	const { $api, $assets } = useGlobalProperties()
	const props = defineProps<{ seletedVipIds : number }>()
	const buChaJiaModal = defineModel<boolean>('buChaJiaModal')

	const selectionChange = (e) => {
		console.log(e)
	}
	const reviewTexts = (str : string, type : string) => {
		const noViewStep = ['drawing', 'cartoon', 'redraw', 'expand', 'aiagent', 'voicechat', 'confront', 'imgcomprehend', 'deploy']
		if (type == 'xunlianModal') {
			return '（会员无限制，非会员则：不可使用）'
		}

		if (noViewStep.includes(type)) {
			if (str == '0') {
				return '×'
			}
			return str
		} else {
			if (str == '0') {
				return '×'
			}
			return str + '日/次'
		}
	}
	const tableData = ref({})
	const currentData = computed(() => {
		return tableData.value[props.seletedVipIds]
	})
	const rightData = computed(() => {
		return tableData.value[0]
	})
	onMounted(async () => {
		const vipLimitConfig = await $api.get('api/v1/vip/getConfig')
		tableData.value = vipLimitConfig.vipLimit
	})
</script>

<style scoped lang="scss">
	.VipNumberSteps {
		margin: 25rpx;
		border: 1px solid rgba(202, 147, 128, 0.5);
		border-radius: 10px;

		&_headers {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx;
			border-radius: 18rpx 18rpx 0 0;
			background: #fff7e5;
			font-size: 24rpx;

			&_textbox {
				background: linear-gradient(90deg, #612c08, #bf5b02);
				background-clip: text;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				font-weight: 700;
			}

			&_buttonBox {
				display: flex;
				align-items: center;
				background-color: #ffe4bd;
				color: #974d1c;
				border: 0;
				padding: 10rpx;
				border-radius: 10rpx;

				&_text {
					margin-left: 10rpx;
				}
			}

		}

		&_middle {
			padding: 20rpx;
		}
	}

	.tables {
		background-color: rgb(254, 251, 244);
		width: 100%;
		border-radius: 15rpx;
		overflow: hidden;
		display: flex;

		&_th {
			display: flex;
			width: 33%;
		}

		&_items {
			width: 33%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&_td {
				padding: 20rpx;
				font-size: 20rpx;
				color: rgb(5, 7, 59);
				width: 100%;
				display: flex;
				justify-content: center;
				border: 1rpx solid #fff;
				display: flex;

				&_text {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				&_image {
					width: 30rpx;
					height: 30rpx;
				}
			}

		}
	}
</style>