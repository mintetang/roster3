//roster2.js
document.addEventListener("DOMContentLoaded",
    function () {
        populateClasses();
        showStudentsList();
    });

function showAddStudentOrgForm() {
    document.getElementById('addStudentOrgPopup').
        style.display = 'block';
}

function showreadOrgForm() {
    document.getElementById('readOrgPopup').
        style.display = 'block';
}

function showreadForm() {
    document.getElementById('readPopup').
        style.display = 'block';
}

function showAddStudentForm() {
    document.getElementById('addStudentPopup').
        style.display = 'block';
}

function showAddClassForm() {
    // Show the add class popup
    document.getElementById('addClassPopup').
        style.display = 'block';
}
function resetStatus() {
    //watch, this is to reset all status to null all classes need to retify
        localStorage.setItem('attendanceData', 
                null); 
        localStorage.setItem('colors', 
                null);   
        //location.reload();
        showStudentsList() 		
    }

function readOrg() {
    //console.log("read last one");
    
	if (!classSelector || !classSelector.options ||
        classSelector.selectedIndex-1 === -1 ) {
        alert
            ('會友名單不存在!');
            return;} 
    else 
    {
        const studentsCopy = localStorage.getItem("students");
        //console.log(studentsCopy);
        const stdArray = JSON.parse(studentsCopy);
        //make the lsClass is the last class
        const lsClass = classSelector.
                options[classSelector.selectedIndex-1].value;

        //the newClass is the current empty class
        const newClass = classSelector.
                options[classSelector.selectedIndex].value;
        //copy the lsClass to newClass
        stdArray[newClass] = stdArray[lsClass]

        localStorage.setItem('students', 
                JSON.stringify(stdArray));

        /* class already created so this is not necessary, leave for backup 
        const classCopy = localStorage.getItem("classes");
        const stdClass = JSON.parse(classCopy);
        stdClass.push('2025-10-27-第2堂');
        console.log(stdClass)
        localStorage.setItem('classes', 
                JSON.stringify(stdClass));*/

        // copy the colors

        //const colorsCopy = localStorage.getItem("colors");
        //const stdColor = JSON.parse(colorsCopy);
        //console.log(stdColor);

        //make color of newClass to be last class
        //stdColor[newClass]=stdColor[lsClass];
        //console.log(stdColor);

        //localStorage.setItem('colors', 
        //        JSON.stringify(stdColor));
        //location.reload();
        
        //copy attendanceData to new class
       const copattData = localStorage.getItem('attendanceData');
        const savedAttendanceData = JSON.parse(copattData);
         const copyatt = savedAttendanceData.map(item => ({
            ...item, status: 'reset'}));
        //console.log(copyatt);

        // filter to be copied att data from last class
        const matchingObjects = copyatt.filter(obj => obj.class.includes(lsClass));
        //console.log(matchingObjects);

        //make newAttObjects as the new class name by map
        const newAttObjects = matchingObjects.map(item => {       
        return { ...item, class: newClass}; 
        });

        // By Concatenation append the new Att data to copyatt as new att
        const newatt = copyatt.concat(newAttObjects);
        //console.log(newatt);

        localStorage.setItem('attendanceData', 
                JSON.stringify(newatt));             
        //location.reload();
        showStudentsList() 		
    }
    closePopup();
}

async function addOrg() {
    const requestURL =
        //"https://roster2.wasmer.app/scripts/nameroll1.json";
        "https://mintetang.github.io/roster3/scripts/nameroll1.json";
    const request = new Request(requestURL);
    const response = await fetch(request);
    const rData = await response.json();
    const jsArray = rData.data;
    /*const savedStudents = JSON.parse
            (localStorage.getItem('students'));
    const orgArray = savedStudents[selectedClass];
    //console.log(jsArray.length);*/
    for (let i = 0; i < jsArray.length; i++) 
        {
    const newStudentName = jsArray[i].name;
    const newStudentRoll = jsArray[i].rollNumber;
    if (!newStudentName || !newStudentRoll) {
        alert("Missing name or roll number.");
        return;}
    std(newStudentName, newStudentRoll);}
}

function addClass() {
	//jt 0927
	//const newSession = document.
    //    getElementById('session').value;
    const tempClassName = document.
        getElementById('newClassName').value;
	//const newClassName = `${tempClassName}-${newSession}`;
    const newClassName = tempClassName;

    if (!newClassName) {
        alert("請輸入日期.");
        return;
    }

    const classSelector = document.getElementById('classSelector');

    // 🔴 Check if class already exists
    const exists = Array.from(classSelector.options)
        .some(option => option.value === newClassName);

    if (exists) {
        alert("此堂次已存在，請勿重複新增。");
        return;
    }

    // ✅ Add the new class
    const newClassOption = document.createElement('option');
    newClassOption.value = newClassName;
    newClassOption.text = newClassName;

    classSelector.add(newClassOption);
    classSelector.value = newClassName;

    showStudentsList();
    saveClasses();
    closePopup();
}

function addStudent() {
    const newStudentName = document.getElementById('newStudentName').value;
    const newStudentRoll = document.getElementById('newStudentRoll').value;

    if (!newStudentName || !newStudentRoll) {
        alert("Please provide both name and roll number.");
        return;
    }

    std(newStudentName, newStudentRoll);
}

function std(newStudentName, newStudentRoll) {
    const classSelector = document.getElementById('classSelector');
    const selectedClass = classSelector.value;
    const studentsList = document.getElementById('studentsList');

    // Create student list item
    const listItem = document.createElement('li');
    listItem.setAttribute('data-roll-number', newStudentRoll);
    listItem.innerHTML = `<strong>${newStudentName}</strong> ${newStudentRoll}`;

    // Load saved attendance if any
    const status1 = getSavedAttendance(selectedClass, newStudentRoll, 'status1') || 'reset';
    const status2 = getSavedAttendance(selectedClass, newStudentRoll, 'status2') || 'reset';

    const togglePresent1 = createAttendanceToggle(
        'status1', listItem, selectedClass, status1, { reset: '(1)⬜', present: '(1)✅' }
    );
    const togglePresent2 = createAttendanceToggle(
        'status2', listItem, selectedClass, status2, { reset: '(2)⬜', present: '(2)✔️' }
    );

    listItem.appendChild(togglePresent1);
    listItem.appendChild(togglePresent2);
    studentsList.appendChild(listItem);

    // Save student to class
    const savedStudents = JSON.parse(localStorage.getItem('students')) || {};
    if (!savedStudents[selectedClass]) savedStudents[selectedClass] = [];
    savedStudents[selectedClass].push({ name: newStudentName, rollNumber: newStudentRoll });
    localStorage.setItem('students', JSON.stringify(savedStudents));

    // Initialize attendance record
    updateAttendanceRecord(newStudentRoll, selectedClass, 'status1', status1);
    updateAttendanceRecord(newStudentRoll, selectedClass, 'status2', status2);

    closePopup();
}


function createAttendanceToggle(type, listItem, selectedClass, initialStatus = 'reset', icons = { reset: '⬜', present: '✅' }) {
    const toggleButton = createButton(icons[initialStatus], type, () => {
        const currentStatus = toggleButton.dataset.status;

        if (currentStatus === 'reset') {
            // Mark as present
            markAttendance(type, 'present', listItem, selectedClass);

            toggleButton.textContent = icons.present;
            toggleButton.className = type;
            toggleButton.dataset.status = 'present';
        } else {
            // Reset attendance
            markAttendance(type, 'reset', listItem, selectedClass);

            toggleButton.textContent = icons.reset;
            toggleButton.className = 'reset';
            toggleButton.dataset.status = 'reset';
        }
    });

    // Restore saved state
    toggleButton.dataset.status = initialStatus;
    toggleButton.textContent = initialStatus === 'present' ? icons.present : icons.reset;
    toggleButton.className = initialStatus === 'present' ? type : 'reset';

    return toggleButton;
}


function submitAttendance() {
    const classSelector = document.
        getElementById('classSelector');

    if (!classSelector || !classSelector.options ||
        classSelector.selectedIndex === -1) {
        console.error
            ('Class selector is not properly defined or has no options.');
        return;
    }

    const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;

    if (!selectedClass) {
        console.error('Selected class is not valid.');
        return;
    }
    //add 0113 to show result after submit
    showAttendanceResult(selectedClass);
    document.getElementById("resultSection")
            .scrollIntoView({ behavior: "smooth" });//remove below list 0113
/*    const studentsList =
        document.getElementById('studentsList');

    // Check if attendance is already submitted 
    // for the selected class
    const isAttendanceSubmitted =
        isAttendanceSubmittedForClass(selectedClass);

    if (isAttendanceSubmitted) {
        // If attendance is submitted, hide the 
        // summary and show the attendance result
        document.getElementById('summarySection').
            style.display = 'none';
        showAttendanceResult(selectedClass);
    } else {
        // If attendance is not submitted, show the summary
        document.getElementById('summarySection').
            style.display = 'block';
        document.getElementById('resultSection').
            style.display = 'none';
    }
            
    // Clear the student list and reset the form
    studentsList.innerHTML = '';*/ 
}

function isAttendanceSubmittedForClass(selectedClass) {
    const savedAttendanceData = JSON.parse
        (localStorage.getItem('attendanceData')) || [];
    return savedAttendanceData.some
        (record => record.class === selectedClass);
}

function showAttendanceResult(selectedClass) {
    const resultSection = document.getElementById('resultSection');

    if (!resultSection) {
        console.error('Result section is not properly defined.');
        return;
    }

    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Retrieve attendance data
    const savedAttendanceData =
        JSON.parse(localStorage.getItem('attendanceData')) || [];

    const filteredAttendanceData =
        savedAttendanceData.filter(record => record.class === selectedClass);

    const totalStudents = filteredAttendanceData.length;

    // STATUS 1
    const presentStatus1 = filteredAttendanceData.filter(
        record => record.status1 === 'present'
    ).length;

    const absentStatus1 = filteredAttendanceData.filter(
        record => record.status1 === 'reset'
    ).length;

    // STATUS 2
    const presentStatus2 = filteredAttendanceData.filter(
        record => record.status2 === 'present'
    ).length;

    const absentStatus2 = filteredAttendanceData.filter(
        record => record.status2 === 'reset'
    ).length;

    // Attendance rate 
    const attendanceRate1 =
        totalStudents > 0
            ? Math.round((presentStatus1 / totalStudents) * 100) + '%'
            : '0%';

    const attendanceRate2 =
        totalStudents > 0
            ? Math.round((presentStatus2 / totalStudents) * 100) + '%'
            : '0%';

    // Update UI
    document.getElementById('attendanceDate').innerText = date;
    document.getElementById('attendanceTime').innerText = time;
    document.getElementById('attendanceClass').innerText = selectedClass;
    document.getElementById('attendanceTotalStudents').innerText = totalStudents;

   document.getElementById('attendancePresent').innerText = presentStatus1 + presentStatus2;
;
    document.getElementById('attendanceAbsent').innerText = totalStudents - (presentStatus1 + presentStatus2);

    document.getElementById('attendanceRate1').innerText = attendanceRate1;
    document.getElementById('attendanceRate2').innerText = attendanceRate2;
    const overallAttendanceRate =
        totalStudents > 0
            ? Math.round(((presentStatus1 + presentStatus2) / totalStudents) * 100) + '%'
            : '0%';
    document.getElementById('attendanceRate').innerText = overallAttendanceRate;
    // Show result section
    resultSection.style.display = 'block';
}

function histRate() {
    const classSelector = document.
        getElementById('classSelector');

    if (!classSelector || !classSelector.options ||
        classSelector.selectedIndex === -1) {
        console.error
            ('Class selector is not properly defined or has no options.');
        return;
    }
    const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;

    if (!selectedClass) {
        console.error('Selected class is not valid.');
        return;
    }
    //set attText and attClass
    attText = document.getElementById('attendanceRate').innerText;
    if (attText === 'NaN%')
        {console.log('need to have attendance data to output');
            return;
        };
    attClass = selectedClass;
    //console.log(attClass);
    //console.log(attText);  
    //make attendance history session here
    //const hisSection = document.getElementById('hisSection');
    //document.getElementById("hisSection").innerText="TBD";
    // Add content from localStorage attHis

    if (localStorage.getItem('attHis') === null){
        console.log('no data in attHis');
        }
        else {
        //document.getElementById("attP").innerText = localStorage.getItem('attHis');
        console.log(localStorage.getItem('attHis'));
        }
    //attObj to record the class and the attendance rate 
    attObj = {'date': attClass,'per': attText};
    //console.log(attObj);
    let attArray = JSON.parse(localStorage.getItem('attHis'));
    //console.log(attArray);
    if (attArray === null) {
    attArray = [];
    attArray.push(attObj);
    //console.log(attArray);
    } 
    else if (JSON.stringify(attArray).includes(attClass) !== false){
        // Find object with the attClass;
        //indexToUpdate = attArray.findIndex((obj) => attClass in obj );
        indexToUpdate = attArray.findIndex(obj => obj.date === attObj.date);
        //console.log(indexToUpdate);
        attArray.splice(indexToUpdate, 1, attObj); 
        // Remove 1 element at indexToUpdate and insert newObject
        //console.log(attArray);
    }
    else {
    attArray.push(attObj);
    //console.log(attArray);
    }
    attArray.sort((a, b) => 
        a.date.localeCompare(b.date));
    //save attendance history to localStorage attHis
    localStorage.setItem('attHis', 
          JSON.stringify(attArray));
    //document.getElementById("attP").innerText = localStorage.getItem('attHis');

    //myChart

    const arrayOfObjects = attArray;
    const { date, per } = arrayOfObjects.reduce((acc, obj) => {
    acc.date.push(obj.date);
    acc.per.push(obj.per);
    return acc;
    }, { date: [], per: [] });

    //const stringArray = ["10", "21", "3", "14", "53"];
    const perInt = per.map(function(str) {
    return parseInt(str, 10); // 10 specifies decimal radix
    });
    
    console.log(per);

    const ctx = document.getElementById('myChart').getContext('2d');
        if(Chart.getChart("myChart")) {
    Chart.getChart("myChart")?.destroy()
        }                                                                           
    mychart = new Chart(ctx, {
        type: 'bar', // or 'line', 'pie', etc.
        data: {
            labels: date, // Array for labels on the x-axis
            datasets: [{
                label: '出席率',
                data: perInt, // Your array of data points
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    title: {
                    display: true,
                    text: '出席率 (%)'}, // Your Y-axis label
                    beginAtZero: true
                }
            }
        }
    });
    // Append the new div to the result session
}

function closePopup() {
    // Close the currently open popup
    document.getElementById('addStudentPopup').
        style.display = 'none';
    document.getElementById('addClassPopup').
        style.display = 'none';
    document.getElementById('addStudentOrgPopup').
        style.display = 'none';
    document.getElementById('readOrgPopup').
        style.display = 'none';
    document.getElementById('readPopup').
        style.display = 'none';
}

function createButton(text, status, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = text;
    button.className = status;
    button.onclick = onClick;
    return button;
}

function populateClasses() {
    // Retrieve classes from local storage
    const savedClasses = JSON.parse
        (localStorage.getItem('classes')) || [];
    const classSelector = 
        document.getElementById('classSelector');

    savedClasses.forEach(className => {
        const newClassOption = 
            document.createElement('option');
        newClassOption.value = className;
        newClassOption.text = className;
        classSelector.add(newClassOption);
    });
    let ln = classSelector.options.length;
    //console.log(ln);
    const selectedClass = classSelector.
        options[classSelector.selectedIndex+ln-1].value;
    classSelector.value = selectedClass;
    //console.log(classSelector.value);
}

function showStudentsList() {
    const classSelector = document.getElementById('classSelector');
    const selectedClass = classSelector.value;

    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';

    const savedStudents = JSON.parse(localStorage.getItem('students')) || {};
    const selectedClassStudents = savedStudents[selectedClass] || [];

    selectedClassStudents.forEach(student => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-roll-number', student.rollNumber);
        listItem.innerHTML = `<strong>${student.name}</strong> ${student.rollNumber}`;

        // Restore saved attendance
        const status1 = getSavedAttendance(selectedClass, student.rollNumber, 'status1') || 'reset';
        const status2 = getSavedAttendance(selectedClass, student.rollNumber, 'status2') || 'reset';

        const togglePresent1 = createAttendanceToggle(
            'status1', listItem, selectedClass, status1, { reset: '(1)⬜', present: '(1)✅' }
        );
        const togglePresent2 = createAttendanceToggle(
            'status2', listItem, selectedClass, status2, { reset: '(2)⬜', present: '(2)✔️' }
        );

        listItem.appendChild(togglePresent1);
        listItem.appendChild(togglePresent2);
        studentsList.appendChild(listItem);

        // Restore saved background color
        const savedColor = getSavedColor(selectedClass, student.rollNumber);
        if (savedColor) listItem.style.backgroundColor = savedColor;
    });

    // Show summary or results
    const resultSection = document.getElementById('resultSection');
    if (resultSection.style.display === 'block') {
        showAttendanceResult(selectedClass);
    } else {
        showSummary(selectedClass);
    }
}

function markAttendance(statusType, statusValue, listItem, selectedClass) {
    const rollNumber = listItem.getAttribute('data-roll-number');

    // Update UI
    listItem.style.backgroundColor = getStatusColor(statusValue);

    // Save color
    saveColor(selectedClass, rollNumber, getStatusColor(statusValue));

    // Save attendance
    updateAttendanceRecord(rollNumber, selectedClass, statusType, statusValue);

    // Refresh summary
    showSummary(selectedClass);
}

function getStatusColor(status) {
    switch (status) {
        case 'present': return '#2ecc71';
        case 'absent': return '#e74c3c';
        case 'reset': return '';
        default: return '';
    }
}

function updateAttendanceRecord(rollNumber, selectedClass, statusType, statusValue) {
    const attendance = JSON.parse(localStorage.getItem('attendanceData')) || {};

    if (!attendance[selectedClass]) attendance[selectedClass] = {};
    if (!attendance[selectedClass][rollNumber]) attendance[selectedClass][rollNumber] = { status1: 'reset', status2: 'reset' };

    attendance[selectedClass][rollNumber][statusType] = statusValue;

    localStorage.setItem('attendanceData', JSON.stringify(attendance));
}

function getSavedAttendance(className, rollNumber, statusType) {
    const attendance = JSON.parse(localStorage.getItem('attendanceData')) || {};
    return attendance?.[className]?.[rollNumber]?.[statusType] || 'reset';
}


function showSummary(selectedClass) {
    const savedAttendanceData =
        JSON.parse(localStorage.getItem('attendanceData')) || [];

    const filteredAttendanceData = savedAttendanceData.filter(
        record => record.class === selectedClass
    );

    const totalStudents = filteredAttendanceData.length;

    // STATUS 1
    const presentStatus1 = filteredAttendanceData.filter(
        record => record.status1 === 'present'
    ).length;

    const absentStatus1 = filteredAttendanceData.filter(
        record => record.status1 === 'reset'
    ).length;

    // STATUS 2
    const presentStatus2 = filteredAttendanceData.filter(
        record => record.status2 === 'present'
    ).length;

    const absentStatus2 = filteredAttendanceData.filter(
        record => record.status2 === 'reset'
    ).length;

    // Update UI only if elements exist
    const totalStudentsEl = document.getElementById('totalStudents');
    if (totalStudentsEl) totalStudentsEl.innerText = totalStudents;

    const totalPresent1El = document.getElementById('totalPresent1');
    if (totalPresent1El) totalPresent1El.innerText = presentStatus1;

    const totalAbsent1El = document.getElementById('totalAbsent1');
    if (totalAbsent1El) totalAbsent1El.innerText = absentStatus1;

    const totalPresent2El = document.getElementById('totalPresent2');
    if (totalPresent2El) totalPresent2El.innerText = presentStatus2;

    const totalAbsent2El = document.getElementById('totalAbsent2');
    if (totalAbsent2El) totalAbsent2El.innerText = absentStatus2;
}


function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).
        padStart(2, '0');
    const day = String(now.getDate()).
        padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function saveClasses() {
    // Save classes to local storage
    const classSelector = document.
        getElementById('classSelector');
    const savedClasses = Array.from(classSelector.options).
        map(option => option.value);
    localStorage.setItem('classes', 
        JSON.stringify(savedClasses));
}

function saveStudentsList(selectedClass) {
    // Save the updated student list to local storage
    const studentsList = document.
        getElementById('studentsList');
    const savedStudents = JSON.parse
        (localStorage.getItem('students')) || {};
    const selectedClassStudents = Array.from(studentsList.children).
    map(item => {
        return {
            name: item.querySelector('strong').innerText,
            rollNumber: item.getAttribute('data-roll-number')
        };
    });

    savedStudents[selectedClass] = selectedClassStudents;
    localStorage.setItem
        ('students', JSON.stringify(savedStudents));
}

function saveColor(selectedClass, rollNumber, color) {
    const savedColors = JSON.parse
    (localStorage.getItem('colors')) || {};
    if (!savedColors[selectedClass]) {
        savedColors[selectedClass] = {};
    }
    savedColors[selectedClass][rollNumber] = color;
    localStorage.setItem('colors', 
        JSON.stringify(savedColors));
}

function getSavedColor(selectedClass, rollNumber) {
    const savedColors = JSON.parse
        (localStorage.getItem('colors')) || {};
    return savedColors[selectedClass] ? 
        savedColors[selectedClass][rollNumber] : null;
}

function cleanSelectedClass()
    {
    const reCheck = prompt('！！！請輸入"YES"來確認刪除目前的日期出席記錄，確認後"無法回復"！！！');
    //console.log(reCheck); 
    if (reCheck === 'YES') {
  // Perform actions for cancellation, e.g., stop further processing

    const classSelector = 
        document.getElementById('classSelector');
	const selectedClass = classSelector.
        options[classSelector.selectedIndex].value;
        //console.log(selectedClass);
    //delete the studentlist from the selectedClass
    const savedStudents = JSON.parse
            (localStorage.getItem('students'));

    delete savedStudents[selectedClass];
    //console.log(savedStudents);
    localStorage.setItem
            ('students', JSON.stringify(savedStudents));

    // delete selectedClass
    let localClass = JSON.parse
            (localStorage.getItem('classes'));

    index = localClass.findIndex(delClass => delClass === selectedClass);
    localClass.splice(index, 1);
    //console.log(localClass);
    localStorage.setItem
            ('classes', JSON.stringify(localClass));

    // delete selectedClass attendance rate history
    const newatt = JSON.parse
            (localStorage.getItem('attHis'));
    indexToDel = newatt.findIndex((obj) => selectedClass in obj );
    newatt.splice(indexToDel, 1);
    localStorage.setItem('attHis', 
          JSON.stringify(newatt));
    alert(`${selectedClass}已刪除！`);
    //refresh
    location.reload();
	//localStorage.clear();
    } else {
    alert("輸入錯誤，無法刪除！");
    }

}

function getFormattedDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      //const seconds = String(now.getSeconds()).padStart(2, '0');

      // Example format: YYYY-MM-DD_HH-MM-SS
      return `${year}-${month}-${day}-${hours}-${minutes}`;
    }

function exportLocalStorage() {
  // 1. Get all localStorage data
    const localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        localStorageData[key] = localStorage.getItem(key);
    }

    // 2. Convert to a JSON string
    const jsonString = JSON.stringify(localStorageData, null, 4);

    // 3. Create a Blob and URL
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // 4. Create and click a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    const dateTimeString = getFormattedDateTime();
    console.log(dateTimeString);
    const filename = `data_${dateTimeString}.json`;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  
  alert(`暫存成功 ${filename}`);
}

function rlsFromFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.clear(); // Clear existing localStorage before restoring
            for (const key in data) {
                localStorage.setItem(key, data[key]);
            }
            console.log('localStorage restored successfully!');
            alert('成功讀回出席紀錄!');
            location.reload();
        } catch (error) {
            console.error('Error parsing or restoring localStorage:', error);
        }
    };
    reader.readAsText(file);
    closePopup();
}

function highlightSearchTerm(searchTerm, targetElementId) {
        const targetElement = document.getElementById(targetElementId);
        if (!targetElement) return;

        const originalText = targetElement.innerHTML;
        const regex = new RegExp(`(${searchTerm})`, 'ig'); // 'ig' for case-insensitive and global search
        // Remove previous highlights to avoid nesting
        let cleanedText = originalText.replace(/<\/?mark>/g, ''); 
        
        const highlightedText = cleanedText.replace(regex, `<mark class='highlight'>$1</mark>`);
        //console.log(highlightedText);
        targetElement.innerHTML = highlightedText;

        // Apply CSS for highlighting
        //const style = document.createElement('style');
        //style.innerHTML = `.highlight { background-color: yellow; }`;
        //document.head.appendChild(style);
    }

function scrollToHighlightedTerm() {
        const firstHighlight = document.querySelector('.highlight');
        if (firstHighlight) {
            firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

async function searchAndHighlight() {
            const searchTerm = document.getElementById("searchTermInput").value;
            highlightSearchTerm(searchTerm, 'studentsList');
            scrollToHighlightedTerm();
            await sleep(2000);
            location.reload();
    }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// for Google Output to drive


// ===== Google config =====
const CLIENT_ID =
  "273160542369-ttt03gmv0iio70vek53dqrqcfs9rt1a6.apps.googleusercontent.com";

const API_KEY =
  "AIzaSyDZkfoh01VUEwX_uK3xn3jVvMLssdPCqoo";

const SCOPES = "https://www.googleapis.com/auth/drive.file";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";

// ===== State =====
let tokenClient;
let gapiInited = false;
let gisInited = false;
initGoogleDriveAuth();

function initGoogleDriveAuth() {
  if (!window.gapi || !window.google?.accounts) {
    setTimeout(initGoogleDriveAuth, 100);
    return;
  }

  const authBtn = document.getElementById("authorize_button");
  if (authBtn) {
    authBtn.onclick = handleAuthClick;
  }

  gapi.load("client", async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  });

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later"",
  });

  gisInited = true;
  maybeEnableButtons();
}
document.getElementById("authorize_button")
  .addEventListener("click", function () {
    this.classList.toggle("clicked");
  });
//make button dimmed or blink after clicked
/*document
  .getElementById("authorize_button")
  .addEventListener("click", function () {
    this.classList.add("dimmed");
  });
document.getElementById("upload_button").addEventListener("click", function () {
  this.classList.add("blink");
});

document.getElementById("googleIn").addEventListener("click", function () {
  this.classList.add("blink");
});

document.getElementById("update_button").addEventListener("click", function () {
  this.classList.add("blink");
});*/

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").disabled = false;
  }
}

function handleAuthClick() {
    tokenClient.requestAccessToken({ prompt: "consent" });
    }

    // Try silent auth once user interacts
    document.addEventListener("click", () => {
    tokenClient.requestAccessToken({ prompt: "" });
    }, { once: true });

// Fallback button
document.getElementById("authorize_button").onclick = handleAuthClick;

//declaire fileId to set in upload and use in googleIn

async function uploadToDrive() {
  // Example: get all localStorage data
  const allData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    allData[key] = localStorage.getItem(key);
  }

  const fileContent = JSON.stringify(allData, null, 2);
  const file = new Blob([fileContent], { type: "application/json" });
  const metadata = {
    name: "roster.json",
    mimeType: "application/json",
  };

  const accessToken = gapi.client.getToken().access_token;
  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", file);

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
    {
      method: "POST",
      headers: new Headers({ Authorization: "Bearer " + accessToken }),
      body: form,
    }
  );

  const json = await res.json();
  document.getElementById("pfileId").innerText = json.id;
  alert("✅ 已完成上傳: File ID: " + json.id);
  return;
}


async function googleIn() {
  const accessToken = gapi.client.getToken()?.access_token;
  console.log(accessToken);

  if (!accessToken) {
    alert("❌ 尚未取得授權，請先登入認證");
    return;
  }

  if (typeof fileId === "undefined") {
    fileId = document.getElementById("pfileId").innerText;
  }

  const fetchUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // SAFER for Drive files
    const text = await response.text();
    const fileContent = JSON.parse(text);

    localStorage.clear();
    for (const key in fileContent) {
      localStorage.setItem(key, fileContent[key]);
    }

    alert("成功讀回紀錄!");
    setTimeout(() => location.reload(), 300);

  } catch (error) {
    console.error("Failed to read file:", error);
    alert("❌ 讀取失敗，請確認登入認證？");
  }
}


// Assuming you have authenticated and obtained an access token
// and the gapi client library is loaded.

async function overwriteFile() {
  try {
    const accessToken = gapi.client.getToken()?.access_token;
    if (!accessToken) {
      alert("❌ 尚未登入 Google, 請先認證");
      return;
    }

    // Collect localStorage
    const localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      localStorageData[key] = localStorage.getItem(key);
    }

    const jsonString = JSON.stringify(localStorageData, null, 2);
    const fileId = document.getElementById("pfileId").innerText.trim();

    const url =
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: jsonString,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Google Drive may return EMPTY BODY — don't force JSON
    const resultText = await response.text();
    console.log("Drive response:", resultText || "(empty)");

    alert("✅ 成功更新 Google roster.json");

  } catch (err) {
    console.error("Update failed:", err);
    alert("❌ 更新失敗，請確認登入認證？");
  }
}