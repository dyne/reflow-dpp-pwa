import base45 from 'base45';
import {
  Block, Button, Checkbox, Link, List, ListItem, Navbar, NavbarBackLink, Page, Popup, Preloader
} from 'konsta/react';
import { useState } from 'react';
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
  const [timestamp, setTimestamp] = useState('');
  const [popupOpened, setPopupOpened] = useState(false);


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
      setBlock(json.DPP.sawroom_entry)
      setHappy(true);
      setTimestamp(new Date().toTimeString().split(' ')[0]);
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
      setPopupOpened(true)
    }
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
          text={block || ''}
          media={
            <Checkbox
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
          <Button outline onClick={getBlockchainDetails} className="mt-8">
            BLOCKCHAIN DETAILS
          </Button>
        }
      </Block>


      <Popup opened={popupOpened} onBackdropClick={() => setPopupOpened(false)}>
        <Page>
          <Navbar
            title="DPP Details"
            right={
              <Link navbar onClick={() => setPopupOpened(false)}>
                Close
              </Link>
            }
          />
          <Block className="space-y-4">
            {
              details && <>
                <pre className="overflow-scroll w-100 h-100">{JSON.stringify(details, null, 2)}</pre>
              </>
            }
          </Block>
        </Page>
      </Popup>
    </Page >
  );
}
