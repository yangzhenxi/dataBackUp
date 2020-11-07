<template>
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
        @click="handleEdit()">导出Excel</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" bordered>
      <template slot="name" slot-scope="text">
        <a>{{ text }}</a>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getServiceList } from '@/api/manage'
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    attrs: {}
  }
  if (index === 4) {
    obj.attrs.colSpan = 0
  }
  return obj
}
// import { mergeCellKey } from '@/utils/mergeCell'
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
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (index === 2) {
              obj.attrs.rowSpan = 2
            }
            return obj
          }
        },
        {
          title: '表名',
          dataIndex: 'description',
          ellipsis: true
          //   customRender: renderContent
        },
        {
          title: '生产库到备库数据量',
          dataIndex: 'callNo',
          sorter: true,
          needTotal: true
          //   customRender: renderContent

          //   customRender: text => text + ' 次'
        },
        {
          title: '数据抽取量',
          dataIndex: 'status',
          needTotal: true
          //   customRender: renderContent
        },
        {
          title: '推送联众库数据量',
          dataIndex: 'updatedAt',
          sorter: true
          //   customRender: renderContents
        }
      ],
      result: [],
      const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        customRender: (text, row, index) => {
          if (index < 4) {
            return <a href="javascript:;">{text}</a>;
          }
          return {
            children: <a href="javascript:;">{text}</a>,
            attrs: {
              colSpan: 5,
            },
          };
        },
      },
      {
        title: 'Age',
        dataIndex: 'age',
        customRender: renderContent,
      },
      {
        title: 'Home phone',
        colSpan: 2,
        dataIndex: 'tel',
        customRender: (value, row, index) => {
          const obj = {
            children: value,
            attrs: {},
          };
          if (index === 2) {
            obj.attrs.rowSpan = 2;
          }
          // These two are merged into above cell
          if (index === 3) {
            obj.attrs.rowSpan = 0;
          }
          if (index === 4) {
            obj.attrs.colSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Phone',
        colSpan: 0,
        dataIndex: 'phone',
        customRender: renderContent,
      },
      {
        title: 'Address',
        dataIndex: 'address',
        customRender: renderContent,
      },
    ];
      data: [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          tel: '0571-22098909',
          phone: 18889898989,
          address: 'New York No. 1 Lake Park'
        },
        {
          key: '2',
          name: 'Jim Green',
          tel: '0571-22098333',
          phone: 18889898888,
          age: 42,
          address: 'London No. 1 Lake Park'
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          tel: '0575-22098909',
          phone: 18900010002,
          address: 'Sidney No. 1 Lake Park'
        },
        {
          key: '4',
          name: 'Jim Red',
          age: 18,
          tel: '0575-22098909',
          phone: 18900010002,
          address: 'London No. 2 Lake Park'
        },
        {
          key: '5',
          name: 'Jake White',
          age: 18,
          tel: '0575-22098909',
          phone: 18900010002,
          address: 'Dublin No. 2 Lake Park'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getServiceList(Object.assign(parameter, this.queryParam)).then((res) => {
          this.result = res.result.data
          return res.result
        })
      }
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
    }
  }
}
</script>
