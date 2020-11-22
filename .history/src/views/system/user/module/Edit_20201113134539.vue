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
          label="密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input-password
            placeholder="请输入密码"
            v-decorator="['password', { rules: [{required: true, message: '请输入密码'}],firstFields:true
            }]" />
        </a-form-item>
        <a-form-item
          label="确认密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <a-input-password
            placeholder="请输入密码"
            v-decorator="['confirm_password', { rules: [{required: true, message: '请输入密码'},{validator:ConfirmPass}],firstFields:true
            }]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { mixinFormModal } from '@/utils/mixin'
import { ResetPass } from '@/api/system/user'

export default {
    mixins: [mixinFormModal],
    data () {
        return {
            roleList: Array,
            recard: null
        }
    },
    methods: {
        Edit () {
            this.visible = true
        },
        handleSubmit () {
        this.form.validateFields(async (errors, values) => {
            this.confirmLoading = true
            if (!errors) {
            try {
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
            console.log(this.form.getFiedsValue(['password']))
            const pattern = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/
            if (!pattern.test(value)) {
                callback(new Error('Ip格式错误'))
            }
            callback()
        }
    }
}
</script>
