const axios = require('axios');
const apiKey = 'Bearer b39a43066557a5c10660fa10bd681b69b7f141069cdf184a8b10f2999a77a336';    
const config = {
        headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
        }
    };
const create_client=async(user)=>{
      const data = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      };
      const response=await axios.post('https://api.vcita.biz/platform/v1/clients', data, config)
      return response.data
}
const get_client=async()=>{
  const response=await axios.get('https://api.vcita.biz/platform/v1/clients/str1sw0jb7sjvrgh',config)
  return response.data
}

module.exports={
    create_client,
    get_client,
    config
}