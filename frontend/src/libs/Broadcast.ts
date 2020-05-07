interface EventParameters {
    useOnce?: boolean, // 只执行一次
    useNextCall?: boolean //
}

type Invoke = (data: any, nextCall?: () => void) => void;

interface HookParameters extends EventParameters {
    invoke: any,
    _invoke: Invoke
    eventName: string
}

type Hooks = {[key: string]: (HookParameters | null)[]};

export default class Broadcast {
    private hooks:Hooks = {};

    public addEventListener(eventName: string, invoke: Invoke, params?: EventParameters) {
        const hook:HookParameters = {
            invoke: null,
            _invoke: invoke,
            useOnce: params ? params.useOnce : false,
            useNextCall: params ? params.useNextCall : false,
            eventName
        };

        hook.invoke = this.executeInvoke(hook, invoke);

        if (Object.keys(this.hooks).indexOf(eventName) >= 0) {
            this.hooks[eventName].push(hook);
        } else {
            this.hooks[eventName] = [hook];
        }
    }

    public triggerEvent(eventName: string, data?: any) {
        if (this.hooks[eventName]) {
            let index = 0;
            const queue = this.hooks[eventName];

            (function loop() {
                const hook = queue[index];
                if (hook !== null && hook.invoke !== null) {
                    if (hook.useNextCall) {
                        return hook.invoke(data, () => {
                            if (index < queue.length - 1) {
                                index += 1;
                                loop();
                            }
                        });
                    }
                    hook.invoke(data);
                }
                if (index < queue.length - 1) {
                    index += 1;
                    loop();
                }
            })();

        }
    }

    public removeEventListener(eventName: string, invoke: Invoke | null) {
        if (this.hooks[eventName]) {
            let index = -1;
            this.hooks[eventName].forEach((hook, _index) => {
                if (hook && hook._invoke === invoke) {
                    index = _index;
                }
            });

            if (index >= 0) {
                this.hooks[eventName].splice(index, 1, null);
            }
        }
    }

    private cancelAfterCalled(eventName: string, invoke: Invoke | null) {
        const _this = this;
        return function() {
            _this.removeEventListener(eventName, invoke);
            const args:any[any] = [].slice.call(arguments);
            invoke && invoke.apply(null, args);
        }
    }

    // private callWithPromise(invoke: Invoke) {
    //     return (data: any, call: Function) => {
    //         invoke && invoke(data);
    //         call();
    //     }
    // }

    private executeInvoke(hook: HookParameters, invoke: Invoke):Function {
        // let invoke = hook.invoke;

        // if (hook.useNextCall) {
        //     return this.callWithPromise(invoke);
        // }

        if (hook.useOnce) {
            return this.cancelAfterCalled(hook.eventName, invoke);
        }

        return invoke;
    }
}