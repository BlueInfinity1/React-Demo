import mysql from 'mysql2/promise';

export const handler = async (event) => {
    console.log("Received appointment request:", event.body);

    let requestData;
    try {
        requestData = JSON.parse(event.body);
    } catch (error) {
        console.error("Invalid JSON input:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid JSON format" })
        };
    }

    const { patient_id, doctor_id, start_time } = requestData;

    if (!patient_id || !doctor_id || !start_time) {
        console.error("Missing required parameters");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing required parameters: patient_id, doctor_id, start_time" })
        };
    }

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        // Check if the time slot is available in `time_slots`
        console.log("Checking if the time slot is available...");
        const [availableSlots] = await connection.execute(
            `SELECT * FROM time_slots WHERE doctor_id = ? AND start_time = ? AND patient_id IS NULL`,
            [doctor_id, start_time]
        );

        if (availableSlots.length === 0) {
            console.warn("Requested time slot is already booked.");
            return {
                statusCode: 409, // Conflict
                body: JSON.stringify({ error: "Requested time slot is already booked" })
            };
        }

        // Mark the time slot as booked in `time_slots`
        console.log("Booking the time slot...");
        await connection.execute(
            `UPDATE time_slots SET patient_id = ? WHERE doctor_id = ? AND start_time = ?`,
            [patient_id, doctor_id, start_time]
        );

        // Insert appointment record into `appointments`
        console.log("Inserting appointment into appointments table...");
        await connection.execute(
            `INSERT INTO appointments (doctor_id, patient_id, start_time, created_at) 
             VALUES (?, ?, ?, NOW())`,
            [doctor_id, patient_id, start_time]
        );

        await connection.end();

        console.log("Appointment successfully booked.");

        return {
            statusCode: 201, // Created
            body: JSON.stringify({
                message: "Appointment booked successfully",
                doctor_id,
                patient_id,
                start_time
            })
        };

    } catch (error) {
        console.error("Database Query Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
