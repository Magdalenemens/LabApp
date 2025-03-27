import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestEntryModule } from './modules/test_directory/test-entry/test-entry.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DivisionsComponent } from './modules/masters/divisions/divisions.component';
import { TestComponent } from './test/test.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DefaultModule } from './layouts/default.module';
import { SectionsComponent } from './modules/masters/sections/sections.component';
import { DataTablesModule } from 'angular-datatables';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { WorkCentersComponent } from './modules/masters/workcenters/workcenters.component';
import { TestsitesComponent } from './modules/masters/testsites/testsites.component';
import { MnComponent } from './modules/masters/mn/mn.component';
import { mniComponent } from './modules/masters/mni/mni.component';
import { AlphabetOnlyDirective } from './common/alphabet-only.directive';
import { CnlcdComponent } from './modules/masters/cnlcd/cnlcd.component';
import { ClientsComponent } from './modules/masters/clients/clients.component';
import { AddclientsComponent } from './modules/masters/clients/addclients/addclients.component';
import { SpecialpricesComponent } from './modules/masters/clients/specialprices/specialprices.component';
import { ArComponent } from './modules/masters/ar/ar.component';
import { SpecimenSitesComponent } from './modules/masters/specimensites/specimensites.component';
import { SpecimenTypesComponent } from './modules/masters/specimentypes/specimentypes.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccountmanagersComponent } from './modules/masters/accountmanagers/accountmanagers.component';
import { DriversComponent } from './modules/masters/drivers/drivers.component';
import { SitesComponent } from './modules/masters/site/sites.component';
import { ListComponent } from './modules/masters/clients/list/list.component';
import { TestDefinitionComponent } from './modules/test_directory/test-definition/test-definition.component';
import { AddTestDirectoryComponent } from './modules/test_directory/test-definition/add-test-directory/add-test-directory.component';
import { AddPathologyComponent } from './modules/Clinical_module/anatomic-pathology/add-pathology/add-pathology.component';
import { ListAnatomyComponent } from './modules/Clinical_module/anatomic-pathology/list-anatomy/list-anatomy.component';
import { SlidePicturesComponent } from './modules/Clinical_module/anatomic-pathology/slide-pictures/slide-pictures.component';
import { ResultstemplatesComponent } from './modules/masters/resultstemplates/resultstemplates.component';
import { AutofocusDirective } from './common/autofocus.directive';
import { ReportmainheaderComponent } from './modules/masters/reportmainheader/reportmainheader.component';
import { ReportsubheaderComponent } from './modules/masters/reportsubheader/reportsubheader.component';
import { NgxEditorModule } from 'ngx-editor';
import { UnderConstComponent } from './modules/masters/under-const/under-const.component';
import { AddOrderentryComponent } from './modules/orderprocessing/orderentry/add-orderentry/add-orderentry.component';
import { OrdersComponent } from './modules/orderprocessing/orderentry/orders.component';
import { CytogeneticsComponent } from './modules/Clinical_module/cytogenetics/cytogenetics.component';
import { AddCytogeneticsComponent } from './modules/Clinical_module/cytogenetics/add-cytogenetics/add-cytogenetics.component';
import { ListCytogeneticsComponent } from './modules/Clinical_module/cytogenetics/list-cytogenetics/list-cytogenetics.component';
import { QualityCheckComponent } from './modules/Clinical_module/cytogenetics/quality-check/quality-check.component';
import { GeneralresultsComponent } from './modules/Clinical_module/generalresults/generalresults.component';
import { AddGeneralResultsComponent } from './modules/Clinical_module/generalresults/add-general-results/add-general-results.component';
import { ListGeneralResultsComponent } from './modules/Clinical_module/generalresults/list-general-results/list-general-results.component';
import { AuditComponent } from './modules/Clinical_module/generalresults/audit/audit.component';
import { PtrComponent } from './modules/Clinical_module/generalresults/ptr/ptr.component';
import { ProfileComponent } from './modules/test_directory/test-definition/profile/profile.component';
import { NoSpacesDirective } from './common/NoSpaces.directive';
import { OrderReceivingComponent } from './modules/orderprocessing/centralreceiving/order-receiving/order-receiving.component';
import { OrdersReceivingComponent } from './modules/orderprocessing/centralreceiving/orders-receiving.component';
import { MicroBiologyComponent } from './modules/Clinical_module/micro-biology/micro-biology.component';
import { AddMicrobiologyComponent } from './modules/Clinical_module/micro-biology/add-microbiology/add-microbiology.component';
import { ListMicrobiologyComponent } from './modules/Clinical_module/micro-biology/list-microbiology/list-microbiology.component';
import { AnatomicPathologyComponent } from './modules/Clinical_module/anatomic-pathology/anatomic-pathology.component';
import { PaginationComponent } from './modules/pagination/pagination.component';
import { TooltipDirective } from './common/tooltip.directive';
import { TooltiptextDirective } from './common/tooltiptexts.directive';
import { JwtInterceptor } from './interceptors/Jwt.interceptor';
import { ReferenceRangesComponentSingle } from './modules/test_directory/reference-ranges/reference-ranges.component';
import { ReferenceRangesComponent } from './modules/test_directory/test-definition/reference-ranges/reference-ranges.component';
import { TestDefinitionModule } from './modules/test_directory/test-definition/test-definition.module';
import { AnatomicPathologyModule } from './modules/Clinical_module/anatomic-pathology/anatomic-pathology.module';
import { TestAssignmentComponent } from './modules/test_directory/test-assignment/test-assignment.component';
import { TestImportsComponent } from './modules/test_directory/test-imports/test-imports.component';
import { BillsGenerationComponent } from './modules/finance/biling/bills-generation/bills-generation.component';
import { BillsListingComponent } from './modules/finance/biling/bills-listing/bills-listing.component';
import { BillsChecksComponent } from './modules/finance/biling/bills-checks/bills-checks.component';
import { BilingComponent } from './modules/finance/biling/biling.component';
import { NumericRefernceRangeComponent } from './modules/test_directory/test-definition/numeric-refernce-range/numeric-refernce-range.component';
import { RequestInterceptor } from './interceptors/http-loader.interceptor';
import { PreAnalyticalReceivingComponent } from './modules/orderprocessing/preanalyticalreceiving/preanalyticalreceiving.component';
import { ArchivingComponent } from './modules/system/archiving/archiving.component';
import { ManualBackupComponent } from './modules/system/manual-backup/manual-backup.component';
import { LoginTrackComponent } from './modules/system/login-track/login-track.component';
import { ProcessingComponent } from './modules/management-reports/processing/processing.component';
import { FinanceComponent } from './modules/management-reports/finance/finance.component';
import { SystemConfigurationComponent } from './modules/system/system-configuration/system-configuration.component';
import { CytogeneticsLoginComponent } from './modules/orderprocessing/cytogenetics-login/cytogenetics-login.component';
import { DoctorsComponent } from './modules/masters/doctors/doctors.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { EnvironmentalordersComponent } from './modules/orderprocessing/environmentalorder/environmentalorders.component';
import { UsersComponent } from './modules/masters/users/users.component';
import { DefulatTimezonePipe } from './common/defaulttimezone.pipe ';
import { TestAllocationComponent } from './modules/test_directory/test-definition/test-allocation/test-allocation.component';
import { AccnprefixComponent } from './modules/masters/accnprefix/accnprefix.component';
import { AdduserComponent } from './modules/system/users/adduser/adduser.component';
import { UserComponent } from './modules/system/users/users.component';
import { UserListComponent } from './modules/system/users/list/list.component';
import { PagetrackingComponent } from './modules/system/users/pagetracking/pagetracking.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BarChartComponent } from './modules/shared/components/bar-chart/bar-chart.component';
import { LoginTrackingComponent } from './modules/system/users/logintracking/logintracking.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LabSitesComponent } from './modules/system/lab-sites/lab-sites.component';
import { DataEntryComponent } from './modules/system/lab-sites/data-entry/data-entry.component';
import { SlidePicturesMBComponent } from './modules/Clinical_module/micro-biology/slide-pictures/slide-pictures.component';
import { CustomerQuotationComponent } from './modules/orderprocessing/customer-quotation/customer-quotation.component';
import { SalesPricesComponent } from './modules/finance/sales-prices/sales-prices.component';
import { PriceMasterListComponent } from './modules/finance/sales-prices/price-master-list/price-master-list.component';
import { MasterListTwoComponent } from './modules/finance/sales-prices/master-list-two/master-list-two.component';
import { MasterListThreeComponent } from './modules/finance/sales-prices/master-list-three/master-list-three.component';
import { SiteTestsAssignmentComponent } from './modules/system/lab-sites/site-tests-assignment/site-tests-assignment.component';
import { SiteListComponent } from './modules/system/lab-sites/site-list/site-list.component';
import { SiteTestsListsComponent } from './modules/system/lab-sites/site-tests-lists/site-tests-lists.component';
 import { SpinnerComponent } from './layouts/spinner/spinner.component';
import { AddEnvironmentalorderComponent } from './modules/orderprocessing/environmentalorder/add-environmentalorder/add-environmentalorder.component';
import { CgtestdefinitionComponent } from './modules/test_directory/cgtestdefinition/cgtestdefinition.component';
import { AddcgtestdefinitionComponent } from './modules/test_directory/cgtestdefinition/addcgtestdefinition/addcgtestdefinition.component';
import { CgtestdefinitionprofileComponent } from './modules/test_directory/cgtestdefinition/cgtestdefinitionprofile/cgtestdefinitionprofile.component';
import { APTestDefinitionListComponent } from './modules/test_directory/aptestdefinition/aptestdefinitionlist/aptestdefinitionlist.component';
import { EvtestdefinitionComponent } from './modules/test_directory/evtestdefinition/evtestdefinition.component';
import { AddevtestdefinitionComponent } from './modules/test_directory/evtestdefinition/addevtestdefinition/addevtestdefinition.component';
import { EvtestdefinitionprofileComponent } from './modules/test_directory/evtestdefinition/evtestdefinitionprofile/evtestdefinitionprofile.component';
import { SortingComponent } from './modules/pagination/sorting/sorting.component';
import { APTestDefinitionComponent } from './modules/test_directory/aptestdefinition/aptestdefinition.component';
import { AddAPTestDefinitionComponent } from './modules/test_directory/aptestdefinition/addaptestdefinition/addaptestdefinition.component';
import { AddOrderentrynewComponent } from './modules/orderprocessing/orderentrynew/add-orderentrynew/add-orderentrynew.component';
import { ListOrderentrynewComponent } from './modules/orderprocessing/orderentrynew/list-orderentrynew/list-orderentrynew.component';
import { OrderentrynewComponent } from './modules/orderprocessing/orderentrynew/orderentrynew.component';
import { ClientAccountComponent } from './modules/finance/client-account/client-account.component';
import { clientaccountRoutingModule } from './modules/finance/client-account/client-account-routing.module';
import { ClientAccountStatementComponent } from './modules/finance/client-account/client-account-statement/client-account-statement.component';
import { DataClientAccountComponent } from './modules/finance/client-account/data-client-account/data-client-account.component';
import { clientaccountModule } from './modules/finance/client-account/client-account.module';
import { ClinicalEnvironmentalComponent } from './modules/Clinical_module/clinical-environmental/clinical-environmental.component';
import { AddClinicalEnvironmentalComponent } from './modules/Clinical_module/clinical-environmental/add-clinical-environmental/add-clinical-environmental.component';
import { ListClinicalEnvironmentalComponent } from './modules/Clinical_module/clinical-environmental/list-clinical-environmental/list-clinical-environmental.component';
import { SeteupevtestdefinitionComponent } from './modules/test_directory/evtestdefinition/seteupevtestdefinition/seteupevtestdefinition.component';
import { clinicalEnvironmentalModule } from './modules/Clinical_module/clinical-environmental/clinical-environmental.module';
import { RolesPermissionsComponent } from './modules/system/roles-permissions/roles-permissions.component';
import { PrivilegesComponent } from './modules/system/users/privileges/privileges.component';
import { CytogeneticOrdersComponent } from './modules/orderprocessing/cytogenetic-orders/cytogenetic-orders.component';
import { ClinicalPrivilegesComponent } from './modules/system/users/clinical-privileges/clinical-privileges.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CompanyComponent } from './modules/masters/company/company.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ListEnvironmentalorderComponent } from './modules/orderprocessing/environmentalorder/list-environmentalorder/list-environmentalorder.component';
import { EvSampleTypeComponent } from './modules/masters/ev-sample-type/ev-sample-type.component';
import { CrossCheckComponent } from './modules/finance/client-account/cross-check/cross-check.component';
import { CurrentStatusComponent } from './modules/finance/client-account/current-status/current-status.component';
import { MbtestdefinitionComponent } from './modules/test_directory/mbtestdefinition/mbtestdefinition.component';
import { AddmbtestdefinitionComponent } from './modules/test_directory/mbtestdefinition/addmbtestdefinition/addmbtestdefinition.component';
import { ListmbtestdefinitionComponent } from './modules/test_directory/mbtestdefinition/listmbtestdefinition/listmbtestdefinition.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NoSpacesDirective,
    AccnprefixComponent,
    DivisionsComponent,
    TestComponent,
    SectionsComponent,
    WorkCentersComponent,
    TestsitesComponent,
    ReportmainheaderComponent,
    ReportsubheaderComponent,
    SpecimenSitesComponent,
    SpecimenTypesComponent,
    ResultstemplatesComponent,
    AccountmanagersComponent,
    DriversComponent,
    SitesComponent,
    MnComponent,
    mniComponent,
    AlphabetOnlyDirective,
    CnlcdComponent,
    ClientsComponent,
    AddclientsComponent,
    SpecialpricesComponent,
    ArComponent,
    EvSampleTypeComponent,
    ListComponent,
    TestDefinitionComponent,
    AddTestDirectoryComponent,
    UsersComponent,
    UnderConstComponent,
    AnatomicPathologyComponent,
    AddPathologyComponent,
    ListAnatomyComponent,
    SlidePicturesComponent,
    AutofocusDirective,
    MicroBiologyComponent,
    AddMicrobiologyComponent,
    ListMicrobiologyComponent,
    SlidePicturesMBComponent,
    AddOrderentryComponent,
    OrdersComponent,
    OrderReceivingComponent,
    OrdersReceivingComponent,
    CytogeneticsComponent,
    AddCytogeneticsComponent,
    ListCytogeneticsComponent,
    CytogeneticsLoginComponent,
    QualityCheckComponent,
    GeneralresultsComponent,
    AddGeneralResultsComponent,
    ListGeneralResultsComponent,
    PtrComponent,
    AuditComponent,
    PaginationComponent,
    TooltipDirective,
    TooltiptextDirective,
    ReferenceRangesComponentSingle,
    TestAssignmentComponent,
    TestImportsComponent,
    BillsGenerationComponent,
    BillsListingComponent,
    BillsChecksComponent,
    BilingComponent,
    NumericRefernceRangeComponent,
    PreAnalyticalReceivingComponent,
    SystemConfigurationComponent,
    ArchivingComponent,
    ManualBackupComponent,
    LoginTrackComponent,
    AdduserComponent,
    UserComponent,
    UserListComponent,
    ProcessingComponent,
    PagetrackingComponent,
    FinanceComponent,
    DoctorsComponent,
    DashboardComponent,
    DefulatTimezonePipe,
    EnvironmentalordersComponent,
    TestAllocationComponent,
    BarChartComponent,
    LoginTrackingComponent,
    LabSitesComponent,
    DataEntryComponent,
    SiteTestsAssignmentComponent,
    SiteListComponent,
    SiteTestsListsComponent,
    CustomerQuotationComponent,
    SalesPricesComponent,
    PriceMasterListComponent,
    MasterListTwoComponent,
    MasterListThreeComponent,
    AddEnvironmentalorderComponent,
     SpinnerComponent,
    CgtestdefinitionComponent,
    AddcgtestdefinitionComponent,
    CgtestdefinitionprofileComponent,
    APTestDefinitionComponent,
    AddAPTestDefinitionComponent,
    APTestDefinitionListComponent,
    EvtestdefinitionComponent,
    AddevtestdefinitionComponent,
    EvtestdefinitionprofileComponent,
    SeteupevtestdefinitionComponent,
    SortingComponent,
    AddOrderentrynewComponent,
    ListOrderentrynewComponent,
    OrderentrynewComponent,
    ClientAccountComponent,
    ClientAccountStatementComponent,
    DataClientAccountComponent,
    ClinicalEnvironmentalComponent,
    AddClinicalEnvironmentalComponent,
    ListClinicalEnvironmentalComponent,
    RolesPermissionsComponent,
    PrivilegesComponent,
    CytogeneticOrdersComponent,
    ClinicalPrivilegesComponent,
    CompanyComponent,
    ListEnvironmentalorderComponent,
    CrossCheckComponent,
    CurrentStatusComponent,
    MbtestdefinitionComponent,
    AddmbtestdefinitionComponent,
    ListmbtestdefinitionComponent
  ],

  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    DefaultModule,
    AppRoutingModule,
    TestEntryModule,
    DataTablesModule,
    BrowserAnimationsModule,
    NgSelectModule,
    NgxEditorModule,
    TestDefinitionModule,
    AnatomicPathologyModule,
    clinicalEnvironmentalModule,
    NgxChartsModule,
    NgMultiSelectDropDownModule,
    AngularEditorModule,
    CKEditorModule,
    EditorModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
