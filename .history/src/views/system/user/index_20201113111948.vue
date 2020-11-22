<template>
  <page-header-wrapper :title="false">
    <a-card>
      <a-row>
        <a-col :span="2">
          <a-button
            type="primary"
            @click="$refs.Add.Add(roleList,UserList)"
            icon="plus">新增</a-button>
        </a-col>
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
      <!-- <add-modal
        ref="Add"
        @ok="handleOk" />
      <edit-modal
        ref="Edit"
        @ok="handleOk" /> -->
    </a-card>

  </page-header-wrapper>
</template>

<script>
import { MIcon, MTable } from '@/components'
// import AddModal from './module/Add'
// import EditModal from './module/Edit'
import { GetUserList, systemUserDelete, systemUserResetPassword, systemUserPatch } from '@/api/system/user'
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
        MTable
        // AddModal,
        // EditModal
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
            const role = that.roleList.find(u => u.Id === text.Id)
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
            title: '是否要删除' + record.username,
            content: '点击确定即可删除',
            okType: 'danger',
            onOk: () => {
                systemUserDelete(record).then((res) => {
                this.$message.success('删除成功！')
                this.$refs.table.refresh()
                })
            }
            })
        },
        ResetPassword (record) {
            this.$confirm({
            title: '是否重置密码' + record.username,
            content: '点击确定即可重置密码',
            onOk: () => {
                systemUserResetPassword(record).then((res) => {
                this.$message.success('重置成功！默认密码为Passw0rd!')
                this.$refs.table.refresh()
                })
            }
            })
        },
            // 修改状态
        onChange (record) {
            record.locked = !record.locked
            const obj = {
                user: {
                    ...record
                }
            }
            systemUserPatch(obj).then(res => {
                this.$message.success('修改状态成功')
            }).catch(() => {
                record.locked = !record.locked
            })
        }
    }
}
</script>

<style lang="less" scoped>
    /deep/.ant-form-item label {
        position: relative;
        color: white;
    }
    /deep/input#name,/deep/input#username,/deep/input#mail,/deep/input#phone {
        background: content-box;
        height: 0;
        padding: 1.2em .5em;
        color: white !important;
    }
    /deep/input#name::first-line, /deep/input#username::first-line, /deep/input#mail::first-line, /deep/input#phone::first-line{
      color: white;
    }
</style>
