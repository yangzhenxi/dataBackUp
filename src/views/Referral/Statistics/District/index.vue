<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col
            :md="8"
            :sm="24">
            <a-form-item label="机构">
              <a-input v-model="params.name" placeholder="请输入要查询的机构"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="时间">
              <a-date-picker :default-value="$route.query.start_time" @change="(val) => this.queryParam.start_time = moment(val).format('YYYY-MM-DD')" placeholder="请选择开始时间" />
              <span> ---- </span>
              <a-date-picker :default-value="$route.query.end_time" @change="(val) => this.queryParam.end_time = moment(val).format('YYYY-MM-DD')" placeholder="请选择结束时间" />
            </a-form-item>
          </a-col>
          <a-col
            :md="8"
            :sm="24">
            <a-button
              type="primary"
              @click="get_table_data">查询</a-button>
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
        @click="Close">返回推送日志</a-button>
      <a-button
        type="primary"
        @click="ExportExcel">导出Excel</a-button>
    </div>
    <m-table
      ref="table"
      size="default"
      bordered
      rowKey="keys"
      :columns="columns"
      :data="loadData">
      <template slot="TableName" slot-scope="text" >
        <a-tooltip>
          <template slot="title">根据更新时间统计新增的数据</template>
          {{ text | convert('L_TABLENAME') }}
        </a-tooltip>
      </template>
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
    </m-table>
  </a-card>
</template>

<script>
import Papa from 'papaparse'
import moment from 'moment'
import { MTable } from '@/components'
import { GetresDetail } from '@/api/Statistics'
import { GetReferralresDetail } from '@/api/Referral'
import { getRowSpanCount, convert, deepGet } from '@/utils/util'
export default {
    name: 'TableList',
    components: {
        MTable
    },
    data () {
        return {
            // 查询参数
			queryParam: {},
            District: [], // 区县
            name: [], // 机构名称
			params: {},
            // 表头
            columns: [
                {
                    title: '区县',
                    align: 'center',
                    sorter: true,
                    customRender: (val, row, index) => {
                        const obj = {
                            children: this.District[0],
                            attrs: {}
                        }
                        const i = getRowSpanCount(this.District, index)
                        obj.attrs.rowSpan = i
                        return obj
                    }
                },
                {
                    title: '机构名称',
					dataIndex: 'name',
					ellipsis: true,
                    sorter: true,
					customRender: (val, row, index) => {
                        const obj = {
                            children: val,
                            attrs: {}
                        }
                        const i = getRowSpanCount(this.name, index)
                        obj.attrs.rowSpan = i
                        return obj
                    }
                },
                {
                    title: '表名',
                    dataIndex: 'TableName',
                    scopedSlots: { customRender: 'TableName' },
                    ellipsis: true,
                    sorter: true
                },
                {
                    title: '备库到中间库数据量',
                    dataIndex: 'Upload',
                    sorter: true
                },
                {
                    title: '成功数',
                    dataIndex: 'Success',
                    sorter: true
                },
                {
                    title: '失败数',
                    sorter: true,
                    dataIndex: 'Failure',
                    scopedSlots: { customRender: 'Failure' }
                }
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: async (parameter) => {
				this.result = []
				let result = {}
				this.$route.query.table_data_type === 'Getres' ? result = await GetresDetail(this.$route.query) : result = GetReferralresDetail(this.$route.query)
                this.result = []
                result.data.organizations.forEach(u => {
					const arr = deepGet(u, 'res', [])
                    arr.forEach((_, p) => {
                        this.result.push({
                            Failure: _.Failure,
                            Id: _.Id,
                            Success: _.Success,
                            TableName: _.TableName,
                            Upload: _.Upload,
                            name: u.name,
							countyCode: result.data.code,
							code: u.code,
							keys: u.code + u.name + _.Failure + _.Id + _.TableName + _.Upload,
                            District: result.data.name
                        })
						this.District.push(result.data.name)
                        this.name.push(u.name)
                    })
                })
                return {
                    data: this.result,
                    queryParam: this.params
                }
            }
        }
    },

    methods: {
        Close () {
			const obj = {
				'start_time': this.$route.query.start_time,
				'end_time': this.$route.query.end_time,
				'town': this.$route.query.town
				// 'table_data_type': this.$route.query.table_data_type
			}
			console.log(obj)
            this.$router.push({ path: '/Referral/Statistics/Home', query: obj })
        },
        ErrorLog (row) {
			const obj = {
				code: row.code,
				countyCode: row.countyCode,
				TableName: row.TableName,
				queryParam: this.queryParam,
				start_time: this.queryParam.start_time,
				end_time: this.queryParam.end_time,
				is_town: 'false',
				router: 'Referral/Statistics/District'
			}
            this.$router.push({ path: '/error/statisticslog', query: obj })
        },
        ExportExcel () {
			const itemList = []
            this.result.forEach((u, index) => {
                const obj = {
                    区县: u.District,
                    机构: u.name,
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
            // 生成<a></a>DOM元素
            const el = document.createElement('a')
            // 链接赋值
            el.href = url
            el.download = '备份数据库.csv'
            // 必须点击否则不会下载
            el.click()
            // 移除链接释放资源
            urlObject.revokeObjectURL(url)
        },
		onChange (date, dateString) {
			this.queryParam.start_time = dateString[0]
			this.queryParam.end_time = dateString[1]
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
