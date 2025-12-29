import {ShipDto} from '../services/api/pingapp-api.service';


// export interface PaginatedDisplay<T> {
//   data: T[];
//   page: number;
//   pageSize: number;
//   totalItems: number;
//   totalPages: number;
// }

export interface IPaginatedViewModel {
  ships: ShipDto[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  sort: string;
  direction: string;
}
