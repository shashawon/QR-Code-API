// ============================================
// FAKE DATABASE
// ============================================

let fake_db = [];


// Stores the current QR image URL

let currentQR = "";



// ============================================
// GENERATE QR CODE
// ============================================

function generateQR() {

    // Get student information

    let studentId =
        document.getElementById("studentId").value.trim();

    let studentName =
        document.getElementById("studentName").value.trim();

    let course =
        document.getElementById("course").value.trim();


    // Check if fields are empty

    if (
        studentId === "" ||
        studentName === "" ||
        course === ""
    ) {

        alert(
            "Please complete all student information."
        );

        return;
    }


    // Get current date and time

    let now = new Date();

    let date =
        now.toLocaleDateString();

    let time =
        now.toLocaleTimeString();


    // ========================================
    // CREATE QR DATA
    // ========================================

    let attendanceData =
        "Student ID: " + studentId +
        "\nName: " + studentName +
        "\nCourse: " + course +
        "\nDate: " + date +
        "\nTime: " + time;


    // Encode information for QuickChart

    let encodedData =
        encodeURIComponent(attendanceData);


    // ========================================
    // QUICKCHART QR CODE API
    // ========================================

    currentQR =
        "https://quickchart.io/qr?text="
        + encodedData
        + "&size=250";


    // ========================================
    // DISPLAY QR CODE
    // ========================================

    document.getElementById("qrCode").innerHTML =

        "<h3>Generated Attendance QR</h3>" +

        "<img id='qrImage' " +
        "src='" + currentQR + "' " +
        "alt='Attendance QR Code'>" +

        "<p>Scan this QR code for attendance.</p>";


    // Show Save button

    document.getElementById("saveQR").style.display =
        "inline-block";


    /*
        IMPORTANT:

        The student is NOT added to fake_db here.

        The student will only be added
        after the QR code is successfully scanned.
    */

}



// ============================================
// SAVE QR CODE IMAGE
// ============================================

function saveQRCode() {

    if (currentQR === "") {

        alert(
            "Please generate a QR code first."
        );

        return;
    }


    let link =
        document.createElement("a");


    link.href = currentQR;

    link.download =
        "student-attendance-qr.png";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}



// ============================================
// START QR SCANNER
// ============================================

function startScanner() {

    let scanner =
        new Html5Qrcode("reader");


    scanner.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,

            qrbox: {
                width: 250,
                height: 250
            }

        },


        // ====================================
        // SUCCESSFULLY SCANNED
        // ====================================

        function(decodedText) {

            console.log(
                "QR Code Data:",
                decodedText
            );


            // =================================
            // DISPLAY SCANNED INFORMATION
            // =================================

            document.getElementById(
                "scannedResult"
            ).innerHTML =

                "<h3>Attendance Recorded!</h3>" +

                "<pre>" +
                decodedText +
                "</pre>";


            // =================================
            // GET DATA FROM QR CODE
            // =================================

            let lines =
                decodedText.split("\n");


            // Make sure the QR contains
            // the expected information

            if (lines.length < 5) {

                alert(
                    "Invalid attendance QR code."
                );

                scanner.stop();

                return;
            }


            let studentId =
                lines[0]
                .replace("Student ID: ", "");

            let studentName =
                lines[1]
                .replace("Name: ", "");

            let course =
                lines[2]
                .replace("Course: ", "");

            let date =
                lines[3]
                .replace("Date: ", "");

            let time =
                lines[4]
                .replace("Time: ", "");


            // =================================
            // CHECK FOR DUPLICATE ATTENDANCE
            // =================================

            let alreadyRecorded =
                fake_db.some(function(student) {

                    return (
                        student.student_id === studentId &&
                        student.date === date
                    );

                });


            if (alreadyRecorded) {

                alert(
                    "This student is already marked present today."
                );

                scanner.stop();

                return;
            }


            // =================================
            // ADD TO FAKE DATABASE
            // =================================

            fake_db.push({

                student_id: studentId,

                name: studentName,

                course: course,

                date: date,

                time: time

            });


            // =================================
            // DISPLAY ATTENDANCE RECORD
            // =================================

            displayAttendance();


            // =================================
            // STOP SCANNER
            // =================================

            scanner.stop().then(function() {

                console.log(
                    "QR scanner stopped."
                );

            });

        },


        // ====================================
        // SCANNER IS STILL SEARCHING
        // ====================================

        function(errorMessage) {

            // Do nothing while searching

        }

    ).catch(function(error) {

        console.log(
            "Unable to start scanner:",
            error
        );

        alert(
            "Unable to access the camera. " +
            "Please allow camera permission."
        );

    });

}



// ============================================
// DISPLAY ATTENDANCE RECORDS
// ============================================

function displayAttendance() {

    let records =
        document.getElementById("records");


    // Clear existing table rows

    records.replaceChildren();


    // Add each attendance record

    fake_db.forEach(function(student, index) {


        let row =
            document.createElement("tr");


        // # column

        let numberCell =
            document.createElement("td");

        numberCell.textContent =
            index + 1;

        row.appendChild(numberCell);


        // Student ID

        let idCell =
            document.createElement("td");

        idCell.textContent =
            student.student_id;

        row.appendChild(idCell);


        // Student Name

        let nameCell =
            document.createElement("td");

        nameCell.textContent =
            student.name;

        row.appendChild(nameCell);


        // Course

        let courseCell =
            document.createElement("td");

        courseCell.textContent =
            student.course;

        row.appendChild(courseCell);


        // Date

        let dateCell =
            document.createElement("td");

        dateCell.textContent =
            student.date;

        row.appendChild(dateCell);


        // Time

        let timeCell =
            document.createElement("td");

        timeCell.textContent =
            student.time;

        row.appendChild(timeCell);


        // Status

        let statusCell =
            document.createElement("td");

        statusCell.textContent =
            "Present";

        statusCell.className =
            "status-present";

        row.appendChild(statusCell);


        // Add row to table

        records.appendChild(row);

    });

}