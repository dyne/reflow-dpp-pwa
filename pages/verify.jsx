import { useState } from 'react';
import base45 from 'base45';
import { QrReader } from 'react-qr-reader';

const format = (data) => {
  const decoded = base45.decode(data).toString('utf8');
  return JSON.stringify(JSON.parse(decoded), null, 2);
}

export default function Verify() {
  const [dpp, setDpp] = useState('No result');
  const [verification, setVerification] = useState('Not verified yet');
  const [happy, setHappy] = useState(false);
  const [block, setBlock] = useState();
  const [details, setDetails] = useState();

  const verifyLocalDpp = async (result) => {
    const decodedDpp = format(result.text);
    setDpp(decodedDpp);
    const options = {
      method: 'POST',
      body: decodedDpp,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const resp = await fetch('/api/verify', options);

    if (resp.status === 200) {
      const json = await resp.json();
      setVerification("🎉 " + JSON.stringify(json.output[0]));
      setBlock(json.DPP.sawroom_entry)
      console.log()
      setHappy(true);
    } else {
      setVerification('🤯 Verification failed');
    }
  }

  const getBlockchainDetails = async (result) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ data: { sawroom_entry: block } }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const url = "https://apiroom.net/api/ReflowDPP/Sawroom-Read-data-from-the-blockchain";
    const res = await fetch(url, options);
    if (res.status === 200) {
      const json = await res.json();
      setDetails(json);
    }
  }

  return (
    <div className="mx-auto">
      <h1>Scan the DPP</h1>

      {!happy && <QrReader
        constraints={{
          facingMode: "environment"
        }}
        facingMode="environment"
        onResult={async (result, error) => {
          if (!!result) {
            verifyLocalDpp(result);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: '100%' }}
      />}
      <p className="w-100">{verification}</p>
      {happy &&
        <button onClick={() => {
          getBlockchainDetails();
        }} className="px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent">
          DETAILS SAVED ON BLOCKCHAIN
        </button>
      }
      {details && <>
        <pre className="overflow-scroll w-100 h-100">{JSON.stringify(details, null, 2)}</pre>
      </>}
      {!details && <pre className="overflow-scroll w-100">{dpp}</pre>}
    </div>
  );
}
