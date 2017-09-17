// Add the following blocks to the main index after the initialization of the map obj
map.addListener('center_changed', function() {
    if (updateStateEnum === UpdateStateEnum.OFF) {
        updateStateEnum = UpdateStateEnum.FLAG_RAISE;
        update(); 
    }
});

map.addListener('bounds_changed', function() {
    if (updateStateEnum === UpdateStateEnum.OFF) {
        updateStateEnum = UpdateStateEnum.FLAG_RAISE;
        update(); 
    }
});

var updateStateEnum = UpdateStateEnum.OFF;
var update = function() {
    window.setTimeout(function() {
        if (updateStateEnum === UpdateStateEnum.FLAG_RAISE) {
            updateStateEnum = UpdateStateEnum.FUNC_RUN;
            console.log("ccc");
            updateStateEnum = UpdateStateEnum.OFF;
        }
    }, 1000);
};

var UpdateStateEnum = {
    OFF: 0,
    FLAG_RAISE: 1,
    FUNC_RUN: 2,
}