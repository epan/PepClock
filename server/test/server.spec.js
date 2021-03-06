'use strict';
const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js');
const dbUtils = require('../../db/lib/utils.js');

describe('Unauthorized Routes', function() {
  it('redirects to login if not authed', function(done) {
    request(app)
      .get('/dashboard')
      .expect(302)
      .expect(function(res) {
        expect(res.header.location).to.equal('/login');
      })
      .end(done); 
  });

  it('serves / without auth', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .expect(function(res) {
        expect(res.text).to.include('<script src="/dist/bundle.js"></script>');        
      })
      .end(done);
  });

  it('serves /redirected without auth', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .expect(function(res) {
        expect(res.text).to.include('<script src="/dist/bundle.js"></script>');        
      })
      .end(done);
  });

  it('redirects to login if not authed and get /dashboard', function(done) {
    request(app)
      .get('/dashboard')
      .expect(302)
      .expect(function(res) {
        expect(res.header.location).to.equal('/login');
      })
      .end(done); 
  });

  it('redirects to login if not authed and get /edit', function(done) {
    request(app)
      .get('/edit/1')
      .expect(302)
      .expect(function(res) {
        expect(res.header.location).to.equal('/login');
      })
      .end(done); 
  });

  it('redirects to login if not authed and get /events', function(done) {
    request(app)
      .get('/events/1')
      .expect(302)
      .expect(function(res) {
        expect(res.header.location).to.equal('/login');
      })
      .end(done); 
  });

  it('redirects to login if not authed and get /dashboard', function(done) {
    request(app)
      .get('/dashboard')
      .expect(302)
      .expect(function(res) {
        expect(res.header.location).to.equal('/login');
      })
      .end(done); 
  });
});

describe('Authorized Routes', function () {
  beforeEach(function (done) {
    dbUtils.rollbackMigrate(done);
  });

  afterEach(function (done) {
    dbUtils.rollback(done);
  });

  const agent = request.agent(app);

  it('should redirect to /noTwoFA after auth', function(done) {
    agent
      .post('/login')
      .send({email: 'admin@domain.com', password: 'admin123'})
      .expect((res) => {
        expect(200);
        expect(res.header.location).to.equal('/noTwoFA');
      })
      .end(done);
  });

  it('should render /create if authed', function(done) {
    agent
      .get('/create')
      .expect(200)
      .expect(function(res) {
        expect(res.text).to.include('<script src="/dist/bundle.js"></script>');        
      })
      .end(done);
  });

  it('should render /dashbooard if authed', function(done) {
    agent
      .get('/dashboard')
      .expect(200)
      .expect(function(res) {
        expect(res.text).to.include('<script src="/dist/bundle.js"></script>');        
      })
      .end(done);
  });

  it('should render /edit if authed', function(done) {
    agent
      .get('/edit/1')
      .expect(200)
      .expect(function(res) {
        expect(res.text).to.include('<script src="/dist/bundle.js"></script>');        
      })
      .end(done);
  });

  it('should render /events if authed', function(done) {
    agent
      .get('/events/1')
      .expect(200)
      .expect(function(res) {
        expect(res.text).to.include('<script src="/dist/bundle.js"></script>');        
      })
      .end(done);
  });
});
