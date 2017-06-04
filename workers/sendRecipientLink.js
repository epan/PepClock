const models = require('../db/models');
const email = require('./utils/email');

class sendRecipientLink {
  constructor() {
    this.event = null;
  }

  work (cb) {
    this.getEventsToDeliver((err, data) => {
      if (err) {
        cb(err);
      } else {
        this.sendRecipientEmail(data, (err, data) => {
          if (err) {
            cb(err);
          } else {
            this.updateEventStatus('sent', (err, data) => {
              cb(err, data);
            });
          }
        });
      }
    });
  }

  getEventsToDeliver (cb) {
    models.Event
    .where('delivery_time', '<', 'now()')
    .where({status: 'not sent'})
    .fetch({withRelated: ['recipient']})
        .then(model => {
          if (model) {
            this.event = model;
            const result = {
              eventId: model.attributes.id,
              firstName: model.relations.recipient.attributes.first_name,
              lastName: model.relations.recipient.attributes.last_name,
              email: model.relations.recipient.attributes.email
            };
            cb(null, result);
          } else {
            cb('No events to send', null);
          }
        });
  }

  sendRecipientEmail (recipient, cb) {
    const link = `http://localhost:3000/events/${recipient.eventId}`;
    email.sendToRecipient(link, recipient.email, cb);
  }

  updateEventStatus (status, cb) {
    this.event.save({status: status}, {method: 'update'})
      .then(response => cb(null, response))
      .catch(err => cb(err, null));
  }

}

const worker = new sendRecipientLink();

worker.work((err, message) => {
  if (err) {
    console.log(err);
  } else {
    console.log(message);
  }
});
