import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.languages.registerDocumentFormattingEditProvider('cdl', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            const text = document.getText();
            const formattedText = formatCDL(text);
            
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            
            return [vscode.TextEdit.replace(fullRange, formattedText)];
        }
    });

    context.subscriptions.push(disposable);
}

function formatCDL(text: string): string {
    // Split the text into lines
    const lines = text.split('\n');
    const formattedLines: string[] = [];
    let indentLevel = 0;
    const indentSize = 2; // Number of spaces per indent level

    for (let line of lines) {
        // Trim the line
        line = line.trim();
        
        // Skip empty lines
        if (line === '') {
            formattedLines.push('');
            continue;
        }

        // Handle closing brackets
        if (line.startsWith('}')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        // Add the line with proper indentation
        formattedLines.push(' '.repeat(indentLevel * indentSize) + line);

        // Handle opening brackets
        if (line.endsWith('{')) {
            indentLevel++;
        }
    }

    return formattedLines.join('\n');
} 