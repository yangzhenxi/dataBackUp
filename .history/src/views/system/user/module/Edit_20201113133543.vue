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
        this.$nextTick(() => {
        setTimeout(() => {
          this.form.setFieldsValue(
            // this.pick(this.recard, ['name', 'username', 'role_id'])
          )
        })
      })
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
    }
  }
}
</script>

<style lang="less" scoped>
    /deep/.ant-form-item label {
        position: relative;
        color: white;
    }
    /deep/.ant-modal-title {
    margin: 0;
    color: white;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
}
/deep/i.anticon.anticon-close.ant-modal-close-icon {
    color: white;
}
</style>
