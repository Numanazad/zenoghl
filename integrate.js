const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const createAppointmentInZenoti = async (appointment) => {
  try {
    const response = await axios.post('dummy url for zenoti appointments', {
      location: appointment.location,
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      customer: appointment.customer,
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

app.post('/ghl-webhook', async (req, res) => {
  const appointment = req.body;
  
  try {
    await createAppointmentInZenoti(appointment);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const setGHLWebhook = async () => {
  try {
    const response = await axios.post('url for ghl webhooks', {
      url: 'url for server side ghl appointment notification',
      event: 'appointment_created',
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

setGHLWebhook();
