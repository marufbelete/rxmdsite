const axios = require('axios');

const zoomApiUrl = 'https://api.zoom.us/v2/users/me/meetings';
const zoomClientId = process.env.ZOOM_CLIENT_ID;
const zoomClientSecret = process.env.ZOOM_CLIENT_SECRET;
//   const zoomRedirectUri = 'https://yourapp.com/zoom/callback'; // Your app's OAuth redirect URI

async function generateZoomLink(appointmentDate) {
  const meetingData = {
    topic: 'Appointment with TestRxmd',
    type: 2, // Scheduled meeting
    start_time: appointmentDate,
    duration: 60, // Meeting duration in minutes
    timezone: 'America/New_York',
    settings: {
      join_before_host: true,
      waiting_room: true,
      approval_type: 2, // Automatically approve participants
      audio: 'voip',
      auto_recording: 'cloud'
    }
  };
  const accessToken = await getZoomAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
    const response = await axios.post(zoomApiUrl, meetingData, { headers });
    const joinUrl = response.data.join_url;
    return joinUrl;
}

async function getZoomAccessToken() {
  const zoomAuthUrl = 'https://zoom.us/oauth/token';
  const authData = {
    grant_type: 'client_credentials',
    client_id: zoomClientId,
    client_secret: zoomClientSecret
  };
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const params = new URLSearchParams(authData);

    const response = await axios.post(zoomAuthUrl, params, { headers });
    const accessToken = response.data.access_token;
    return accessToken;
}

module.exports={
    generateZoomLink
}