'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
  const  definition ={
        openapi:'3.0.0',
        info: {
            title: "Ride CRUD API",
            description: "Rider information",
           

        },
        servers: [
            {
              url: 'http://localhost:3000',
              description: 'Development server',
            },
          ],
    }
const option={
    definition,
    apis:['./src/app.js']
}

const swaggerDocs = swaggerJsDoc(option);

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocs))
module.exports = (db) => {
    

    app.get('/health', (req, res) => res.send('Healthy'));
    /**
 * @swagger
 * /rides:
 *   post:
 *     summary: Create a JSONPlaceholder rides.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               riderID:
 *                 type: integer
 *                 description: Unique id of a rider
 *                 example: 1
 *               start_lat:
 *                 type: float
 *                 description: pickup location latitude attribute
 *                 example: 782.6
 *               end_lat:
 *                 type: float
 *                 description: dropoff location latitude attribute
 *                 example: 444.32
 *               start_long:
 *                 type: float
 *                 description: pickup location longitude attribute
 *                 example: 334.6
 *               end_long:
 *                 type: float
 *                 description: dropoff location longitude attribute
 *                 example: 545.334
 *               rider_name:
 *                 type: string
 *                 description: Name of riderName
 *                 example: ali
 *               driver_vehicle:
 *                 type: string
 *                 description: vehicle Name
 *                 example: toyota
 *     responses:
 *       200:
 *         description: list of rides.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   riderID:
 *                     type: integer
 *                     description: Unique id of a rider
 *                     example: 1
 *                   startLat:
 *                     type: float
 *                     description: pickup location latitude attribute
 *                     example: 782.6
 *                   endLat:
 *                     type: float
 *                     description: dropoff location latitude attribute
 *                     example: 444.3
 *                   startLong:
 *                     type: float
 *                     description: pickup location longitude attribute
 *                     example: 232.54
 *                   endLong:
 *                     type: float
 *                     description: dropoff location latitude attribute
 *                     example: 444.43
 *                   driverName:
 *                     type: string
 *                     description: Name of a driver
 *                     example:  umer
 *                   riderName:
 *                     type: string
 *                     description: Name of riderName
 *                     example: ali
 *                   driverVehicle:
 *                     type: string
 *                     description: vehicle Name
 *                     example: toyota
 *                   created:
 *                     type: string
 *                     description: date of a ride
 *                     example: 2022-02-26 11:12:58  
*/


    app.post('/rides', jsonParser, (req, res) => {
        const startLatitude = Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName = req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];
        
        const result = db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {

                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }

                res.send(rows);
            });
        });
    });

    /**
 * @swagger
 * /rides:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users.
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of rides.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   riderID:
 *                     type: integer
 *                     description: Unique id of a rider
 *                     example: 1
 *                   startLat:
 *                     type: float
 *                     description: pickup location latitude attribute
 *                     example: 782.6
 *                   endLat:
 *                     type: float
 *                     description: dropoff location latitude attribute
 *                     example: 444.3
 *                   startLong:
 *                     type: float
 *                     description: pickup location longitude attribute
 *                     example: 232.54
 *                   endLong:
 *                     type: float
 *                     description: dropoff location latitude attribute
 *                     example: 444.43
 *                   driverName:
 *                     type: string
 *                     description: Name of a driver
 *                     example:  umer
 *                   riderName:
 *                     type: string
 *                     description: Name of riderName
 *                     example: ali
 *                   driverVehicle:
 *                     type: string
 *                     description: vehicle Name
 *                     example: toyota
 *                   created:
 *                     type: string
 *                     description: date of a ride
 *                     example: 2022-02-26 11:12:58  
 */
    app.get('/rides', (req, res) => {
        db.all('SELECT * FROM Rides', function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });


        /**
 * @swagger
 * /rides/:id:
 *   get:
 *     summary: Retrieve a list of rides.
 *     description: Retrieve ride details by by rideId.
 *     responses:
 *       200:
 *         description: Ride details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   riderID:
 *                     type: integer
 *                     description: Unique id of a rider
 *                     example: 1
 *                   startLat:
 *                     type: float
 *                     description: pickup location latitude attribute
 *                     example: 782.6
 *                   endLat:
 *                     type: float
 *                     description: dropoff location latitude attribute
 *                     example: 444.3
 *                   startLong:
 *                     type: float
 *                     description: pickup location longitude attribute
 *                     example: 232.54
 *                   endLong:
 *                     type: float
 *                     description: dropoff location latitude attribute
 *                     example: 444.43
 *                   driverName:
 *                     type: string
 *                     description: Name of a driver
 *                     example:  umer
 *                   riderName:
 *                     type: string
 *                     description: Name of riderName
 *                     example: ali
 *                   driverVehicle:
 *                     type: string
 *                     description: vehicle Name
 *                     example: toyota
 *                   created:
 *                     type: string
 *                     description: date of a ride
 *                     example: 2022-02-26 11:12:58  
 */
    app.get('/rides/:id', (req, res) => {
        db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });

    return app;
};
