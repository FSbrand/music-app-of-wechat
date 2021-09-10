const math_utils_addzero = (num,count) =>{
    return (Array(count).join(0)+Math.trunc(num)).slice(-count);
  }
  
  
  module.exports={
    math_utils_addzero
  }