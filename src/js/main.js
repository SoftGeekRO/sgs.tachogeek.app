
import { settings } from './sgs/config/settings';
import apps from "./sgs/apps/registry";

//import style from "@scss/style.scss";

apps.populate(settings.INSTALLED_APPS);

export default apps;
