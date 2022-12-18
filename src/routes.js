import Home from './routes/Home.svelte'
import Create from './routes/c/Create.svelte'
import Clash from './routes/c/Clash.svelte'
import Submit from './routes/c/Submit.svelte'
import CreateB from './routes/b/Create.svelte'
import GameB from './routes/b/Game.svelte'
import TOS from './routes/TOS.svelte'
import _404 from './routes/404.svelte'
import ModeratorView from './routes/mod/ModeratorView.svelte'
import ManageModerators from './routes/mod/ManageModerators.svelte'
import ModeratorInvitePage from './routes/mod/ModeratorInvitePage.svelte'
import Info from './routes/Info.svelte'
import CreateTierList from './routes/t/CreateTierList.svelte'
import TierList from './routes/t/TierList.svelte'
export default {
    '/': Home,
    '/c/create': Create,
    '/c/clash/:id': Clash,
    '/c/submit/:id': Submit,
    '/b/create': CreateB,
    '/tos': TOS,
    '/b/game/:id': GameB,
    '/mod/clash/:id':ModeratorView,
    '/mod/manage':ManageModerators,
    '/mod/invite/:token':ModeratorInvitePage,
    '/info/':Info,
    '/t/create': CreateTierList,
    '/t/list/:id': TierList,
    '*': _404
}
