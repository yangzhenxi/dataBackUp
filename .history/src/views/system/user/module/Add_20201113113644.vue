<template>
  <a-modal
    title="新建用户"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @change="handleCancel"
    destroyOnClose>
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-form-item
          label="用户名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入用户名"
            v-decorator="['username', { rules: [{required: true, message: '请输入用户名！'},{max:20,min:5,message:' 用户名长度为5-20个字符以内!'}],firstFields:true
            }]" />
        </a-form-item>
        <a-form-item
          label="密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input-password
            placeholder="请输入用户名"
            v-decorator="['password', { rules: [{required: true, message: '请输入用户名！'},{max:20,min:5,message:' 用户名长度为5-20个字符以内!'}],firstFields:true
            }]" />
        </a-form-item>
        <a-form-item
          label="角色"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-select
            placeholder="请选择角色"
            v-decorator="['role', { rules: [{required: true, message: '请选择角色'}] }]">
            <a-select-option
              v-for="i in roleList"
              :key="i.Id"
              :value="i.Id">
              {{ i.Name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { mixinFormModal } from '@/utils/mixin'
import { Register } from '@/api/system/user'
import { GetRoleres } from '@/api/system/role'
// import { nameValidator, telValidator, nameRepeatspecialValidator } from '@/utils/validator'
export default {
  mixins: [mixinFormModal],
  data () {
    return {
      roleList: Array
    }
  },
  methods: {
    async Add () {
      this.visible = true
      this.checked = true
      this.roleList = this.deepGet(await GetRoleres(), 'data', [])
    },
    handleSubmit () {
      this.form.validateFields(async (errors, values) => {
        this.confirmLoading = true
        if (!errors) {
          try {
            Register(values).then((res) => {
              this.confirmLoading = false
              this.$message.success('新建成功！')
              this.$emit('ok')
              this.visible = false
            })
          } catch (error) {
            this.confirmLoading = false
          }
        }
        this.confirmLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-form-item label{
    color: rgba(0, 0, 0, 0.85) !important;
}
</style>
