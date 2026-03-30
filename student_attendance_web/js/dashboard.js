// js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // Set default dates on load
    document.getElementById('attendanceDate').valueAsDate = new Date();
    document.getElementById('reportDate').valueAsDate = new Date();

    // --- 1. Register Student Logic ---
    const registerStudentForm = document.getElementById('registerStudentForm');
    
    registerStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            student_id: document.getElementById('newStudentId').value,
            full_name: document.getElementById('newStudentName').value,
            section: document.getElementById('newStudentSection').value
        };

        try {
            const response = await fetch('api/add_student.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            const regMessage = document.getElementById('regMessage');
            
            // Use Bootstrap text colors for feedback
            regMessage.className = result.success ? "mt-3 text-center fw-bold text-success" : "mt-3 text-center fw-bold text-danger";
            regMessage.textContent = result.message;
            
            if(result.success) {
                registerStudentForm.reset();
            }
        } catch (error) {
            console.error("Error registering student:", error);
        }
    });

    // --- 2. Load Students Grid Logic ---
    let currentLoadedStudents = [];
    const loadStudentsBtn = document.getElementById('loadStudentsBtn');
    
    loadStudentsBtn.addEventListener('click', async () => {
        const section = document.getElementById('searchSection').value;
        if (!section) return alert("Please enter a section to load.");

        try {
            const response = await fetch(`api/get_students.php?section=${encodeURIComponent(section)}`);
            const result = await response.json();
            
            const tbody = document.getElementById('studentGridBody');
            tbody.innerHTML = ""; 
            currentLoadedStudents = result.data || [];

            if (currentLoadedStudents.length === 0) {
                tbody.innerHTML = `<tr><td colspan='5' class="text-muted-custom py-4">No students found for this section.</td></tr>`;
                document.getElementById('saveAttendanceBtn').style.display = "none";
                return;
            }

            // Generate rows with your standardized UI classes
            currentLoadedStudents.forEach(student => {
                tbody.innerHTML += `
                    <tr>
                        <td class="text-start font-monospace text-faint-custom">${student.student_id}</td>
                        <td class="text-start fw-bold">${student.full_name}</td>
                        <td>
                            <div class="form-check d-flex justify-content-center m-0">
                                <input class="form-check-input custom-checkbox" type="radio" name="status_${student.student_id}" value="Present" checked>
                            </div>
                        </td>
                        <td>
                            <div class="form-check d-flex justify-content-center m-0">
                                <input class="form-check-input custom-checkbox" type="radio" name="status_${student.student_id}" value="Absent">
                            </div>
                        </td>
                        <td>
                            <div class="form-check d-flex justify-content-center m-0">
                                <input class="form-check-input custom-checkbox" type="radio" name="status_${student.student_id}" value="Late">
                            </div>
                        </td>
                    </tr>
                `;
            });
            
            document.getElementById('saveAttendanceBtn').style.display = "block";
            document.getElementById('attMessage').textContent = "";
        } catch (error) {
            console.error("Error loading class:", error);
        }
    });

    // --- 3. Save Attendance Logic ---
    const attendanceForm = document.getElementById('attendanceForm');
    
    attendanceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const date = document.getElementById('attendanceDate').value;
        
        // Map the selected radio buttons to our record array
        const records = currentLoadedStudents.map(student => ({
            student_id: student.student_id,
            date: date,
            status: document.querySelector(`input[name="status_${student.student_id}"]:checked`).value
        }));

        try {
            const response = await fetch('api/save_attendance.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(records)
            });
            const result = await response.json();
            
            const attMessage = document.getElementById('attMessage');
            attMessage.className = result.success ? "fw-bold fs-5 text-success" : "fw-bold fs-5 text-danger";
            attMessage.textContent = result.message;
        } catch (error) {
            console.error("Error saving attendance:", error);
        }
    });

    // --- 4. Generate Report Logic (Direct CSV Download) ---
    const reportForm = document.getElementById('reportForm');
    
    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const date = document.getElementById('reportDate').value;
        const section = document.getElementById('reportSection').value;
        
        const msg = document.getElementById('reportMessage');
        msg.className = "mt-3 text-center fw-bold text-muted-custom";
        msg.textContent = "Generating...";

        try {
            const response = await fetch(`api/export_report.php?date=${date}&section=${encodeURIComponent(section)}`);
            const result = await response.json();
            
            if (result.success) {
                msg.textContent = "Downloaded successfully!";
                msg.className = "mt-3 text-center fw-bold text-success";
                
                // Trigger the browser's native download behavior for the CSV string
                const blob = new Blob([result.csv_data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Attendance_${section}_${date}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                msg.textContent = result.message;
                msg.className = "mt-3 text-center fw-bold text-danger";
            }
        } catch (error) {
            msg.textContent = "Server error generating report.";
            msg.className = "mt-3 text-center fw-bold text-danger";
            console.error("Error generating report:", error);
        }
    });
});