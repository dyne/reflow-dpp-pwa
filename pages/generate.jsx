import base45 from 'base45';
import { Block, Button, List, ListInput, Navbar, NavbarBackLink, Page, Preloader } from 'konsta/react';
import { useState } from 'react';
import QRCode from "react-qr-code";

export default function Generate() {
  const [rid, setRid] = useState('');
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    setLoading(true);
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
    <Page>
      <Navbar left={
        <NavbarBackLink text="Back" onClick={() => history.back()} />
      } title="Generate DPP" />

      <List className="p-2">
        <form onSubmit={onSubmit}>

          <ListInput
            label="Valueflows ID"
            floatingLabel
            type="text"
            placeholder="Please insert a valid ID"
            onChange={(e) => { setRid(e.target.value) }}
            required
          />
          <Button large outline type="submit">
            GENERATE 💌
          </Button>
        </form>
      </List>
      <Block className="flex justify-center w-full">
        {loading && !result && <Preloader />}
        {result && <QRCode value={result} className="mx-auto" />}
      </Block>
    </Page>
  )
}
