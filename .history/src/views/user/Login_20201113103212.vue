<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >

      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="账户: admin"
          v-decorator="[
            'username',
            {rules: [{ required: true, message: '请输入帐户名或邮箱地址' }], validateTrigger: 'change'}
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input-password
          size="large"
          placeholder="密码: admin or ant.design"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input-password>
      </a-form-item>
      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import storage from 'store'
// import md5 from 'md5'
// import { ACCESS_TOKEN } from '@/store/mutation-types'

import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions, mapMutations } from 'vuex'

import { timeFix } from '@/utils/util'
// import { getSmsCaptcha, get2step } from '@/api/login'

export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
//   created () {
//     get2step({ })
//       .then(res => {
//         this.requiredTwoStepCaptcha = res.result.stepCode
//       })
//       .catch(() => {
//         this.requiredTwoStepCaptcha = false
//       })
//     // this.requiredTwoStepCaptcha = true
//   },
  methods: {
    ...mapActions(['Login', 'Logout']),
    ...mapMutations(['SET_TOKEN']),

    handleSubmit (e) {
      e.preventDefault()
      storage.set(ACCESS_TOKEN, 'sshjghsdgjhdsfkjgdfjkd', 7 * 24 * 60 * 60 * 1000)

      this.SET_TOKEN('sudghsdkghjdsfhgdfj')
      this.$router.push({ path: '/' })
        setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    //   const {
    //     form: { validateFields },
    //     state,
    //     customActiveKey,
    //     Login
    //   } = this

    //   state.loginBtn = true

    //   const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

    //   validateFields(validateFieldsKey, { force: true }, (err, values) => {
    //     if (!err) {
    //       console.log('login form', values)
    //       const loginParams = { ...values }
    //       delete loginParams.username
    //       loginParams[!state.loginType ? 'email' : 'username'] = values.username
    //       loginParams.password = md5(values.password)
    //       Login(loginParams)
    //         .then((res) => this.loginSuccess(res))
    //         .catch(err => this.requestFailed(err))
    //         .finally(() => {
    //           state.loginBtn = false
    //         })
    //     } else {
    //       setTimeout(() => {
    //         state.loginBtn = false
    //       }, 600)
    //     }
    //   })
    },
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

        //   const hide = this.$message.loading('验证码发送中..', 0)
        //   getSmsCaptcha({ mobile: values.mobile }).then(res => {
        //     setTimeout(hide, 2500)
        //     this.$notification['success']({
        //       message: '提示',
        //       description: '验证码获取成功，您的验证码为：' + res.result.captcha,
        //       duration: 8
        //     })
        //   }).catch(err => {
        //     setTimeout(hide, 1)
        //     clearInterval(interval)
        //     state.time = 60
        //     state.smsSendBtn = false
        //     this.requestFailed(err)
        //   })
        }
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      console.log(res)
      // check res.homePage define, set $router.push name res.homePage
      // Why not enter onComplete
      /*
      this.$router.push({ name: 'analysis' }, () => {
        console.log('onComplete')
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      })
      */
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
