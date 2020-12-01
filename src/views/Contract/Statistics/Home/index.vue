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
              <a-select placeholder="请选择区县" :default-value="$route.query.town ||districtList[0].code" @change="(val) => this.queryParam.town = val" allowClear >
                <a-select-option v-for="(i,index) in districtList" :key="index" :value="i.code">{{ i.town }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="时间">
              <a-date-picker :default-value="$route.query.start_time || default_start_time" @change="(val) => this.queryParam.start_time = moment(val).format('YYYY-MM-DD')" placeholder="请选择开始时间" />
              <span> ---- </span>
              <a-date-picker :default-value="$route.query.end_time || default_end_time" @change="(val) => this.queryParam.end_time = moment(val).format('YYYY-MM-DD')" placeholder="请选择结束时间" />
            </a-form-item>
          </a-col>
          <a-col
            :md="6"
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
        @click="ExportExcel">导出Excel</a-button>
      <!-- <a-select :default-value="$route.query.table_data_type||table_data_type_list[0].title" style="width: 120px" @change="handleChange">
        <a-select-option v-for="(i,index) in table_data_type_list" :key="index" :value="i.val">
          {{ i.title }}
        </a-select-option>
      </a-select> -->
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
import { MTable, STable } from '@/components'
import { Getres } from '@/api/Statistics'
// import { GetReferralres } from '@/api/Referral'
import { convert } from '@/utils/util'
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
				start_time: moment().subtract(1, 'days').format('YYYY-MM-DD'),
				end_time: moment().subtract(1, 'days').format('YYYY-MM-DD')
			},
			default_start_time: moment().subtract(1, 'days').format('YYYY-MM-DD'),
			default_end_time: moment().subtract(1, 'days').format('YYYY-MM-DD'),
			table_data_type_list: [
				{ title: '签约', val: 'Getres' },
				{ title: '转诊', val: 'GetReferralres' }
			],
			table_data_type: this.$route.query.table_data_type || 'Getres',
            temp: {},
            itemList: [],
			Region: [],
			MomentDate: [],
            District: [],
            // 表头
            columns: [
                {
                    title: '区县',
                    dataIndex: 'name',
                    align: 'center',
                    sorter: true,
                    customRender: (val, row, index) => {
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
            result: [],
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
				if (this.$route.query.start_time) { this.queryParam = this.$route.query }
				const result = await Getres(this.queryParam)
				console.log(result.data)
				result.data.forEach((u, o) => {
					if (u.res !== null) {
						u.res.forEach((_, p) => {
							console.log(_.Failure)
							this.result.push({
								index: o + p,
								Failure: _.Failure,
								Id: _.Id,
								Success: _.Success,
								TableName: _.TableName,
								Upload: _.Upload,
								code: u.code,
								District: u.name,
								keys: u.name + u.code + _.Id + _.TableName
							})
							this.District.push(u.name)
						})
					}
				})
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
				town: this.queryParam.town,
				// defaultDate: [this.queryParam.start_time, this.queryParam.end_time],
				table_data_type: this.table_data_type
			}
            this.$router.push({ path: '/Contract/Statistics/District', query: obj })
        },
        ErrorLog (row) {
			const obj = {
				code: row.code,
				countyCode: row.code,
				TableName: row.TableName,
				town: this.queryParam.town,
				start_time: this.queryParam.start_time,
				end_time: this.queryParam.end_time,
				is_town: 'true',
				router: 'Contract/Statistics/Home'
			}
            this.$router.push({ path: '/error/statisticslog', query: obj })
        },
        ExportExcel () {
            this.result.forEach((u, index) => {
                const obj = {
                    区县: u.District,
                    表名: convert(u.TableName, 'L_TABLENAME'),
                    推送联众库数据量: u.Upload,
                    成功数: u.Success,
                    失败数: u.Failure
                }
                this.itemList.push(obj)
            })
            var csv = Papa.unparse(this.itemList)
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
