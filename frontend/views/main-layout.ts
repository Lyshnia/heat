import '@vaadin/vaadin-app-layout';
import { AppLayoutElement } from '@vaadin/vaadin-app-layout';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';
import '@vaadin/vaadin-avatar/vaadin-avatar';
import '@vaadin/vaadin-tabs';
import '@vaadin/vaadin-tabs/vaadin-tab';
import { customElement, html } from 'lit-element';
import { router } from '../index';
import {isAuthorizedViewRoute, views} from '../routes';
import { appStore } from '../stores/app-store';
import { Layout } from './view';
import {logout} from "Frontend/views/auth/auth";

interface RouteInfo {
  path: string;
  title: string;
}

@customElement('main-layout')
export class MainLayout extends Layout {
  render() {
    return html`
      <vaadin-app-layout primary-section="drawer">
        <header slot="navbar" theme="dark" class="sidemenu-header">
          <vaadin-drawer-toggle></vaadin-drawer-toggle>
          <h1>${appStore.currentViewTitle}</h1>
          <vaadin-button @click="${() => logout()}" class="ms-auto">Logout</vaadin-button>
        </header>

        <div slot="drawer" class="sidemenu-menu">
          <div id="logo">
            <img src="images/logo.png" alt="${appStore.applicationName} logo" />
            <span>${appStore.applicationName}</span>
          </div>
          <hr />
          <vaadin-tabs orientation="vertical" theme="minimal" .selected=${this.getSelectedViewRoute()}>
            ${this.getMenuRoutes().map(
              (viewRoute) => html`
                <vaadin-tab>
                  <a href=${router.urlForPath(viewRoute.path)} tabindex="-1">${viewRoute.title}</a>
                </vaadin-tab>
              `
            )}
          </vaadin-tabs>
        </div>
        <slot></slot>
      </vaadin-app-layout>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add('block', 'h-full');
    this.reaction(
      () => appStore.location,
      () => {
        AppLayoutElement.dispatchCloseOverlayDrawerEvent();
      }
    );
  }

  private getMenuRoutes(): RouteInfo[] {
    // return views.filter((route) => route.title) as RouteInfo[];

    // @ts-ignore
    return (views.filter((route) => route.title) as RouteInfo[]).filter((route) => route.title).filter(isAuthorizedViewRoute);
  }

  private getSelectedViewRoute(): number {
    return this.getMenuRoutes().findIndex((viewRoute) => viewRoute.path == appStore.location);
  }
}
