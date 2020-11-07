<template>
  <page-header-wrapper :title="false">
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col
              :md="8"
              :sm="24">
              <a-form-item label="区县">
                <a-select
                  v-model="queryParam.status"
                  placeholder="请选择"
                  default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="8"
              :sm="24">
              <a-form-item label="筛选条件">
                <a-select
                  v-model="queryParam.status"
                  placeholder="请选择"
                  default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col
                :md="8"
                :sm="24">
                <a-form-item label="更新日期">
                  <a-range-picker
                    @change="onChange"
                    format="YYYY-MM-DD HH:mm:ss" />
                </a-form-item>
              </a-col>
            </template>
            <a-col
              :md="(!advanced && 8) || 24"
              :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}">
                <a-button
                  type="primary"
                  @click="$refs.table.refresh(true)">查询</a-button>
                <a-button
                  style="margin-left: 8px"
                  @click="() => (queryParam = {})">重置</a-button>
                <a
                  @click="toggleAdvanced"
                  style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button
          type="primary"
          @click="handleEdit()">错误日志</a-button>
        <a-button
          type="primary"
          @click="Export()">导出Excel</a-button>
      </div>
      <s-table
        ref="table"
        size="default"
        bordered
        rowKey="description"
        :columns="columns"
        :customRow="handlechange"
        :data="loadData">
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import { getServiceList } from '@/api/manage'
import { mergeCellKey } from '@/utils/mergeCell'
export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '区县',
          dataIndex: 'District',
          align: 'center',
          sorter: true,
          needTotal: true,
          customRender: (val, row, index) => {
            const obj = {
              children: val,
              attrs: {}
            }
            obj.attrs.rowSpan = mergeCellKey(row.District, this.result, 'District')
            return obj
          }
        },
        {
          title: '表名',
          dataIndex: 'description',
          ellipsis: true
        },
        {
          title: '生产库到备库数据量',
          dataIndex: 'callNo',
          sorter: true,
          needTotal: true,
          scopedSlots: { customRender: 'callNo' }

        },
        {
          title: '数据抽取量',
          dataIndex: 'status',
          needTotal: true
        },
        {
          title: '推送联众库数据量',
          dataIndex: 'updatedAt',
          sorter: true
        }
      ],
      result: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getServiceList(Object.assign(parameter, this.queryParam)).then((res) => {
            console.log(res.result.data)
          this.result = res.result.data
          return res.result
        })
      },
      handlechange: (row, index) => ({
          on: {
              click: () => {
                  this.$router.push('/Statistics/Home/District')
                  console.log(row, index)
              }
          }
      })
    }
  },

  methods: {
    handleEdit (record) {
      //   this.$emit('onEdit', record)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    onChange (date, dateString) {
      console.log(date, dateString)
    },
    Export () {
        this.result.forEach((u, index) => {
            if (index !== 0) {
                const obj = {
                    '用户名': data[0],
                    '姓名': data[1],
                    '手机号码': data[3],
                    '邮箱': data[2],
                    '是否下次登录修改密码': data[4],
                    '是否不能修改密码': data[5],
                    '是否密码永不过期': data[6],
                    '是否禁用账户': data[7]
                }
            }
        })
        console.log(this.result)
    }
  }
}
</script>
