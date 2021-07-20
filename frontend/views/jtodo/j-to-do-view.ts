import '@vaadin/vaadin-button';
import '@vaadin/vaadin-text-field';
import {customElement, html, internalProperty} from 'lit-element';
import {View} from '../../views/view';
import Todo from "Frontend/generated/com/example/application/data/entity/Todo";
import TodoModel from "Frontend/generated/com/example/application/data/entity/TodoModel";
import {Binder, field} from "@vaadin/form";
import '@vaadin/vaadin-text-field/src/vaadin-text-field.js';
import '@vaadin/vaadin-button/src/vaadin-button.js';
import * as todoEndpoint from "Frontend/generated/TodoEndpoint";
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-lumo-styles/icons';
import '@vaadin/vaadin-dialog/vaadin-dialog';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-ordered-layout/vaadin-vertical-layout';
import {guard} from "lit-html/directives/guard";
import {nothing, render} from 'lit-html';
import {ConnectionState, ConnectionStateStore} from "@vaadin/flow-frontend/ConnectionState";

@customElement('j-to-do-view')
export class JToDoView extends View {
    static _name: string = '';

    @internalProperty()
    private dialogOpened = false;

    @internalProperty()
    private todos: Todo[] = [];

    @internalProperty()
    private localTodo: Todo[] = [];

    @internalProperty()
    private _todo: Todo | undefined;

    @internalProperty()
    private offline = false;

    private binder = new Binder(this, TodoModel);

    render() {
        const {model} = this.binder;

        return html`
            ${this.offline ? html`<h1>Saving not supported in offline mode</h1>` : nothing}
            ${this.binder.submitting ? html`
                <span class="label">submitting</span>
                <div class="spinner"></div>` : nothing}
            <form>
                <vaadin-text-field ...="${field(model.task)}"></vaadin-text-field>
                <vaadin-button theme="primary" @click="${this.createTodo}" ?disabled="${this.binder.invalid}">
                    Create
                </vaadin-button>
            </form>
            <div class="todos h-full flex justify-center flex-col">
                ${this.allTodos.map(todo => html`
                    <div class="todo">
                        <vaadin-checkbox
                                ?checked=${todo.done}
                                @checked-changed=${(e: CustomEvent) => this.updateTodoState(todo, e.detail.value)}
                        >${todo.task}
                        </vaadin-checkbox>

                        <vaadin-button theme="tertiary error" style="padding: 0; margin: 0"
                                       @click="${() => this.deleteTodo(todo)}">X
                        </vaadin-button>

                        <vaadin-button theme="tertiary" style="padding: 0; margin: 0"
                                       @click="${() => {
                                           this._todo = todo;
                                           this.dialogOpened = true;
                                       }}">
                            <iron-icon icon="lumo:edit"></iron-icon>
                        </vaadin-button>
                    </div>
                `)}
            </div>

            <vaadin-dialog
                    aria-label="simple"
                    .opened="${this.dialogOpened}"
                    @opened-changed="${(e: CustomEvent) => (this.dialogOpened = e.detail.value)}"
                    .renderer="${guard([], () => (root: HTMLElement) => {
                        render(
                                html`
                                    <vaadin-vertical-layout
                                            theme="spacing"
                                            style="width: 300px; max-width: 100%; align-items: stretch;"
                                    >
                                        <h2 style="margin: var(--lumo-space-m) 0 0 0; font-size: 1.5em; font-weight: bold;">
                                            Edit Task
                                        </h2>
                                        <vaadin-vertical-layout style="align-items: stretch;">
                                            <vaadin-text-field label="Task" @value-changed="${this.nameChanged}"
                                                               value="${this._todo?.task}"></vaadin-text-field>
                                        </vaadin-vertical-layout>
                                        <vaadin-horizontal-layout theme="spacing" style="justify-content: flex-end">
                                            <vaadin-button @click="${() => (this.dialogOpened = false)}">
                                                Cancel
                                            </vaadin-button>
                                            <vaadin-button theme="primary"
                                                           @click="${(e: CustomEvent) => this.editTodo(this._todo)}">
                                                Save changes
                                            </vaadin-button>
                                        </vaadin-horizontal-layout>
                                    </vaadin-vertical-layout>
                                `,
                                root
                        );
                    })}"
            ></vaadin-dialog>
        `;
    }

    updateTodoState(todo: Todo, done: boolean) {
        const updated = {...todo, done};
        this.todos = this.todos.map(t => t.id == todo.id ? updated : t);
        todoEndpoint.save(updated);
    }

    deleteTodo(todo: Todo) {
        // @ts-ignore
        this.todos = this.todos.filter(t => t.id != todo.id)
        todoEndpoint.delete(todo);
    }

    editTodo(todo: Todo | undefined) {
        this.dialogOpened = false
        if (todo != undefined) {
            this._todo = undefined;
            const task = JToDoView._name


            const updated = {...todo, task};
            console.log(updated)
            this.todos = this.todos.map(t => t.id == todo.id ? updated : t);
            todoEndpoint.save(updated);
        }
    }

    nameChanged(e: CustomEvent) {
        // @ts-ignore
        JToDoView._name = e.detail.value;
    }

    syncPending() {
        for (const t in this.localTodo) {

        }
    }

    async connectedCallback() {
        super.connectedCallback();
        this.todos = await todoEndpoint.findAll();

        const connectionState = (window as any).Vaadin.connectionState as ConnectionStateStore;
        connectionState.addStateChangeListener((_: ConnectionState, current: ConnectionState) => {
            this.offline = current === ConnectionState.CONNECTION_LOST;

            if (!this.offline) {
                this.syncPending();
            }
        })
    }


    get allTodos() {
        return this.todos.concat(this.localTodo)
    }

    async createTodo() {
        try {
            const saved = await this.binder.submitTo(todoEndpoint.save);
            if (saved) {
                this.todos = [...this.todos, saved];
                this.binder.clear();
            }
        } catch (e) {
            if (this.offline) {
                // @ts-ignore
                this.localTodo = [...this.localTodo, this.todos];
            }
        }
    }
}
