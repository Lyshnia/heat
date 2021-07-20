import {Route, Router} from '@vaadin/router';
import './views/jtodo/j-to-do-view';
import './views/auth/login-view';
import './views/main-layout';
import {isLoggedIn, isUserInRole} from "Frontend/views/auth/auth";

export type ViewRoute = Route & {
    title?: string;
    children?: ViewRoute[];
    rolesAllowed?: string[];
};

export const views: ViewRoute[] = [
    // place routes below (more info https://vaadin.com/docs/latest/fusion/routing/overview)
    {
        path: '/login',
        component: 'login-view'
    }, {
        path: '',
        component: 'j-to-do-view',
        title: '',
        action: () => {
            if (!isLoggedIn()) {
                return location.replace('/login');
            }
            return undefined;
        },
    },
    {
        path: 'todo',
        component: 'j-to-do-view',
        title: 'JTo Do',

    },
    {
        path: 'view/:id?',
        component: 'my-view',
        title: 'Views',
        rolesAllowed: ['ADMIN'],
        action: async (context, commands: Router.Commands) => {
            const route = context.route as ViewRoute;
            if (!isAuthorizedViewRoute(route)) {
                return commands.prevent();
            }
            await import('./views/jtodo/my-view');
            return undefined
        },
    },
    {
        path: 'about',
        component: 'about-view',
        title: 'About',
        action: async () => {
            await import('./views/about/about-view');
        },
    },
];
export const routes: ViewRoute[] = [
    {
        path: '',
        component: 'main-layout',
        children: [...views],
    },
];

export function isAuthorizedViewRoute(route: ViewRoute) {
    if (route.rolesAllowed) {
        return route.rolesAllowed.find((role) => isUserInRole(role));
    }

    return true;
}