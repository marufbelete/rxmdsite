const axios = require('axios');

const zoomApiUrl = 'https://api.zoom.us/v2/users/me/meetings';
const zoomClientId = process.env.ZOOM_CLIENT_ID;
const zoomClientSecret = process.env.ZOOM_CLIENT_SECRET;

async function generateZoomLink(appointmentDate) {
  const meetingData = {
    topic: 'Appointment with TestRxmd',
    type: 2, // Scheduled meeting
    start_time: appointmentDate,
    duration: 60, // Meeting duration in minutes
    timezone: 'Etc/UTC',
    settings: {
      join_before_host: true,
      waiting_room: true,
      approval_type: 2, // Automatically approve participants
      audio: 'voip',
    }
  };
  const accessToken = await getZoomAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
    const response = await axios.post(zoomApiUrl, meetingData, { headers });
    const {start_url,join_url} = response.data;
    return {start_url,join_url};
}

async function getZoomAccessToken(req, res, next) {
  const zoomTokenUrl = 'https://zoom.us/oauth/token';
  const refreshToken = process.env.ZOOM_REFRESH_TOKEN;
  const authData = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: zoomClientId,
    client_secret: zoomClientSecret,
  };
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const params = new URLSearchParams(authData);
  const response = await axios.post(zoomTokenUrl, params, { headers });
  const accessToken = response.data.access_token;
  // Save the access token to a database or session
  return accessToken;
}



module.exports={
    generateZoomLink
}