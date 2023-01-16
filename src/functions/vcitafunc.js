const axios = require('axios');
const apiKey = 'Bearer b39a43066557a5c10660fa10bd681b69b7f141069cdf184a8b10f2999a77a336';    
const config = {
        headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
        }
    };
const create_client=async()=>{
      const data = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'marufbelete9@gmail.com',
        phone: '555-555-5555'
      };
      const response=await axios.post('https://api.vcita.biz/platform/v1/clients', data, config)
      return response.data
}
const get_client=async()=>{
  const response=await axios.get('https://api.vcita.biz/platform/v1/clients/str1sw0jb7sjvrgh',config)
  return response.data
}

const send_message=async()=>{
    const data = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'marufbelete9@gmail.com',
      phone: '555-555-5555'
    };
    const response=await axios.post('https://api.vcita.biz/platform/v1/messages', data, config)
    return response.data
}
module.exports={
    create_client,
    get_client,
    config
}