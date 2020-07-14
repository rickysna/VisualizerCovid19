interface EventParameters {
  useOnce?: boolean, // 只执行一次
  refer?: any
}

type Invoke = (data: any, nextCall?: () => void) => void;

interface HookParameters extends EventParameters {
  invoke: any,
  _invoke: Invoke,
  eventName: string
}

type Hooks = { [key: string]: (HookParameters | null)[] };

const hooks: Hooks = {};

export default class Broadcast {
  constructor(public nameSpace: string = "") {
    return this;
  }

  private concatEventName(eventName: string) {
    return `${this.nameSpace}_${eventName}`;
  }

  private addHook(eventName: string, hook: HookParameters) {
    eventName = this.concatEventName(eventName);
    if (Object.keys(hooks).indexOf(eventName) >= 0) {
      hooks[eventName].push(hook);
    } else {
      hooks[eventName] = [hook];
    }
  }

  public addEventListener(eventName: string, invoke: Invoke, params?: EventParameters) {
    if (invoke instanceof Function) {
      const hook: HookParameters = {
        invoke: null,
        _invoke: invoke,
        eventName,
        ...params,
      };

      hook.invoke = this.executeInvoke(hook, invoke);

      this.addHook(eventName, hook);
    } else {
      console.warn("callback parameter is undefined");
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public triggerEvent(eventName: string, params: {data?: any, refer?: any} = {}) {
    eventName = this.concatEventName(eventName);
    const { data, refer } = params;

    if (!hooks[eventName]) return;

    let index = 0;
    const queue = hooks[eventName];

    (function loop(): any {
      const hook = queue[index];

      if (!hook && !hook.invoke) return;
      if (refer && refer !== hook.refer) return;

      hook.invoke(data);
      if (index < queue.length - 1) {
        index += 1;
        loop();
      }
    }());
  }

  public removeEventListener(eventName: string, invoke: Invoke | null) {
    eventName = this.concatEventName(eventName);
    if (hooks[eventName]) {
      let index = -1;
      hooks[eventName].forEach((hook, _index) => {
        // eslint-disable-next-line no-underscore-dangle
        if (hook && hook._invoke === invoke) {
          index = _index;
        }
      });

      if (index >= 0) {
        hooks[eventName].splice(index, 1, null);
      }
    }
  }

  private cancelAfterCalled(eventName: string, invoke: Invoke | null): Invoke {
    eventName = this.concatEventName(eventName);
    // eslint-disable-next-line no-underscore-dangle
    const _this = this;
    return function call(...args) {
      _this.removeEventListener(eventName, invoke);
      if (invoke) invoke(...args);
    };
  }

  private executeInvoke(hook: HookParameters, invoke: Invoke): Function {
    if (hook.useOnce) {
      return this.cancelAfterCalled(hook.eventName, invoke);
    }

    return invoke;
  }
}
