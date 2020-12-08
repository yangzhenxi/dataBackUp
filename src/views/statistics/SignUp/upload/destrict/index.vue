<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col
            v-action:system
            :md="6"
            :sm="24">
            <a-form-item label="区县" >
              <a-select placeholder="请选择区县" v-model="queryParam.town" allowClear >
                <a-select-option v-for="(i,index) in districtList" :key="index" :value="i.code">{{ i.town }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="时间">
              <a-date-picker v-model="queryParam.start_time" :disabled-date="disabledStartDate" :allowClear="false" placeholder="请选择开始时间" />
              <span> ---- </span>
              <a-date-picker v-model="queryParam.end_time" :disabled-date="disabledEndDate" :allowClear="false" placeholder="请选择结束时间" />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
            :sm="24">
            <a-button
              type="primary"
              @click="$refs.table.refresh(true)">查询</a-button>
            <a-button
              style="margin-left: 8px"
              @click="() => (queryParam = {})">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button
        type="primary"
        @click="ExportExcel">导出Excel</a-button>
    </div>
    <m-table
      ref="table"
      size="default"
      bordered
      :columns="columns"
      :data="loadData">
      <template
        slot="Failure"
        slot-scope="text,record">
        <div class="flex">
          <span>{{ text }}</span>
          <a-button
            v-show="text!==0"
            type="primary"
            size="small"
            @click="ErrorLog(record)">查看错误日志</a-button>
        </div>
      </template>
      <template slot="TableName" slot-scope="text" >
        <a-tooltip>
          <template slot="title">根据更新时间统计新增的数据</template>
          {{ text | convert('L_TABLENAME') }}
        </a-tooltip>
      </template>
    </m-table>
  </a-card>
</template>

<script>
import Papa from 'papaparse'
import moment from 'moment'
import { MTable } from '@/components'
import { Getres } from '@/api/Statistics'
import { mixinTable } from '@/utils/mixin'
import { convert, getRowSpanCount, deepGet } from '@/utils/util'
let that = Object
export default {
	mixins: [mixinTable],
    name: 'TableList',
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
			// queryParam: {
			// 	start_time: this.$route.query.start_time || moment().subtract(30, 'days').format('YYYY-MM-DD'),
			// 	end_time: this.$route.query.end_time || moment().subtract(30, 'days').format('YYYY-MM-DD'),
			// 	town: this.$route.query.code || ''
			// },
            // 表头
            columns: [
                {
                    title: '区县',
                    dataIndex: 'name',
                    align: 'center',
                    sorter: true,
                    customRender: (val, row, index) => {
                        const child = this.$createElement('a', {
                            domProps: {
                                innerHTML: row.District
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
                                rowSpan: getRowSpanCount(this.District, index)
                            }
                        }
                        return obj
                    }
                },
                {
                    title: '表名',
                    align: 'center',
                    dataIndex: 'TableName',
                    scopedSlots: { customRender: 'TableName' },
                    ellipsis: true
                },
                {
					title: '中间库',
                    align: 'center',
                    dataIndex: 'Upload',
                    sorter: true
                },
                {
					title: '成功数',
                    align: 'center',
                    dataIndex: 'Success',
                    sorter: true
                },
                {
                    title: '失败数',
					sorter: true,
                    align: 'center',
                    dataIndex: 'Failure',
                    scopedSlots: { customRender: 'Failure' }
                }
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: async (parameter) => {
				this.result = []
				if (this.$route.query.start_time) { this.queryParam = this.$route.query }
				this.queryParam.start_time = moment(this.queryParam.start_time).format('YYYY-MM-DD')
				this.queryParam.end_time = moment(this.queryParam.end_time).format('YYYY-MM-DD')
				const result = deepGet(await Getres(this.queryParam), 'data', [])
				result.forEach((u, o) => {
					const res = deepGet(u, 'res', [])
					res.forEach((_, p) => {
						this.result.push({
							Failure: _.failure,
							Success: _.success,
							TableName: _.table_name,
							Upload: _.upload,
							code: u.code,
							District: u.name
						})
						this.District.push(u.name)
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
            this.$router.push({ path: `/Statistics/SignUp/upload/${row.code}`, query: this.queryParam })
        },
        ErrorLog (row) {
			this.queryParam.code = row.code
			this.queryParam.table_name = row.TableName
			this.queryParam.router = 'Statistics/SignUp/upload'
			this.queryParam.is_town = 'true'
            this.$router.push({ path: '/error/statisticslog', query: this.queryParam })
        },
        ExportExcel () {
			const itemList = []
            this.result.forEach((u, index) => {
                const obj = {
                    区县: u.District,
                    表名: convert(u.TableName, 'L_TABLENAME'),
                    推送联众库数据量: u.Upload,
                    成功数: u.Success,
                    失败数: u.Failure
                }
                itemList.push(obj)
            })
            var csv = Papa.unparse(itemList)
            // 定义文件内容，类型必须为Blob 否则createObjectURL会报错
            const content = new Blob([`\ufeff${csv}`])
            // 生成url对象
            const urlObject = window.URL || window.webkitURL || window
            const url = urlObject.createObjectURL(content)
            console.log(url)
            // 生成<a></a>DOM元素
            const el = document.createElement('a')
            // 链接赋值
            el.href = url
            el.download = '导出的推送结果.csv'
            // 必须点击否则不会下载
            el.click()
            // 移除链接释放资源
            urlObject.revokeObjectURL(url)
        },
        moment
    }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-around;
}
</style>
