import jui from '../src/main.js'

jui.define("chart.brush.canvas.scatter", [ "util.base" ], function(_) {

    var CanvasScatterBrush = function () {
        this.draw = function() {
            console.log(`FPS:${this.chart.fps}, TPF:${this.chart.tpf}`);
        }
    }

    return CanvasScatterBrush;
}, "chart.brush.canvas.core");

var builder = jui.include("chart.realtime"),
    time = jui.include("util.time");

var chart = builder("#chart", {
    width : 800,
    height : 600,
    axis : [{
        x : {
            type : "date",
            domain : getDomain(),
            interval : 1,
            realtime : "minutes",
            format : "hh:mm",
            key : "time"
        },
        y : {
            type : "range",
            domain : [ 0, 8000 ],
            step : 4,
            line : "solid"
        }
    }],
    brush : [{
        type : "canvas.scatter"
    }],
    interval: 100
});

chart.run(function(runningTime) {
    if(runningTime % 1000 > 900) {
        chart.set("x", { domain : getDomain() });
        console.log("x-axis rendering!!!");
    }
});

function getDomain() {
    return [ new Date(new Date() - time.MINUTE * 5), new Date() ];
}