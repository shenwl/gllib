type Timestamp = number;
type Listener = (params: { nowToListenAt: Timestamp }) => any;

/**
 * 循环执行任务的时钟工具，执行函数能接收到入队到执行的时间差
 * 需要使用全局时间的地方使用
 */
export default class Timing {
  listeners: { listener: Listener, listenAt: Timestamp }[];
  startAt: Timestamp;

  constructor() {
    this.listeners = [];
  }

  listen = (listener: Listener) => {
    this.listeners.push({ listener, listenAt: Date.now() });
    return () => {
      this.listeners = this.listeners.filter(v => v.listener !== listener);
    }
  }

  start = () => {
    this.startAt = Date.now();
    this.run();
  }

  run = () => {
    const cur = Date.now();
    this.listeners.forEach(({ listener, listenAt }) => {
      listener({
        nowToListenAt: cur - listenAt,
      });
    });
    requestAnimationFrame(this.run);
  }
}