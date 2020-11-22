<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row>
        <a-button
          type="primary"
          @click="$refs.Add.Add()">新增</a-button>
        <a-button
          style="margin-left:20px;"
          type="primary"
          @click="EditPAss">批量重置密码</a-button>
      </a-row>
      <m-table
        style="margin-top:10px;"
        ref="table"
        :columns="columns"
        :data="loadData">
        <template
          slot="role"
          slot-scope="text,role">
          <span>{{ role | filtersRoleList() }}</span>
        </template>
        <template slot="action" slot-scope="text,record">
          <a-button
            size="small"
            type="primary"
            icon="form"
            @click="$refs.Edit.Edit(record)">修改</a-button>
          <a-button
            size="small"
            type="danger"
            icon="delete"
            style="margin-left:15px;"
            @click="Delect(record)">删除</a-button>
        </template>
      </m-table>
      <add-modal
        ref="Add"
        @ok="handleOk" />
      <edit-modal
        ref="Edit"
        @ok="handleOk" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { MIcon, MTable } from '@/components'
import AddModal from './module/Add'
import EditModal from './module/Edit'
import { GetUserList, DeleteUser, ResetPass } from '@/api/system/user'
import { GetRoleres } from '@/api/system/role'
import { mixinTable } from '@/utils/mixin'
let that = Object
const columns = [
  {
    title: '用户名',
    dataIndex: 'UserName',
    sorter: true
  },
  {
    title: '角色',
    dataIndex: 'Role',
    sorter: true,
    scopedSlots: { customRender: 'role' }
  },
  {
    title: '添加时间',
    dataIndex: 'CreateTime',
    sorter: true,
    scopedSlots: { customRender: 'time' }
  },

  {
    title: '操作',
    sorter: true,
    scopedSlots: { customRender: 'action' },
     width: '350px'
  }
]
export default {
    mixins: [mixinTable],
    beforeCreate () {
        that = this
    },
    components: {
        MIcon,
        MTable,
        AddModal,
        EditModal
    },
    data () {
        return {
            that: this,
            columns,
            Search: {}, // 搜索数据
            roleList: [],
            dataSource: [],
            loadData: async (parameter) => {
                try {
                const data = this.deepGet(await GetUserList(), 'data', [])
                return {
                    data
                }
                } catch (error) {
                return false
                }
            }
        }
    },
    filters: {
        filtersRoleList (text) {
            const role = that.roleList.find(u => u.Id === text.Role)
            return role.Name
        }
    },
    created () {
        this.getRoleList()
    },
    methods: {
        async getRoleList () {
        const res = await GetRoleres()
        this.roleList = res.data
        },
        Delect (record) {
            this.$confirm({
            title: '是否要删除' + record.UserName,
            content: '点击确定即可删除',
            okType: 'danger',
            onOk: () => {
                DeleteUser(record).then((res) => {
                this.$message.success('删除成功！')
                this.$refs.table.refresh()
                })
            }
            })
        },
        EditPAss (record) {
            this.$confirm({
            title: '是否要批量重置',
            content: '点击确定即批量重置',
            onOk: () => {
                ResetPass(record).then((res) => {
                this.$message.success('删除成功！')
                this.$refs.table.refresh()
                })
            }
            })
        }
    }
}
</script>

<style lang="less" scoped>
</style>
