function getRoundRobinInputs() {
    const numProcesses = parseInt(document.getElementById('rrNumProcesses').value);
  
    // Validation for "Number of Processes"
    if (isNaN(numProcesses) || numProcesses < 2 || numProcesses > 9) {
      const errorMsg = document.getElementById('rrError');
      errorMsg.innerHTML = 'Please enter a valid number of processes (2-9).';
      return;
    }
  
    const rrInputsDiv = document.getElementById('rrInputs');
    rrInputsDiv.innerHTML = '';
  
    for (let i = 1; i <= numProcesses; i++) {
      const processDiv = document.createElement('div');
      processDiv.innerHTML = `
        <label for="arrivalTime${i}">Arrival Time for Process ${i}:</label>
        <input type="number" id="arrivalTime${i}" class="rrInput" min="0" required>
        <label for="burstTime${i}">Burst Time for Process ${i}:</label>
        <input type="number" id="burstTime${i}" class="rrInput" min="1" required><br><br>
      `;
      rrInputsDiv.appendChild(processDiv);
    }
  
    // Time quantum input field
    const timeQuantumInput = document.createElement('input');
    timeQuantumInput.setAttribute('type', 'number');
    timeQuantumInput.setAttribute('placeholder', 'Enter Time Quantum');
    timeQuantumInput.setAttribute('id', 'timeQuantum');
    rrInputsDiv.appendChild(timeQuantumInput);
  
    const errorMsg = document.getElementById('rrError');
    errorMsg.innerHTML = ''; // Clear previous error message if any
  }

function calculateRoundRobin() {
    try {
        let numProcesses = parseInt(document.getElementById('rrNumProcesses').value);
        let timeQuantum = parseInt(document.getElementById('timeQuantum').value);
      
        // Validation for inputs
        if (isNaN(numProcesses) || numProcesses <= 0 || numProcesses > 10 || isNaN(timeQuantum) || timeQuantum <= 0) {
          let errorMsg = document.getElementById('rrError');
          errorMsg.innerHTML = 'Please enter valid inputs.';
          return;
        }
      
        let processes = [];
      
        // Get values of burst time input fields
        for (let i = 1; i <= numProcesses; i++) {
          let arrivalTime = parseInt(document.getElementById(`arrivalTime${i}`).value);
          let burstTime = parseInt(document.getElementById(`burstTime${i}`).value);
      
          // Validation for burst time input fields
          if (isNaN(arrivalTime) || arrivalTime < 0 || isNaN(burstTime) || burstTime <= 0) {
            let errorMsg = document.getElementById('rrError');
            errorMsg.innerHTML = 'Please enter valid arrival and burst times for each process.';
            return;
          }

          processes.push({
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            remainingBurstTime: burstTime
          });


          processes.sort((a,b) => a.arrivalTime - b.arrivalTime);

          while (processes.length > 0) {
            let process = processes[0];

            if (process.arrivalTime > )
          }
      
          
        }
      
        
        // The rest of your code...
      

      let totalWaitingTime = waitingTimes.reduce((acc, val) => acc + val, 0);
      let averageWaitingTime = totalWaitingTime / numProcesses;
      let totalTurnaroundTime = turnaroundTimes.reduce((acc, val) => acc + val, 0);
      let averageTurnaroundTime = totalTurnaroundTime / numProcesses;

      let resultsDiv = document.createElement('div');
      resultsDiv.innerHTML = `
          <h3>Results</h3>
          <p>Waiting Times: ${waitingTimes.join(', ')}</p>
          <p>Turnaround Times: ${turnaroundTimes.join(', ')}</p>
          <p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>
          <p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p>
      `;
    } catch (error) {
      console.log(errorMsg);
    }
}

function resetCalculator() {
    // Reload the page
    window.location.reload();
  }