<template>
  <a-modal
    title="修改用户"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @change="handleCancel"
    destroyOnClose
  >
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
        <!-- <a-form-item
          label="密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input-password
            placeholder="请输入密码"
            v-decorator="['password', { rules: [{required: true, message: '请输入密码'}],firstFields:true
            }]" />
        </a-form-item> -->
        <!-- <a-form-item
          label="确认密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input-password
            placeholder="请输入密码"
            v-decorator="['confirm_password', { rules: [{required: true, message: '请输入密码'},{validator:ConfirmPass}],firstFields:true
            }]" />
        </a-form-item> -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { mixinFormModal } from '@/utils/mixin'
import { ResetPass } from '@/api/system/user'
import { GetRoleres } from '@/api/system/role'

export default {
    mixins: [mixinFormModal],
    data () {
        return {
            roleList: Array,
            recard: null
        }
    },
    methods: {
        async Edit (record) {
            this.visible = true
            this.roleList = this.deepGet(await GetRoleres(), 'data', [])
            this.record = record
            this.$nextTick(() => {
        setTimeout(() => {
          this.form.setFieldsValue(
            this.pick(this.recard, ['name', 'username', 'role_id'])
          )
        })
      })
        },
        handleSubmit () {
        this.form.validateFields(async (errors, values) => {
            this.confirmLoading = true
            if (!errors) {
            try {
                values.id = this.record.Role
                ResetPass(values).then(res => {
                        this.confirmLoading = false
                        this.$message.success('修改成功')
                        this.$emit('ok')
                        this.visible = false
                })
            } catch (error) {
                this.confirmLoading = false
            }
            } else {
            this.confirmLoading = false
            }
        })
        },
        ConfirmPass (rule, value, callback) {
            const user = this.form.getFieldsValue(['password'])
            if (value !== user.password) {
                callback(new Error('两次输入密码不一致'))
            }
            callback()
        }
    }
}
</script>
