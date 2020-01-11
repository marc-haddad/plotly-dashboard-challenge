
// Scale multiplier used to properly size bubbles in bubble chart below
var scale = 0.7;

// Create initial plots and data to display on first visit
function init() {
    
    d3.json("data/samples.json").then(function(data) {
        console.log(data);
        var results = data.samples;
        var subject = results[0];   
        var otuIds;
        var values;
        var labels;
        var subjectIdSelections = d3.selectAll("#selDataset");
        
        // Populate select box with list of all test subject id numbers 
        for(var i = 0; i < data.samples.length; i++) { 
            subjectIdSelections.append("option")
            .text(data.samples[i].id);
        };

        if (subject.otu_ids.length > 10) {
            otuIds = subject.otu_ids.map(id => `OTU ${id.toString()}`).slice(0, 10);
            values = subject.sample_values.slice(0, 10);
            labels = subject.otu_labels.slice(0, 10);
        } else {
            otuIds = subject.otu_ids.map(id => `OTU ${id.toString()}`);
            values = subject.sample_values;
            labels = subject.otu_labels;
        };
        var revOtuIds = otuIds.reverse();
        var revValues = values.reverse();
        var revLabels = labels.reverse();

        var trace1 = {
            x: revValues,
            y: revOtuIds,
            text: revLabels,
            type: "bar",
            orientation: "h"
        };

        var layout = {
            xaxis: {autorange: true}
        };

        Plotly.newPlot("bar", [trace1], layout);

        var allOtuIds = subject.otu_ids;
        var allValues = subject.sample_values;
        var allLabels = subject.otu_labels;

        // Initial bubble chart trace
        var trace2 = {
            x: allOtuIds,
            y: allValues,
            mode: "markers",
            marker: {
                size: allValues.map(x => x * scale),
                color:  allOtuIds 
            },
            text: allLabels
        };

        var layoutBubble = {
            xaxis: {
                title: "OTU ID",
                autorange: true
            },
            yaxis: {autorange: true}
        };


        Plotly.newPlot("bubble", [trace2], layoutBubble);

        var metaInfo = data.metadata[0];
        var keys = Object.keys(metaInfo);
        var vals = Object.values(metaInfo);

        var metaBox = d3.selectAll("#sample-metadata");
        for (var i = 0; i < keys.length; i++) {
            metaBox.append("p")
            .text(`${keys[i]}: ${vals[i]}`);
        };
    });

};

// Listens for event changes within "select" tag
d3.selectAll("#selDataset").on("change", updateData);

// Read selected input, change plot and demographic data
function updateData() {
    var selection = d3.selectAll("#selDataset").property("value");
    
    d3.json("data/samples.json").then(function(data) {
        var results = data.samples;
        var subject;
        
        for (var i = 0; i < results.length; i++) {
            if (results[i].id == selection) {
                subject = results[i];
                break;
            }
        };
        
        var otuIds;
        var values;
        var labels;
        if (subject.otu_ids.length > 10) {
            otuIds = subject.otu_ids.map(id => `OTU ${id.toString()}`).slice(0, 10);
            values = subject.sample_values.slice(0, 10);
            labels = subject.otu_labels.slice(0, 10);
        }
        else {
            otuIds = subject.otu_ids.map(id => `OTU ${id.toString()}`);
            values = subject.sample_values;
            labels = subject.otu_labels;
        };
        var revOtuIds = otuIds.reverse();
        var revValues = values.reverse();
        var revLabels = labels.reverse();
        
        var x = revValues
        var y = revOtuIds
        var text = revLabels

        // Restyle plots with new data
        Plotly.restyle("bar", "x", [x]);
        Plotly.restyle("bar", "y", [y]);
        Plotly.restyle("bar", "text", [text]);

        var allOtuIds = subject.otu_ids;
        var allValues = subject.sample_values;
        var allLabels = subject.otu_labels;
        
        Plotly.restyle("bubble", "x", [allOtuIds]);
        Plotly.restyle("bubble", "y", [allValues]);
        Plotly.restyle("bubble", "text", [allLabels]);
        Plotly.restyle("bubble", "marker.size", [allValues.map(x => x * scale)]);
        Plotly.restyle("bubble", "marker.color", [allOtuIds]);

        // Update metadata
        var metaArray = data.metadata;
        var metaInfo;
        for (var i = 0; i < metaArray.length; i++) {
            if (metaArray[i].id == selection) {
                var metaInfo = metaArray[i];
                var keys = Object.keys(metaInfo);
                var vals = Object.values(metaInfo);
                d3.select("#sample-metadata").selectAll("p").remove();
                var metaBox = d3.selectAll("#sample-metadata");
                
                for (var j = 0; j < keys.length; j++) {
                    metaBox.append("p").text(`${keys[j]}: ${vals[j]}`);
                };
                break;
            };
        };

    });
};


init();