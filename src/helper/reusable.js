const removeEmptyPair=(obj)=> {
    for (let propName in obj) {
      if (!(obj[propName])) {
        delete obj[propName];
      }
    }
    return obj
}
module.exports={
    removeEmptyPair
}