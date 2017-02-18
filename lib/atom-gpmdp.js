'use babel';

import AtomGpmdpView from './atom-gpmdp-view';
import { CompositeDisposable } from 'atom';

export default {

  atomGpmdpView: null,
  modalPanel: null,
  subscriptions: null,

  initialize(state) {
    ws = new Websocket('ws://127.0.0.1:5672');

    ws.onopen = function() {
      console.log("Opened websocket");
    };

    ws.onclose = function() {
      console.log("Closed websocket");
    };

    ws.onmessage = function(event) {
      console.log("Message received:" + event.data);
    };

    ws.onerror = function(event) {
      if(typeof event.data != 'undefined') {
          console.log("Websocket Error:" + event.data);
      }
    };

  },

  activate(state) {
    this.atomGpmdpView = new AtomGpmdpView(state.atomGpmdpViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomGpmdpView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-gpmdp:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomGpmdpView.destroy();
  },

  serialize() {
    return {
      atomGpmdpViewState: this.atomGpmdpView.serialize()
    };
  },

  toggle() {
    console.log('AtomGpmdp was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
