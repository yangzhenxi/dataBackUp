<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col
            v-action:system
            :md="8"
            :sm="24">
            <a-form-item label="区县">
              <a-select
                placeholder="请选择区县"
                v-model="queryParam.town"
                allowClear>
                <a-select-option
                  v-for="(i,index) in districtList"
                  :key="index"
                  :value="i.code">{{ i.town }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="更新时间">
              <a-range-picker @change="onChange" :defaultValue="defaultDate"/>
            </a-form-item>
          </a-col>
          <a-col
            :md="8"
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
        @click="ErrorLog">错误日志</a-button>
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
      <template
        slot="TableName"
        slot-scope="text">
        {{ text | convert('L_TABLENAME') }}
      </template>
    </m-table>
  </a-card>
</template>

<script>
import Papa from 'papaparse'
import moment from 'moment'
import { MTable, STable } from '@/components'
import { GetPullRes } from '@/api/Statistics'
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
        this.dateFormat = moment().subtract(1, 'days').format('YYYY-MM-DD')
        return {
            that: this,
            temp: {},
            itemList: [],
			Region: [],
			defaultDate: [this.$route.query.start_time, this.$route.query.end_time],
            District: [],
            default: () => {
                return moment('2015-06-06', 'YYYY-MM-DD')
            },
            // 查询参数
            queryParam: {},
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
                    title: '抽取数据量',
                    dataIndex: 'Pull',
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
                { code: '33', town: '浙江省(其他)' },
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
				if (this.$route.query) {
					this.queryParam = this.$route.query
				}
                const result = await GetPullRes(this.queryParam)
                this.result = []
                result.data.forEach((u, o) => {
                    if (u.res !== null) {
                        u.res.forEach((_, p) => {
                            this.result.push({
                                index: o + p,
                                Failure: _.Failure,
                                Id: _.Id,
                                Success: _.Success,
                                TableName: _.TableName,
                                Pull: _.Pull,
                                code: u.code,
								District: u.name,
								keys: u.code + u.name + _.Pull + _.Success + o + p
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
		onChange (date, dateString) {
			this.MomentDate = date
			this.queryParam.start_time = dateString[0]
			this.queryParam.end_time = dateString[1]
		},
        toDistrict (row) {
			const obj = {
				code: row.code,
				start_time: this.queryParam.start_time,
				end_time: this.queryParam.end_time,
				defaultDate: [this.queryParam.start_time, this.queryParam.end_time]
			}
            this.$router.push({
                path: '/pull/Extract/District',
                query: obj
            })
        },
        ErrorLog (row) {
            if (row) {
				const obj = {
					code: row.code,
					TableName: row.TableName,
					queryParam: this.queryParam,
					start_time: this.queryParam.start_time,
					end_time: this.queryParam.end_time,
					is_town: true
				}
                this.$router.push({ path: '/pull/Extract/Errorlog', query: obj })
            } else {
                this.$router.push('/pull/Extract/Errorlog')
            }
        },
        ExportExcel () {
            this.result.forEach((u, index) => {
                const obj = {
                    区县: u.District,
                    表名: convert(u.TableName, 'L_TABLENAME'),
                    抽取数据量: u.Pull,
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
