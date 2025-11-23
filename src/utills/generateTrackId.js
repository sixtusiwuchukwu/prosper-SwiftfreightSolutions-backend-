 const generateTrackId =()=> {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return 'CL' + Math.floor(10000000 + Math.random() * 90000000);
  };

  export default generateTrackId