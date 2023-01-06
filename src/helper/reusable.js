const removeEmptyPair=(obj)=> {
    for (let propName in obj) {
      if (!(obj[propName])) {
        delete obj[propName];
      }
    }
    return obj
}
const formatPhoneNumber=(phoneNumberString) =>{
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return  match[1] + '-' + match[2] + '-' + match[3];
  }
  return null;
}
module.exports={
    removeEmptyPair,
    formatPhoneNumber
}