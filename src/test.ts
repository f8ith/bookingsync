import { APIClient } from './simplybook.js'

const client = new APIClient()
await client.initialize()
console.log(await client.getServiceList())
