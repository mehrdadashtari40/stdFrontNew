import { routes as auth } from './views/auth';
import { routes as trello } from './views/trello';
import { routes as inbox } from './views/inbox';
import { routes as systemManagement } from './views/system-management';
import { routes as basicInformation } from './views/basic-information';
import { routes as processManagement } from './views/process-management';
import { routes as serviceDesk } from './views/service-desk';
import { routes as bi } from './views/BIIframe';
import { routes as BISetting } from './views/BI';
import { routes as profile } from './views/profile';
import { routes as logs } from './views/logs';
import { routes as recommends } from './views/recommends';
import { routes as supervisor } from './views/supervisor';
import { routes as customsettings } from './views/customSettings';
import { routes as menu } from './views/menu';
import { routes as workdesk } from './views/work-desk';
import { routes as sso } from './views/sso';

export const routes = [
	...inbox,
	...trello,
	...systemManagement,
	...basicInformation,
	...processManagement,
	...bi,
	...BISetting,
	...profile,
	...logs,
	...recommends,
	...supervisor,
	...customsettings,
	...menu,
	...workdesk,
	...sso
];

export const authRoutes = [...auth, ...serviceDesk];

