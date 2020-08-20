<template>
  <section :class="`header ${extraClass}`">
    <div :class="!collapsing ? 'header-logo' : 'header-logo header-logo-collapse'" @click="home">
      <span class="header-logo-bd">
        <svg aria-hidden="true" class="logo">
          <use xlink:href="#icon-logo" />
        </svg>
      </span>
      <el-divider v-if="getUserName()" direction="vertical"></el-divider>
    </div>
    <el-menu class="header-nav" mode="horizontal">
      <template v-if="getUserName()">
        <el-menu-item index="1" @click="setCollapse({ collapsing: !collapsing })">
          <svg aria-hidden="true" class="icon icon1">
            <use xlink:href="#icon-11" />
          </svg>
        </el-menu-item>
        <!--<el-submenu index="2">
          <template slot="title">帮助中心</template>
          <el-menu-item index="2-1" @click="showTip">选项1</el-menu-item>
          <el-menu-item index="2-2" @click="showTip">选项2</el-menu-item>
          <el-menu-item index="2-3" @click="showTip">选项3</el-menu-item>
          <! <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>-->
        <el-menu-item index="3" @click="showTip">费用</el-menu-item>
        <el-menu-item index="5" @click="showTip">工单</el-menu-item>
        <el-menu-item index="4" @click="showTip">资源中心</el-menu-item>
        <el-menu-item index="7" @click="$replace('/ops/index', '/index', 'ops')">运维中心</el-menu-item>
        <el-menu-item
          index="8"
          @click="$replace('/user/userManager?mid=352','/userManager?mid=352','user')"
        >用户中心</el-menu-item>
        <el-menu-item index="6" @click="showTip">帮助</el-menu-item>

        <el-menu-item
          class="header-msg"
          index="8"
          @click="$replace('/tbs/notice','/notice', 'tbs')"
        >
          <svg v-if="notice" aria-hidden="true" class="icon icon2">
            <use xlink:href="#icon-xiaoxi" />
          </svg>
          <svg v-else aria-hidden="true" class="icon icon2">
            <use xlink:href="#icon-wuxiaoxi" />
          </svg>
        </el-menu-item>
        <el-submenu class="header-user" index="7">
          <template slot="title">
            <svg aria-hidden="true" class="icon icon3">
              <use xlink:href="#icon-yonghuming" />
            </svg>
            <span class="text">{{ getUserName() }}</span>
          </template>
          <el-menu-item index="7-1" @click="logout">退出</el-menu-item>
        </el-submenu>
      </template>
      <template v-else>
        <el-menu-item @click="showTip" class="visitor-item" index="1">简体中文</el-menu-item>
        <el-menu-item @click="showTip" class="visitor-item" index="2">帮助中心</el-menu-item>
        <el-menu-item @click="push('/')" class="visitor-item" index="3">首页</el-menu-item>
      </template>
    </el-menu>
  </section>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import collapse from "../../mixins/collapse";
import { loginOut } from "../../api";
import mixin from "../../mixins";

export default {
  mixins: [mixin, collapse],
  name: "Head",
  props: ["extraClass"],
  data() {
    return {};
  },
  computed: {
    ...mapState(["notice"]),
    ...mapGetters(["getUserName"]),
  },
  methods: {
    ...mapActions(["clear", "update"]),
    async logout() {
      try {
        await loginOut();
      } catch (err) {}
      localStorage.clear();
      this.clear();
      this.$replace("/login", "/login");
    },
    home() {
      this.$replace("/tbs/index", "/index");
    },
    showTip() {
      this.$message({ message: "功能开发中,敬请期待", type: "warning" });
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  flex-direction: row;
  display: flex;
  padding: 0;
  width: 100%;
  min-width: 1280px;
  height: 46px;
  line-height: 46px;
  background: rgba(120, 22, 125, 1);
  box-shadow: 0px 2px 8px 0px rgba(216, 198, 217, 1);
  z-index: 200;
  &-logo {
    position: relative;
    width: 200px;
    font-size: 17px;
    font-weight: 600;
    overflow: hidden;
    transition: 0.3s all ease-in-out;
    color: #fff;
    cursor: pointer;
    &-bd {
      display: block;
      overflow: hidden;
      transition: 0.3s all ease-in-out;
    }
    .logo {
      fill: #fff;
      font-size: 20px;
      width: 104px;
      height: 29px;
      margin: 8px 0 0 40px;
      transition: 0.3s all ease-in-out;
    }
    .el-divider {
      position: absolute;
      width: 1px;
      background: rgba(144, 43, 148, 1);
      height: 100%;
      right: -8px;
      top: 0;
    }
  }
  &-logo-collapse {
    width: 56px;
    .logo {
      margin-left: 10px;
    }
    .header-logo-bd {
      border-right: 10px solid #78177d;
    }
  }
  &-nav {
    font-size: 14px;
    color: #fff;
    padding-left: 8px;
    flex: 1;
    background: transparent;
    border: none !important;
    > .el-menu-item {
      height: 46px !important;
      line-height: 46px !important;
      padding: 0 9px;
      color: #f5ecff !important;
      font-weight: 400;
    }
  }
  &-user {
    float: right !important;
    .text {
      margin-left: 8px;
    }
  }
  &-msg {
    float: right !important;
    margin-right: 20px !important;
  }
  .visitor-item {
    float: right;
    line-height: 40px !important;
    height: 40px !important;
    position: relative;
    color: #eae6eb !important;
    &:after {
      content: "\20";
      position: absolute;
      width: 1px;
      height: 14px;
      right: 0;
      background-color: #9f69a1;
    }
  }
  .visitor-item:first-child {
    &:after {
      display: none;
    }
  }
  .el-menu-item {
    display: flex;
    align-items: center;
  }
  .el-input {
    width: 220px;
    height: 36px;
    margin-top: 0;
    background: rgba(255, 255, 255, 0.2) !important;
    border-radius: 18px;
    margin-right: 40px;
    vertical-align: top;
    overflow: hidden;
  }
  .icon {
    font-size: 20px;
    fill: #fff;
  }
  .icon1 {
    width: 15px;
    height: 13px;
  }
  .icon2 {
    width: 18px;
  }
  .item {
    line-height: 46px;
    font-size: 12px;
    color: #fff;
    margin-right: 20px;
    cursor: pointer;
  }
  .username {
    display: flex;
    position: relative;
    cursor: default;
    padding: 0 18px;
    margin: 0 18px;
    &:after,
    &:before {
      content: "\20";
      position: absolute;
      top: 10px;
      height: 26px;
      border-left: solid 1px rgba(144, 43, 148, 1);
    }

    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }
  }
}
.min-header {
  height: 40px;
  .header-logo {
    .logo {
      margin-top: 4px;
    }
  }
}
</style>
<style lang="scss">
.header-nav {
  font-size: 14px;
  color: #fff;
  padding-left: 30px;
  flex: 1;
  background: transparent !important;
  border: none;
  > .el-submenu .el-submenu__title {
    display: flex;
    align-items: center;
    height: 46px !important;
    line-height: 46px !important;
    border: none;
    color: #f5ecff !important;
    padding: 0 9px;
    font-weight: 400;
    i {
      color: rgba(245, 236, 255, 1);
    }
  }
  > .el-menu-item:not(.is-disabled):hover,
  > .el-menu-item:not(.is-disabled):focus {
    background: transparent !important;
    color: #fff !important;
  }
  > .el-submenu .el-submenu__title:hover {
    background: transparent !important;
  }
  > .el-submenu:focus .el-submenu__title,
  > .el-submenu.is-active .el-submenu__title,
  > .el-submenu:hover .el-submenu__title {
    color: #fff;
  }
}
.el-menu--popup-bottom-start {
  margin-top: 0 !important;
}
.el-menu--popup {
  min-width: 100px !important;
}
</style>
