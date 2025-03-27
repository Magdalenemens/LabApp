import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent {
  @ViewChild('inputFile') inputFile!: ElementRef<HTMLInputElement>;
  @ViewChild('previewImage') previewImage!: ElementRef<HTMLImageElement>;
  imageSelected: boolean = false;

  onSelectImage() {
    this.inputFile.nativeElement.click(); // Trigger file input
  }

  onRemoveImage() {
    this.previewImage.nativeElement.src = ''; // Clear image preview
    this.inputFile.nativeElement.value = '';  // Reset file input
    this.imageSelected = false;
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage.nativeElement.src = reader.result as string; // Show image preview
        this.imageSelected = true;
      };
      reader.readAsDataURL(file);
    }
  }
}
