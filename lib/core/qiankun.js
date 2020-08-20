import { registerMicroApps, start, initGlobalState, addGlobalUncaughtErrorHandler } from "qiankun";

const QianKun = class QianKunEvent {
  constructor() {
    this.store = initGlobalState({});
    this.microStore = {};
    this.active = null;
    this.activeMicro = null;
  }
  instance(config) {
    this.register(config);
    this.store.onGlobalStateChange((state, prev) => {
      console.info(state);

    });
  }

  emit(type, data = {}, name = 'all') {
    console.info(type);
    /**
     * 描述
     * @date 2020-08-06
     * @param {any} name: microName  tbs|user|ops|all
     * @param {any} type: eventType  collapse:导航切换
     * @param {any} data: data       {}
     * @returns {any}
     */
    this.store.setGlobalState({ name, type, ...data });
  }

  add(name) {
    this.microStore[name] = {};
  }

  unmound(name) {
    this.emit(name, 'unmound');
  }

  register(apps) {
    registerMicroApps(apps,
      {
        // beforeLoad: (app) => console.log("beforeLoad", app.name),
        // beforeMount: (app) => console.log("beforeMount", app.name),
        afterMount: (app, b) => {
          this.active = app;
          this.activeMicro = app.name;
        },
        // beforeUnmount: (app) => console.log("beforeUnmount", app.name),
        // afterUnmount: (app) => console.log("afterUnmount", app.name),
      }
    );
    start();
    addGlobalUncaughtErrorHandler(event => console.log(event));
  }
}
const QianKunInstance = new QianKun;
window.QianKun = new QianKun
export default QianKunInstance;
