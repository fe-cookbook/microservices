import { mapActions } from 'vuex';
import { origin } from '../config';
import { microId, showButton } from '../util'
import { getButtonList } from "../api";


export const authMixin = {
  data() {
    return { buttonList: [] };
  },
  mounted() {
    this.getButtonList();
  },
  methods: {
    showButton,
    async getButtonList() {
      const { mid } = this.$route.query;
      if (!mid) return;
      const [err, result] = await getButtonList(mid);
      this.buttonList = result;
    }
  },
};

/**
 * 分页混入
 * @date 2020-08-14
 * @returns {any}
 */
export const pageMixin = {
  data() {
    return {
      pageSize: 10, // 每页显示条目个数
      count: 1, // 总条目数
      perShow: false, // 分页是否显示
      page: 1,
      currentSize: 0,
    };
  },
};

/**
 * 全局弹窗混入
 * @date 2020-08-14
 * @returns {any}
 */
export const dialogMixin = {
  data() {
    return {
      currentIndex: 0,
      currentRow: {},
    };
  },
  methods: {
    ...mapActions(['update']),
    hideDialog(type) {
      this[`${type}Visible`] = false;
      this.update({ filterBlur: false });
    },
    showDialog(type, scope) {
      this[`${type}Visible`] = true;
      if (scope) {
        this.currentIndex = scope.$index;
        this.currentRow = scope.row;
      }
      this.update({ filterBlur: true });
    },
  },
};
/**
 * 默认混入 路由 && loading
 * @date 2020-08-14
 * @returns {any}
 */

export default {
  data() {
    return { screenLoading: false };
  },
  methods: {
    go(num) {
      this.$router.go(num);
    },
    push(param) {
      this.$router.push(param);
    },
    replace(param) {
      this.$router.replace(param);
    },

    /**
     * 根据appName切换origin
     * @date 2020-08-14
     * @param {any} path
     * @param {any} appName 
     * @returns {any}
     */

    locationPush(path, appName) {
      const url = appName ? origin[appName] : location.origin;
      location.replace(`${url}${path}`);
    },

    /**
     * 根据appName切换origin
     * @date 2020-08-14
     * @param {any} path
     * @param {any} appName 
     * @returns {any}
     */
    locationReplace(path, appName) {
      const url = appName ? origin[appName] : location.origin;
      location.replace(`${url}${path}`);
    },

    /**
     * 路由跳转
     * @date 2020-08-14
     * @param {any} microPath 微服务path
     * @param {any} appPath 应用内path
     * @param {any} appName 非微服务第三方跳转
     * @returns {any}
     */
    $push(microPath, appPath, appName) {
      const current = localStorage.getItem('microId');
      if (microId() === 'portal') {
        this.locationPush(microPath);
      } else if (appName) {
        if (current === appName) {
          this.push(appPath);
        } else {
          this.locationPush(appPath, appName);
        }
      } else {
        this.push(appPath);
      }
    },

    /**
     * 路由跳转
     * @date 2020-08-14
     * @param {any} microPath 微服务path
     * @param {any} appPath 应用内path
     * @param {any} appName 非微服务第三方跳转
     * @returns {any}
     */
    $replace(microPath, appPath, appName) {
      const current = localStorage.getItem('microId');
      if (microId() === 'portal') {
        this.locationReplace(microPath);
      } else if (appName) {
        if (current === appName) {
          this.replace(appPath);
        } else {
          this.locationReplace(appPath, appName);
        }
      } else {
        this.replace(appPath);
      }
    }
  },
};
