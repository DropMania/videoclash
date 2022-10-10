import Home from './routes/Home.svelte'
import Create from './routes/Create.svelte'
import Clash from './routes/Clash.svelte'
import Submit from './routes/Submit.svelte'
export default {
    '/': Home,
    '/create': Create,
    '/clash/:id': Clash,
    '/submit/:id': Submit
}
