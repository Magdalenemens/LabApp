import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { clientAccountDataEntry } from 'src/app/models/clientAccountDataEntry';
import { ClientAccountDataEntryService } from '../data-client-account/data-client-account.service';
import { REPORT_BASEURL } from 'src/app/common/constant';
import { EnvironmentalorderService } from 'src/app/modules/orderprocessing/environmentalorder/add-environmentalorder/environmentalorder.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PrintService } from 'src/app/services/print.service.';
import { LoaderService } from 'src/app/modules/shared/services/loaderService';
@Component({
  selector: 'app-client-account-statement',
  templateUrl: './client-account-statement.component.html',
  styleUrls: ['./client-account-statement.component.scss']
})
export class ClientAccountStatementComponent {
  @ViewChild('reportFrame') reportFrame!: ElementRef;
  @ViewChild('ngSelectInstance') ngSelectInstance!: NgSelectComponent;
  @ViewChildren('rowRef') rowRefs: QueryList<ElementRef> | undefined;
  selectedFile: File | null = null;
  base64Image: string = ''; // To store the Base64 string
  uploadMessage: string = '';
  cn = '';
  isDisabled = true;
  highLightedSelectedRow = 0;
  clientList: clientAccountDataEntry[] = [];
  filteredClientList: clientAccountDataEntry[] = [];
  statementList: clientAccountDataEntry[] = [];
  selectedClient: any = {};
  totalDebit = 0;
  totalCredit = 0;
  balance = 0;
  currentId = 0;
  total_days = 0;

  fromDate = "";
  toDate = "";
  reportPath_finance = '/Finance'; // Path to the report folder
  reportName = 'ClientDateStatment'; // Report name
  coverLetterReportName = 'ClientCoverLetter'; // Report name
  printOptions = {
    pageHeader: true

  };

  constructor(private _clientaccountservice: ClientAccountDataEntryService,
    private router: Router, private route: ActivatedRoute,
    private _printService: PrintService, private _loaderService: LoaderService) {
  }
  ngOnInit(): void {
    this.getclientAccountDetails();
    this._loaderService.ShowHideLoader(3000);
  }
  getclientAccountDetails() {
    this._clientaccountservice.getClientAccountList().subscribe(res => {
      this.clientList = res;
      this.filteredClientList = this.clientList;
      if (this.clientList) {
        this.getClientAccountStatement(this.clientList[0].clnT_FL_ID, this.clientList[0].cn);
      }
    },
      (error) => {
        console.error('Error loadinng anatomic list:', error);
      })
  }



  getClientAccountStatement(id, cn) {
    this.currentId = id;
    this.highLightedSelectedRow = id;
    this.cn = cn;
    this.selectedClient = this.clientList.find(v => v.cn == cn && v.clnT_FL_ID == id);
    if (this.ngSelectInstance) {
      this.ngSelectInstance.writeValue(this.selectedClient); // Clear the UI
    }
    const row = this.rowRefs.toArray().find((ref) => {
      return ref.nativeElement.querySelector('td').innerText.trim() === this.selectedClient.cn;
    });

    if (row) {
      row.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.nativeElement.style.backgroundColor = 'yellow'; // Highlighting the row
    }

    this._clientaccountservice.getClientAccountStatement(id, this.fromDate, this.toDate).subscribe(res => {
      this.statementList = res;
      if (this.statementList.length > 0) {
        this.totalDebit = this.statementList[0].ytD_DEBIT;
        this.totalCredit = this.statementList[0].ytD_CREDIT;
        this.balance = this.totalDebit - this.totalCredit;
        this.total_days = this.statementList[this.statementList.length - 1].totaL_DAYS;
      } else {
        this.totalDebit = 0;
        this.totalCredit = 0;
        this.balance = 0;

      }
    },
      (error) => {
        console.error('Error loadinng anatomic list:', error);
      })
  }

  onPrint(): void {
    this._loaderService.show();
    let clientNumber = this.statementList[0].cn;
    // Check if client number is available
    if (!clientNumber) {
      console.error('Error: client number parameter is missing.');
      return;
    }
    // Construct the URL with print parameters
    const baseUrl = REPORT_BASEURL;
    // const reportParams = `&Client_No=${clientNumber}`;
    const reportParams = `&Client_No=${clientNumber}`
      + `&DisplayLogo=${this.printOptions.pageHeader}`;
    const reportUrl = `${baseUrl}${this.reportPath_finance}/${this.reportName}${reportParams}&rs:Command=Render&rs:Format=PDF&rs:Print=True`;
    // Fetch the report as a blob
    this._printService.getSSRSReport(reportUrl).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const iframeSrc = `${url}#toolbar=0&navpanes=0&scrollbar=1`; // Hide default toolbar
      // Open a new tab
      const newTab = window.open("", "_blank");
      if (newTab) {
        newTab.document.write(`
         <html>
         <head>
           <title>Report Preview</title>
         </head>
         <body style="text-align: center; margin: 0; padding: 0;">
           <iframe src="${iframeSrc}" width="100%" height="90%" style="border: none;"></iframe>
           <br/>
           <button onclick="downloadReport()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-top: 10px;">
             Download Report
           </button>
           <script>
             function downloadReport() {
               const a = document.createElement('a');
               a.href = "${url}";
               a.download = "ClientDateStatment_${clientNumber}.pdf"; 
               document.body.appendChild(a);
               a.click();
               document.body.removeChild(a);
             }
           </script>
         </body>
         </html>
       `);
        this._loaderService.hide();
        newTab.document.close();
      } else {
        this._loaderService.hide();
        console.error("Error: Unable to open new tab.");
      }
    });
  }

  onPrintCoverLetter(): void {
    this._loaderService.show();
    let clientNumber = this.statementList[0].cn;
    // Check if client number is available
    if (!clientNumber) {
      console.error('Error: client number parameter is missing.');
      return;
    }
    // Construct the URL with print parameters
    const baseUrl = REPORT_BASEURL;
    // const reportParams = `&Client_No=${clientNumber}`;
    const reportParams = `&Client_No=${clientNumber}`
      + `&DisplayLogo=${this.printOptions.pageHeader}`;
    const reportUrl = `${baseUrl}${this.reportPath_finance}/${this.coverLetterReportName}${reportParams}&rs:Command=Render&rs:Format=PDF&rs:Print=True`;
    // Fetch the report as a blob
    this._printService.getSSRSReport(reportUrl).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const iframeSrc = `${url}#toolbar=0&navpanes=0&scrollbar=1`; // Hide default toolbar
      // Open a new tab
      const newTab = window.open("", "_blank");
      if (newTab) {
        newTab.document.write(`
         <html>
         <head>
           <title>Report Preview</title>
         </head>
         <body style="text-align: center; margin: 0; padding: 0;">
           <iframe src="${iframeSrc}" width="100%" height="90%" style="border: none;"></iframe>
           <br/>
           <button onclick="downloadReport()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-top: 10px;">
             Download Report
           </button>
           <script>
             function downloadReport() {
               const a = document.createElement('a');
               a.href = "${url}";
               a.download = "ClientCoverLetter_${clientNumber}.pdf"; 
               document.body.appendChild(a);
               a.click();
               document.body.removeChild(a);
             }
           </script>
         </body>
         </html>
       `);
        this._loaderService.hide();
        newTab.document.close();
      } else {
        this._loaderService.hide();
        console.error("Error: Unable to open new tab.");
      }
    });
  }

  change($event: any) {
    if ($event != null) {
      var selectedIndex = this.clientList.indexOf($event);
      // const remainingRows = this.clientList.filter((item, index) => index !== Number(selectedIndex));

      // // Place the selected row at the start (index 0) and add the remaining rows after it
      // this.filteredClientList = [$event, ...remainingRows];
      this.getClientAccountStatement($event.clnT_FL_ID, $event.cn);
    } else {
      this.filteredClientList = this.clientList;
    }
  }
}
