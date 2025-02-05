/* This SQL procedure is used to initially populate time slots for all the doctors in our database. Each doctor is assumed to be available from 9:00 to 17:00,
 * but we will ignore the lunch break (12:00 - 12:30) as well as the weekends (Saturday and Sunday) in the slot generation.
*/

DELIMITER //

CREATE PROCEDURE PopulateTimeSlots()
BEGIN
    DECLARE startDate DATE DEFAULT '2025-02-06';
    DECLARE endDate DATE DEFAULT '2025-02-13';
    DECLARE currentDate DATE DEFAULT '2025-02-06';
    DECLARE startTime TIME;
    DECLARE endTime TIME;
    DECLARE doctorId INT;
    DECLARE doctorCount INT;
    DECLARE doctorIndex INT;

    -- Get the total number of doctors
    SELECT COUNT(*) INTO doctorCount FROM doctors;

    WHILE currentDate <= endDate DO
        -- Only process weekdays (WEEKDAY returns 0=Monday ... 4=Friday)
        IF WEEKDAY(currentDate) < 5 THEN
            SET doctorIndex = 0;
            WHILE doctorIndex < doctorCount DO
                -- Retrieve the doctor ID using LIMIT to fetch one row at a time
                SELECT id INTO doctorId
                FROM doctors
                ORDER BY id
                LIMIT doctorIndex, 1;
                
                -- Set workday hours: from 9:00 AM to 5:00 PM
                SET startTime = '09:00:00';
                SET endTime = '17:00:00';
                
                -- Loop over the day in 30-minute intervals
                WHILE startTime < endTime DO
                    -- Skip the lunch break between 12:00 and 12:30
                    IF startTime < '12:00:00' OR startTime >= '12:30:00' THEN
                        INSERT IGNORE INTO time_slots (doctor_id, start_time, end_time)
                        VALUES (
                            doctorId, 
                            CONCAT(currentDate, ' ', startTime), 
                            ADDTIME(CONCAT(currentDate, ' ', startTime), '00:30:00')
                        );
                    END IF;
                    SET startTime = ADDTIME(startTime, '00:30:00');
                END WHILE;
                
                SET doctorIndex = doctorIndex + 1;
            END WHILE;
        END IF;
        SET currentDate = DATE_ADD(currentDate, INTERVAL 1 DAY);
    END WHILE;
END //

DELIMITER ;
