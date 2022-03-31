import base45 from 'base45';
import {
  Block, Button, Checkbox, Link, List, ListItem, Navbar, NavbarBackLink, Page, Popup, Preloader
} from 'konsta/react';
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import {JSONTree} from "react-json-tree";

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
  const [timestamp, setTimestamp] = useState('');
  const [popupOpened, setPopupOpened] = useState(false);
  const [popupTitle, setPopupTitle] = useState('DPP details');


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
      setVerification(JSON.stringify(json.output[0]).replace(/_/g, ' '));
      setBlock(json.DPP.sawroom_entry);
      setHappy(true);
      setTimestamp(new Date().toTimeString().split(' ')[0]);
    } else {
      setVerification('🤯 Verification failed');
    }
  }
  const retrieveDetails = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ data: { sawroom_entry: block } }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const url = "https://apiroom.net/api/ReflowDPP/Sawroom-Read-data-from-the-blockchain";
    const res = await fetch(url, options);
    return await res.json();
  }

  const retrieveValueFlows = async (vid) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        "id": vid,
        "recurseLimit": 10,
        "unwind": true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const url = "https://reflow-demo.dyne.org/api/json/trace";
    const res = await fetch(url, options);
    return await res.json();
  }

  const getBlockchainDetails = async (result) => {
    const json = await retrieveDetails();
    setDetails(json);
    setPopupTitle("DPP Details");
    setPopupOpened(true);
  }

  const getValueFlows = async (result) => {
    const details = await retrieveDetails(result);
    const valueFlows = await retrieveValueFlows(details.sawroom.id);
    setDetails(valueFlows);
    setPopupTitle("Value Flows");
    setPopupOpened(true);
  }

  return (
    <Page>
      <Navbar left={
        <NavbarBackLink text="Back" onClick={() => history.back()} />
      } title="Verify DPP" />

      <List>
        <ListItem
          label
          after={timestamp || ''}
          title={verification}
          text={''}
          media={
            <Checkbox
              readOnly
              component="div"
              name="verified-checkbox"
              checked={happy}
            />
          }
        />
      </List>

      {!happy && <Block className="text-center">
        <QrReader
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
        />
        <Preloader />
      </Block>}

      <Block>
        {dpp && <pre className="overflow-scroll w-100">{dpp}</pre>}
        {happy &&
          <>
            <Button outline onClick={getBlockchainDetails} className="mt-8">
              BLOCKCHAIN DETAILS
            </Button>
            <Button outline onClick={getValueFlows} className="mt-8">
              VIEW VALUEFLOWS
            </Button>
          </>
        }
      </Block>


      <Popup opened={popupOpened} onBackdropClick={() => setPopupOpened(false)}>
        <Page>
          <Navbar
            title={popupTitle}
            right={
              <Link navbar onClick={() => setPopupOpened(false)}>
                Close
              </Link>
            }
          />
          <Block className="space-y-4">
            {
              details && <>

                <pre className="overflow-scroll w-100 h-100"><JSONTree data={details} />;</pre>
              </>
            }
          </Block>
        </Page>
      </Popup>
    </Page >
  );
}
