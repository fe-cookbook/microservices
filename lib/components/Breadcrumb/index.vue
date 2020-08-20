<template>
  <section class="qd-breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <div :class="!dataInfo.back ? 'tit' : 'tit tit-back'">
        <span v-if="dataInfo.back" class="back" @click="back">
          <svg aria-hidden="true" class="icon">
            <use xlink:href="#icon-Shape" />
          </svg>
          <el-divider direction="vertical"></el-divider>
        </span>
        <span class="text">{{ dataInfo.title }}</span>
        <el-tooltip
          v-if="dataInfo.tip"
          class="item"
          effect="dark"
          :content="dataInfo.tip"
          placement="right-start"
        >
          <svg aria-hidden="true" class="icon">
            <use xlink:href="#icon-wenhao" />
          </svg>
        </el-tooltip>
      </div>
      <slot></slot>
    </el-breadcrumb>
  </section>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: ["dataInfo"],
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.back();
    },
    to(router) {
      if (router) this.$router.replace(router);
    },
  },
};
</script>
<style lang="scss">
.qd-breadcrumb {
  height: 46px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 7px 0px rgba(233, 233, 248, 1);
  border-radius: 4px;
  padding: 7px 18px;
  margin-bottom: 16px;
  .el-breadcrumb {
    display: flex;
  }

  .tit {
    position: relative;
    padding-left: 16px;
    flex: 1;
    font-size: 16px;
    font-weight: 500;
    color: rgba(38, 38, 38, 1);
    line-height: 32px;
    .text {
      margin-right: 12px;
    }
    .icon {
      color: rgba(94, 94, 118, 1);
    }
    &:before {
      content: "\20";
      position: absolute;
      left: 0;
      top: 11px;
      border: solid 6px transparent;
      border-left-color: #281945;
      border-top-width: 5px;
      border-bottom-width: 5px;
    }
  }
  .tit-back {
    padding-left: 0;
    .back .icon {
      color: rgba(38, 38, 38, 1);
      width: 12px;
      cursor: pointer;
    }
    .el-divider {
      vertical-align: -0.15em;
      background-color: rgba(217, 217, 217, 1);
    }
    &:before {
      display: none;
    }
  }
}
.full-content .el-breadcrumb {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
