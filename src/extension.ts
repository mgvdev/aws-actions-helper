import { Action, TreeActionsProvider } from './treeActions';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { actionsList } from './action-list';

const methodList: vscode.QuickPickItem[] = [
  {label: 'JS Array style', description: 'Insert actions like an JS array' },
  {label: 'Plain text', description: 'Insert actions separated with comma'}
];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "aws-actions-helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let insertOneAction = vscode.commands.registerTextEditorCommand('aws-actions-helper.insertOneAction', async (editor, edit) => {
    
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user    
    const text = await vscode.window.showQuickPick(actionsList, {canPickMany:false});
    editor.selections.forEach((selection) => editor.edit((editBuilder) => editBuilder.insert(selection.active, text || '')));
	});
  
	let insertMultipleActions = vscode.commands.registerTextEditorCommand('aws-actions-helper.insertMultipleAction', async (editor, edit) => {
    
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user    
    const texts = await vscode.window.showQuickPick(actionsList, {canPickMany:true});
    const method = await vscode.window.showQuickPick(methodList, {canPickMany: false});
    if (texts) {
      
      switch (method?.label) {
        case 'JS Array style':
            const jsText = texts.reduce((acc, cur) => {return acc += `"${cur}",`}, "").slice(0, -1);
            editor.selections.forEach((selection) => editor.edit((editBuilder) => editBuilder.insert(selection.active, jsText || '')));
          break;
        case 'Plain text':
            editor.selections.forEach((selection) => editor.edit((editBuilder) => editBuilder.insert(selection.active, texts.join(',') || '')));
          break;
      }
      
    }
	});

  const awsActionTree = vscode.window.registerTreeDataProvider('aws-actions-helper', new TreeActionsProvider());
  const actionAddFromPanel = vscode.commands.registerTextEditorCommand('aws-actions-helper.action.insert', async (editor, edit, actionName: string) => {
    editor.selections.forEach((selection) => editor.edit((editBuilder) => editBuilder.insert(selection.active, actionName || '')));
  });
	context.subscriptions.push(insertOneAction, insertMultipleActions , actionAddFromPanel);

  
  
}

// this method is called when your extension is deactivated
export function deactivate() {}
