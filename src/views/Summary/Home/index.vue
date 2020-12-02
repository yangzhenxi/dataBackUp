<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="数据集" >
              <a-select placeholder="请选择数据集" :default-value="dataList[0].code" @change="(val) => this.queryParam.town = val" allowClear >
                <a-select-option v-for="(i,index) in dataList" :key="index" :value="i.code">{{ i.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="区县" >
              <a-select placeholder="请选择区县" :default-value="$route.query.town ||districtList[0].code" @change="(val) => this.queryParam.town = val" allowClear >
                <a-select-option v-for="(i,index) in districtList" :key="index" :value="i.code">{{ i.town }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="时间">
              <a-date-picker :default-value="$route.query.start_time || default_start_time" @change="(val) => this.queryParam.start_time = moment(val).format('YYYY-MM-DD')" placeholder="请选择开始时间" />
              <span> ---- </span>
              <a-date-picker :default-value="$route.query.end_time || default_end_time" @change="(val) => this.queryParam.end_time = moment(val).format('YYYY-MM-DD')" placeholder="请选择结束时间" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="数据筛选">
              <a-select placeholder="请选择要筛选的数据" :default-value="filterData[0].value" allowClear >
                <a-select-option v-for="(i,index) in filterData" :key="index" :value="i.value">{{ i.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-button type="primary" @click="get_table_data">查询</a-button>
            <a-button style="margin: 0px 10px 20px" @click="() => (queryParam = {})">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-button type="primary" @click="ExportExcel" style="margin-bottom:20px;">导出Excel</a-button>
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
      <template slot="pull_failure" slot-scope="text,record">
        <div class="flex">
          <span>{{ text }}</span>
          <a-button
            v-show="record.pull_failure!==0"
            type="primary"
            size="small"
            @click="ErrorLog(record ,'Extractlog')">查看错误日志({{ record.pull_failure }}个)</a-button>
        </div>
      </template>
      <template slot="Extract_failure" slot-scope="text,record">
        <div class="flex">
          <span>{{ text }}</span>
          <a-button
            v-show="record.Extract_failure!==0"
            type="primary"
            size="small"
            @click="ErrorLog(record,'statisticslog')">查看错误日志({{ record.Extract_failure }}个)</a-button>
        </div>
      </template>
    </m-table>
  </a-card>
</template>

<script>
import Papa from 'papaparse'
import moment from 'moment'
import { MTable, STable } from '@/components'
import { Getres, GetPullRes } from '@/api/Statistics'
import { convert, deepGet, compare } from '@/utils/util'
let that = Object
export default {
    name: 'TableList',
    components: {
        MTable,
        STable
    },
    beforeCreate () {
        that = this
    },
    data () {
        return {
			that: this,
			default_start_time: moment().subtract(1, 'days').format('YYYY-MM-DD'),
			default_end_time: moment().subtract(1, 'days').format('YYYY-MM-DD'),
			District: [],
			pull_result: [],
			extract_result: [],
			filterData: [
				{ name: '全部', value: 'All' },
				{ name: '数据量一致', value: 'On' },
				{ name: '数据量不一致', value: 'OFF' }
			],
            // 表头
            columns: [
                {
                    title: '区县',
                    dataIndex: 'name',
                    align: 'center',
                    sorter: true,
                    customRender: (val, row, index) => {
						if (row.District !== '合计') {
							const child = that.$createElement('a', {
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
									rowSpan: that.getRowSpanCount(that.District, index)
								}
							}
							return obj
						} else {
							return {
								children: row.District
							}
						}
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
                    title: '备库',
                    dataIndex: 'howlink',
                    sorter: true
                },
                {
                    title: '中间库',
                    dataIndex: 'pull',
					sorter: true,
                    scopedSlots: { customRender: 'pull_failure' }
                },
                {
                    title: '联众库',
                    sorter: true,
                    dataIndex: 'upload',
                    scopedSlots: { customRender: 'Extract_failure' }
                },
                {
                    title: '业务库',
                    sorter: true,
                    dataIndex: 'yewu'
                }
            ],
            result: [],
            dataList: [
                { code: 'Contract', name: '签约' }
                // { code: 'Referral', name: '转诊' }
			],
			districtList: [
                { code: '', town: '全部' },
                { code: '3303', town: '温州市(其他)' },
                { code: '330301', town: '市本级' },
                { code: '330302', town: '鹿城区' },
                { code: '330303', town: '龙湾区' },
                { code: '330304', town: '瓯海区' },
                { code: '330322', town: '洞头县' },
                { code: '330324', town: '永嘉县' },
                { code: '330326', town: '平阳县' },
                { code: '330328', town: '文成县' },
                { code: '330329', town: '泰顺县' },
                { code: '330381', town: '瑞安市' },
                { code: '330382', town: '乐清市' },
                { code: '330399', town: '经开区' }
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: async (parameter) => {
				this.result = []
				this.District = []
				this.pull_result = []
				this.extract_result = []
				let uploadCount = 0
				let pullCount = 0
				if (this.$route.query) { this.queryParam = this.$route.query }
				if (!this.queryParam.start_time) {
					this.queryParam.start_time = moment().subtract(1, 'days').format('YYYY-MM-DD')
					this.queryParam.end_time = moment().subtract(1, 'days').format('YYYY-MM-DD')
				}
                const [pull, Extract] = (await Promise.all([GetPullRes(this.queryParam), Getres(this.queryParam)].map(api => api.catch(e => null))))
				const pulldata = deepGet(pull, 'data', [])
				const extract = deepGet(Extract, 'data', [])
				pulldata.forEach(u => {
					this.pull_result.push(...u.res.sort(compare('TableName')))
					u.res.forEach(o => {
						this.District.push(u)
					})
				})
				extract.forEach(u => {
					const arr = u.res.sort(compare('TableName'))
					this.extract_result.push(...arr)
				})
				this.pull_result.forEach((u, o) => {
					if (u.TableName === 'QianYueDXX') {
						uploadCount = uploadCount + this.extract_result[o].Upload
						pullCount = pullCount + u.Pull
					}
					this.result.push({
						code: this.District[o].code,
						TableName: u.TableName,
						upload: this.extract_result[o].Upload,
						pull: u.Pull,
						howlink: '暂无数据',
						yewu: '暂无数据',
						Extract_failure: this.extract_result[o].Failure,
						pull_failure: u.Failure,
						District: this.District[o].name
					})
				})
				this.result.push({
					District: '合计',
					TableName: 'QianYueDXX',
					howlink: '暂无数据',
					yewu: '暂无数据',
					pull: pullCount,
					upload: uploadCount,
					Extract_failure: 0,
					pull_failure: 0
				})
				this.District.push({ name: '温州市(全部)' })
				return {
                    data: this.result
                }
            }
        }
	},
    methods: {
		toDistrict (row) {
			if (row.name !== '温州市(全部)') {
				const obj = {
					code: row.code,
					start_time: this.queryParam.start_time,
					end_time: this.queryParam.end_time,
					town: this.queryParam.town,
					table_data_type: this.table_data_type
				}
				this.$router.push({ path: '/Summary/District', query: obj })
			}
        },
        ErrorLog (row, router) {
			const obj = {
				code: row.code,
				countyCode: row.code,
				TableName: row.TableName,
				town: this.queryParam.town,
				start_time: this.queryParam.start_time,
				end_time: this.queryParam.end_time,
				is_town: 'true',
				router: 'Summary'
			}
            this.$router.push({ path: '/error/' + router, query: obj })
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
        getRowSpanCount (data, index) {
            let preValue = data[0]
            const res = [[preValue]]
            let i = 0
            for (let j = 1; j < data.length; j++) {
                if (data[j] === preValue) {
                    res[i].push(data[j])
                } else {
                    i += 1
                    res[i] = []
                    res[i].push(data[j])
                    preValue = data[j]
                }
            }
            const result = []
            res.map((u) => {
                u.map((_, p) => {
                    result.push(p === 0 ? u.length : 0)
                })
            })
            return result[index]
		},

		handleChange (value) {
			this.table_data_type = value
			this.$refs.table.refresh()
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
