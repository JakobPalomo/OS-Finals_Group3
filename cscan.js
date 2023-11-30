function getCSCANRequests() {
    const currentPosition = parseInt(document.getElementById('currentPosition').value);
    const trackSize = parseInt(document.getElementById('trackSize').value);
    const seekRate = parseInt(document.getElementById('seekRate').value);
    const numRequests = parseInt(document.getElementById('numRequests').value);
  
    if (
      isNaN(currentPosition) || isNaN(trackSize) || isNaN(seekRate) ||
      isNaN(numRequests) || numRequests <= 0 || numRequests > 10 ||
      currentPosition < 0 || trackSize <= 0 || seekRate <= 0
    ) {
      const errorMsg = document.getElementById('cscanGraph');
      errorMsg.innerHTML = 'Please enter valid inputs.';
      return;
    }
  
    const requestsDiv = document.getElementById('cscanRequests');
    requestsDiv.innerHTML = '';
  
    for (let i = 0; i < numRequests; i++) {
      const inputField = document.createElement('input');
      inputField.setAttribute('type', 'number');
      inputField.setAttribute('placeholder', `Request ${i + 1}`);
      inputField.setAttribute('id', `cscanRequest${i + 1}`);
      requestsDiv.appendChild(inputField);
    }
  }
  
  function calculateCSCAN() {
    const currentPosition = parseInt(document.getElementById('currentPosition').value);
    const trackSize = parseInt(document.getElementById('trackSize').value);
    const seekRate = parseInt(document.getElementById('seekRate').value);
    const numRequests = parseInt(document.getElementById('numRequests').value);
  
    if (
      isNaN(currentPosition) || isNaN(trackSize) || isNaN(seekRate) ||
      isNaN(numRequests) || numRequests <= 0 || numRequests > 10 ||
      currentPosition < 0 || trackSize <= 0 || seekRate <= 0
    ) {
      const errorMsg = document.getElementById('cscanGraph');
      errorMsg.innerHTML = 'Please enter valid inputs.';
      return;
    }
  
    const requests = [];
  
    for (let i = 1; i <= numRequests; i++) {
      const requestValue = parseInt(document.getElementById(`cscanRequest${i}`).value);
  
      if (isNaN(requestValue) || requestValue < 0 || requestValue >= trackSize) {
        const errorMsg = document.getElementById('cscanGraph');
        errorMsg.innerHTML = 'Request values should be positive integers less than track size.';
        return;
      }
  
      requests.push(requestValue);
    }
  
    requests.push(currentPosition);
    requests.sort((a, b) => a - b);
  
    const totalSeekSequence = [];
    const initialIndex = requests.indexOf(currentPosition);
    const forwardRequests = requests.slice(initialIndex);
    const backwardRequests = requests.slice(0, initialIndex);
  
    totalSeekSequence.push(...forwardRequests, trackSize - 1, 0, ...backwardRequests);
    const totalSeekTime = totalSeekSequence.reduce((acc, val, index, arr) => {
      return acc + Math.abs(arr[index + 1] - val) * seekRate;
    }, 0);
  
    const cscanGraph = document.getElementById('cscanGraph');
    cscanGraph.innerHTML = '';
  
    const graphDiv = document.createElement('div');
    graphDiv.innerHTML = `<h3>CSCAN Results</h3>
      <p>Total Seek Time: ${totalSeekTime}</p>
      <p>Seek Sequence: ${totalSeekSequence.join(', ')}</p>
    `;
    cscanGraph.appendChild(graphDiv);
  }