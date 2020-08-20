<template>
  <div class="login">
    <div class="login-content">
      <div class="login-aside"></div>
      <div class="login-form">
        <el-form :model="formData" :rules="formRule" ref="formData" size="medium">
          <div class="tit">帐号登录</div>
          <el-form-item prop="accountName" class="el-form-line" @submit.native.prevent>
            <el-input
              @keyup.enter.native="handleLogin"
              :maxlength="11"
              @change="change('accountName')"
              clearable
              placeholder="用户名"
              v-model.trim="formData.accountName"
            >
              <svg aria-hidden="true" class="icon" slot="prefix">
                <use xlink:href="#iconzhanghu" />
              </svg>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" class="el-form-line">
            <el-input
              @keyup.enter.native="handleLogin"
              :maxlength="12"
              @change="errCode = 3"
              clearable
              placeholder="密码"
              type="password"
              v-model.trim="formData.password"
            >
              <svg aria-hidden="true" class="icon" slot="prefix">
                <use xlink:href="#iconmima" />
              </svg>
            </el-input>
          </el-form-item>
          <!-- <el-form-item prop="smsNumber">
            <el-input
              @keyup.enter.native="handleLogin"
              :maxlength="6"
              @change="errCode = 3"
              clearable
              placeholder="验证码"
              v-model="formData.smsNumber"
            >
              <svg aria-hidden="true" class="icon" slot="prefix">
                <use xlink:href="#iconyanzhengma" />
              </svg>
            </el-input>
            <span @click="getSmsNumber" class="tip">{{ getSmsText() }}</span>
          </el-form-item>-->

          <el-form-item class="login-item">
            <el-button :loading="loading" @click="handleLogin" type="violet">登录</el-button>
          </el-form-item>
          <el-form-item class="rememberpwd">
            <el-checkbox v-model="checked">记住登录名</el-checkbox>
            <el-divider direction="vertical"></el-divider>
            <router-link to="/register">免费注册</router-link>
            <el-divider direction="vertical"></el-divider>
            <router-link to="/register">忘记密码</router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { login } from "../../api";
import { debounce, sleep, setFullBackground, $replace } from "../../util";
import mixins from "../../mixins";
export default {
  name: "Login",
  mixins: [mixins],
  data() {
    return {
      checked: false,
      loading: false,
      formData: {
        accountName: localStorage.getItem("_userName") || "",
        password: "",
      },
      formRule: {
        accountName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["change", "blur"],
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["change", "blur"],
          },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: ["change", "blur"],
          },
        ],
        smsNumber: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { len: 6, message: "请输入6位验证码", trigger: "blur" },
        ],
      },
      smsText: "获取验证码",
      smsNum: 0,
      waiting: false,
    };
  },
  created() {
    this.debounceSetFullBackground = debounce(() => {
      setFullBackground(".login");
    });
    this.handleLogin = debounce(this.handleLogin);
  },
  async mounted() {
    this.update({ filterBlur: false });
    setFullBackground(".login");
    window.addEventListener("resize", this.debounceSetFullBackground);
  },
  methods: {
    ...mapActions(["update"]),
    async login() {
      this.loading = true;
      const [, result] = await login(this.formData);
      if (result) {
        if (this.checked) {
          localStorage.setItem("_userName", result.accountName);
        }
        Object.keys(result).forEach((key) => {
          localStorage.setItem(key, result[key]);
        });
        await sleep(1000);
        this.loginSuccess();
      }
      this.loading = false;
    },
    /**
     * 登录成功后回调接口
     * @date 2020-08-13
     * @returns {any}
     */
    loginSuccess() {},
    // 账号密码非空验证
    handleLogin() {
      this.$refs.formData.validate((v) => {
        if (v) this.login();
      });
    },
    change(field) {
      this.$refs.formData.validateField(field);
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.debounceSetFullBackground);
  },
};
</script>
<style lang="scss" scoped>
.login {
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 1280px;
  min-height: 700px;
  margin: 0 auto;
  position: relative;

  &-content {
    display: flex;
    background: url("~@/assets/imgs/login/bg.png") 0 60px no-repeat;
    z-index: 90;
    min-height: 100%;
    flex: 1;
  }
  &-aside {
    flex: 1;
    margin: 112px 0 0 113px;
    color: rgba(29, 33, 45, 1);
    letter-spacing: 2px;
    font-family: MicrosoftYaHei;

    .tit {
      font-size: 20px;
      line-height: 26px;
      margin-bottom: 10px;
    }
    .sub-tit {
      font-size: 40px;
      line-height: 52px;
    }
    .icon {
      position: relative;
      left: 5px;
      color: #338aec;
      font-size: 18px;
      top: 3px;
    }
    .same-acount {
      text-decoration: underline;
      float: right;
      cursor: pointer;
    }
    .tip {
      position: absolute;
      top: 3px;
      right: 170px;
      white-space: nowrap;
      cursor: pointer;
    }
  }
  &-form {
    margin: 100px 87px 0 0;
    width: 400px;
    height: 453px;
    padding: 29px 40px 0;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 16px 0px rgba(54, 54, 64, 0.2);
    border-radius: 4px;
    .tit {
      font-size: 21px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 29px;
      padding-bottom: 8px;
      width: 79px;
      margin: 0 auto 18px;
      white-space: nowrap;
      border-bottom: solid 3px rgba(137, 25, 142, 1);
    }
    .el-form-item {
      height: 52px;
      .el-input,
      .el-input__inner {
        padding: 0;
        border: none;
      }
    }
    .el-form-line {
      border-bottom: solid 1px rgba(218, 223, 229, 1);
    }
    .el-divider--vertical {
      margin-top: 18px;
    }

    .el-form-item__content {
      display: flex;
      flex: 1;
      line-height: 52px;
    }
  }
  .login-item .el-form-item__content {
    flex: 1;
    margin-top: 18px;
    justify-content: space-between;
  }
  .rememberpwd .el-form-item__content {
    color: $--link-color;
    justify-content: space-between;
  }
  .el-button--violet {
    width: 100%;
  }
  .el-form-item.is-error .el-input__inner,
  .el-form-item.is-error .el-input__inner:focus,
  .el-form-item.is-error .el-textarea__inner,
  .el-form-item.is-error .el-textarea__inner:focus {
    border-color: #df1616;
  }
  .el-form-item__error {
    top: 55px;
  }
  .login {
    input::placeholder {
      color: #999;
    }

    .el-input__inner {
      line-height: 52px;
      border: none;
      padding-left: 34px;
    }
    .el-button {
      letter-spacing: 5px;
      border-radius: 18px;
      font-size: 16px;
      height: 36px;
      line-height: 36px;
      padding: 0 12px;
    }

    .el-form-item__error {
      display: inline-block;
      position: static;
      margin-left: 5px;
    }
  }
}
</style>