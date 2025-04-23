export default async function handler(req, res) {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = 'appSJ44aM5IVKdNcx';
  const USERS_TABLE = 'Users';
  const CLIENTS_TABLE = 'Clients';

  const headers = {
    Authorization: `Bearer ${AIRTABLE_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    // Fetch user record
    const userResp = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${USERS_TABLE}?filterByFormula={Email}='${email}'`, { headers });
    const userData = await userResp.json();
    const user = userData.records[0]?.fields || null;

    // Fetch client records associated with user
    const clientResp = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${CLIENTS_TABLE}?filterByFormula={AssociatedEmail}='${email}'`, { headers });
    const clientData = await clientResp.json();
    const clients = clientData.records.map(r => r.fields);

    res.status(200).json({ user, clients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Airtable data' });
  }
}
