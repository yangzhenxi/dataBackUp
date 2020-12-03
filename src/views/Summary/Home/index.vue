<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="数据集" >
              <a-select placeholder="请选择数据集" v-model="this.queryParam.data_set" allowClear >
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
              <a-date-picker v-model="this.queryParam.start_time" placeholder="请选择开始时间" />
              <span> ---- </span>
              <a-date-picker v-model="this.queryParam.end_time" placeholder="请选择结束时间" />
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
            v-show="record.pull_error !==0"
            type="primary"
            size="small"
            @click="ErrorLog(record ,'Extractlog')">查看错误日志({{ record.pull_failure }}个)</a-button>
        </div>
      </template>
      <template slot="upload_failure" slot-scope="text,record">
        <div class="flex">
          <span>{{ text }}</span>
          <a-button
            v-show="record.upload_error!==0"
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
import { getAllList } from '@/api/Statistics'
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
			queryParam: {
				data_set: 0,
				start_time: moment().subtract(1, 'days').format('YYYY-MM-DD'),
				end_time: moment().subtract(1, 'days').format('YYYY-MM-DD')
			},
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
                    dataIndex: 'destrict',
                    align: 'center',
                    sorter: true,
                    customRender: (val, row, index) => {
						if (row.destrict !== '合计') {
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
						} else {
							return {
								children: row.destrict
							}
						}
                    }
                },
                {
                    title: '表名',
                    sorter: true,
					dataIndex: 'TableName',
                    align: 'center',
                    scopedSlots: { customRender: 'TableName' },
                    ellipsis: true
				},
				{
                    title: '业务库',
					sorter: true,
                    align: 'center',
                    dataIndex: 'main_nums'
                },
                {
					title: '备库',
                    align: 'center',
                    dataIndex: 'backup_nums',
                    sorter: true
                },
                {
					title: '中间库',
                    align: 'center',
					dataIndex: 'pull_nums',
					scopedSlots: { customRender: 'pull_failure' },
					sorter: true
                },
                {
                    title: '联众库',
					sorter: true,
                    align: 'center',
					scopedSlots: { customRender: 'upload_failure' },
                    dataIndex: 'upload_nums'
                }
            ],
            result: [],
            dataList: [
                { code: 0, name: '签约' }
                // { code: 1, name: '转诊' }
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
				let uploadCount = 0
				let pullCount = 0
				let mianCount = 0
				let backupCount = 0
				if (this.$route.query.start_time) { this.queryParam = this.$route.query }
				const data = deepGet(await getAllList(this.queryParam), 'data', {})
				const main = deepGet(deepGet(data, 'main', {}), 'data', [])
				const backup = deepGet(deepGet(data, 'backup', {}), 'data', [])
				const pull = deepGet(deepGet(data, 'pull', {}), 'data', [])
				const upload = deepGet(deepGet(data, 'upload', {}), 'data', [])
				const mainRes = this.structure(main)
				const backupRes = this.structure(backup)
				const pullRes = this.structure(pull)
				const uploadRes = this.structure(upload)
				mainRes.forEach((item, index) => {
					uploadCount = uploadCount + uploadRes[index].upload
					pullCount = pullCount + pullRes[index].pull
					mianCount = mianCount + item.nums
					backupCount = backupCount + backupRes[index].nums
					const obj = {
						TableName: item.table_name,
						code: item.code,
						destrict: item.destrict,
						upload_nums: uploadRes[index].upload,
						pull_nums: pullRes[index].pull,
						main_nums: item.nums,
						backup_nums: backupRes[index].nums,
						pull_error: pullRes[index].error,
						upload_error: uploadRes[index].error

					}
					this.result.push(obj)
				})
				this.result.push({
					TableName: 'QianYueDXX',
					destrict: '合计',
					upload_nums: uploadCount,
					pull_nums: pullCount,
					main_nums: mianCount,
					pull_error: 0,
					upload_error: 0,
					backup_nums: backupCount
				})
				this.District.push('合计')
				return {
                    data: this.result
                }
            }
        }
	},
    methods: {
		toDistrict (row) {
				const obj = {
					code: row.code,
					start_time: this.queryParam.start_time,
					end_time: this.queryParam.end_time,
					data_set: this.queryParam.data_set
				}
				this.$router.push({ path: '/Summary/District', query: obj })
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
		structure (arr) {
			const arrs = []
			this.District = []
			arr.forEach(u => {
				const res = deepGet(u, 'res', [])
				res.forEach(item => {
					this.District.push(u.name)
					item.destrict = u.name
					item.code = u.code
					item.error = item.Failure || 0
				})
				if (res.length >= 2) {
				res.sort(compare('table_name'))
				}
				arrs.push(...res)
			})
			return arrs
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
