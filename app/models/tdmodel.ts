import { DecimalPipe } from "@angular/common";
export class TDModel {
  sno: number = 0;
  tD_ID: number = 0;
  tcode: string = '';
  ct: string = '';
  tesT_ID: string = '';
  full_Name: string = '';
  fulL_NAME: string = '';
  aFull_Name: string = '';
  synm: string = '';
  s_TYPE: string = '';
  units: string = '';
  prty: string = '';
  status: string = '';
  ordable: string = '';
  pr: string = '';
  mdl: string = '';
  rstp: string = '';
  dec: number = 0;
  diVs: string = 'd';
  sect: string = '';
  wc: string = '';
  ts: string = '';
  prfx: string = '';
  tno: string = '';
  mhn: string = '';
  shn: string = '';
  seq: string = '';
  cnvunits: string = '';
  cnvtdec: number = 0;

  cnvtfctr: number = 0;
  result: string = '';
  tat: number = 0;
  // ptn:string='';
  deltatp: string = '';
  deltaval: number = 0;
  daysval: number = 0;
  bill: string = '';
  // bilL_NAME:string='';
  dscntg: string = '';
  uprice: number = 0;
  upricE2: number = 0;
  ucost: number = 0;
  mnotes: string = '';
  fnotes: string = '';
  sts: string = 's';
  minterp: string = 's';
  finterp: string = 's';
  div: string = 's';
  tesT_INF: string = 's';
  selected: any;
  lbL_CMNT: string = 's';
  S_RPT: boolean;
  topiC_ID: number = 0;
  r_STS : string = '';
  dt : string = '';
  dscnt : number = 0;
  dprice : number = 0;
  isEditing?: any;
  oldHomePrice: number;
  oldNormalPrice: number;
  editedRow:boolean;

}

export class tdDivModel {
  div: string = '';
  divdesc: string = '';
  sect: string = '';
  sectdesc: string = '';
}

export class TdRefRngModel {
  refid: number = 0;
  sitE_NO: string = '';
  dtno: number = 0;
  tcode: string = '';
  rstp: string = '';
  s_TYPE: string = '';
  sex: string = '';
  agE_F: number = 0;
  aff: string = '';
  agE_T: number = 0;
  atf: string = '';
  agE_FROM: number = 0;
  agE_TO: number = 0;
  reF_LOW: string = '0';
  reF_HIGH: string = '0';
  crtcL_LOW: string = '0';
  crtcL_HIGH: string = '0';
  lhf: string = '';
  response: string = '';
  dec: number = 0;
  reF_RANGE: string = '';
  reF_LC: string = '';
  reF_HC: string = '';
  remarks: string = '';
}

export class GTModel {
  rno: number;
  gtD_ID: number;
  gtno: string = '';
  grP_NO: string = '';
  reQ_CODE: string = '';
  dtno: string = '';
  tcode: string = '';
  fulL_NAME: string = '';
  pndg: string = '';
  s_TYPE: string = '';
  mdl: string = '';
  rstp: string = '';
  s: string = '';
  gp: string = '';
  seq: string = '';
}

export class TDPriceMasterModel {
}

export class EVInvoiceQRImageModel {
  temP_IMAGES_ID: number = 0;
  imagE_ID: string = '';
  tcode: string = '';
  uploaD_DATE: string = '';
  image: string = null;
}
