<template>
  <el-scrollbar v-if="menuId" :class="styleClass">
    <div class="menu-tit" v-if="title && !isCollapse">
      <span class="txt">{{title}}</span>
    </div>
    <el-menu
      :default-active="activeId"
      :default-openeds="defaultOpeneds"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <div v-for="(item, index) in menuData" :key="index">
        <el-submenu v-if="hasSubmenu(item)" :index="index">
          <template slot="title">
            <svg aria-hidden="true" class="icon" v-if="item.icon">
              <use :xlink:href="`#${item.icon}`" />
            </svg>
            {{ item.title
            }}
            <span slot="title" class="hide">
              <span class="txt">{{ item.title }}</span>
            </span>
          </template>
          <el-menu-item
            class="item-children"
            @click="redirect(row)"
            v-for="(row, k) in item.children"
            :key="k"
            :index="`${index}-${k}`"
          >{{ row.title }}</el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="`${index}`" class="item-children" @click="redirect(item)">
          <svg aria-hidden="true" class="icon" v-if="item.icon">
            <use :xlink:href="`#${item.icon}`" />
          </svg>
          <span slot="title" class="hide">
            <span class="txt">{{ item.title }}</span>
          </span>
          {{ item.title }}
          <el-badge
            v-if="notice && item.icon === 'icon-tongzhiguanli1'"
            :value="notice"
            :max="10"
            class="badge"
          ></el-badge>
        </el-menu-item>
      </div>
    </el-menu>
  </el-scrollbar>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
import mixin from "../../mixins";
import collapse from "../../mixins/collapse";
import { isQiankun } from "../../util";

export default {
  name: "Aside",
  mixins: [mixin, collapse],
  props: ["menuId", "menuData", "title"],
  data() {
    return {
      activeId: 0,
      defaultOpeneds: [0],
      flag: false,
    };
  },

  computed: {
    ...mapState(["notice"]),
    ...mapGetters(["collapsing", "isCollapse", "collapseCls", "filterBlur"]),
    styleClass() {
      const arr = ["qd-aside"];
      if (this.collapsing) arr.push("qd-aside-collapse");
      if (this.collapseCls) arr.push(this.collapseCls);
      if (this.filterBlur) arr.push("filter-blur");
      return arr.join(" ");
    },
  },

  mounted() {
    if (localStorage.getItem("userId")) this.polling();
    if (isQiankun()) {
      this.$on("global:microCollapse", async ({ collapsing }) => {
        this.collapseAnimate({ collapsing });
      });
    }
  },
  updated() {
    this.listFilter();
    this.setIndex();
  },
  methods: {
    ...mapActions(["clear", "collapse", "update"]),
    setIndex() {
      this.activeId = `${this.ergodic(this.menuData, this.menuId)}`;
      this.flag = false;
    },
    ergodic(list, id) {
      let mid = 0;
      if (this.flag) return;
      for (let index = 0; index < list.length; index += 1) {
        const item = list[index];
        if (this.flag) break;
        if (item.uuid === id) {
          mid = item.id;
          this.flag = true;
          break;
        } else if (item.children) {
          mid = this.ergodic(item.children, id);
        }
      }
      return mid;
    },
    polling() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.noticeUnread();
      }, 15000);
    },
    async noticeUnread() {
      const [err, result] = await noticeUnread();
      if (!err) {
        this.update({ notice: result });
        this.polling();
      }
    },
    hasSubmenu(item) {
      return !!(item.children && item.children.length);
    },
    redirect({ url, menuId }) {
      const path = menuId ? `${url}?mid=${menuId}` : url;
      this.$router.push(path);
    },
    formatId(menu, parent) {
      menu.forEach((item, index) => {
        if (parent && typeof parent.id === "number") {
          item.id = `${parent.id}-${index}`;
        } else {
          item.id = index;
        }
        if (item.children) this.formatId(item.children, item);
      });
    },
    listFilter() {
      this.formatId(this.menuData);
    },
  },
  beforeDestroy() {
    if (this.timer) clearTimeout(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.qd-aside {
  .menu-tit {
    position: relative;
    margin: 0 18px;
    line-height: 53px;
    text-align: center;
    color: #333;
    &::after,
    &::before {
      content: "\20";
      position: absolute;
      height: 1px;
      width: 100%;
      left: 0;
      background-color: #d9bbda;
    }
    &::after {
      top: 26px;
    }
    &::before {
      top: 28px;
    }
    .txt {
      position: relative;
      font-weight: 500;
      z-index: 9;
      background-color: #fff;
      padding: 0 12px;
      white-space: nowrap;
    }
  }
  border-right: none;
  position: fixed;
  top: 46px;
  left: 0;
  height: 2000px;
  height: 100%;
  padding-bottom: 84px;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
  transition: 0.3s all ease-in-out;
  width: 200px;
  z-index: 9;
  .item {
    position: relative;
    height: 97px;
    padding: 25px 0;
    text-align: center;
    font-size: 14px;
    color: #7f8490;
    .tit {
      display: block;
      line-height: 20px;
    }
  }
  .hide {
    display: none;
  }

  .item-children,
  .el-submenu {
    position: relative;
    line-height: 48px;
    color: #666;
    cursor: pointer;
    font-size: 14px;
    &::after {
      content: "\20";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-bottom: solid 1px rgba(245, 245, 249, 1);
    }
  }
  .el-submenu .item-children {
    &::before {
      content: "\20";
      display: inline-block;
      width: 3px;
      height: 3px;
      border-radius: 3px;
      margin: 0 8px 0 36px;
      background-color: #666;
      vertical-align: middle;
    }
  }
  .icon {
    width: 18px;
    height: 18px;
    margin: 14px 18px 14px 0;
    vertical-align: middle;
  }
  .el-menu {
    border-right: none;
    width: 200px;
    transition: 0.3s all ease-in-out;
  }
  .el-menu-item {
    position: relative;
    height: 48px;
    border-right: solid 3px #fff;
    padding: 0 18px !important;
  }
  .el-submenu.is-active {
    position: relative;
    border-right: solid 3px #78167d;
  }
  .el-submenu.is-opened.is-active {
    border-right: none;
  }
  .el-menu-item.is-active,
  .item-children:hover {
    color: #78167d;
    background: rgba(245, 245, 249, 1);
    border-right-color: #78167d;
    &::before {
      background-color: #78167d;
    }
  }
}
</style>
<style lang="scss">
.badge {
  height: auto;
  padding: 0;
  .el-badge__content {
    position: inherit;
    transform: none;
    background: rgba(255, 91, 91, 1);
    border-radius: 9px;
    margin: 7px 0 0 14px;
    height: 17px;
    line-height: 17px;
    border: none;
  }
}
.qd-aside .el-menu--collapse,
.qd-aside-collapse {
  width: 54px !important;
  .el-tooltip {
    padding: 0 18px !important;
  }
  .el-submenu__icon-arrow {
    visibility: hidden;
  }
}
.qd-aside {
  .el-submenu__title {
    position: relative;
    line-height: 48px;
    height: 48px;
    color: #666;
    cursor: pointer;
    font-size: 14px;
    &::after {
      content: "\20";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-bottom: solid 1px rgba(245, 245, 249, 1);
    }
  }
  .el-submenu__title:hover,
  .is-active .el-submenu__title {
    color: #78167d;
    background: rgba(245, 245, 249, 1);
    i {
      color: #78167d;
    }
  }
}
.el-menu--popup {
  .item-children {
    height: 40px;
    line-height: 40px;
  }
  .item-children:hover,
  .item-children:focus {
    color: #78167d;
    background: #f5f5f9;
  }
}
</style>
