var context, analyser, 
    canvas, canvas_context, 
    bpm, bpmDisplay, currentBPMDisplay;
var SAMPLE_SIZE = 2048,
    NUM_BARS = 30;

function main () {
    context = new webkitAudioContext();
    analyser = context.createAnalyser();
    canvas = document.getElementById('fftbox');
    canvas_context = canvas.getContext("2d");
    bpmDisplay = document.getElementById('bpm');
    currentBPMDisplay = document.getElementById('current_bpm');
    bpm = new BeatDetektor(85, 169);

    analyser.fftSize = SAMPLE_SIZE;

    navigator.webkitGetUserMedia({audio: true}, function(stream) {
        var microphone = context.createMediaStreamSource(stream);

        // Demo to:
        // connect source through a series of filters
        //var compressor = context.createDynamicsCompressor();
        //var reverb = context.createConvolver();
        //var volume = context.createGainNode();
 
        //microphone.connect(compressor);
        //compressor.connect(reverb);
        //reverb.connect(volume);
        //volume.connect(context.destination);

        // microphone -> filter -> destination.
        microphone.connect(analyser);

        visualizerUpdate();

    }, function () { alert('fail'); });
}

function visualizerUpdate (time) {

    // Get the frequency-domain data
    var data = new Uint8Array(SAMPLE_SIZE),
        length = data.length,
        sum, average, bar_width, scaled_average;
    analyser.getByteFrequencyData(data);

    // Clear the canvas
    canvas_context.clearRect(0, 0, canvas.width, canvas.height);

    // Break the samples up into bins
    var bin_size = Math.floor(length / NUM_BARS);

    for (var i=0; i < NUM_BARS; ++i) {
        sum = 0;
        for (var j=0; j < bin_size; ++j) {
            sum += data[(i * bin_size) + j];
        }

        // Calculate the average frequency of the samples in the bin
        average = sum / bin_size;

        // Draw the bars on the canvas
        bar_width = canvas.width / NUM_BARS;
        scaled_average = (average / 256) * canvas.height;

        canvas_context.fillRect(i * bar_width, canvas.height, bar_width - 2,
                -scaled_average);
    }
    // Beatdetektor api
    bpm.process(time/1000, data);
    bpmDisplay.innerHTML = bpm.win_bpm_int_lo;

    window.requestAnimationFrame(visualizerUpdate);
}
window.addEventListener('load', main, false);
