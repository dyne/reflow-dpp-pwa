import { useState } from 'react';
import base45 from 'base45';
import QRCode from "react-qr-code";

export default function Generate() {
  const [rid, setRid] = useState('');
  const [result, setResult] = useState();

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      "data": {
        "reflow_data_to_post": {
          "id": rid,
          "recurseLimit": 10,
          "unwind": true
        },
        "reflow_endpoint": "https://reflow-demo.dyne.org/api/json/trace",
        "sawroomEndpoint": "http://195.201.41.35:8008"
      }
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const url = "https://apiroom.net/api/ReflowDPP/Reflow-create-DPP-and-store-in-sawroom.chain";
    const res = await fetch(url, options);
    if (res.status === 200) {
      const json = await res.json();
      const compressed = base45.encode(JSON.stringify(json));
      setResult(compressed);
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold">
        Generate
      </h1>
      <div className="mb-3 pt-0">
        <form onSubmit={onSubmit}>
          <input type="text" onChange={(e) => { setRid(e.target.value) }} placeholder="Insert the valueflows ID" className="px-3 py-4 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-base border-0 shadow outline-none focus:outline-none focus:ring w-full" required />
          <button className="text-green-500 bg-transparent border border-solid border-green-500 hover:bg-green-500 hover:text-white active:bg-green-600 font-bold uppercase px-8 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="submit">
            GENERATE 💌
          </button>
        </form>
        {result && <QRCode value={result} />}
      </div>
    </>
  )
}
