fetch('http://localhost:3000/api/products?limit=5')
  .then(res => res.json())
  .then(data => {
    console.log(JSON.stringify(data.data, null, 2));
  });
