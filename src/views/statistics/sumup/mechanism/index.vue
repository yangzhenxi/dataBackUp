<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="机构">
              <a-input placeholder="请输入要查询的机构" v-model="queryParam.name" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="时间">
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
      </m-table>
    </div>
  </a-card>
</template>

<script>
// import moment from 'moment'
import { compare, getRowSpanCount } from '@/utils/util'
import { MTable } from '@/components'
import { mixinTable } from '@/utils/mixin'
export default {
	name: 'Datacountmechanism',
	mixins: [mixinTable],
	components: {
		MTable
	},
	data () {
		return {
			// 表头
            columns: [
                {
                    title: '区县',
					align: 'center',
                    dataIndex: 'District',
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
                    title: '业务库到备库',
                    dataIndex: 'howlink',
                    sorter: true
				},
				{
                    title: '备库到中间库数据量',
                    dataIndex: 'Pull',
					sorter: true,
                    scopedSlots: { customRender: 'pullFailure' }
                },
                {
                    title: '中间库到联众库',
                    sorter: true,
                    dataIndex: 'upload',
                    scopedSlots: { customRender: 'uploadFailure' }
                }
			],
			loadData: async () => {
			}
		}
	},
	methods: {
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
		getRowSpanCount,
		compare
	}
}
</script>

<style>

</style>
