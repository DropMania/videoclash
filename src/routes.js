import Home from './routes/Home.svelte'
import Create from './routes/c/Create.svelte'
import Clash from './routes/c/Clash.svelte'
import Submit from './routes/c/Submit.svelte'
import CreateB from './routes/b/Create.svelte'
import GameB from './routes/b/Game.svelte'
import TOS from './routes/TOS.svelte'
import _404 from './routes/404.svelte'
import ModeratorView from './routes/mod/ModeratorView.svelte'
export default {
    '/': Home,
    '/c/create': Create,
    '/c/clash/:id': Clash,
    '/c/submit/:id': Submit,
    '/b/create': CreateB,
    '/tos': TOS,
    '/b/game/:id': GameB,
    '/mod/:id/:secret':ModeratorView,
    '*': _404
}
