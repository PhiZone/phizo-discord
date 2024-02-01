# Phizo for Discord

Hi! I am Phizo, Permanent Representative of the United Republic of PhiZone to the Union of Social Networks.  
Here at Discord, I am dedicated to provide you with information as far as I can reach.

Because I'm still new here, my abilities are very limited. You can checkout [our website](https://www.phi.zone/) for more information!

### Commands

- `/phizone` - Provides utilities related to PhiZone.
  - `/phizone pb {id:int}` - Queries personal bests for a PhiZone user.
  - `/phizone qs {id:string}` - Queries a song on PhiZone.
  - `/phizone qc {id:string}` - Queries a chart on PhiZone.
  - `/phizone ss {query:string}` - Searches songs on PhiZone.
  - `/phizone sc {query:string}` - Searches charts on PhiZone.

### `.env`
```
TOKEN="MY_DISCORD_TOKEN"
CLIENT_ID="MY_CLIENT_ID"
API_URL="https://api.phizone.cn"
WEBSITE_URL="https://www.phi.zone"
```

### Deployment

Run `node deploy-commands.js` to deploy commands.

Run `node index.js` to start Phizo.