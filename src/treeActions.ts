import { actionsList } from './action-list';
import * as vscode from 'vscode';


export class Action extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly isAction: boolean
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    
    if (isAction) {
      this.command =  {
        command: 'aws-actions-helper.action.insert',
        title: 'Insert action',
        arguments: [this.label]
      };
    }
  }
 
}

export class TreeActionsProvider implements vscode.TreeDataProvider<Action> {

  
  onDidChangeTreeData?: vscode.Event<Action | void | Action[] | null | undefined> | undefined;
  getTreeItem(element: Action): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: Action | undefined): vscode.ProviderResult<Action[]> {

    let treeItems: Action[] = []; 
    if (element) {
      actionsList.filter((action) => action.startsWith(element.label)).forEach((action) => {
        treeItems.push(new Action(action, vscode.TreeItemCollapsibleState.None, true));
      });
    } else {
      new Set(actionsList.map((action) => action.split(':')[0])).forEach((rootAction) => {
        treeItems.push(new Action(rootAction, vscode.TreeItemCollapsibleState.Collapsed, false));
      });
    }
    
    return Promise.resolve(treeItems);
  }
  getParent?(element: Action): vscode.ProviderResult<Action> {
    throw new Error('Method not implemented.');
  }
  resolveTreeItem?(item: vscode.TreeItem, element: Action, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
    throw new Error('Method not implemented.');
  }
  
  
 } 