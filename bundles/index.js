import JUI from '../src/main.js'

JUI.define("chart.brush.canvas.activebubble", [ "util.canvas.bubble.mortal" ], function(MortalBubble) {
    class ActiveBubble {
        constructor(renderContext, contextWidth, contextHeight) {
            this.renderContext = renderContext;
            this.contextWidth = contextWidth;
            this.contextHeight = contextHeight;

            this.gravity = 0.2;
            this.data = []; // MortalBubble
        }

        preCheck() {
            for (let i = 0; i < this.data.length; i++) {
                const bubble = this.data[i];
                if(!bubble.active) {
                    this.data[i] = null;
                    this.data.splice(i, 1);
                }
            }

            return this.data.length > 0;
        }

        draw() {
            if(!this.preCheck()) return;

            let collisions = [],
                dups = [];

            for (let i = 0; i < this.data.length; i++) {
                // force gravity
                const bubble = this.data[i];
                const gDirection = [1, 0];
                bubble.force([
                    gDirection[0] * bubble.mass * this.gravity,
                    gDirection[1] * bubble.mass * this.gravity,
                ]);

                bubble.update();
            }

            for (let i = 0; i < this.data.length; i++) {
                // collapse testing
                for (let j = 0; j < this.data.length; j++) {
                    if (i == j) continue;
                    const me = this.data[i];
                    const other = this.data[j];
                    const dist = me.distance(other);
                    const radiusSum = me.radius + other.radius;
                    if (radiusSum - dist > 1) {
                        collisions.push([me, other]);
                    }
                }
            }

            for (let i = 0; i < collisions.length - 1; i++) {
                const me = collisions[i];
                for (let j = i + 1; j < collisions.length; j++) {
                    const other = collisions[j];
                    if (
                        (me[0] == other[0] && me[1] == other[1]) ||
                        (me[1] == other[0] && me[0] == other[1])
                    ) {
                        dups.push(j);
                    }
                }
            }

            for(let i = 0; i < collisions.length; i++) {
                if (dups.indexOf(i) != -1) continue;

                const collision = collisions[i];
                const me = collision[0];
                const other = collision[1];
                const radiusSum = me.radius + other.radius;
                const dist = me.distance(other);
                let normal = [other.pos[0] - me.pos[0], other.pos[1] - me.pos[1]];
                const len = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
                normal = [normal[0] / len, normal[1] / len];
                const size = radiusSum - dist;
                if (other.pos[0] == me.pos[0] && other.pos[1] == me.pos[1]) {
                    normal = [0, -1];
                }

                me.pos = [
                    -size / 2 * normal[0] + me.pos[0],
                    -size / 2 * normal[1] + me.pos[1],
                ];

                other.pos = [
                    size / 2 * normal[0] + other.pos[0],
                    size / 2 * normal[1] + other.pos[1],
                ];

                // const c = 0.01;
                const meForce = [
                    normal[0] * me.accel[0],
                    normal[1] * me.accel[1],
                ];
                const otherForce = [
                    normal[0] * other.accel[0],
                    normal[1] * other.accel[1],
                ];

                if (me.pos[0] < other.pos[0]) {
                    me.veloc = [me.veloc[0] * 0.7, me.veloc[1] * 0.99];
                    me.force([-otherForce[0], -otherForce[1]]);
                } else {
                    other.veloc = [other.veloc[0] * 0.7, other.veloc[1] * 0.99];
                    other.force([-meForce[0], -meForce[1]]);
                }
            }

            const now = (new Date()).getTime();
            for (let i = 0; i < this.data.length; i++) {
                const me = this.data[i];

                if (me.pos[0] > this.contextWidth - 100) {
                    me.pos[0] = this.contextWidth - 100;
                }
                if (me.pos[1] > this.contextHeight) {
                    me.pos[1] = this.contextHeight;
                } else if (me.pos[1] < 0) {
                    me.pos[1] = 0;
                }

                this.data[i].draw(this.renderContext, now);
            }
        }
    }

    const CanvasActiveBubbleBrush = function() {
        this.drawBefore = function() {
            if(this.chart.getCache('active_bubble') == null) {
                this.chart.setCache('active_bubble', new ActiveBubble(
                    this.canvas, this.axis.area('width'), this.axis.area('height')))
            }
        }

        this.draw = function() {
            const activeBubble = this.chart.getCache('active_bubble');

            while(this.axis.data.length > 0) {
                let data = this.axis.data.shift(),
                    birthtime = this.getValue(data, "birthtime", Date.now()),
                    age = this.getValue(data, "age", 1000);

                activeBubble.data.push(new MortalBubble(birthtime, age));
                this.axis.start++;
            }

            activeBubble.draw();
        }
    }

    CanvasActiveBubbleBrush.setup = function() {
        return {

        };
    }

    return CanvasActiveBubbleBrush;

}, "chart.brush.canvas.core");

const animation = JUI.include("chart.animation");
window.c = animation("#chart", {
    width: 1000,
    height: 70,
    padding: 0,
    axis: {
        data: [
            { birthtime: Date.now(), age: 5000 },
            { birthtime: Date.now() + 1000, age: 3000 },
            { birthtime: Date.now(), age: 4000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 },
            { birthtime: Date.now() + 2000, age: 2000 }
        ]
    },
    brush : {
        type: "canvas.activebubble",
    },
    interval : 0
});

c.run(function(runningTime) {
});
