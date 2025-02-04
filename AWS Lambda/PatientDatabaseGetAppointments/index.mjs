import mysql from 'mysql2/promise';

export const handler = async (event) => {
    console.log("Received time slots request:", event.queryStringParameters);

    // Extract query parameters
    const params = event.queryStringParameters || {};
    const doctor_id = params.doctor_id;
    const date = params.date || new Date().toISOString().split('T')[0]; // Default to today

    if (!doctor_id) {
        console.error("Missing required parameter: doctor_id");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing required parameter: doctor_id" })
        };
    }

    const connection = await mysql.createConnection({
        host: 'patients-database-instance-1.cha680k884mq.us-east-1.rds.amazonaws.com', // Replace with actual host
        user: 'admin',
        password: 'LwWtkzuBVhyqsQ9wu7A1', // Replace with actual password
        database: 'patients_database'
    });

    try {
        console.log(`Fetching time slots for doctor ${doctor_id} on ${date}...`);

        const [timeSlots] = await connection.execute(
            `SELECT start_time, end_time, patient_id 
             FROM time_slots 
             WHERE doctor_id = ? 
             AND DATE(start_time) = ?
             ORDER BY start_time ASC`,
            [doctor_id, date]
        );

        await connection.end();

        console.log(`Fetched ${timeSlots.length} time slots.`);

        // Convert data to expected format
        const response = timeSlots.map(slot => ({
            start_time: slot.start_time,
            end_time: slot.end_time, // End time is not absolutely necessary since all slots are 30 mins
            occupied: slot.patient_id !== null // True if booked, False if available
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error("Database Query Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
