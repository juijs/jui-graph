if (typeof module == 'object' && module.exports) {
    try {
        module.exports = require("juijs");

        require("./util/time.js")
        require("./util/transform.js")
        require("./util/svg/element.js")
        require("./util/svg/element.transform.js")
        require("./util/svg/element.path.js")
        require("./util/svg/element.path.rect.js")
        require("./util/svg/element.path.symbol.js")
        require("./util/svg/element.poly.js")
        require("./util/svg/base.js")
        require("./util/svg/base3d.js")
        require("./util/svg.js")
        require("./util/scale/linear.js")
        require("./util/scale/circle.js")
        require("./util/scale/log.js")
        require("./util/scale/ordinal.js")
        require("./util/scale/time.js")
        require("./util/scale.js")
        require("./base/vector.js")
        require("./base/draw.js")
        require("./base/axis.js")
        require("./base/map.js")
        require("./base/builder.js")
        require("./base/plane.js")
        require("./polygon/core.js")
        require("./polygon/grid.js")
        require("./polygon/line.js")
        require("./polygon/point.js")
        require("./polygon/cube.js")
        require("./grid/draw2d.js")
        require("./grid/draw3d.js")
        require("./grid/core.js")
        require("./grid/block.js")
        require("./grid/date.js")
        require("./grid/dateblock.js")
        require("./grid/fullblock.js")
        require("./grid/radar.js")
        require("./grid/range.js")
        require("./grid/log.js")
        require("./grid/rule.js")
        require("./grid/panel.js")
        require("./grid/table.js")
        require("./grid/overlap.js")
        require("./grid/topologytable.js")
        require("./grid/grid3d.js")
        require("./brush/core.js")
        require("./brush/map/core.js")
        require("./brush/polygon/core.js")
        require("./brush/canvas/core.js")
        require("./widget/core.js")
        require("./widget/map/core.js")
        require("./widget/polygon/core.js")
        require("./widget/canvas/core.js")
        require("./theme/jennifer.js")
        require("./theme/dark.js")
    } catch(e) {
        console.log("JUI_WARNING_MSG: Base module does not exist");
    }
}