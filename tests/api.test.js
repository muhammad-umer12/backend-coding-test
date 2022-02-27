'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('GET /rides', () => {
    
        it('should return json list of rides', (done) => {
            const res = request(app)
            .get('/rides')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);  
                       
        });
    });
});

describe('GET /rides/:id', () => {
    
    it('should return json object of rides', (done) => {
        const res = request(app)
        .get('/rides/:id')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);  
                   
    });
});

describe('POST /rides', function() {
    it('should return json of rides', function(done) {
      request(app)
        .post('/rides')
        .send(
            {
                "start_lat":33,
                "start_long":33,
                "end_lat":55,
                "end_long":44,
                "rider_name":"umer",
                "driver_name":"ali",
                "driver_vehicle":"toyota"
            }
        )
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          return done();
        });
    });
  });