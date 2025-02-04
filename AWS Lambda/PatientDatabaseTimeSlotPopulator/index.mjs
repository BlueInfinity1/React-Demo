import mysql from 'mysql2/promise';

const DB_CONFIG = {
  host: 'patients-database-instance-1.cha680k884mq.us-east-1.rds.amazonaws.com', // Not the real host
  user: 'admin',
  password: 'LwWtkzuBVhyqsQ9wu7A1', // Not the real password
  database: 'patients_database'
};

exports.handler = async (event) => {
    const connection = await mysql.createConnection(DB_CONFIG);

    try {
        // Get the date 9 days in the future
        let futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);

        // Skip if it's a weekend (Saturday = 6, Sunday = 0)
        const dayOfWeek = futureDate.getDay();
        if (dayOfWeek === 6 || dayOfWeek === 0) {
            console.log(`Skipping ${futureDate.toISOString().split("T")[0]} (Weekend)`);
            return { statusCode: 200, body: "Skipped weekend" };
        }

        const dateString = futureDate.toISOString().split("T")[0];

        // Fetch all doctor IDs
        const [doctors] = await connection.execute("SELECT id FROM doctors");

        for (let doctor of doctors) {
            let time = new Date(`${dateString}T09:00:00`);

            while (time.getHours() < 17) {
                if (!(time.getHours() === 12 && time.getMinutes() === 0)) { // Skip lunch break
                    const startTime = time.toISOString().slice(0, 19).replace("T", " ");
                    time.setMinutes(time.getMinutes() + 30);
                    const endTime = time.toISOString().slice(0, 19).replace("T", " ");

                    await connection.execute(
                        "INSERT IGNORE INTO time_slots (doctor_id, start_time, end_time) VALUES (?, ?, ?)",
                        [doctor.id, startTime, endTime]
                    );
                } else {
                    time.setMinutes(time.getMinutes() + 30); // Skip lunch break (12:00 - 12:30)
                }
            }
        }

        return { statusCode: 200, body: "Time slots generated successfully" };
    } catch (error) {
        console.error("Error generating time slots:", error);
        return { statusCode: 500, body: "Error generating time slots" };
    } finally {
        await connection.end();
    }
};
