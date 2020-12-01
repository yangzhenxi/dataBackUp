<template>
  <div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="数据集">
                <a-select placeholder="请选择数据集" allowClear>
                  <a-select-option v-for="(i,index) in dataList" :key="index" :value="i.val">{{ i.title }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="区县">
                <a-date-picker v-model="queryParam.start_time" ></a-date-picker>
                <span>---</span>
                <a-date-picker v-model="queryParam.end_time"></a-date-picker>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-button type="primary" @click="get_table_data">查询</a-button>
              <a-button style="margin: 0px 10px 20px" @click="() => (queryParam = {})">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <m-table
        ref="table"
        size="default"
        bordered
        :columns="columns"
        :data="loadData">
        <template slot="TableName" slot-scope="text" >
          <a-tooltip>
            <template slot="title">根据更新时间统计新增的数据</template>
            {{ text | convert('L_TABLENAME') }}
          </a-tooltip>
        </template>
      </m-table>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { compare, getRowSpanCount } from '@/utils/util'
import { MTable } from '@/components'
import { mixinTable } from '@/utils/mixin'
import { Getres, GetPullRes } from '@/api/Statistics'
let that = Object

export default {
	mixins: [mixinTable],
	name: 'DatacountSumup',
	components: {
		MTable
	},
	beforeCreate () {
		that = this
	},
	data () {
		return {
			that: this,
			result: [],
			District: [],
			dataList: [
				{ title: '签约', key: 'qy' },
				{ title: '转诊', key: 'zz' }
			],
			queryParam: {
				start_time: moment().subtract(1, 'days').format('YYYY-MM-DD'),
				end_time: moment().subtract(1, 'days').format('YYYY-MM-DD')
			},
			// 表头
            columns: [
                {
                    title: '区县',
                    dataIndex: 'destrict',
                    align: 'center',
                    sorter: true,
                    customRender: (val, row, index) => {
						const child = that.$createElement('a', {
                            domProps: {
                                innerHTML: row.destrict
                            },
                            on: {
                                click: function () {
                                    that.toDistrict(row)
                                }
                            }
                        })
                        const obj = {
                            children: child,
                            attrs: {
                                rowSpan: that.getRowSpanCount(that.District, index)
                            }
                        }
                        return obj
                    }
                },
                {
                    title: '表名',
                    sorter: true,
                    dataIndex: 'TableName',
                    scopedSlots: { customRender: 'TableName' },
                    ellipsis: true
                },
                {
                    title: '业务库到备库',
                    dataIndex: 'howlink',
                    sorter: true
                },
                {
                    title: '备库到中间库',
                    dataIndex: 'pull',
					sorter: true,
                    scopedSlots: { customRender: 'pull_failure' }
                },
                {
                    title: '中间库到联众库',
                    sorter: true,
                    dataIndex: 'upload',
                    scopedSlots: { customRender: 'Extract_failure' }
                }
			],
			loadData: async () => {
				this.result = []
				this.District = []
				const [pulldata, Uploaddata] = (await Promise.all([GetPullRes(this.queryParam), Getres(this.queryParam)].map(api => api)))
				const pull = this.deepGet(pulldata, 'data', []).map(u => {
					u.res = u.res.sort(compare('TableName'))
					return u
				})
				const upload = this.deepGet(Uploaddata, 'data', []).map(u => {
					u.res = u.res.sort(compare('TableName'))
					u.res.forEach(o => {
						this.District.push(u.name)
					})
					return u
				})
				pull.forEach((u, index) => {
					const arr = this.deepGet(u, 'res', [])
					arr.forEach((o, _) => {
						this.result.push({
							destrict: u.name,
							code: u.code,
							TableName: o.TableName,
							howlink: '暂无数据',
							pull: o.Pull,
							upload: upload[index].res[_].Upload
						})
					})
				})
				return {
					data: this.result
				}
			}
		}
	},
	methods: {
		toDistrict (row) {
			this.$router.push({ path: `/datacount/sumup/${row.code}` })
		},
		get_table_data () {
			if (this.queryParam.start_time === 'Invalid date' && this.queryParam.end_time === 'Invalid date') {
				this.$refs.table.refresh(true)
				return true
			}
			if (this.queryParam.start_time || this.queryParam.end_time) {
				if (this.queryParam.start_time && this.queryParam.end_time && this.queryParam.start_time !== 'Invalid date' && this.queryParam.end_time !== 'Invalid date') {
					this.$refs.table.refresh(true)
				} else {
					this.$message.info('请选择完时间在查询')
				}
			} else {
				this.$refs.table.refresh(true)
			}
		},
		getRowSpanCount
	}
}
</script>

<style>

</style>
