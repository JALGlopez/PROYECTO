function updateEditor() {
    const editor = document.getElementById('editor');
    const highlighting = document.getElementById('highlighting');
    const lineNumbers = document.getElementById('lineNumbers');
    const code = editor.value;
    
    // Actualizar el código con resaltado
    highlighting.innerHTML = highlightHTML(code);
    
    // Actualizar los números de línea
    const lines = code.split('\n').length;
    lineNumbers.innerHTML = Array(lines).fill(0).map((_, i) => i + 1).join('<br>');
    
    syncScroll();
}

function highlightHTML(code) {
    const keywords = {
        tag: /\b(<!DOCTYPE html>|<\/?[\w\s="/.':;#-\/\?]+>)\b/g,
        attribute: /\b([\w-]+)(?=\=)/g,
        string: /"[^"]*"|'[^']*'/g
    };
    return code.replace(keywords.tag, '<span class="tag">$&</span>')
               .replace(keywords.attribute, '<span class="attribute">$&</span>')
               .replace(keywords.string, '<span class="string">$&</span>');
}

function syncScroll() {
    const editor = document.getElementById('editor');
    const highlighting = document.getElementById('highlighting');
    const lineNumbers = document.getElementById('lineNumbers');
    
    highlighting.scrollTop = editor.scrollTop;
    highlighting.scrollLeft = editor.scrollLeft;
    lineNumbers.scrollTop = editor.scrollTop;
}

function newFile() {
    document.getElementById('editor').value = '';
    updateEditor();
}

function openFile(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = function() {
        const text = reader.result;
        document.getElementById('editor').value = text;
        updateEditor();
    };
    reader.readAsText(input.files[0]);
}

function saveFile() {
    const textToSave = document.getElementById('editor').value;
    const textToSaveAsBlob = new Blob([textToSave], {type: 'text/plain'});
    const textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    const fileNameToSaveAs = prompt("Ingrese el nombre del archivo a guardar:", "untitled.html");

    const downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.href = textToSaveAsURL;
    downloadLink.click();
}

function saveAsFile() {
    saveFile();
}

function printFile() {
    const content = document.getElementById('editor').value;
    const printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<pre>' + content + '</pre>');
    printWindow.document.close();
    printWindow.print();
}

function findText() {
    const textToFind = prompt("Ingrese el texto a buscar:");
    const editor = document.getElementById('editor');
    const content = editor.value;
    const startIndex = content.indexOf(textToFind);
    if (startIndex !== -1) {
        editor.setSelectionRange(startIndex, startIndex + textToFind.length);
        editor.focus();
    } else {
        alert("Texto no encontrado");
    }
}

function replaceText() {
    const textToFind = prompt("Ingrese el texto a buscar:");
    const textToReplace = prompt("Ingrese el texto de reemplazo:");
    const editor = document.getElementById('editor');
    const content = editor.value;
    const newText = content.replace(new RegExp(textToFind, 'g'), textToReplace);
    editor.value = newText;
    updateEditor();
}

function goToLine() {
    const lineNumber = parseInt(prompt("Ingrese el número de línea:"), 10);
    const editor = document.getElementById('editor');
    const lines = editor.value.split('\n');
    if (lineNumber > 0 && lineNumber <= lines.length) {
        let position = 0;
        for (let i = 0; i < lineNumber - 1; i++) {
            position += lines[i].length + 1;
        }
        editor.setSelectionRange(position, position);
        editor.focus();
    } else {
        alert("Número de línea inválido");
    }
}

