import { Injectable } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Injectable({
  providedIn: 'root',
})
export class kolkovEditorService {
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '18.1rem',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'verdana', name: 'Verdana' },
      { class: 'georgia', name: 'Georgia' },
      { class: 'courier-new', name: 'Courier New' },
      { class: 'tahoma', name: 'Tahoma' },
      { class: 'impact', name: 'Impact' },
      { class: 'sans-serif', name: 'Sans-Serif' },
      { class: 'roboto', name: 'Roboto' },
      { class: 'segoe-ui', name: 'Segoe UI' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      ['toggleEditorMode'], 
      ['link', 'unlink']
    ],
  };

  setLineSpacing(spacing: string) {
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);

      // Check if the selection is within a single element or spans multiple
      const parentElement =
        range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
          ? (range.commonAncestorContainer as HTMLElement)
          : range.commonAncestorContainer.parentElement;

      if (parentElement) {
        // Create a wrapper span to apply the line-height
        const wrapper = document.createElement('span');
        wrapper.style.lineHeight = spacing;
        wrapper.style.display = 'block'; // Ensures line-height applies properly

        const selectedContent = range.extractContents();
        wrapper.appendChild(selectedContent);

        range.deleteContents();
        range.insertNode(wrapper);

        // Restore selection to the end of the wrapper
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(wrapper);
        newRange.collapse(false);
        selection.addRange(newRange);
      }
    }
  }
}
