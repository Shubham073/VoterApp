export interface Voter {
  _id: string;
  'Assembly Constituency No'?: string;
  'Assembly Constituency Name'?: string;
  'Reservation Status'?: string;
  'Part No'?: string;
  'Section Name'?: string;
  'Polling Station No'?: string;
  'Polling Station Name'?: string;
  'Polling Station Address'?: string;
  'Serial No'?: string;
  'EPIC No'?: string;
  Name?: string;
  'Relation Name'?: string;
  'Relation Type'?: string;
  'House No'?: string;
  Age?: string | number;
  Gender?: string;
  'Photo Available'?: string;
  mobileNumber?: string;
}

export interface PaginatedResponse {
  voters: Voter[];
  totalPages: number;
  currentPage: number;
  total?: number;
}

export interface FilterParams {
  'Assembly Constituency No'?: string;
  'Assembly Constituency Name'?: string;
  'Reservation Status'?: string;
  'Part No'?: string;
  'Section Name'?: string;
  'Polling Station No'?: string;
  'Polling Station Name'?: string;
  'Polling Station Address'?: string;
  'Serial No'?: string;
  'EPIC No'?: string;
  Name?: string;
  'Relation Name'?: string;
  'Relation Type'?: string;
  'House No'?: string;
  Age?: string;
  Gender?: string;
  'Photo Available'?: string;
  mobileNumber?: string;
  page?: number;
  limit?: number;
}

export type RootStackParamList = {
  Landing: undefined;
  VoterList: undefined;
  Search: undefined;
  AdvanceSearch: undefined;
  Survey: undefined;
  Data: undefined;
  Publish: undefined;
  VoterDetails: {voter: Voter; isEditable?: boolean};
  WhatsAppMessage: {voter: Voter};
};
