import jui from '../src/main.js'

jui.define("chart.brush.canvas.equalizercolumn", [ "util.base" ], function(_) {
    var CanvasEqualizerColumnBrush = function() {
        let zeroY, bar_width, is_reverse;

        this.getTargetSize = function() {
            let width = this.axis.x.rangeBand();

            if(this.brush.size > 0) {
                return this.brush.size;
            } else {
                let size = width - this.brush.outerPadding * 2;
                return (size < this.brush.minSize) ? this.brush.minSize : size;
            }
        }

        this.getBarElement = function(dataIndex, targetIndex) {
            let style = this.getBarStyle(),
                color = this.color(targetIndex),
                value = this.getData(dataIndex)[this.brush.target[targetIndex]];

            return {
                fill : color,
                stroke : style.borderColor,
                "stroke-width" : style.borderWidth,
                "stroke-opacity" : style.borderOpacity,
                hidden: value == 0
            };
        }

        this.getBarStyle = function() {
            return {
                borderColor: this.chart.theme("barBorderColor"),
                borderWidth: this.chart.theme("barBorderWidth"),
                borderOpacity: this.chart.theme("barBorderOpacity"),
                borderRadius: this.chart.theme("barBorderRadius"),
                disableOpacity: this.chart.theme("barDisableBackgroundOpacity"),
                circleColor: this.chart.theme("barPointBorderColor")
            }
        }

        this.drawBefore = function() {
            zeroY = this.axis.y(0);
            bar_width = this.getTargetSize();
            is_reverse = this.axis.get("y").reverse;
        }

        this.draw = function() {
            const targets = this.brush.target,
                padding = this.brush.innerPadding,
                band = this.axis.y.rangeBand(),
                unit = band / (this.brush.unit * padding),
                height = unit + padding,
                translateY = (is_reverse) ? 0 : -unit;

            this.eachData(function(data, i) {
                let startX = this.offset("x", i) - bar_width / 2,
                    startY = this.axis.y(0),
                    y = startY,
                    value = 0,
                    stackList = [];

                for(let j = 0; j < targets.length; j++) {
                    let yValue = data[targets[j]] + value,
                        endY = this.axis.y(yValue),
                        targetHeight = Math.abs(startY - endY),
                        targetY = targetHeight;

                    while(targetY >= height) {
                        let r = _.extend(this.getBarElement(i, j), {
                            x : startX,
                            y : y + translateY,
                            width : bar_width,
                            height : unit
                        });

                        targetY -= height;
                        y += (is_reverse) ? height : -height;

                        this.canvas.beginPath();
                        this.canvas.fillStyle = r.fill;
                        this.canvas.strokeStyle = r.stroke;
                        this.canvas.strokeOpacity = r["stroke-opacity"];
                        this.canvas.lineWidth = r["stroke-width"];
                        this.canvas.rect(r.x, r.y, r.width, r.height);
                        this.canvas.fill();

                        stackList.push(r);
                    }

                    startY = endY;
                    value = yValue;
                }

                if(stackList.length > 0) {
                    this.chart.setCache(`equalizer_${i}`, stackList.length == 0 ? null : stackList[stackList.length - 1]);
                    this.chart.setCache(`raycast_area_${i}`, {
                        x1: stackList[0].x,
                        x2: stackList[0].x + stackList[0].width,
                        y2: this.axis.y(this.axis.y.min()),
                        y1: stackList[stackList.length - 1].y
                    });
                }
            });

            this.drawAnimation();
        }

        this.drawAnimation = function() {
            const MAX_DISTANCE = 8; // 애니메이션 움직인 최대 반경 (0px ~ 10px)
            const UP_SEC_PER_MOVE = 20; // 초당 20픽셀 이동
            const DOWN_SEC_PER_MOVE = 30; // 초당 30픽셀 이동
            const TOP_PADDING = -3;
            const TOTAL_PADDING = -8;

            this.eachData(function (data, i) {
                const r = this.chart.getCache(`equalizer_${i}`);
                let total = 0;

                for(let j = 0; j < this.brush.target.length; j++) {
                    total += data[this.brush.target[j]];
                }

                if(r != null) {
                    const tpf = this.chart.getCache(`tpf`, 1);
                    const status = this.chart.getCache(`equalizer_move_${i}`, { direction: -1, distance: 0 });
                    const speed = status.direction == -1 ? UP_SEC_PER_MOVE : DOWN_SEC_PER_MOVE;

                    status.distance += status.direction * speed * tpf;

                    // 애니메이션-바 방향 벡터 설정
                    if(Math.abs(status.distance) >= MAX_DISTANCE) {
                        status.direction = 1;
                    } else if(status.distance >= 0) {
                        status.direction = -1;
                    }

                    // 애니메이션-바 최소/최대 위치 설정
                    if(status.distance < -MAX_DISTANCE) {
                        status.distance = -MAX_DISTANCE;
                    } else if(status.distance > 0) {
                        status.distance = 0;
                    }

                    const ry = r.y + status.distance + TOP_PADDING;

                    this.canvas.strokeStyle = r.fill;
                    this.canvas.lineWidth = r.height * 0.7;
                    this.canvas.beginPath();
                    this.canvas.moveTo(r.x, ry);
                    this.canvas.lineTo(r.x + r.width, ry);
                    this.canvas.closePath();
                    this.canvas.stroke();

                    this.canvas.fillStyle = this.chart.theme("barFontColor");
                    this.canvas.font = this.chart.theme("barFontSize") + "px";
                    this.canvas.textAlign = "center";
                    this.canvas.textBaseline = "middle";
                    this.canvas.fillText(total, r.x + r.width/2, ry + TOTAL_PADDING);
                    this.canvas.fill();

                    this.chart.setCache(`equalizer_move_${i}`, status);
                }
            });
        }
    }

    CanvasEqualizerColumnBrush.setup = function() {
        return {
            /** @cfg {Number} [size=0] Set a fixed size of the bar. */
            size: 0,
            /** @cfg {Number} [minSize=0] Sets the minimum size as it is not possible to draw a bar when the value is 0. */
            minSize: 0,
            /** @cfg {Number} [outerPadding=15] Determines the outer margin of a stack bar. */
            outerPadding: 15,
            /** @cfg {Number} [innerPadding=1] Determines the inner margin of a bar. */
            innerPadding: 1,
            /** @cfg {Number} [unit=5] Determines the reference value that represents the color.*/
            unit: 1
        };
    }

    return CanvasEqualizerColumnBrush;

}, "chart.brush.canvas.core");

const realtime = jui.include("chart.realtime");
const c = realtime("#chart", {
    width: 500,
    height: 300,
    axis: [{
        x : {
            domain : [ "1 year ago", "1 month ago", "Yesterday", "Today" ],
            line : true
        },
        y : {
            type : "range",
            domain : [ 0, 30 ],
            // domain : function(d) {
            //     return Math.max(d.normal, d.warning, d.fatal);
            // },
            step : 5,
            line : false
        }
    }],
    brush : [{
        type : "canvas.equalizercolumn",
        target : [ "normal", "warning", "fatal" ],
        unit : 10
    }],
    interval : 100
});

c.run(function(runningTime) {
    if(runningTime > 10000) {
        c.update([
            { normal : 7, warning : 7, fatal : 7 },
            { normal : 10, warning : 8, fatal : 5 },
            { normal : 6, warning : 4, fatal : 10 },
            { normal : 5, warning : 5, fatal : 7 }
        ]);
    } else {
        c.update([
            { normal : 5, warning : 5, fatal : 5 },
            { normal : 10, warning : 8, fatal : 5 },
            { normal : 6, warning : 4, fatal : 10 },
            { normal : 5, warning : 5, fatal : 7 }
        ]);
    }
});