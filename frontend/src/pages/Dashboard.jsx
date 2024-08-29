import React, { useState, useEffect } from 'react';

function Dashboard() {
    const [response, setResponse] = useState('hello');


    useEffect(() => {
        fetch("http://localhost:5000/products", {
          method: "GET",
          headers : {'Content-Type':'application/json',
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"}
        })

          .then((response) => response.json())
          .then((data) => {
            setResponse(data);
            console.log(data);
          })
          .catch((error) => console.log(error));
      }, []);

    return (
        <div className="Dashboard">
            <div>{response.name}</div>
        </div>
    );
}

export default Dashboard;
