var context, analyser, canvas, canvas_context;
var SAMPLE_SIZE = 2048;

function main () {
    context = new webkitAudioContext();
    analyser = context.createAnalyser();
    canvas = document.getElementById('fftbox');
    canvas_context = canvas.getContext("2d");

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

        // ...call requestAnimationFrame() and render the analyser's output to canvas.
    }, function () { alert('fail'); });
}

function visualizerUpdate (time) {
    window.requestAnimationFrame(visualizerUpdate);

    // This graph has 30 bars.
    var num_bars = 30;

    // Get the frequency-domain data
    var data = new Uint8Array(SAMPLE_SIZE),
        length = data.length;
    analyser.getByteFrequencyData(data);

    // Clear the canvas
    canvas_context.clearRect(0, 0, canvas.width, canvas.height);

    // Break the samples up into bins
    var bin_size = Math.floor(length / num_bars);

    for (var i=0; i < num_bars; ++i) {
        var sum = 0;
        for (var j=0; j < bin_size; ++j) {
            sum += data[(i * bin_size) + j];
        }

        // Calculate the average frequency of the samples in the bin
        var average = sum / bin_size;

        // Draw the bars on the canvas
        var bar_width = canvas.width / num_bars;
        var scaled_average = (average / 256) * canvas.height;

        canvas_context.fillRect(i * bar_width, canvas.height, bar_width - 2,
                -scaled_average);
    }
}
window.addEventListener('load', main, false);
