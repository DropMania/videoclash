import Home from './routes/c/Home.svelte'
import Create from './routes/c/Create.svelte'
import Clash from './routes/c/Clash.svelte'
import Submit from './routes/c/Submit.svelte'
import CreateB from './routes/b/Create.svelte'
import TOS from './routes/c/TOS.svelte'
export default {
    '/': Home,
    '/c/create': Create,
    '/c/clash/:id': Clash,
    '/c/submit/:id': Submit,
    '/b/create': CreateB,
    '/tos': TOS
}
