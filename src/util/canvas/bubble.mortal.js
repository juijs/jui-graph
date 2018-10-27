import JUI from "juijs";
import CanvasBase from "./base";
import KineticObject from "./kinetic";

JUI.use(CanvasBase, KineticObject);

export default {
    name: "util.canvas.bubble.mortal",
    extend: "util.canvas.kinetic",
    component: function () {
        const CanvasUtil = JUI.include("util.canvas.base");

        const MortalBubble = function(birthtime, age) {
            this.active = true;
            this.radius = 20;
            this.birthtime = birthtime;
            this.age = age;
            this.force([30, 0]);

            if (age <= 3000) {
                this.color = '#497eff';
                this.shadowColor = 'rgba(16,116,252,0.2)';
            } else if (age <= 7000) {
                this.color = '#ffdd26';
                this.shadowColor = 'rgba(255,221,38,0.2)';
            } else {
                this.color = '#ff4f55';
                this.shadowColor = 'rgba(255,79,85,0.2)';
            }

            this.draw = function(context, now) {
                context.shadowColor = this.shadowColor;
                context.shadowBlur = 10;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 10;

                const util = new CanvasUtil(context);
                const d = this.age - (now - this.birthtime);
                let radius = this.radius;
                let animSpeed = 3;

                if (d <= 0) {
                    this.active = false;
                    return;
                }

                if (d <= 100 * animSpeed) {
                    radius *= (100 * animSpeed - d) / (100 * animSpeed) + 1;
                }

                if (d <= 80 * animSpeed) {
                    const x = (80 * animSpeed - d) / (80 * animSpeed);
                    const sd = (radius / 3 - 2) * x + 2;
                    const ed = (radius / 3 - 2) * Math.sin(Math.PI / 2 * x) + 2;
                    const stroke = 3 * x + 2;
                    context.lineCap = 'round';
                    util.drawLine(
                        this.pos[0] + sd, this.pos[1],
                        this.pos[0] + ed, this.pos[1],
                        this.color, stroke
                    );
                    util.drawLine(
                        this.pos[0] - sd, this.pos[1],
                        this.pos[0] - ed, this.pos[1],
                        this.color, stroke
                    );
                    util.drawLine(
                        this.pos[0], this.pos[1] + sd,
                        this.pos[0], this.pos[1] + ed,
                        this.color, stroke
                    );
                    util.drawLine(
                        this.pos[0], this.pos[1] - sd,
                        this.pos[0], this.pos[1] - ed,
                        this.color, stroke
                    );
                    context.lineCap = 'butt';
                } else {
                    util.drawCircle(this.pos[0], this.pos[1], radius, this.color);
                }
            }
        }

        return MortalBubble;
    }
}