import mysql from 'mysql2/promise';

export const handler = async (event) => {
    console.log("Fetching all doctors and patients...");

    // Database connection
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        // Fetch all doctors
        console.log("Querying doctors...");
        const [doctors] = await connection.execute(`
            SELECT id, name, specialty, location 
            FROM doctors
        `);
        
        // Fetch all patients
        console.log("Querying patients...");
        const [patients] = await connection.execute(`
            SELECT id, name, age, gender, has_insurance 
            FROM patients
        `);

        await connection.end();
        
        console.log(`Fetched ${doctors.length} doctors and ${patients.length} patients.`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                doctors,
                patients
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
