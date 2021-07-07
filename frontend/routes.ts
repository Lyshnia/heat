import { Route } from '@vaadin/router';
import './views/jtodo/j-to-do-view';
import './views/main-layout';

export type ViewRoute = Route & { title?: string; children?: ViewRoute[] };

export const views: ViewRoute[] = [
  // place routes below (more info https://vaadin.com/docs/latest/fusion/routing/overview)
  {
    path: '',
    component: 'j-to-do-view',
    title: '',
  },
  {
    path: 'todo',
    component: 'j-to-do-view',
    title: 'JTo Do',
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
