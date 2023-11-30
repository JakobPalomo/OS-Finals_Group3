function getNumberOfProcesses(algorithm) {
    const numberOfProcesses = parseInt(document.getElementById(algorithm === 'sjf' ? 'sjfProcessNum' : 'rrProcessNum').value);
  
    if (isNaN(numberOfProcesses) || numberOfProcesses <= 0) {
      const errorMsg = document.getElementById(algorithm === 'sjf' ? 'sjfError' : 'rrError');
      errorMsg.innerHTML = 'Please enter a valid number of processes.';
      return;
    }
  
    const inputDiv = document.getElementById(algorithm === 'sjf' ? 'sjfInput' : 'rrInput');
    inputDiv.innerHTML = '';
  
    for (let i = 0; i < numberOfProcesses; i++) {
      const inputField = document.createElement('input');
      inputField.setAttribute('type', 'number');
      inputField.setAttribute('placeholder', `Process ${i + 1}`);
      inputField.setAttribute('id', `${algorithm === 'sjf' ? 'sjfProcess' : 'rrProcess'}${i + 1}`);
      inputDiv.appendChild(inputField);
    }
    const errorMsg = document.getElementById(algorithm === 'sjf' ? 'sjfError' : 'rrError');
    errorMsg.innerHTML = ''; // Clear previous error message if any
  }


  function calculateSJF() {
    const numberOfProcesses = document.getElementById('sjfInput').childElementCount;
  
    const processes = [];
  
    for (let i = 1; i <= numberOfProcesses; i++) {
      const processValue = parseInt(document.getElementById(`sjfProcess${i}`).value);
  
      if (isNaN(processValue) || processValue < 0) {
        const errorMsg = document.getElementById('sjfError');
        errorMsg.innerHTML = 'Process values should be positive integers.';
        return;
      }
  
      processes.push(processValue);
    }
  
    processes.sort((a, b) => a - b);
  
    const ganttChart = document.getElementById('ganttChart');
    ganttChart.innerHTML = '';
  
    let chartContent = '';
    let startTime = 0;
  
    const waitingTimes = new Array(processes.length).fill(0);
    const turnaroundTimes = new Array(processes.length).fill(0);
  
    processes.forEach((process, index) => {
      const processName = `P${index + 1}`;
      chartContent += `<div class="block" style="width: ${process * 20}px;">${processName}</div>`;
      startTime += process;
  
      turnaroundTimes[index] = startTime;
      waitingTimes[index] = startTime - process;
    });
  
    ganttChart.innerHTML = chartContent;
  
    const averageWaitingTime = waitingTimes.reduce((total, time) => total + time, 0) / processes.length;
    const averageTurnaroundTime = turnaroundTimes.reduce((total, time) => total + time, 0) / processes.length;
  
    const resultsDiv = document.createElement('div');
    resultsDiv.innerHTML = `
      <h3>Results</h3>
      <p>Waiting Times: ${waitingTimes.join(', ')}</p>
      <p>Turnaround Times: ${turnaroundTimes.join(', ')}</p>
      <p>Average Waiting Time: ${averageWaitingTime.toFixed(2)}</p>
      <p>Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}</p>
    `;
    ganttChart.appendChild(resultsDiv);
  }
  