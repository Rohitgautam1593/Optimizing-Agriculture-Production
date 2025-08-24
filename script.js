// Static dataset for demonstration (in real app, this would come from a backend)
const staticData = [
    { N: 90, P: 42, K: 43, temperature: 20.87974371, ph: 6.502985292, humidity: 71.58177704, rainfall: 103.4636793, label: 'rice' },
    { N: 85, P: 58, K: 41, temperature: 21.77046169, ph: 7.038096361, humidity: 80.31964408, rainfall: 80.31964408, label: 'rice' },
    { N: 60, P: 55, K: 44, temperature: 23.00445915, ph: 6.362000986, humidity: 82.3207629, rainfall: 103.3207629, label: 'maize' },
    { N: 74, P: 35, K: 40, temperature: 26.49109635, ph: 6.980055211, humidity: 80.15836364, rainfall: 103.15836364, label: 'chickpea' },
    { N: 78, P: 42, K: 42, temperature: 20.13017523, ph: 7.628516564, humidity: 81.6048731, rainfall: 101.6048731, label: 'kidneybeans' },
    { N: 69, P: 51, K: 39, temperature: 23.05804872, ph: 7.150591811, humidity: 82.70812853, rainfall: 103.70812853, label: 'pigeonpeas' },
    { N: 69, P: 62, K: 56, temperature: 21.36739785, ph: 7.884963929, humidity: 82.63941327, rainfall: 103.63941327, label: 'mothbeans' },
    { N: 70, P: 55, K: 47, temperature: 25.49122152, ph: 7.061929191, humidity: 80.99312763, rainfall: 101.99312763, label: 'mungbean' },
    { N: 65, P: 52, K: 41, temperature: 22.36885057, ph: 6.866933687, humidity: 81.54124705, rainfall: 102.54124705, label: 'blackgram' },
    { N: 64, P: 45, K: 42, temperature: 24.14785908, ph: 6.980055211, humidity: 82.63941327, rainfall: 103.63941327, label: 'lentil' },
    { N: 68, P: 42, K: 45, temperature: 22.36885057, ph: 6.866933687, humidity: 81.54124705, rainfall: 102.54124705, label: 'pomegranate' },
    { N: 65, P: 45, K: 42, temperature: 24.14785908, ph: 6.980055211, humidity: 82.63941327, rainfall: 103.63941327, label: 'banana' },
    { N: 70, P: 55, K: 47, temperature: 25.49122152, ph: 7.061929191, humidity: 80.99312763, rainfall: 101.99312763, label: 'mango' },
    { N: 69, P: 62, K: 56, temperature: 21.36739785, ph: 7.884963929, humidity: 82.63941327, rainfall: 103.63941327, label: 'grapes' },
    { N: 68, P: 42, K: 45, temperature: 22.36885057, ph: 6.866933687, humidity: 81.54124705, rainfall: 102.54124705, label: 'watermelon' },
    { N: 65, P: 45, K: 42, temperature: 24.14785908, ph: 6.980055211, humidity: 82.63941327, rainfall: 103.63941327, label: 'muskmelon' },
    { N: 70, P: 55, K: 47, temperature: 25.49122152, ph: 7.061929191, humidity: 80.99312763, rainfall: 101.99312763, label: 'apple' },
    { N: 69, P: 62, K: 56, temperature: 21.36739785, ph: 7.884963929, humidity: 82.63941327, rainfall: 103.63941327, label: 'orange' },
    { N: 68, P: 42, K: 45, temperature: 22.36885057, ph: 6.866933687, humidity: 81.54124705, rainfall: 102.54124705, label: 'papaya' },
    { N: 65, P: 45, K: 42, temperature: 24.14785908, ph: 6.980055211, humidity: 82.63941327, rainfall: 103.63941327, label: 'coconut' },
    { N: 70, P: 55, K: 47, temperature: 25.49122152, ph: 7.061929191, humidity: 80.99312763, rainfall: 101.99312763, label: 'cotton' },
    { N: 69, P: 62, K: 56, temperature: 21.36739785, ph: 7.884963929, humidity: 82.63941327, rainfall: 103.63941327, label: 'jute' },
    { N: 68, P: 42, K: 45, temperature: 22.36885057, ph: 6.866933687, humidity: 81.54124705, rainfall: 102.54124705, label: 'coffee' }
];

// Load dataset from static data instead of API
let data = staticData;
let crops = [...new Set(data.map(d => d.label))];
let summaryStats = {};
let conditionValues = ['N','P','K','temperature','ph','humidity','rainfall'];

async function loadData() {
    // Use static data instead of API call
    data = staticData;
    crops = [...new Set(data.map(d => d.label))];
    calculateSummaryStats();
    populateCropSelect();
    populateConditionComparison();
    renderDistributionChart();
}

// Simple CSV parser (This function is not strictly needed if /api/data returns JSON directly)
// function parseCSV(text) {
//     const lines = text.trim().split('\n');
//     const headers = lines[0].split(',');
//     return lines.slice(1).map(line => {
//         const values = line.split(',');
//         let obj = {};
//         headers.forEach((h, i) => {
//             if (h === 'label') {
//                 obj[h] = values[i];
//             } else {
//                 obj[h] = parseFloat(values[i]);
//             }
//         });
//         return obj;
//     });
// }

/**
 * Calculates summary statistics (mean, min, max) for each agricultural condition.
 */
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

/**
 * Displays the calculated summary statistics on the page.
 */
function displaySummaryStats() {
    const container = document.getElementById('summary-stats');
    container.innerHTML = '';
    for (const cond in summaryStats) {
        const stat = summaryStats[cond];
        container.innerHTML += `<p><strong>${cond}:</strong> Mean: ${stat.mean.toFixed(2)}, Min: ${stat.min.toFixed(2)}, Max: ${stat.max.toFixed(2)}</p>`;
    }
}

/**
 * Populates the crop selection dropdown with available crop names.
 */
function populateCropSelect() {
    const select = document.getElementById('crop-select');
    select.innerHTML = ''; // Clear existing options
    crops.forEach(crop => {
        const option = document.createElement('option');
        option.value = crop;
        option.textContent = crop;
        select.appendChild(option);
    });
    // Remove previous event listeners to avoid duplicates
    select.removeEventListener('change', showCropSummary);
    select.addEventListener('change', showCropSummary);
    showCropSummary(); // Display summary for the initially selected crop
}

/**
 * Displays detailed statistics for the currently selected crop.
 */
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

/**
 * Populates the condition comparison dropdown and sets up its event listener.
 */
function populateConditionComparison() {
    const select = document.getElementById('condition-select');
    select.removeEventListener('change', showConditionComparison); // Prevent duplicate listeners
    select.addEventListener('change', showConditionComparison);
    showConditionComparison(); // Display initial comparison
}

/**
 * Shows a comparison of crops that require more or less than the average of a selected condition.
 */
function showConditionComparison() {
    const cond = document.getElementById('condition-select').value;
    const meanVal = summaryStats[cond].mean;
    const moreThanAvg = [...new Set(data.filter(d => d[cond] > meanVal).map(d => d.label))];
    const lessThanAvg = [...new Set(data.filter(d => d[cond] <= meanVal).map(d => d.label))];
    let output = `Average value for ${cond}: ${meanVal.toFixed(2)}\n\n`;
    output += `Crops which require more than average ${cond}:\n${moreThanAvg.length > 0 ? moreThanAvg.join(', ') : 'N/A'}\n\n`;
    output += `Crops which require less than or equal to average ${cond}:\n${lessThanAvg.length > 0 ? lessThanAvg.join(', ') : 'N/A'}`;
    document.getElementById('condition-comparison-output').textContent = output;
}

/**
 * Helper function to calculate the mean of an array of numbers.
 * @param {Array<number>} arr - The array of numbers.
 * @returns {number} The mean of the array.
 */
function mean(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

let distributionChartInstance = null; // To store the Chart.js instance

/**
 * Renders the distribution chart for agricultural conditions using Chart.js.
 * Displays histogram-like distributions for each condition.
 */
function renderDistributionChart() {
    const ctx = document.getElementById('distributionChart').getContext('2d');

    // Destroy existing chart instance if it exists to prevent re-rendering issues
    if (distributionChartInstance) {
        distributionChartInstance.destroy();
    }

    const datasets = conditionValues.map((cond, i) => {
        const values = data.map(d => d[cond]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binCount = window.innerWidth < 768 ? 12 : 15; // Reduced bins for mobile
        const binSize = (max - min) / binCount;
        let bins = new Array(binCount).fill(0);

        values.forEach(v => {
            let binIndex = Math.floor((v - min) / binSize);
            if (binIndex === binCount) binIndex--; // edge case for max value
            if (binIndex < 0) binIndex = 0; // edge case for min value
            bins[binIndex]++;
        });

        const points = bins.map((count, idx) => {
            return { x: min + idx * binSize + binSize / 2, y: count };
        });

        return {
            label: cond,
            data: points,
            borderColor: getColor(i),
            backgroundColor: getBackgroundColor(i),
            fill: true,
            showLine: true,
            pointRadius: 0,
            borderWidth: window.innerWidth < 768 ? 1.5 : 2, // Thinner lines on mobile
            type: 'line',
            tension: 0.4
        };
    });

    distributionChartInstance = new Chart(ctx, {
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow canvas to resize freely
            plugins: {
                title: {
                    display: true,
                    text: 'Distribution of Agricultural Conditions',
                    font: {
                        size: window.innerWidth < 768 ? 12 : 16, // Smaller font on mobile
                        weight: 'bold'
                    },
                    color: getComputedStyle(document.documentElement).getPropertyValue('--dark-text'),
                    padding: window.innerWidth < 768 ? 10 : 20
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderWidth: 1,
                    titleFont: {
                        size: window.innerWidth < 768 ? 10 : 12
                    },
                    bodyFont: {
                        size: window.innerWidth < 768 ? 9 : 11
                    }
                },
                legend: {
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--dark-text'),
                        font: {
                            size: window.innerWidth < 768 ? 8 : 10 // Smaller legend on mobile
                        },
                        usePointStyle: true,
                        padding: window.innerWidth < 768 ? 8 : 15
                    },
                    position: window.innerWidth < 768 ? 'bottom' : 'top',
                    align: 'center'
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Value Range',
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12,
                            weight: 'bold'
                        },
                        color: getComputedStyle(document.documentElement).getPropertyValue('--dark-text')
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--dark-text'),
                        font: {
                            size: window.innerWidth < 768 ? 8 : 10
                        },
                        maxTicksLimit: window.innerWidth < 768 ? 8 : 12 // Fewer ticks on mobile
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-light')
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency',
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12,
                            weight: 'bold'
                        },
                        color: getComputedStyle(document.documentElement).getPropertyValue('--dark-text')
                    },
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--dark-text'),
                        font: {
                            size: window.innerWidth < 768 ? 8 : 10
                        },
                        maxTicksLimit: window.innerWidth < 768 ? 6 : 8 // Fewer ticks on mobile
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-light')
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            layout: {
                padding: window.innerWidth < 768 ? 10 : 20
            }
        }
    });
}

/**
 * Provides a consistent color for chart lines based on index.
 * @param {number} index - The index of the dataset.
 * @returns {string} A color string.
 */
function getColor(index) {
    const colors = [
        'rgb(46, 125, 50)',   // Primary Green
        'rgb(255, 179, 0)',   // Accent Gold
        'rgb(211, 47, 47)',   // Red
        'rgb(25, 118, 210)',  // Blue
        'rgb(103, 58, 183)',  // Deep Purple
        'rgb(0, 150, 136)',   // Teal
        'rgb(255, 87, 34)'    // Deep Orange
    ];
    return colors[index % colors.length];
}

/**
 * Provides a lighter, semi-transparent background color for chart fill areas.
 * @param {number} index - The index of the dataset.
 * @returns {string} An RGBA color string for fill.
 */
function getBackgroundColor(index) {
    const colors = [
        'rgba(46, 125, 50, 0.2)',
        'rgba(255, 179, 0, 0.2)',
        'rgba(211, 47, 47, 0.2)',
        'rgba(25, 118, 210, 0.2)',
        'rgba(103, 58, 183, 0.2)',
        'rgba(0, 150, 136, 0.2)',
        'rgba(255, 87, 34, 0.2)'
    ];
    return colors[index % colors.length];
}

/**
 * Sends user input features to the backend for crop prediction.
 * Displays the prediction result or an error message.
 * @param {Object} features - An object containing the input features for prediction.
 */
/**
 * Display prediction result with proper styling
 */
function showPredictionResult(message, type) {
    const predictionResultDiv = document.getElementById('prediction-result');
    
    if (type === 'error') {
        predictionResultDiv.innerHTML = `<p style="color: #d32f2f; font-weight: bold;">❌ ${message}</p>`;
        predictionResultDiv.classList.add('error-message');
        predictionResultDiv.style.backgroundColor = 'rgba(255, 99, 71, 0.1)';
    } else {
        predictionResultDiv.innerHTML = message;
        predictionResultDiv.classList.remove('error-message');
        predictionResultDiv.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--prediction-bg-light');
    }
}

// Form submission handler
document.getElementById('prediction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const N = parseFloat(document.getElementById('input-N').value);
    const P = parseFloat(document.getElementById('input-P').value);
    const K = parseFloat(document.getElementById('input-K').value);
    const temperature = parseFloat(document.getElementById('input-temperature').value);
    const ph = parseFloat(document.getElementById('input-ph').value);
    const humidity = parseFloat(document.getElementById('input-humidity').value);
    const rainfall = parseFloat(document.getElementById('input-rainfall').value);
    
    // Validate inputs
    if (isNaN(N) || isNaN(P) || isNaN(K) || isNaN(temperature) || isNaN(ph) || isNaN(humidity) || isNaN(rainfall)) {
        showPredictionResult('Please enter valid numbers for all fields.', 'error');
        return;
    }
    
    // Show loading message
    const predictionResultDiv = document.getElementById('prediction-result');
    predictionResultDiv.innerHTML = '<p>🌱 Analyzing conditions and predicting crop...</p>';
    predictionResultDiv.classList.remove('error-message');
    
    // Simulate processing time for better UX
    setTimeout(() => {
        // Client-side crop prediction logic
        const prediction = predictCrop(N, P, K, temperature, ph, humidity, rainfall);
        
        // Display result
        showPredictionResult(prediction, 'success');
    }, 1000);
});

/**
 * Simple client-side crop prediction algorithm
 * This is a rule-based system that mimics basic agricultural knowledge
 */
function predictCrop(N, P, K, temperature, ph, humidity, rainfall) {
    // Define crop requirements and scoring
    const crops = {
        'rice': {
            name: 'Rice',
            requirements: {
                N: { min: 80, max: 120, weight: 0.2 },
                P: { min: 30, max: 60, weight: 0.15 },
                K: { min: 30, max: 60, weight: 0.15 },
                temperature: { min: 20, max: 35, weight: 0.2 },
                ph: { min: 5.5, max: 7.5, weight: 0.1 },
                humidity: { min: 70, max: 90, weight: 0.1 },
                rainfall: { min: 150, max: 300, weight: 0.1 }
            }
        },
        'maize': {
            name: 'Maize',
            requirements: {
                N: { min: 70, max: 110, weight: 0.2 },
                P: { min: 25, max: 50, weight: 0.15 },
                K: { min: 25, max: 50, weight: 0.15 },
                temperature: { min: 18, max: 32, weight: 0.2 },
                ph: { min: 5.8, max: 7.5, weight: 0.1 },
                humidity: { min: 60, max: 80, weight: 0.1 },
                rainfall: { min: 100, max: 250, weight: 0.1 }
            }
        },
        'chickpea': {
            name: 'Chickpea',
            requirements: {
                N: { min: 20, max: 40, weight: 0.15 },
                P: { min: 15, max: 30, weight: 0.2 },
                K: { min: 15, max: 30, weight: 0.15 },
                temperature: { min: 15, max: 30, weight: 0.2 },
                ph: { min: 6.0, max: 7.5, weight: 0.1 },
                humidity: { min: 50, max: 70, weight: 0.1 },
                rainfall: { min: 80, max: 200, weight: 0.1 }
            }
        },
        'kidneybeans': {
            name: 'Kidney Beans',
            requirements: {
                N: { min: 25, max: 45, weight: 0.15 },
                P: { min: 20, max: 35, weight: 0.2 },
                K: { min: 20, max: 35, weight: 0.15 },
                temperature: { min: 18, max: 28, weight: 0.2 },
                ph: { min: 6.0, max: 7.0, weight: 0.1 },
                humidity: { min: 55, max: 75, weight: 0.1 },
                rainfall: { min: 100, max: 220, weight: 0.1 }
            }
        },
        'pigeonpeas': {
            name: 'Pigeon Peas',
            requirements: {
                N: { min: 15, max: 35, weight: 0.15 },
                P: { min: 10, max: 25, weight: 0.2 },
                K: { min: 15, max: 30, weight: 0.15 },
                temperature: { min: 20, max: 35, weight: 0.2 },
                ph: { min: 5.5, max: 7.5, weight: 0.1 },
                humidity: { min: 60, max: 80, weight: 0.1 },
                rainfall: { min: 80, max: 180, weight: 0.1 }
            }
        },
        'mothbeans': {
            name: 'Moth Beans',
            requirements: {
                N: { min: 10, max: 25, weight: 0.15 },
                P: { min: 8, max: 20, weight: 0.2 },
                K: { min: 10, max: 25, weight: 0.15 },
                temperature: { min: 22, max: 38, weight: 0.2 },
                ph: { min: 6.5, max: 8.0, weight: 0.1 },
                humidity: { min: 40, max: 60, weight: 0.1 },
                rainfall: { min: 50, max: 150, weight: 0.1 }
            }
        },
        'mungbean': {
            name: 'Mung Bean',
            requirements: {
                N: { min: 20, max: 40, weight: 0.15 },
                P: { min: 15, max: 30, weight: 0.2 },
                K: { min: 15, max: 30, weight: 0.15 },
                temperature: { min: 25, max: 35, weight: 0.2 },
                ph: { min: 6.0, max: 7.5, weight: 0.1 },
                humidity: { min: 60, max: 80, weight: 0.1 },
                rainfall: { min: 80, max: 200, weight: 0.1 }
            }
        },
        'blackgram': {
            name: 'Black Gram',
            requirements: {
                N: { min: 25, max: 45, weight: 0.15 },
                P: { min: 20, max: 35, weight: 0.2 },
                K: { min: 20, max: 35, weight: 0.15 },
                temperature: { min: 25, max: 35, weight: 0.2 },
                ph: { min: 6.0, max: 7.5, weight: 0.1 },
                humidity: { min: 65, max: 85, weight: 0.1 },
                rainfall: { min: 100, max: 250, weight: 0.1 }
            }
        },
        'lentil': {
            name: 'Lentil',
            requirements: {
                N: { min: 15, max: 35, weight: 0.15 },
                P: { min: 12, max: 28, weight: 0.2 },
                K: { min: 15, max: 30, weight: 0.15 },
                temperature: { min: 15, max: 28, weight: 0.2 },
                ph: { min: 6.0, max: 7.5, weight: 0.1 },
                humidity: { min: 50, max: 70, weight: 0.1 },
                rainfall: { min: 80, max: 180, weight: 0.1 }
            }
        },
        'pomegranate': {
            name: 'Pomegranate',
            requirements: {
                N: { min: 30, max: 60, weight: 0.15 },
                P: { min: 20, max: 40, weight: 0.2 },
                K: { min: 25, max: 45, weight: 0.15 },
                temperature: { min: 20, max: 35, weight: 0.2 },
                ph: { min: 5.5, max: 7.5, weight: 0.1 },
                humidity: { min: 40, max: 60, weight: 0.1 },
                rainfall: { min: 60, max: 150, weight: 0.1 }
            }
        },
        'banana': {
            name: 'Banana',
            requirements: {
                N: { min: 40, max: 80, weight: 0.15 },
                P: { min: 25, max: 50, weight: 0.2 },
                K: { min: 50, max: 100, weight: 0.15 },
                temperature: { min: 22, max: 35, weight: 0.2 },
                ph: { min: 5.5, max: 7.0, weight: 0.1 },
                humidity: { min: 70, max: 90, weight: 0.1 },
                rainfall: { min: 120, max: 300, weight: 0.1 }
            }
        },
        'mango': {
            name: 'Mango',
            requirements: {
                N: { min: 35, max: 70, weight: 0.15 },
                P: { min: 20, max: 45, weight: 0.2 },
                K: { min: 30, max: 60, weight: 0.15 },
                temperature: { min: 25, max: 38, weight: 0.2 },
                ph: { min: 5.5, max: 7.5, weight: 0.1 },
                humidity: { min: 50, max: 70, weight: 0.1 },
                rainfall: { min: 80, max: 200, weight: 0.1 }
            }
        },
        'grapes': {
            name: 'Grapes',
            requirements: {
                N: { min: 30, max: 60, weight: 0.15 },
                P: { min: 20, max: 40, weight: 0.2 },
                K: { min: 25, max: 50, weight: 0.15 },
                temperature: { min: 18, max: 32, weight: 0.2 },
                ph: { min: 5.5, max: 7.0, weight: 0.1 },
                humidity: { min: 40, max: 60, weight: 0.1 },
                rainfall: { min: 60, max: 150, weight: 0.1 }
            }
        },
        'watermelon': {
            name: 'Watermelon',
            requirements: {
                N: { min: 35, max: 70, weight: 0.15 },
                P: { min: 25, max: 50, weight: 0.2 },
                K: { min: 30, max: 60, weight: 0.15 },
                temperature: { min: 25, max: 35, weight: 0.2 },
                ph: { min: 6.0, max: 7.5, weight: 0.1 },
                humidity: { min: 60, max: 80, weight: 0.1 },
                rainfall: { min: 100, max: 250, weight: 0.1 }
            }
        },
        'muskmelon': {
            name: 'Muskmelon',
            requirements: {
                N: { min: 30, max: 60, weight: 0.15 },
                P: { min: 20, max: 40, weight: 0.2 },
                K: { min: 25, max: 50, weight: 0.15 },
                temperature: { min: 22, max: 32, weight: 0.2 },
                ph: { min: 6.0, max: 7.5, weight: 0.1 },
                humidity: { min: 55, max: 75, weight: 0.1 },
                rainfall: { min: 80, max: 200, weight: 0.1 }
            }
        },
        'apple': {
            name: 'Apple',
            requirements: {
                N: { min: 25, max: 50, weight: 0.15 },
                P: { min: 15, max: 35, weight: 0.2 },
                K: { min: 20, max: 40, weight: 0.15 },
                temperature: { min: 15, max: 28, weight: 0.2 },
                ph: { min: 6.0, max: 7.0, weight: 0.1 },
                humidity: { min: 45, max: 65, weight: 0.1 },
                rainfall: { min: 80, max: 180, weight: 0.1 }
            }
        },
        'orange': {
            name: 'Orange',
            requirements: {
                N: { min: 30, max: 60, weight: 0.15 },
                P: { min: 20, max: 40, weight: 0.2 },
                K: { min: 25, max: 50, weight: 0.15 },
                temperature: { min: 20, max: 32, weight: 0.2 },
                ph: { min: 5.5, max: 7.5, weight: 0.1 },
                humidity: { min: 50, max: 70, weight: 0.1 },
                rainfall: { min: 100, max: 250, weight: 0.1 }
            }
        },
        'papaya': {
            name: 'Papaya',
            requirements: {
                N: { min: 35, max: 70, weight: 0.15 },
                P: { min: 25, max: 50, weight: 0.2 },
                K: { min: 30, max: 60, weight: 0.15 },
                temperature: { min: 25, max: 35, weight: 0.2 },
                ph: { min: 6.0, max: 7.5, weight: 0.1 },
                humidity: { min: 60, max: 80, weight: 0.1 },
                rainfall: { min: 120, max: 300, weight: 0.1 }
            }
        },
        'coconut': {
            name: 'Coconut',
            requirements: {
                N: { min: 40, max: 80, weight: 0.15 },
                P: { min: 30, max: 60, weight: 0.2 },
                K: { min: 35, max: 70, weight: 0.15 },
                temperature: { min: 25, max: 38, weight: 0.2 },
                ph: { min: 5.5, max: 7.5, weight: 0.1 },
                humidity: { min: 70, max: 90, weight: 0.1 },
                rainfall: { min: 150, max: 400, weight: 0.1 }
            }
        },
        'cotton': {
            name: 'Cotton',
            requirements: {
                N: { min: 50, max: 100, weight: 0.15 },
                P: { min: 30, max: 60, weight: 0.2 },
                K: { min: 25, max: 50, weight: 0.15 },
                temperature: { min: 22, max: 35, weight: 0.2 },
                ph: { min: 5.5, max: 7.5, weight: 0.1 },
                humidity: { min: 50, max: 70, weight: 0.1 },
                rainfall: { min: 80, max: 200, weight: 0.1 }
            }
        },
        'jute': {
            name: 'Jute',
            requirements: {
                N: { min: 60, max: 120, weight: 0.15 },
                P: { min: 40, max: 80, weight: 0.2 },
                K: { min: 30, max: 60, weight: 0.15 },
                temperature: { min: 24, max: 37, weight: 0.2 },
                ph: { min: 6.0, max: 7.5, weight: 0.1 },
                humidity: { min: 70, max: 90, weight: 0.1 },
                rainfall: { min: 150, max: 350, weight: 0.1 }
            }
        },
        'coffee': {
            name: 'Coffee',
            requirements: {
                N: { min: 30, max: 60, weight: 0.15 },
                P: { min: 20, max: 40, weight: 0.2 },
                K: { min: 25, max: 50, weight: 0.15 },
                temperature: { min: 18, max: 28, weight: 0.2 },
                ph: { min: 5.5, max: 6.5, weight: 0.1 },
                humidity: { min: 60, max: 80, weight: 0.1 },
                rainfall: { min: 120, max: 300, weight: 0.1 }
            }
        }
    };
    
    // Calculate scores for each crop
    const cropScores = {};
    
    for (const [cropKey, crop] of Object.entries(crops)) {
        let totalScore = 0;
        let maxPossibleScore = 0;
        
        // Check each parameter
        const params = { N, P, K, temperature, ph, humidity, rainfall };
        
        for (const [param, value] of Object.entries(params)) {
            const req = crop.requirements[param];
            const weight = req.weight;
            maxPossibleScore += weight;
            
            // Calculate score based on how well the value fits the requirement
            if (value >= req.min && value <= req.max) {
                // Perfect fit - full score
                totalScore += weight;
            } else if (value < req.min) {
                // Below minimum - partial score based on how close
                const distance = Math.abs(value - req.min);
                const range = req.max - req.min;
                const penalty = Math.min(distance / range, 1);
                totalScore += weight * (1 - penalty * 0.5);
            } else {
                // Above maximum - partial score based on how close
                const distance = Math.abs(value - req.max);
                const range = req.max - req.min;
                const penalty = Math.min(distance / range, 1);
                totalScore += weight * (1 - penalty * 0.5);
            }
        }
        
        // Normalize score to percentage
        cropScores[cropKey] = (totalScore / maxPossibleScore) * 100;
    }
    
    // Find the best crop
    let bestCrop = null;
    let bestScore = 0;
    
    for (const [cropKey, score] of Object.entries(cropScores)) {
        if (score > bestScore) {
            bestScore = score;
            bestCrop = cropKey;
        }
    }
    
    // Get top 3 recommendations
    const sortedCrops = Object.entries(cropScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
    
    // Format the result
    let result = `<h3>🌱 Crop Recommendation</h3>`;
    result += `<p><strong>Best Match:</strong> ${crops[bestCrop].name} (${bestScore.toFixed(1)}% compatibility)</p>`;
    
    if (sortedCrops.length > 1) {
        result += `<p><strong>Alternative Options:</strong></p><ul>`;
        for (let i = 1; i < sortedCrops.length; i++) {
            const [cropKey, score] = sortedCrops[i];
            result += `<li>${crops[cropKey].name} (${score.toFixed(1)}% compatibility)</li>`;
        }
        result += `</ul>`;
    }
    
    result += `<p><strong>Analysis:</strong> Based on your soil and climate conditions, `;
    result += `${crops[bestCrop].name} appears to be the most suitable crop. `;
    result += `The recommendation considers factors like nutrient levels, temperature, pH, humidity, and rainfall patterns.</p>`;
    
    return result;
}

/**
 * Loads and displays model accuracy and confusion matrix from the backend.
 * Renders the confusion matrix as an HTML table with color scaling.
 */
async function loadModelMetrics() {
    // Mock model metrics for demonstration
    const metrics = {
        accuracy: 0.97,
        labels: ['rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate', 'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee'],
        confusion_matrix: [
            [15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
        ]
    };

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

const themeToggleBtn = document.getElementById('theme-toggle');

/**
 * Loads the saved theme preference from localStorage and applies it.
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for dark mode
    } else {
        document.documentElement.classList.remove('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon for light mode
    }
    // Re-render charts to apply new theme colors if they exist
    if (data.length > 0) { // Only re-render if data is loaded
        renderDistributionChart();
        loadModelMetrics(); // Re-render confusion matrix for color updates
    }
}

/**
 * Toggles the theme between light and dark mode and saves the preference.
 */
function toggleTheme() {
    if (document.documentElement.classList.contains('dark-mode')) {
        document.documentElement.classList.remove('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
    // Re-render charts to apply new theme colors
    if (data.length > 0) { // Only re-render if data is loaded
        renderDistributionChart();
        loadModelMetrics(); // Re-render confusion matrix for color updates
    }
}

themeToggleBtn.addEventListener('click', toggleTheme);

// Load theme on page load
loadTheme();

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

/**
 * Handles scroll events to hide/show the navbar for a cleaner experience.
 */
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // Scrolling down
        navbar.style.top = '-70px'; // hide navbar (adjust based on navbar height)
    } else {
        // Scrolling up
        navbar.style.top = '0';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
});

// Initialize app functions
loadData();
loadModelMetrics();

// Add window resize listener for responsive chart
window.addEventListener('resize', function() {
    if (distributionChartInstance && data.length > 0) {
        // Debounce resize events
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(() => {
            renderDistributionChart();
        }, 250);
    }
});

// Navigation active state handling
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar ul li a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('.navbar ul li a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Update navigation on scroll
window.addEventListener('scroll', updateActiveNavigation);
