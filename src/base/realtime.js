import JUI from "juijs"
import JUIBuilder from "./builder"

JUI.use(JUIBuilder);

export default {
    name: "chart.realtime",
    extend: "core",
    component: function () {
        const _ = JUI.include("util.base");
        const builder = JUI.include("chart.builder");

        const UI = function() {
            let interval = 1000;
            let prevTime = 0;
            let startTime = 0;

            this.init = function() {
                interval = this.options.interval;
                delete this.options.interval;

                this.builder = builder(this.selector, this.options);
            }

            this.run = function(callback) {
                let currentTime = Date.now();

                if(startTime == 0) {
                    startTime = currentTime;
                }

                if(currentTime - prevTime > interval || interval == 0){
                    this.builder.tpf = (currentTime - prevTime) / 1000;
                    if(this.builder.tpf > 1) this.builder.tpf = 1;
                    this.builder.fps = (1.0 / this.builder.tpf);

                    this.render();
                    if(typeof(callback) == "function") {
                        callback.call(this, currentTime - startTime);
                    }

                    prevTime = currentTime;
                }

                if(interval > 0) {
                    const self = this;
                    this.animateFunc = window.requestAnimationFrame(function() {
                        self.run(callback);
                    });
                }
            }

            this.stop = function() {
                if(typeof(this.animateFunc) == "function") {
                    cancelAnimationFrame(this.animateFunc);
                    this.animateFunc = null;
                }
            }

            this.set = function(type, value, isReset) {
                this.builder.axis(0).set(type, value, isReset);
            }

            this.update = function(data) {
                this.builder.axis(0).update(data);
            }

            this.render = function(isAll) {
                this.builder.render(isAll);
            }
        }

        UI.setup = function() {
            return _.extend({
                render: false,
                canvas: true,
                interval: 100
            }, JUIBuilder.component().setup(), true);
        }

        return UI;
    }
}