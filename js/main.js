(function() {
    'use strict';

    function init() {
        radio.tuneOut(window, 'load', init);

        SW.MediaManager = new SW.MediaManager();
        SW.Canvas = new SW.Canvas();
        SW.Draw = new SW.Draw();
        SW.FSM = new SW.FSM({
            state: SW.Loading
        });
        SW.Game = new SW.Game();

        SW.Game.start();
    }

    radio.tuneIn(window, 'load', init);
}());