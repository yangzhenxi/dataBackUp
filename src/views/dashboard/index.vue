<template>
  <div>
    <a-spin :spinning="loading">
      <a-row :gutter="[16, 16]" v-for="(value,key) in data" :key="key" :class="key">
        <template v-if="key === 'resource'">
          <a-col :sm="24" :md="12" :xl="6" v-for="item in value" :key="item.key">
            <resource :dataSource="item"/>
          </a-col>
        </template>
        <template v-if="key === 'capatity'">
          <a-col :sm="24" :md="24" :xl="12" v-for="item in value" :key="item.key">
            <capatity :dataSource="item" />
          </a-col>
        </template>
        <template v-if="key === 'server'">
          <div class="clip-path" />
          <a-col
            :sm="24"
            :md="12"
            :xl="6"
            v-for="item in value"
            :key="`cdm_${item.key}`"
            class="col"
          >
            <server :dataSource="item"/>
          </a-col>
        </template>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import resource from './module/resource/index'
import Capatity from './module/Capatity/index'
import Server from './module/server'
import { deepGet } from '@/utils/util'
import { getdatabaseStatus, getServerCapacity, getstatus } from '@/api/dashborad'
export default {
    components: {
		resource,
		Capatity,
		Server
    },
    data () {
        return {
			loading: true,
			data: {
				resource: [
					{
					key: 'main',
					title: '业务库',
					keyName: 'ZhuKu',
					data: [],
					MaxLinkingNumber: 0
				},
				{
					key: 'backup',
					title: '备库',
					keyName: 'BeiKu',
					data: [],
					MaxLinkingNumber: 0
				},
				{
					key: 'pull',
					title: '中间库',
					keyName: 'ZhongJianKu',
					data: [],
					MaxLinkingNumber: 0
				},
				{
					key: 'upload',
					title: '联众库',
					keyName: '联众库',
					data: [],
					MaxLinkingNumber: 0
				}
				],
				capatity: [
				// {
				// 	key: 'pool',
				// 	name: 'storagePool',
				// 	title: '业务库',
				// 	data: {
				// 		input: 20,
				// 		output: 30,
				// 		cpuIdle: 50
				// 	}
				// },
				{
					key: 'backup',
					keyName: 'BeiKu',
					name: 'storagePool',
					title: '备库',
					data: {}
				},
				{
					key: 'pull',
					keyName: 'ZhongJianKu',
					name: 'storagePool',
					title: '中间库',
					data: {}
				}
				],
				server: [
					{
						key: 'SignUp',
						name: 'SignUp',
						title: '签约抽取推送',
						type: '服务监控',
						icon: 'tuisong',
						status: 1
					},
					{
						key: 'SignUpTotal',
						name: 'SignUpTotal',
						title: '签约统计',
						type: '服务监控',
						icon: 'shujutongji',
						status: 1
					},
					{
						key: 'Referral',
						name: 'Referral',
						title: '转诊抽取推送',
						type: '服务监控',
						icon: 'tuisong',
						status: 0
					},
					{
						key: 'ReferralTotal',
						name: 'resourceSLA',
						title: '转诊统计',
						type: '服务监控',
						icon: 'shujutongji',
						status: 0
					}
				]
			}
        }
	},
	created () {
		this.load()
	},
	methods: {
		async load () {
			const [resStatusdata, resdata, resCapadata] = (await Promise.all([getstatus(), getdatabaseStatus(), getServerCapacity()].map(api => api.catch(e => null))))
                // const [Usercount, Session, Desktop, CPU, Memory, Storage] = (await Promise.all([GetUserCount(), GetSession(), GetDesktop(), GetCpu(), GetMemory(), GetStorage()].map(api => api.catch(e => null))))

			const resStatus = deepGet(resStatusdata, ['data', 'service'])
			const res = deepGet(resdata, 'data', {})
			const resCapa = deepGet(resCapadata, 'data', {})
			this.data.server.map((u, index) => {
				return Object.assign(u, {
					status: deepGet(resStatus[index], 'code'),
					err: deepGet(resStatus[index], 'err')
				})
			})

			this.data.resource.map((u, index) => {
				return Object.assign(u, {
					status: deepGet(res, [u.keyName, 'Status']),
					MaxLinkingNumber: deepGet(res, [u.keyName, 'MaxLinkingNumber']),
					data: [
						{ 'key': '在线', 'count': deepGet(res, [u.keyName, 'NowLinkingNumber']) },
						{ 'key': '离线', 'count': deepGet(res, [u.keyName, 'MaxLinkingNumber']) - deepGet(res, [u.keyName, 'NowLinkingNumber']) }
					]
				})
			})

			this.data.capatity.map(u => {
				return Object.assign(u, {
					status: deepGet(resCapa, [u.keyName, 'Status']),
					TotalCapatity: deepGet(resCapa, [u.keyName, 'TotalCapatity']),
					data: {
						input: 20,
						output: 30,
						cpuIdle: parseInt(deepGet(resCapa, [u.keyName, 'UsedCapacityPercent']))
					}
				})
			})
			this.loading = false
		}
	}
}
</script>

<style lang="less" scoped>
    .clip-path {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #ffffff;
      @width: 2px;
      @edge: 16px;
      clip-path: polygon(
        @edge 0,
        calc(@edge + @width / sqrt(2)) @width,
        @width calc(@edge + @width / sqrt(2)),
        @width calc(100% - (@edge + @width / sqrt(2))),
        calc(@edge + @width / sqrt(2)) calc(100% - @width),
        calc(100% - @edge - @width / sqrt(2)) calc(100% - @width),
        calc(100% - @width) calc(100% - @edge - @width / sqrt(2)),
        calc(100% - @width)  calc(@edge + @width / sqrt(2)),
        calc(100% - @edge - @width / sqrt(2)) @width,
        calc(@edge + @width / sqrt(2)) @width,
        @edge 0,
        calc(100% - @edge)  0,
        100% @edge,
        100% calc(100% - @edge),
        calc(100% - @edge) 100%,
        @edge 100%,
        0 calc(100% - @edge),
        0 @edge
      );
    }
    .server {
      position: relative;
      margin: 16px 0px !important;
      background: linear-gradient(to bottom, #ededed 0%, #ffffff 50%, #ededed 100%);
      .col {
        padding: 24px !important;
      }
    }
</style>
