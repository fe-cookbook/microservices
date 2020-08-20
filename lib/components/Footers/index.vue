<template>
  <div :class="styleClass">
    <svg aria-hidden="true" class="logo">
      <use xlink:href="#icon-logo" />
    </svg>
    <span class="f-line"></span>
    Copyright &copy; 2020 北京启迪区块链科技发展有限公司 | 备案序号：京ICP备19007786号
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Footer",
  props: ["extraClass"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["filterBlur"]),
    styleClass() {
      const arr = ["qd-footer "];
      if (this.filterBlur) arr.push("filter-blur");
      if (this.extraClass) arr.push(this.extraClass);
      return arr.join(" ");
    },
  },
};
</script>
<style lang="scss" scoped>
.qd-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  min-height: 38px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: rgba(255, 249, 255, 1);
  font-size: 12px;
  background: rgba(109, 0, 115, 1);
  z-index: 200;
  .logo {
    width: 78px;
    fill: #fff;
    font-size: 20px;
    height: 23px;
  }
  .f-line {
    width: 1px;
    height: 13px;
    background-color: rgba(255, 249, 255, 1);
    margin: 0 18px;
  }
  .footer_img {
    height: 23px;
  }
}
.full-page {
  .blank {
    display: none;
  }
}
.min-footer {
  min-height: 38px;
  background: rgba(54, 54, 64, 1);
}
</style>
