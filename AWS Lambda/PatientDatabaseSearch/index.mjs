import mysql from 'mysql2/promise';

export const handler = async (event) => {
    console.log("Received Query Params:", event.queryStringParameters);

    // This Lambda is specifically for this demo project, so we do not separate environments into dev, test, staging, or prod.

    // Connect to MySQL
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        // Extract query parameters
        const params = event.queryStringParameters || {};
        const table = params.table;

        console.log("Selected Table:", table);

        if (!table) {
            console.error("Missing 'table' parameter");
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing 'table' parameter" })
            };
        }

        let sql = "";
        let conditions = [];
        let values = [];

        // Patients Table Query
        if (table === "patients") {
            sql = "SELECT * FROM patients";
            console.log("Querying Patients Table");

            if (params.id) {
                conditions.push("id = ?");
                values.push(params.id);
            }
            if (params.name) {
                conditions.push("name LIKE ?");
                values.push(`%${params.name}%`);
            }
            if (params.age) {
                conditions.push("age = ?");
                values.push(params.age);
            }
            if (params.gender) {
                conditions.push("gender = ?");
                values.push(params.gender);
            }
            if (params.has_insurance) {
                conditions.push("has_insurance = ?");
                values.push(params.has_insurance.toLowerCase() === "true" ? 1 : 0);
            }
        }

        // Doctors Table Query
        else if (table === "doctors") {
            sql = "SELECT * FROM doctors";
            console.log("Querying Doctors Table");

            if (params.id) {
                conditions.push("id = ?");
                values.push(params.id);
            }
            if (params.name) {
                conditions.push("name LIKE ?");
                values.push(`%${params.name}%`);
            }
            if (params.specialty) {
                conditions.push("specialty LIKE ?");
                values.push(`%${params.specialty}%`);
            }
            if (params.location) {
                conditions.push("location LIKE ?");
                values.push(`%${params.location}%`);
            }
        }

        // Visits Table Query (More Complex Query with Joins)        
        else if (table === "visits") {
            sql = `
                SELECT 
                    visits.id AS visit_id,
                    patients.name AS patient_name,
                    patients.age AS patient_age,
                    patients.gender AS patient_gender,
                    doctors.name AS doctor_name,
                    doctors.specialty AS doctor_specialty,
                    visits.visit_date,
                    visits.reason,
                    visits.follow_up
                FROM visits
                JOIN patients ON visits.patient_id = patients.id
                JOIN doctors ON visits.doctor_id = doctors.id
            `;
        
            console.log("Querying Visits Table");
        
            if (params.specialty) { 
                conditions.push("doctors.specialty = ?");
                values.push(params.specialty);
            }
            if (params.start_date) {
                conditions.push("visits.visit_date >= ?");
                values.push(params.start_date);
            }
            if (params.end_date) {
                conditions.push("visits.visit_date <= ?");
                values.push(params.end_date);
            }
            if (params.follow_up) {
                conditions.push("visits.follow_up = ?");
                values.push(params.follow_up.toLowerCase() === "true" ? 1 : 0);
            }
        
        }
        
        else {
            console.error("Invalid 'table' parameter:", table);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid 'table' parameter. Use 'patients', 'doctors', or 'visits'." })
            };
        }

            // Append conditions only once
            if (conditions.length > 0) {
                sql += " WHERE " + conditions.join(" AND ");
            }
        
            console.log("Final SQL Query:", sql);
            console.log("Query Values:", values);

        // Execute the query
        const [rows] = await connection.execute(sql, values);
        await connection.end();

        console.log("Query Successful. Returning ", rows.length, " rows, results: ", rows);

        return {
            statusCode: 200,
            body: JSON.stringify(rows)
        };

    } catch (error) {
        console.error("Query Execution Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
