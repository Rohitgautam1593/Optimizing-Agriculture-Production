// Load dataset from backend API
let data = [];
let crops = [];
let summaryStats = {};
let conditionValues = ['N','P','K','temperature','ph','humidity','rainfall'];

async function loadData() {
    const response = await fetch('/api/data');
    data = await response.json();
    crops = [...new Set(data.map(d => d.label))];
    calculateSummaryStats();
    populateCropSelect();
    populateConditionComparison();
    renderDistributionChart();
}

// Simple CSV parser
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        let obj = {};
        headers.forEach((h, i) => {
            if (h === 'label') {
                obj[h] = values[i];
            } else {
                obj[h] = parseFloat(values[i]);
            }
        });
        return obj;
    });
}

// Calculate summary statistics for dataset
function calculateSummaryStats() {
    summaryStats = {};
    conditionValues.forEach(cond => {
        const vals = data.map(d => d[cond]);
        summaryStats[cond] = {
            mean: mean(vals),
            min: Math.min(...vals),
            max: Math.max(...vals)
        };
    });
    displaySummaryStats();
}

// Display summary stats in the page
function displaySummaryStats() {
    const container = document.getElementById('summary-stats');
    container.innerHTML = '';
    for (const cond in summaryStats) {
        const stat = summaryStats[cond];
        container.innerHTML += `<p><strong>${cond}:</strong> Mean: ${stat.mean.toFixed(2)}, Min: ${stat.min.toFixed(2)}, Max: ${stat.max.toFixed(2)}</p>`;
    }
}

// Populate crop select dropdown
function populateCropSelect() {
    const select = document.getElementById('crop-select');
    select.innerHTML = '';
    crops.forEach(crop => {
        const option = document.createElement('option');
        option.value = crop;
        option.textContent = crop;
        select.appendChild(option);
    });
    // Remove previous event listeners to avoid duplicates
    select.removeEventListener('change', showCropSummary);
    select.addEventListener('change', showCropSummary);
    showCropSummary();
}

// Show summary for selected crop
function showCropSummary() {
    const crop = document.getElementById('crop-select').value;
    const cropData = data.filter(d => d.label === crop);
    let output = `Statistics for ${crop}:\n`;
    conditionValues.forEach(cond => {
        const vals = cropData.map(d => d[cond]);
        output += `${cond} - Min: ${Math.min(...vals).toFixed(2)}, Avg: ${mean(vals).toFixed(2)}, Max: ${Math.max(...vals).toFixed(2)}\n`;
    });
    document.getElementById('crop-summary').textContent = output;
}

// Populate condition comparison dropdown and output
function populateConditionComparison() {
    const select = document.getElementById('condition-select');
    select.addEventListener('change', showConditionComparison);
    showConditionComparison();
}

// Show condition comparison output
function showConditionComparison() {
    const cond = document.getElementById('condition-select').value;
    const meanVal = summaryStats[cond].mean;
    const moreThanAvg = [...new Set(data.filter(d => d[cond] > meanVal).map(d => d.label))];
    const lessThanAvg = [...new Set(data.filter(d => d[cond] <= meanVal).map(d => d.label))];
    let output = `Average value for ${cond}: ${meanVal.toFixed(2)}\n\n`;
    output += `Crops which require more than average ${cond}:\n${moreThanAvg.join(', ')}\n\n`;
    output += `Crops which require less than or equal to average ${cond}:\n${lessThanAvg.join(', ')}`;
    document.getElementById('condition-comparison-output').textContent = output;
}

// Mean helper function
function mean(arr) {
    return arr.reduce((a,b) => a+b, 0) / arr.length;
}

function renderDistributionChart() {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    // Prepare data for histogram-like distribution for each condition
    const datasets = conditionValues.map((cond, i) => {
        // Create bins for histogram
        const values = data.map(d => d[cond]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binCount = 20;
        const binSize = (max - min) / binCount;
        let bins = new Array(binCount).fill(0);
        values.forEach(v => {
            let binIndex = Math.floor((v - min) / binSize);
            if (binIndex === binCount) binIndex--; // edge case max value
            bins[binIndex]++;
        });
        // Prepare data points for bar chart
        const points = bins.map((count, idx) => {
            return {x: min + idx * binSize + binSize/2, y: count};
        });
        return {
            label: cond,
            data: points,
            borderColor: getColor(i),
            backgroundColor: getColor(i),
            fill: true,
            showLine: true,
            pointRadius: 0,
            borderWidth: 1,
            type: 'line',
            tension: 0.3
        };
    });
    new Chart(ctx, {
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribution of Agricultural Conditions (Histogram Approximation)'
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Value Range'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Color helper for chart
function getColor(index) {
    const colors = ['darkblue', 'darkgreen', 'darkred', 'black', 'grey', 'lightgreen', 'darkgreen'];
    return colors[index % colors.length];
}

// Crop prediction (mock implementation)
// In real app, this would call a backend or use a trained model
function predictCrop(features) {
    // Simple heuristic: pick crop with closest average N value
    let closestCrop = null;
    let minDiff = Infinity;
    crops.forEach(crop => {
        const cropData = data.filter(d => d.label === crop);
        const avgN = mean(cropData.map(d => d.N));
        const diff = Math.abs(avgN - features.N);
        if (diff < minDiff) {
            minDiff = diff;
            closestCrop = crop;
        }
    });
    return closestCrop;
}

// Handle prediction form submit
document.getElementById('prediction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const features = {};
    for (const [key, value] of formData.entries()) {
        features[key] = parseFloat(value);
    }
    const prediction = predictCrop(features);
    document.getElementById('prediction-result').textContent = `Suggested crop for given conditions: ${prediction}`;
});

async function loadModelMetrics() {
    const response = await fetch('/api/model_metrics');
    const metrics = await response.json();

    console.log('Model metrics:', metrics);

    // Update accuracy text
    document.getElementById('model-accuracy').textContent = (metrics.accuracy * 100).toFixed(2) + '%';

    // Render confusion matrix as HTML table
    const container = document.getElementById('confusionMatrixTableContainer');
    if (!container) {
        console.error('Confusion matrix container not found');
        return;
    }
    const labels = metrics.labels;
    const matrix = metrics.confusion_matrix;

    // Clear previous content
    container.innerHTML = '';

    // Create table element
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.overflowX = 'auto';
    table.style.display = 'block';

    // Create header row
    const headerRow = document.createElement('tr');
    const emptyHeader = document.createElement('th');
    emptyHeader.style.border = '1px solid #ddd';
    emptyHeader.style.padding = '4px';
    headerRow.appendChild(emptyHeader);
    labels.forEach(label => {
        const th = document.createElement('th');
        th.textContent = label;
        th.style.border = '1px solid #ddd';
        th.style.padding = '4px';
        th.style.backgroundColor = '#f2f2f2';
        th.style.position = 'sticky';
        th.style.top = '0';
        th.style.zIndex = '1';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Find max count for color scaling
    let maxCount = 0;
    matrix.forEach(row => {
        row.forEach(val => {
            if (val > maxCount) maxCount = val;
        });
    });

    // Create rows
    for (let i = 0; i < matrix.length; i++) {
        const tr = document.createElement('tr');
        // Row header
        const rowHeader = document.createElement('th');
        rowHeader.textContent = labels[i];
        rowHeader.style.border = '1px solid #ddd';
        rowHeader.style.padding = '4px';
        rowHeader.style.backgroundColor = '#f2f2f2';
        tr.appendChild(rowHeader);

        for (let j = 0; j < matrix[i].length; j++) {
            const td = document.createElement('td');
            const val = matrix[i][j];
            td.textContent = val;
            td.style.border = '1px solid #ddd';
            td.style.padding = '4px';
            // Color scale from white to blue
            const intensity = val / maxCount;
            const blue = Math.floor(255 - intensity * 155);
            td.style.backgroundColor = `rgb(${blue}, ${blue}, 255)`;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    container.appendChild(table);
}

// Initialize app
loadData();
loadModelMetrics();
