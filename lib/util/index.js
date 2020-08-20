/*
 * @Author: jubao.tian
 * @Date: 2020-07-15 10:55:28
 * @Last Modified by: jubao.tian
 * @Last Modified time: 2020-08-20 11:18:03
 */
import { debounce as debounces } from 'lodash/function';

export function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export function setFullBackground(selector) {
  const ele = document.querySelector(selector);
  if (ele) {
    const height = Math.max(670, window.innerHeight - 78);
    ele.style.height = `${height}px`;
  }
}

export function debounce(
  fn,
  time = 1000,
  options = { leading: true }
) {
  return debounces(fn, time, options);
}

export const toUpperCase = ([a, ...b]) => a.toUpperCase() + b.join('');
export const isQiankun = () => !!window.__POWERED_BY_QIANKUN__;

export async function collapse(payload) {
  const { collapsing } = payload;
  if (collapsing) {
    this.update({ collapseCls: "ease-in-out", collapsing: true });
    await sleep(300);
    this.update({ collapseCls: "", isCollapse: true });
  } else {
    this.update({ collapseCls: "ease-in-out", collapsing: false, isCollapse: false });
    await sleep(300);
    this.update({ collapseCls: "" });
  }
}

export const microId = () => {
  let id = 'portal'
  if (!isQiankun()) {
    id = localStorage.getItem('microId')
  }
  return id
}



/**
 * 获取字典信息
 * @date 2020-07-21
 * @param {any} key
 * @param {any} status
 * @returns {any}
 */
export function getDicByKey(key, status) {
  try {
    let dic = localStorage.getItem('dictionary');
    dic = JSON.parse(dic);
    return status === undefined ? dic[key] : dic[key][status];
  } catch (error) { }
  return {};
}

/**
 * dic 转换为list
 * @export Array
 * @param {*} data
 */
export function dicToList(data, append) {
  const list = [];
  if (append) list.push(append);
  data
    && Object.keys(data)
      .sort((a, b) => a - b)
      .forEach(item => {
        list.push({
          code: item * 1,
          name: data[item],
        });
      });
  return list;
}


export function getMenuItem(item) {
  const {
    menuName,
    iconName,
    menuUrl,
    menuId,
    menuDesc,
  } = item.configMenuInfo;
  return {
    title: menuName,
    icon: iconName,
    url: menuUrl,
    menuId: menuId,
    uuid: menuDesc,
  };
}

export function getMenuData(res) {
  const list = [];
  const formatMenu = (arr, parent) => {
    arr.forEach((item, index) => {
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(getMenuItem(item));
      } else {
        list.push(getMenuItem(item));
      }
      if (item.children) {
        formatMenu(item.children, list[index]);
      }
    });
  };
  formatMenu(res);
  return list;
}

/**
 * @name 判断按钮是否显示
 * @param { Object [] } buttonList 按钮列表
 * @param { number } buttonSign 按钮唯一标识符
 */
export function showButton(buttonList, buttonSign) {
  const index = buttonList.findIndex(btn => btn.buttonUrl === buttonSign);
  if (index > -1) {
    return true;
  } else {
    return false;
  }
}